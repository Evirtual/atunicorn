const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
const CLOUDINARY_API_BASE = 'https://api.cloudinary.com/v1_1'

let jwksCache = null
let jwksCacheExpiresAt = 0

const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {})
    }
  })

const corsHeaders = (request, env) => {
  const allowedOrigin = env.ALLOWED_ORIGIN || '*'
  const requestOrigin = request.headers.get('origin')
  const origin = allowedOrigin === '*' ? '*' : requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin

  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-max-age': '86400'
  }
}

const withCors = (request, env, response) => {
  const headers = new Headers(response.headers)
  Object.entries(corsHeaders(request, env)).forEach(([key, value]) => headers.set(key, value))
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

const base64UrlToBytes = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

const decodeJwtPart = (value) => JSON.parse(new TextDecoder().decode(base64UrlToBytes(value)))

const getJwks = async () => {
  if (jwksCache && Date.now() < jwksCacheExpiresAt) return jwksCache

  const response = await fetch(FIREBASE_JWKS_URL)
  if (!response.ok) throw new Error('Unable to load Firebase signing keys')

  const cacheControl = response.headers.get('cache-control') || ''
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] || 3600)
  jwksCache = await response.json()
  jwksCacheExpiresAt = Date.now() + maxAge * 1000
  return jwksCache
}

const verifyFirebaseToken = async (request, env) => {
  const auth = request.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) throw new Error('Missing authorization token')
  if (!env.FIREBASE_PROJECT_ID) throw new Error('Missing FIREBASE_PROJECT_ID')

  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')
  if (!encodedHeader || !encodedPayload || !encodedSignature) throw new Error('Invalid token')

  const header = decodeJwtPart(encodedHeader)
  const payload = decodeJwtPart(encodedPayload)
  if (header.alg !== 'RS256') throw new Error('Invalid token algorithm')

  const jwks = await getJwks()
  const jwk = jwks.keys?.find((key) => key.kid === header.kid)
  if (!jwk) throw new Error('Unknown token key')

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    base64UrlToBytes(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  )
  if (!valid) throw new Error('Invalid token signature')

  const now = Math.floor(Date.now() / 1000)
  if (payload.aud !== env.FIREBASE_PROJECT_ID) throw new Error('Invalid token audience')
  if (payload.iss !== `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`) throw new Error('Invalid token issuer')
  if (!payload.sub) throw new Error('Invalid token subject')
  if (payload.exp <= now) throw new Error('Expired token')

  return { uid: payload.sub, email: payload.email || null }
}

const sha1Hex = async (value) => {
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const signCloudinaryParams = async (params, apiSecret) => {
  const source = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return sha1Hex(`${source}${apiSecret}`)
}

const assertCloudinaryEnv = (env) => {
  if (!env.CLOUDINARY_CLOUD_NAME) throw new Error('Missing CLOUDINARY_CLOUD_NAME')
  if (!env.CLOUDINARY_API_KEY) throw new Error('Missing CLOUDINARY_API_KEY')
  if (!env.CLOUDINARY_API_SECRET) throw new Error('Missing CLOUDINARY_API_SECRET')
}

const assertImage = (file) => {
  if (!file || typeof file !== 'object') throw new Error('Missing file')
  if (!file.type?.startsWith('image/')) throw new Error('File that you are uploading is not an image')
  if (file.type === 'image/gif' && file.size >= 2 * 1024 * 1024) throw new Error('GIF size is too big (maximum size: 2MB)')
  if (file.type !== 'image/gif' && file.size >= 7 * 1024 * 1024) throw new Error('File size is too big (maximum size: 7MB)')
}

const uploadToCloudinary = async (env, file, params) => {
  assertCloudinaryEnv(env)
  const signature = await signCloudinaryParams(params, env.CLOUDINARY_API_SECRET)
  const form = new FormData()
  form.append('file', file)
  form.append('api_key', env.CLOUDINARY_API_KEY)
  Object.entries(params).forEach(([key, value]) => form.append(key, value))
  form.append('signature', signature)

  const response = await fetch(`${CLOUDINARY_API_BASE}/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error?.message || 'Cloudinary upload failed')
  return body
}

const parseCloudinaryPublicId = (env, input) => {
  const value = String(input || '')
  if (!value) return null
  if (!value.startsWith('http')) return value

  const parsed = new URL(value)
  if (!parsed.hostname.endsWith('cloudinary.com')) return null
  const marker = `/${env.CLOUDINARY_CLOUD_NAME}/image/upload/`
  const markerIndex = parsed.pathname.indexOf(marker)
  if (markerIndex === -1) return null
  const rest = parsed.pathname.slice(markerIndex + marker.length)
  const withoutVersion = rest.replace(/^v\d+\//, '')
  return decodeURIComponent(withoutVersion).replace(/\.[^.]+$/, '')
}

const deleteFromCloudinary = async (env, publicId) => {
  assertCloudinaryEnv(env)
  const timestamp = String(Math.floor(Date.now() / 1000))
  const params = {
    invalidate: 'true',
    public_id: publicId,
    timestamp
  }
  const signature = await signCloudinaryParams(params, env.CLOUDINARY_API_SECRET)
  const form = new FormData()
  form.append('api_key', env.CLOUDINARY_API_KEY)
  Object.entries(params).forEach(([key, value]) => form.append(key, value))
  form.append('signature', signature)

  const response = await fetch(`${CLOUDINARY_API_BASE}/${env.CLOUDINARY_CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: form
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error?.message || 'Cloudinary delete failed')
  return body
}

const upload = async (request, env) => {
  const user = await verifyFirebaseToken(request, env)
  const form = await request.formData()
  const file = form.get('file')
  const kind = String(form.get('kind') || 'upload').replace(/[^a-z0-9-]/gi, '').toLowerCase()
  assertImage(file)

  const timestamp = String(Math.floor(Date.now() / 1000))
  const folder = `atunicorn/${user.uid}`
  const publicId = `${kind}-${Date.now()}-${crypto.randomUUID()}`
  const result = await uploadToCloudinary(env, file, {
    folder,
    public_id: publicId,
    timestamp
  })

  return json({ publicId: result.public_id, url: result.secure_url })
}

const deleteObject = async (request, env) => {
  const user = await verifyFirebaseToken(request, env)
  const body = await request.json().catch(() => ({}))
  const publicId = parseCloudinaryPublicId(env, body.publicId || body.url)
  if (!publicId) throw new Error('Missing image id')
  if (!publicId.startsWith(`atunicorn/${user.uid}/`)) throw new Error('You can only delete your own uploads')

  await deleteFromCloudinary(env, publicId)
  return json({ ok: true })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) })

    const url = new URL(request.url)
    try {
      if (request.method === 'POST' && url.pathname === '/upload') return withCors(request, env, await upload(request, env))
      if (request.method === 'POST' && url.pathname === '/delete') return withCors(request, env, await deleteObject(request, env))
      return withCors(request, env, json({ error: 'Not found' }, { status: 404 }))
    } catch (error) {
      const status = /token|authorization|permission|secret/i.test(error.message) ? 401 : 400
      return withCors(request, env, json({ error: error.message }, { status }))
    }
  }
}
