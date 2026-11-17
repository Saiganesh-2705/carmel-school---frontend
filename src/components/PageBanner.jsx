import { Star } from 'lucide-react';
import Counter from './Counter';

// The animated gradient banner used at the top of every admin page (same look as the dashboard).
export default function PageBanner({ eyebrow, title, text, stats = [], children }) {
  return (
    <section className="aurora-card relative isolate mb-6 overflow-hidden rounded-3xl p-6 text-white shadow-2xl shadow-royal-600/20 sm:p-8">
      <div className="aurora" aria-hidden="true" />
      {[['6%', '24%', 0], ['52%', '14%', 1], ['78%', '72%', 2]].map(([l, t, d], i) => <Star key={i} className="absolute -z-10 h-4 w-4 animate-twinkle fill-sun-400 text-sun-400" style={{ left: l, top: t, animationDelay: `${d}s` }} aria-hidden="true" />)}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="animate-wordIn">
          {eyebrow && <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">{eyebrow}</p>}
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {text && <p className="mt-2 max-w-xl text-white/85">{text}</p>}
        </div>
        {children && <div className="animate-wordIn flex flex-wrap items-center gap-3" style={{ animationDelay: '.12s' }}>{children}</div>}
      </div>
      {stats.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([label, n], i) => (
            <div key={label} className="animate-popIn rounded-2xl bg-white/12 p-3 backdrop-blur ring-1 ring-white/15 transition hover:-translate-y-1 hover:bg-white/20" style={{ animationDelay: `${200 + i * 90}ms` }}>
              <p className="text-2xl font-extrabold tabular-nums sm:text-3xl"><Counter to={n} /></p><p className="text-xs text-white/80 sm:text-sm">{label}</p>
            </div>))}
        </div>)}
    </section>
  );
}
