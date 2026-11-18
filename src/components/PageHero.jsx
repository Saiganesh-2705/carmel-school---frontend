import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { SlideLayers, SlideDots, useSlides } from './HeroSlides';
import { heroSlides } from '../config/school';

// Same look as the home page hero, for inner pages: photo, gradient, stars, breadcrumb, wave edge.
export default function PageHero({ eyebrow, title, text, image = 'campus-entrance.jpg', chips = [], children }) {
  const bg = useRef(null); const copy = useRef(null);
  const [i, setI] = useSlides(Math.max(0, heroSlides.findIndex((s) => s.src === image)));
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const on = () => {
      const y = Math.min(window.scrollY, 600);
      if (bg.current) bg.current.style.transform = `translateY(${y * 0.25}px) scale(1.12)`;
      if (copy.current) { copy.current.style.transform = `translateY(${y * 0.15}px)`; copy.current.style.opacity = String(1 - y / 700); }
    };
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 pb-28 pt-16 text-white sm:pb-36 sm:pt-24">
      <div ref={bg} className="absolute inset-0 -z-10 will-change-transform" style={{ transform: 'scale(1.12)' }}><SlideLayers i={i} /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/65 via-navy-900/20 to-transparent" />
      <div className="hero-grain absolute inset-0 -z-10" aria-hidden="true" />
      {[['6%', '70%', 0], ['82%', '18%', 0.9], ['92%', '58%', 1.7], ['55%', '12%', 2.4]].map(([l, t, d], n) => (
        <Star key={n} className="absolute -z-10 h-4 w-4 animate-twinkle fill-sun-400 text-sun-400" style={{ left: l, top: t, animationDelay: `${d}s` }} aria-hidden="true" />))}
      <div className="pointer-events-none absolute -right-24 top-1/2 -z-10 hidden h-[28rem] w-[28rem] -translate-y-1/2 lg:block" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="ring-spin h-full w-full fill-none stroke-white/40"><circle cx="100" cy="100" r="96" strokeWidth="1" strokeDasharray="3 7" /><circle cx="100" cy="100" r="70" strokeWidth="1.2" strokeDasharray="1 5" /></svg>
        <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sun-400/40 to-teal-500/40 blur-xl" />
      </div>
      <div className="aurora-blob absolute -left-20 bottom-10 -z-10 h-56 w-56 rounded-full bg-teal-500/25 blur-3xl" aria-hidden="true" />
      <div ref={copy} className="mx-auto max-w-6xl px-4 will-change-transform">
        <nav aria-label="Breadcrumb" className="animate-wordIn glass-chip inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-slate-100"><Link to="/" className="hover:text-white">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span className="text-white">{title}</span></nav>
        {eyebrow && <p className="animate-wordIn mt-5 text-sm font-semibold uppercase tracking-[.18em] text-teal-500" style={{ animationDelay: '.1s' }}>{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl" aria-label={title}>
          {title.split(' ').map((w, n) => <span key={n} className="inline-block overflow-hidden pb-1 align-bottom" aria-hidden="true"><span className="word-up inline-block" style={{ animationDelay: `${0.25 + n * 0.09}s` }}>{w}&nbsp;</span></span>)}
        </h1>
        <span className="title-bar mt-4 block h-1 w-24 rounded-full bg-gradient-to-r from-sun-400 via-teal-500 to-royal-500" aria-hidden="true" />
        {text && <p className="animate-wordIn mt-5 max-w-2xl text-lg text-slate-200" style={{ animationDelay: '.35s' }}>{text}</p>}
        {chips.length > 0 && <ul className="mt-7 flex flex-wrap gap-2.5">{chips.map(([Icon, label], n) => <li key={label} className="glass-chip animate-popIn inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold" style={{ animationDelay: `${0.7 + n * 0.12}s` }}><Icon className="h-4 w-4 text-sun-400" aria-hidden="true" />{label}</li>)}</ul>}
        {children && <div className="animate-wordIn mt-7" style={{ animationDelay: '.5s' }}>{children}</div>}
        <div className="animate-wordIn mt-8" style={{ animationDelay: '.6s' }}><SlideDots i={i} setI={setI} /></div>
      </div>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 h-10 w-full fill-white sm:h-14" aria-hidden="true"><path d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,30 L1440,80 L0,80 Z" /></svg>
    </section>
  );
}
