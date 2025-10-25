import Link from 'next/link'

const Upload = props => (
  <label style={props.style}>
    <input
      onChange={e => {
        const handler = props.action || props.onUpload;
        if (handler) handler(e.target.files);
      }}
      type="file"
      style={{ display: 'none' }}
    />
    {props.children}
  </label>
)

export default { Link, Upload }
