import { useState } from 'react';
import { Pin, ChevronDown, Clock, Loader2 } from 'lucide-react';
import api, { API_URL } from '../services/api';

export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const CATS = {
  general: { label: 'General', cls: 'bg-slate-100 text-slate-700', dot: '#64748b' },
  admission: { label: 'Admission', cls: 'bg-teal-500/15 text-teal-700', dot: '#14a39a' },
  event: { label: 'Event', cls: 'bg-royal-500/15 text-royal-600', dot: '#2f5fd0' },
  holiday: { label: 'Holiday', cls: 'bg-amber-400/25 text-amber-700', dot: '#f5b020' },
  achievement: { label: 'Achievement', cls: 'bg-fuchsia-500/15 text-fuchsia-700', dot: '#c026d3' },
};
export const noticeImg = (n) => n.previewImg || (n.hasImage ? `${API_URL}/notices/${n._id}/image?v=${new Date(n.updatedAt || 0).getTime()}` : null);
const readMins = (t) => Math.max(1, Math.round((t || '').trim().split(/\s+/).length / 200));

export default function NoticeCard({ n, actions, featured = false }) {
  const [open, setOpen] = useState(false); const [full, setFull] = useState(null); const [busy, setBusy] = useState(false);
  const cat = CATS[n.category] || CATS.general; const src = noticeImg(n);
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
          <div className={featured ? 'aspect-[16/9] md:aspect-auto md:h-full' : 'aspect-[16/9]'}><img src={src} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
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
