import { Pin } from 'lucide-react';
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export default function NoticeCard({ n, actions }) {
  return (
    <article className={`card ${n.pinned ? 'ring-2 ring-sun-400/60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="flex flex-wrap items-center gap-2 font-semibold">
            {n.pinned && <Pin className="h-4 w-4 text-sun-500" aria-label="Pinned" />}{n.title}
            {n.isPublished === false && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">Draft</span>}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{fmtDate(n.createdAt)}{n.audience && ` · ${{ public: 'Website only', portal: 'Portal only', both: 'Website and portal' }[n.audience]}`}</p>
          <p className="mt-2 whitespace-pre-line text-sm">{n.body}</p>
        </div>
        {actions}
      </div>
    </article>
  );
}
