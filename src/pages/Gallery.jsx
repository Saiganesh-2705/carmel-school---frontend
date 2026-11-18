import { useMemo, useState } from 'react';
import { Expand } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import LazyImg from '../components/LazyImg';
import Lightbox from '../components/Lightbox';
import AlbumGrid from '../components/AlbumGrid';
import { gallery, events, img } from '../config/school';
import { StatsStrip, QuoteBand, Journey, Faq, CtaBand } from '../components/Sections';
import { Camera, Images, PartyPopper, Star, Sparkles } from 'lucide-react';

const cats = ['All', ...new Set(gallery.map((g) => g.cat))];
const counts = Object.fromEntries(cats.map((c) => [c, c === 'All' ? gallery.length : gallery.filter((g) => g.cat === c).length]));

export default function Gallery() {
  const [cat, setCat] = useState('All'); const [idx, setIdx] = useState(null);
  const items = useMemo(() => gallery.filter((g) => cat === 'All' || g.cat === cat), [cat]);
  return (
    <>
      <PageHero eyebrow="Photo gallery" title="Moments from around the school" text={`${gallery.length} photos from celebrations, classrooms, the stage and the field.`} image="annual-day-hoop-dance.jpg" chips={[[Images, `${gallery.length} photos`], [Camera, 'Albums by event'], [Sparkles, 'Newest first']]} />
      <StatsStrip items={[{ n: gallery.length, suffix: '+', label: 'Photos', icon: Images }, { n: events.length, suffix: '+', label: 'Celebrations', icon: PartyPopper }, { text: 'Newest first', label: 'Albums', icon: Camera }, { text: 'Growing', label: 'New photos added', icon: Star }]} />
      <AlbumGrid heading="Photo albums" text="One album for each celebration. Tap an album to open all of its photos." filters />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Filter photos">
          {cats.map((c) => (
            <button key={c} onClick={() => { setCat(c); setIdx(null); }} aria-pressed={cat === c} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${cat === c ? 'scale-105 bg-royal-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {c} <span className={`ml-1 text-xs ${cat === c ? 'text-white/80' : 'text-slate-500'}`}>{counts[c]}</span>
            </button>))}
        </div>
        <ul key={cat} className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((g, i) => (
            <Reveal as="li" key={g.src} dir="zoom" delay={(i % 6) * 60} className="mb-4 break-inside-avoid">
              <button onClick={() => setIdx(i)} aria-label={`Open photo: ${g.alt}`} className="skeleton group relative block w-full overflow-hidden rounded-xl shadow-sm transition-shadow duration-500 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-500">
                <LazyImg src={img(g.src)} alt={g.alt} className="h-auto w-full object-cover transition duration-700 group-hover:scale-105" />
                <Expand className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-navy-900/90 to-transparent p-3 text-left text-sm text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">{g.alt}</span>
              </button>
            </Reveal>))}
        </ul>
      </div>
      {idx !== null && <Lightbox items={items} index={idx} onChange={setIdx} onClose={() => setIdx(null)} />}
      <QuoteBand image="annual-day-bharatanatyam.jpg" quote="Moments that make a childhood." by="Carmel International School" />
      <CtaBand title="Want your child to be in the next photo?" text="Ask the school office about admissions." />
    </>
  );
}
