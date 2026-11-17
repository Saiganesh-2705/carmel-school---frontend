import { useEffect, useState } from 'react';
import { Pin, ChevronDown, ChevronLeft, ChevronRight, Clock, Loader2, Images, Maximize2 } from 'lucide-react';
import api, { API_URL } from '../services/api';
import Lightbox from './Lightbox';

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const CATS = {
  general: { label: 'General', cls: 'bg-slate-100 text-slate-700', dot: '#64748b' },
  admission: { label: 'Admission', cls: 'bg-teal-500/15 text-teal-700', dot: '#14a39a' },
  event: { label: 'Event', cls: 'bg-royal-500/15 text-royal-600', dot: '#2f5fd0' },
  celebration: { label: 'Celebration', cls: 'bg-rose-500/15 text-rose-600', dot: '#f43f5e' },
  holiday: { label: 'Holiday', cls: 'bg-amber-400/25 text-amber-700', dot: '#f5b020' },
  achievement: { label: 'Achievement', cls: 'bg-fuchsia-500/15 text-fuchsia-700', dot: '#c026d3' },
};
// Addresses of every photo of a notice (the form passes previewPhotos while you are still writing it).
export const noticePhotos = (n) => n.previewPhotos || (n.photos || []).map((id) => (id === 'cover' ? `${API_URL}/notices/${n._id}/image?v=${new Date(n.updatedAt || 0).getTime()}` : `${API_URL}/notices/${n._id}/images/${id}`));
export const noticeImg = (n) => noticePhotos(n)[0] || null;

// Photo slider: cross-fades by itself every 3 seconds (pauses on hover), arrows, dots, counter and a full-screen viewer.
function PhotoSlider({ photos, title }) {
  const [i, setI] = useState(0); const [hover, setHover] = useState(false); const [view, setView] = useState(null);
  const many = photos.length > 1;
  useEffect(() => { if (i >= photos.length) setI(0); }, [photos.length, i]);
  useEffect(() => {
    if (!many || hover || view !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setTimeout(() => setI((n) => (n + 1) % photos.length), 3200); return () => clearTimeout(t);
  }, [i, many, hover, view, photos.length]);
  const go = (d, e) => { e.stopPropagation(); setI((n) => (n + d + photos.length) % photos.length); };
  return (
    <div className="group/s relative h-full w-full cursor-zoom-in" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => setView(i)}>
      {photos.map((src, n) => (
        <img key={src} src={src} alt={n === i ? title : ''} loading={n === 0 ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover" style={{ opacity: n === i ? 1 : 0, transform: n === i ? 'scale(1.06)' : 'scale(1)', transition: `opacity .8s ease, transform ${n === i ? 4.5 : 0}s linear` }} />))}
      <span className="absolute bottom-3 right-3 rounded-full bg-black/45 p-1.5 text-white opacity-0 backdrop-blur transition group-hover/s:opacity-100"><Maximize2 className="h-3.5 w-3.5" /></span>
      {many && (<>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur"><Images className="h-3 w-3" />{i + 1}/{photos.length}</span>
        <button type="button" aria-label="Previous photo" onClick={(e) => go(-1, e)} className="absolute left-2 top-1/2 -translate-x-2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-navy-800 opacity-0 shadow transition duration-300 hover:scale-110 group-hover/s:translate-x-0 group-hover/s:opacity-100"><ChevronLeft className="h-4 w-4" /></button>
        <button type="button" aria-label="Next photo" onClick={(e) => go(1, e)} className="absolute right-2 top-1/2 translate-x-2 -translate-y-1/2 rounded-full bg-white/85 p-1.5 text-navy-800 opacity-0 shadow transition duration-300 hover:scale-110 group-hover/s:translate-x-0 group-hover/s:opacity-100"><ChevronRight className="h-4 w-4" /></button>
        <div className="absolute inset-x-0 bottom-1.5 flex justify-center gap-1.5">{photos.map((p, n) => <span key={p} className={`h-1.5 rounded-full bg-white transition-all duration-300 ${n === i ? 'w-5 opacity-100' : 'w-1.5 opacity-60'}`} />)}</div>
      </>)}
      {view !== null && <Lightbox items={photos.map((src) => ({ src, alt: title }))} index={view} onChange={setView} onClose={() => setView(null)} />}
    </div>
  );
}
const readMins = (t) => Math.max(1, Math.round((t || '').trim().split(/\s+/).length / 200));

export default function NoticeCard({ n, actions, featured = false }) {
  const [open, setOpen] = useState(false); const [full, setFull] = useState(null); const [busy, setBusy] = useState(false);
  const cat = CATS[n.category] || CATS.general; const photos = noticePhotos(n); const src = photos.length > 0;
  const text = full ?? n.article ?? '';
  const toggle = async () => {
    const next = !open; setOpen(next);
    if (next && n.articleTruncated && full === null) {
      setBusy(true);
      try { const r = await api.get(`/notices/public/${n._id}`); setFull(r.data.data.article || ''); } catch { setFull(n.article || ''); } finally { setBusy(false); }
    }
  };
  return (
    <article className={`ncard dash-card spot card group !p-0 overflow-hidden ${featured ? 'md:flex' : ''} ${n.pinned ? 'ring-2 ring-sun-400/60' : ''}`}>
      {src && (
        <div className={`nimg relative overflow-hidden bg-slate-200 ${featured ? 'md:w-5/12 md:shrink-0' : ''}`}>
          <div className={featured ? 'aspect-[16/9] md:aspect-auto md:h-full' : 'aspect-[16/9]'}><PhotoSlider photos={photos} title={n.title} /></div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent" />
          <span className={`absolute left-3 top-3 animate-popIn rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur ${cat.cls}`}>{cat.label}</span>
          {n.pinned && <span className="absolute right-3 top-3 animate-popIn rounded-full bg-sun-400 p-1.5 text-navy-900 shadow"><Pin className="h-3.5 w-3.5" aria-label="Pinned" /></span>}
        </div>)}
      <div className="min-w-0 flex-1 p-5">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {!src && <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${cat.cls}`}><span className="h-1.5 w-1.5 rounded-full" style={{ background: cat.dot }} />{cat.label}{n.pinned && <Pin className="ml-1 h-3 w-3 text-sun-500" aria-label="Pinned" />}</span>}
            <h3 className={`flex flex-wrap items-center gap-2 font-semibold transition-colors group-hover:text-royal-600 ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
              {n.title}
              {n.isPublished === false && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Draft</span>}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{fmtDate(n.createdAt)}{n.audience && ` · ${{ public: 'Website only', portal: 'Admin portal only', both: 'Website and admin portal' }[n.audience]}`}</p>
            <p className="mt-2 whitespace-pre-line text-sm">{n.body}</p>
          </div>
          {actions}
        </div>

        {n.hasArticle && (<>
          <button type="button" onClick={toggle} aria-expanded={open} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-royal-500 hover:text-royal-600">
            {open ? 'Show less' : 'Read full article'}<ChevronDown className={`h-4 w-4 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} />
            <span className="inline-flex items-center gap-1 text-xs font-normal text-slate-500"><Clock className="h-3 w-3" />{readMins(n.articleTruncated ? full || n.article : text)} min read</span>
          </button>
          <div className={`expand ${open ? 'open' : ''}`}><div>
            <div className="mt-3 space-y-3 border-l-4 border-teal-500/60 pl-4 text-sm leading-relaxed">
              {busy ? <Loader2 className="h-5 w-5 animate-spin text-teal-500" /> : text.split(/\n{2,}/).filter(Boolean).map((para, i) => <p key={i} className="whitespace-pre-line" style={open ? { animation: `fadeIn .5s ${i * 90}ms both` } : undefined}>{para}</p>)}
            </div>
          </div></div>
        </>)}
      </div>
    </article>
  );
}
