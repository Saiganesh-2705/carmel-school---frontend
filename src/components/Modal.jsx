import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const stack = []; // open windows, so Esc only closes the one on top

// Pop-up window shown above the whole page (rendered on <body>, so it is never clipped by the page it opens from).
// Closes with Esc or the X / Cancel buttons, with a short exit animation. A click outside only gives it a small nudge.
// children may be a function: children(close) gives the form its own animated Cancel button.
// guard (optional): a function (may be async) that returns false to stop the window closing, for example to ask "Discard your changes?".
// Clicking the dark background never closes the window, so typed details cannot be lost by accident.
export default function Modal({ title, subtitle, onClose, guard, size = 'md', children }) {
  const [closing, setClosing] = useState(false); const [nudge, setNudge] = useState(false);
  const g = useRef(guard); g.current = guard;
  const cb = useRef(onClose); cb.current = onClose; const shut = useRef(false);
  const id = useRef(Symbol('modal'));
  const close = useCallback(async () => {
    if (shut.current) return;
    if (g.current && !(await g.current())) return; // guard may be async (a confirmation window)
    if (shut.current) return; shut.current = true; setClosing(true); setTimeout(() => cb.current(), 220);
  }, []);
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const me = id.current; stack.push(me);
    const key = (e) => { if (e.key === 'Escape' && stack[stack.length - 1] === me) close(); };
    window.addEventListener('keydown', key);
    return () => { stack.splice(stack.indexOf(me), 1); document.body.style.overflow = prev; window.removeEventListener('keydown', key); };
  }, [close]);
  const width = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-5xl' }[size];
  return createPortal(
    <div className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-navy-900/60 p-3 backdrop-blur-sm sm:items-center sm:p-6 ${closing ? 'backdrop-out' : 'animate-fadeIn'}`}
      role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) { setNudge(true); setTimeout(() => setNudge(false), 450); } }}>
      <div className={`modal-panel relative my-auto w-full ${width} overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-navy-800 dark:ring-white/10 ${closing ? 'modal-out' : nudge ? 'modal-nudge' : 'modal-in'}`}>
        <div className="modal-bar" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6">
          <div><h2 className="text-lg font-bold sm:text-xl">{title}</h2>{subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}</div>
          <button type="button" className="btn-ghost -mr-2 -mt-1 p-2 transition duration-300 hover:rotate-90 hover:bg-red-50 hover:text-red-600" aria-label="Close" onClick={close}><X className="h-5 w-5" /></button>
        </div>
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-5 pb-5 sm:px-6">{typeof children === 'function' ? children(close) : children}</div>
      </div>
    </div>, document.body);
}
