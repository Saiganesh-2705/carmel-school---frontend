import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Images, CalendarDays, Expand } from 'lucide-react';
import api, { API_URL } from '../services/api';
import Reveal from './Reveal';
import Lightbox from './Lightbox';

export const ALBUM_CATS = { celebration: 'Celebration', festival: 'Festival', sports: 'Sports', cultural: 'Cultural', academic: 'Academic', other: 'Other' };
// Photos kept on Cloudinary are served straight from there, resized for the screen. Others come from the server.
export const albumPhoto = (a, id, w) => { const u = a.cdn && a.cdn[id]; return u ? u.replace('/upload/', `/upload/f_auto,q_auto${w ? `,w_${w}` : ''}/`) : `${API_URL}/albums/${a._id}/images/${id}`; };
export const albumDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Photo albums added by the admin (Blue Day, Children's Day, Sports Day...). Shows nothing at all until at least one album exists.
export default function AlbumGrid({ heading, text, limit, filters = false, link = false, dark = false }) {
  const [rows, setRows] = useState(null); const [cat, setCat] = useState('all'); const [open, setOpen] = useState(null); const [idx, setIdx] = useState(0);
  useEffect(() => { api.get('/albums/public').then((r) => setRows(r.data.data)).catch(() => setRows([])); }, []);
  const cats = useMemo(() => [...new Set((rows || []).map((a) => a.category))], [rows]);
  const shown = useMemo(() => (rows || []).filter((a) => cat === 'all' || a.category === cat).slice(0, limit || 999), [rows, cat, limit]);
  if (!rows || rows.length === 0) return null;
  const items = open ? open.photos.map((id) => ({ src: albumPhoto(open, id, 1800), alt: open.title, title: open.title })) : [];
  return (
    <section className={dark ? 'bg-navy-900 py-16 text-white' : 'py-14'} aria-label={heading}>
      <div className="mx-auto max-w-6xl px-4">
        <Reveal dir="blur"><span className={`eyebrow ${dark ? '!text-sun-400' : ''}`}>New photos</span><h2 className="mt-2 text-3xl font-bold sm:text-4xl">{heading}</h2>{text && <p className={`mt-2 max-w-2xl ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>}</Reveal>
        {filters && cats.length > 1 && (
          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter albums">
            {['all', ...cats].map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${cat === c ? 'scale-105 bg-gradient-to-r from-royal-500 to-teal-500 text-white shadow-lg' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5'}`}>{c === 'all' ? 'All albums' : ALBUM_CATS[c]}</button>)}
          </div>)}
        <ul key={cat} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <Reveal as="li" key={a._id} dir="zoom" delay={(i % 3) * 90}>
              <button onClick={() => { setIdx(0); setOpen(a); }} aria-label={`Open album: ${a.title}, ${a.photos.length} photos`} className="album group relative block w-full text-left">
                {a.photos.length > 1 && <span className="album-back album-back-1" aria-hidden="true" />}
                {a.photos.length > 2 && <span className="album-back album-back-2" aria-hidden="true" />}
                <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg ring-1 ring-black/5">
                  <img src={albumPhoto(a, a.photos[0], 700)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy-800 backdrop-blur">{ALBUM_CATS[a.category]}</span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur"><Images className="h-3.5 w-3.5" />{a.photos.length}</span>
                  <Expand className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-white"><span className="block text-lg font-bold leading-tight">{a.title}</span><span className="mt-1 flex items-center gap-1.5 text-xs text-white/80"><CalendarDays className="h-3.5 w-3.5" />{albumDate(a.eventDate)}</span></span>
                </span>
              </button>
              {a.description && <p className={`mt-3 line-clamp-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{a.description}</p>}
            </Reveal>))}
        </ul>
        {link && <Reveal className="mt-10 text-center"><Link to="/gallery" className="btn-primary btn-shine px-6 py-3">See all albums and photos</Link></Reveal>}
      </div>
      {open && <Lightbox items={items} index={idx} onChange={setIdx} onClose={() => setOpen(null)} />}
    </section>
  );
}
