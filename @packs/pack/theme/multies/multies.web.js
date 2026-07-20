import React from 'react'
import Link from 'next/link'

const Upload = props => <label style={props.style}>
  <input onChange={e => (props.action || props.onUpload || console.log)(e.target.files)} type="file" style={{ display: 'none' }} />
  {props.children}
</label>

const LazyImage = React.forwardRef((props, ref) => {
  const {
    accessibilityLabel,
    resizeMode,
    source,
    style,
    theme: _theme,
    ...imageProps
  } = props
  const sourceUri = typeof source === 'string' ? source : source?.uri
  const flatStyle = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : (style || {})
  const { resizeMode: styleResizeMode, ...imageStyle } = flatStyle

  return (
    <img
      {...imageProps}
      ref={ref}
      src={sourceUri}
      alt={accessibilityLabel || ''}
      loading="lazy"
      decoding="async"
      draggable={false}
      style={{
        ...imageStyle,
        objectFit: resizeMode || styleResizeMode || 'cover'
      }}
    />
  )
})

LazyImage.displayName = 'LazyImage'

export default { LazyImage, Link, Upload }
