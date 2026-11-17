import { useEffect, useState } from 'react';
import { heroSlides, img } from '../config/school';

export const SLIDE_MS = 2000; // time each photo stays on screen
const FADE_MS = 600;          // cross-fade speed between photos

let preloaded = false;
function preload() { if (preloaded) return; preloaded = true; heroSlides.forEach((s) => { const im = new Image(); im.src = img(s.src); }); }

// Shared auto-advancing slideshow state. Pauses while the tab is hidden.
export function useSlides(start = 0) {
  const [i, setI] = useState(start % heroSlides.length);
  useEffect(() => { preload(); }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % heroSlides.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i]);
  return [i, setI];
}

// Full-bleed cross-fading photos with a gentle zoom. Same effect on every page.
export function SlideLayers({ i, zoom = 1.08 }) {
  return heroSlides.map((s, n) => (
    <div key={s.src} className="absolute inset-0 -z-10" style={{ opacity: n === i ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-out` }} aria-hidden={n !== i}>
      <img src={img(s.src)} alt={n === i ? s.alt : ''} className="h-full w-full object-cover will-change-transform"
        style={{ filter: 'brightness(1.12) saturate(1.12) contrast(1.03)', transform: n === i ? `scale(${zoom})` : 'scale(1)', transition: n === i ? `transform ${SLIDE_MS + FADE_MS}ms linear` : 'none' }} />
    </div>));
}

// Dots with a fill bar that shows time left on the current photo.
export function SlideDots({ i, setI }) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Choose slide">
      {heroSlides.map((s, n) => (
        <button key={s.src} aria-label={`Show slide ${n + 1}`} aria-current={n === i} onClick={() => setI(n)}
          className={`relative h-1.5 overflow-hidden rounded-full bg-white/35 transition-all duration-300 hover:bg-white/60 ${n === i ? 'w-10' : 'w-4'}`}>
          {n === i && <span key={i} className="absolute inset-0 origin-left rounded-full bg-teal-500" style={{ animation: `load ${SLIDE_MS}ms linear both` }} />}
        </button>))}
    </div>
  );
}
