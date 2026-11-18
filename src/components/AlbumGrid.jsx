import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Images, CalendarDays, Expand, Sparkles, ArrowRight } from 'lucide-react';
import api, { API_URL } from '../services/api';
import Reveal from './Reveal';
import Lightbox from './Lightbox';

export const ALBUM_CATS = { celebration: 'Celebration', festival: 'Festival', sports: 'Sports', cultural: 'Cultural', academic: 'Academic', other: 'Other' };
// Photos kept on Cloudinary are served straight from there, resized for the screen. Others come from the server.
export const albumPhoto = (a, id, w) => { const u = a.cdn && a.cdn[id]; return u ? u.replace('/upload/', `/upload/f_auto,q_auto${w ? `,w_${w}` : ''}/`) : `${API_URL}/albums/${a._id}/images/${id}`; };
export const albumDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const ts = (a) => new Date(a.eventDate).getTime();
// Newest celebration first. Photos added to an older album later do not move it, so the order always follows the event date.
export const newestFirst = (list) => [...list].sort((a, b) => ts(b) - ts(a) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
const isNew = (a) => Date.now() - Math.max(ts(a), new Date(a.createdAt || 0).getTime()) < 21 * 86400000;

function Badge({ a, dark }) {
  return (<>
    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy-800 backdrop-blur">{ALBUM_CATS[a.category]}</span>
    {isNew(a) && <span className="absolute left-3 top-11 inline-flex animate-pulse items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg"><Sparkles className="h-3 w-3" />New</span>}
  </>);
}

// Photo albums added by the admin (Blue Day, Children's Day, Sports Day...). The newest celebration is featured first.
// Shows nothing at all until at least one album exists.
export default function AlbumGrid({ heading, text, limit, filters = false, link = false, dark = false }) {
  const [rows, setRows] = useState(null); const [cat, setCat] = useState('all'); const [open, setOpen] = useState(null); const [idx, setIdx] = useState(0);
  useEffect(() => { api.get('/albums/public').then((r) => setRows(newestFirst(r.data.data))).catch(() => setRows([])); }, []);
  const cats = useMemo(() => [...new Set((rows || []).map((a) => a.category))], [rows]);
  const shown = useMemo(() => (rows || []).filter((a) => cat === 'all' || a.category === cat).slice(0, limit || 999), [rows, cat, limit]);
  const groups = useMemo(() => {
    const rest = shown.slice(1);
    if (!filters) return [['', rest]];
    const by = {}; rest.forEach((a) => { const y = new Date(a.eventDate).getFullYear(); (by[y] = by[y] || []).push(a); });
    return Object.entries(by).sort((x, y) => y[0] - x[0]);
  }, [shown, filters]);
  if (!rows || rows.length === 0) return null;
  const show = (a) => { setIdx(0); setOpen(a); };
  const items = open ? open.photos.map((id) => ({ src: albumPhoto(open, id, 1800), alt: open.title, title: open.title })) : [];
  const f = shown[0]; const sub = dark ? 'text-slate-300' : 'text-slate-600';
  return (
    <section className={dark ? 'bg-navy-900 py-16 text-white' : 'relative overflow-hidden py-14'} aria-label={heading}>
      {!dark && <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />}
      <div className="mx-auto max-w-6xl px-4">
        <Reveal dir="blur"><span className={`eyebrow ${dark ? '!text-sun-400' : ''}`}>Newest first</span><h2 className="mt-2 text-3xl font-bold sm:text-4xl">{heading}</h2>{text && <p className={`mt-2 max-w-2xl ${sub}`}>{text}</p>}</Reveal>
        {filters && cats.length > 1 && (
          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter albums">
            {['all', ...cats].map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${cat === c ? 'scale-105 bg-gradient-to-r from-royal-500 to-teal-500 text-white shadow-lg' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5'}`}>{c === 'all' ? 'All albums' : ALBUM_CATS[c]}</button>)}
          </div>)}

        {f && (
          <Reveal key={`${cat}-${f._id}`} dir="zoom" className="mt-8">
            <button onClick={() => show(f)} aria-label={`Open the latest album: ${f.title}, ${f.photos.length} photos`} className="group relative grid w-full gap-1.5 overflow-hidden rounded-3xl bg-navy-900 text-left shadow-2xl ring-1 ring-black/5 md:grid-cols-4 md:grid-rows-2">
              <span className="relative block aspect-[16/10] overflow-hidden md:col-span-3 md:row-span-2 md:aspect-auto md:min-h-[24rem]">
                <img src={albumPhoto(f, f.photos[0], 1400)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/5 to-transparent" />
                <Badge a={f} />
                <span className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[.18em] text-sun-400"><Sparkles className="h-3.5 w-3.5" />Latest celebration</span>
                  <span className="mt-1 block font-display text-3xl font-bold leading-tight drop-shadow sm:text-4xl">{f.title}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{albumDate(f.eventDate)}</span><span className="inline-flex items-center gap-1.5"><Images className="h-4 w-4" />{f.photos.length} photos</span></span>
                  {f.description && <span className="mt-2 line-clamp-2 block max-w-2xl text-sm text-white/85">{f.description}</span>}
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy-800 transition group-hover:gap-3 group-hover:bg-sun-400">View all photos <ArrowRight className="h-4 w-4" /></span>
                </span>
              </span>
              {[1, 2].map((n) => f.photos[n] ? (
                <span key={n} className="relative hidden overflow-hidden md:block"><img src={albumPhoto(f, f.photos[n], 500)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  {n === 2 && f.photos.length > 3 && <span className="absolute inset-0 flex items-center justify-center bg-navy-900/55 text-2xl font-bold text-white backdrop-blur-[1px]">+{f.photos.length - 3}</span>}</span>) : <span key={n} className="hidden bg-navy-800 md:block" />)}
            </button>
          </Reveal>)}

        {groups.map(([year, list]) => list.length > 0 && (
          <div key={`${cat}-${year}`} className="mt-12">
            {year && <Reveal><div className="mb-5 flex items-center gap-4"><span className="font-display text-3xl font-bold text-royal-600">{year}</span><span className="h-px flex-1 bg-gradient-to-r from-royal-500/40 to-transparent" /><span className="text-sm text-slate-500">{list.length} album{list.length > 1 ? 's' : ''}</span></div></Reveal>}
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a, i) => (
                <Reveal as="li" key={a._id} dir="zoom" delay={(i % 3) * 90}>
                  <button onClick={() => show(a)} aria-label={`Open album: ${a.title}, ${a.photos.length} photos`} className="album group relative block w-full text-left">
                    {a.photos.length > 1 && <span className="album-back album-back-1" aria-hidden="true" />}
                    {a.photos.length > 2 && <span className="album-back album-back-2" aria-hidden="true" />}
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200 shadow-lg ring-1 ring-black/5">
                      <img src={albumPhoto(a, a.photos[0], 700)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                      <span className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                      <Badge a={a} />
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur"><Images className="h-3.5 w-3.5" />{a.photos.length}</span>
                      <Expand className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true" />
                      <span className="absolute inset-x-0 bottom-0 p-4 text-white"><span className="block text-lg font-bold leading-tight drop-shadow">{a.title}</span><span className="mt-1 flex items-center gap-1.5 text-xs text-white/90"><CalendarDays className="h-3.5 w-3.5" />{albumDate(a.eventDate)}</span></span>
                    </span>
                  </button>
                  {a.description && <p className={`mt-3 line-clamp-2 text-sm ${sub}`}>{a.description}</p>}
                </Reveal>))}
            </ul>
          </div>))}
        {link && <Reveal className="mt-10 text-center"><Link to="/gallery" className="btn-primary btn-shine px-6 py-3">See all albums and photos</Link></Reveal>}
      </div>
      {open && <Lightbox items={items} index={idx} onChange={setIdx} onClose={() => setOpen(null)} />}
    </section>
  );
}
