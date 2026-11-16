import { useEffect } from 'react';

// Small global effects used by modern school sites: click ripple on buttons and magnetic hover on main buttons.
// Everything is skipped for visitors who prefer reduced motion; the magnetic pull is skipped on touch screens.
export default function MotionFX() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sel = '.btn-primary, .btn-ghost, .btn-shine, .ripple';
    const down = (e) => {
      const el = e.target.closest?.(sel); if (!el) return;
      const r = el.getBoundingClientRect(); const d = Math.max(r.width, r.height) * 2;
      const s = document.createElement('span'); s.className = 'ripple-dot';
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.style.overflow = 'hidden'; el.appendChild(s); setTimeout(() => s.remove(), 650);
    };
    document.addEventListener('pointerdown', down);
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const move = (e) => {
      const el = e.target.closest?.('.btn-primary'); if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
    };
    const leave = (e) => { const el = e.target.closest?.('.btn-primary'); if (el) el.style.transform = ''; };
    if (fine) { document.addEventListener('pointermove', move); document.addEventListener('pointerout', leave); }
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('pointermove', move); document.removeEventListener('pointerout', leave); };
  }, []);
  return null;
}
