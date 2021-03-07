import Link from 'next/link'

const Upload = props => <label>
  <input onChange={e => (props.action || props.onUpload || console.log)(e.target.files)} type="file" style={{ display: 'none' }} />
  {props.children}
</label>
console.log('web')
export default { Link, Upload }
