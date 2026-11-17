import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { SlideLayers, SlideDots, useSlides } from './HeroSlides';
import { heroSlides } from '../config/school';

// Same look as the home page hero, for inner pages: photo, gradient, stars, breadcrumb, wave edge.
export default function PageHero({ eyebrow, title, text, image = 'campus-entrance.jpg', children }) {
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
      <div ref={copy} className="mx-auto max-w-6xl px-4 will-change-transform">
        <nav aria-label="Breadcrumb" className="animate-wordIn flex items-center gap-1 text-sm text-slate-300"><Link to="/" className="hover:text-white">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span className="text-white">{title}</span></nav>
        {eyebrow && <p className="animate-wordIn mt-5 text-sm font-semibold uppercase tracking-[.18em] text-teal-500" style={{ animationDelay: '.1s' }}>{eyebrow}</p>}
        <h1 className="animate-wordIn mt-2 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl" style={{ animationDelay: '.2s' }}>{title}</h1>
        {text && <p className="animate-wordIn mt-5 max-w-2xl text-lg text-slate-200" style={{ animationDelay: '.35s' }}>{text}</p>}
        {children && <div className="animate-wordIn mt-7" style={{ animationDelay: '.5s' }}>{children}</div>}
        <div className="animate-wordIn mt-8" style={{ animationDelay: '.6s' }}><SlideDots i={i} setI={setI} /></div>
      </div>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 h-10 w-full fill-white sm:h-14" aria-hidden="true"><path d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,30 L1440,80 L0,80 Z" /></svg>
    </section>
  );
}
