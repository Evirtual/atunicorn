const cloudinaryDeliveryUrl = (source, transformation) => {
  if (!source?.includes('res.cloudinary.com/') || !source.includes('/image/upload/')) return source
  return source.replace('/image/upload/', `/image/upload/${transformation}/`)
}

export const cloudinarySquareUrl = (source, size) =>
  cloudinaryDeliveryUrl(source, `f_auto,q_auto,c_fill,w_${size},h_${size}`)

export const cloudinaryFitUrl = (source, size) =>
  cloudinaryDeliveryUrl(source, `f_auto,q_auto,c_limit,w_${size},h_${size}`)
