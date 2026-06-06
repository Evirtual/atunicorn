# Image storage

Images are stored in Cloudinary. Firebase is still used for Auth, Realtime Database, and Hosting.

The browser app uploads and deletes images through a Cloudflare Worker:

```text
https://atunicorn-storage.social-posts-pinata.workers.dev
```

The Worker verifies the user's Firebase ID token before signing Cloudinary upload/delete requests. This keeps the Cloudinary API secret out of the browser.

## Worker secrets

The Worker needs these secrets:

```text
FIREBASE_PROJECT_ID=unicorn-ee877
CLOUDINARY_CLOUD_NAME=dicbppjam
CLOUDINARY_API_KEY=<active Cloudinary API key>
CLOUDINARY_API_SECRET=<active Cloudinary API secret>
ALLOWED_ORIGIN=https://atunicorn.io
```

Set or update a secret with:

```powershell
yarn wrangler secret put CLOUDINARY_API_SECRET --config workers/cloudinary-storage/wrangler.toml
```

Deploy the Worker with:

```powershell
yarn storage:worker:deploy
```

## App config

The app defaults to:

```text
storageProvider=cloudinary
storageApiUrl=https://atunicorn-storage.social-posts-pinata.workers.dev
```

You can override either value at build time if needed.

## Completed migration

Firebase Storage image URLs were migrated to Cloudinary on June 6, 2026. New and old images should now load from:

```text
https://res.cloudinary.com/dicbppjam/
```
