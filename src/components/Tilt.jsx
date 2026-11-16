import { useRef } from 'react';

// Gentle 3D tilt that follows the pointer. Only on devices with a real hover (not touch).
export default function Tilt({ as: Tag = 'div', max = 7, className = '', children, ...rest }) {
  const ref = useRef(null);
  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  const move = (e) => {
    if (!canHover()) return;
    const el = ref.current, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const leave = () => { const el = ref.current; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
  return <Tag ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`} {...rest}>{children}</Tag>;
}
