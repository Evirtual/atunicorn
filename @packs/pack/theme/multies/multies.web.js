import Link from 'next/link'

const Upload = props => <label style={props.style}>
  <input onChange={e => (props.action || props.onUpload || console.log)(e.target.files)} type="file" style={{ display: 'none' }} />
  {props.children}
</label>
export default { Link, Upload }
