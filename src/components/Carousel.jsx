import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import LazyImg from './LazyImg';
import { img } from '../config/school';

// Drag / swipe / button scrolling photo row with a progress bar. Click a card to call onOpen(i).
export default function Carousel({ items, onOpen }) {
  const row = useRef(null); const [p, setP] = useState(0); const drag = useRef({ on: false, x: 0, left: 0, moved: false });
  const update = () => { const el = row.current; if (el) setP(el.scrollWidth - el.clientWidth > 0 ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 0); };
  useEffect(update, []);
  const by = (d) => { const el = row.current; el.scrollBy({ left: d * Math.min(el.clientWidth * 0.8, 420), behavior: 'smooth' }); };
  const down = (e) => { if (e.pointerType !== 'mouse') return; const el = row.current; drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: false }; };
  const move = (e) => { const d = drag.current; if (!d.on) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 5) { d.moved = true; row.current.classList.add('dragging'); } row.current.scrollLeft = d.left - dx; };
  const up = () => { drag.current.on = false; row.current?.classList.remove('dragging'); };
  const open = (i) => { if (!drag.current.moved) onOpen(i); };
  const nb = 'rounded-full bg-white/10 p-3 text-white ring-1 ring-white/20 transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500';
  return (
    <div>
      <div ref={row} onScroll={update} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
        className="no-scrollbar carousel-row flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-[max(1rem,calc((100vw-72rem)/2+1rem))]" role="list" tabIndex={0} aria-label="Annual Day photos. Use arrow keys to scroll.">
        {items.map((it, i) => (
          <button key={it.src} role="listitem" onClick={() => open(i)} aria-label={`Open photo: ${it.title}`} className="group relative h-72 w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl text-left sm:h-96 sm:w-[26rem] sm:snap-start">
            <LazyImg src={img(it.src)} alt="" draggable="false" className="h-full w-full select-none object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/10 to-transparent" />
            <Expand className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/15 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white"><span className="text-xs font-semibold uppercase tracking-wider text-sun-400">{String(i + 1).padStart(2, '0')}</span><h3 className="text-lg font-semibold">{it.title}</h3></div>
          </button>))}
      </div>
      <div className="mx-auto mt-6 flex max-w-6xl items-center gap-4 px-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full origin-left rounded-full bg-teal-500 transition-transform duration-200" style={{ transform: `scaleX(${Math.max(p, 0.06)})` }} /></div>
        <button className={nb} aria-label="Scroll left" onClick={() => by(-1)}><ChevronLeft className="h-5 w-5" /></button>
        <button className={nb} aria-label="Scroll right" onClick={() => by(1)}><ChevronRight className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
