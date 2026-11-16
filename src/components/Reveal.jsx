import useInView from '../hooks/useInView';
// Fades and slides content in when it scrolls into view. dir: up | left | right | zoom
export default function Reveal({ as: Tag = 'div', dir = 'up', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView();
  return <Tag ref={ref} style={{ '--d': `${delay}ms` }} className={`reveal reveal-${dir} ${seen ? 'in' : ''} ${className}`} {...rest}>{children}</Tag>;
}
