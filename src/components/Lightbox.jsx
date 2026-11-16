import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { img } from '../config/school';

// Full-screen photo viewer: keyboard, swipe, thumbnails, slideshow and zoom.
// items: [{ src, alt, title? }]   index: number   onChange(i)   onClose()
export default function Lightbox({ items, index, onChange, onClose }) {
  const [dir, setDir] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [playing, setPlaying] = useState(false);
  const touch = useRef(null); const closeBtn = useRef(null); const strip = useRef(null);
  const n = items.length; const cur = items[index];

  const go = useCallback((d) => { setDir(d); setZoom(false); onChange((index + d + n) % n); }, [index, n, onChange]);

  useEffect(() => {
    const prev = document.activeElement; closeBtn.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; prev?.focus?.(); };
  }, []);
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [go, onClose]);
  useEffect(() => { if (!playing) return; const t = setTimeout(() => go(1), 3500); return () => clearTimeout(t); }, [playing, index, go]);
  useEffect(() => { // preload neighbours
    [1, -1].forEach((d) => { const i = new Image(); i.src = img(items[(index + d + n) % n].src); });
    strip.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [index, items, n]);

  const onTouchStart = (e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchEnd = (e) => {
    if (!touch.current || zoom) return;
    const dx = e.changedTouches[0].clientX - touch.current.x, dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };
  if (!cur) return null;
  const btn = 'rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500';
  return createPortal(
    <div className="fixed inset-0 z-[90] flex animate-fadeIn flex-col bg-black/[.97]" role="dialog" aria-modal="true" aria-label="Photo viewer" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="text-sm text-slate-300" aria-live="polite">{index + 1} / {n}</p>
        <div className="flex gap-2">
          <button className={btn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause slideshow' : 'Start slideshow'}>{playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
          <button className={btn} onClick={() => setZoom((z) => !z)} aria-label={zoom ? 'Zoom out' : 'Zoom in'}>{zoom ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}</button>
          <button ref={closeBtn} className={btn} onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
      </div>
      {playing && <div key={index} className="h-0.5 origin-left animate-load bg-teal-500" style={{ animationDuration: '3.5s', animationTimingFunction: 'linear' }} />}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={onClose}>
        <button className={`${btn} absolute left-2 z-10 hidden sm:block`} aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); go(-1); }}><ChevronLeft className="h-6 w-6" /></button>
        <figure key={cur.src} className={`flex max-h-full max-w-full flex-col items-center ${dir > 0 ? 'animate-slideNext' : 'animate-slidePrev'}`} onClick={(e) => e.stopPropagation()}>
          <div className={`overflow-auto rounded-lg ${zoom ? 'max-h-[72vh] max-w-full cursor-zoom-out' : 'cursor-zoom-in'}`} onClick={() => setZoom((z) => !z)}>
            <img src={img(cur.src)} alt={cur.alt} draggable="false" className={`rounded-lg object-contain transition-all duration-500 ${zoom ? 'max-w-none w-[170vw] sm:w-[120vw]' : 'max-h-[64vh] sm:max-h-[70vh] max-w-full'}`} />
          </div>
          <figcaption className="mt-3 max-w-2xl px-3 text-center text-sm text-slate-200">{cur.title && <strong className="mr-1 text-white">{cur.title}.</strong>}{cur.alt}</figcaption>
        </figure>
        <button className={`${btn} absolute right-2 z-10 hidden sm:block`} aria-label="Next photo" onClick={(e) => { e.stopPropagation(); go(1); }}><ChevronRight className="h-6 w-6" /></button>
      </div>
      <div ref={strip} className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3" role="group" aria-label="Thumbnails">
        {items.map((it, i) => (
          <button key={it.src} aria-current={i === index} aria-label={`Photo ${i + 1}`} onClick={() => { setDir(i > index ? 1 : -1); setZoom(false); onChange(i); }} className={`h-14 w-20 shrink-0 overflow-hidden rounded-md transition duration-300 ${i === index ? 'scale-105 opacity-100 ring-2 ring-teal-500' : 'opacity-50 hover:opacity-90'}`}>
            <img src={img(it.src)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>))}
      </div>
    </div>,
    document.body
  );
}
