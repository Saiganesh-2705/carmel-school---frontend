import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, MessageSquare, Quote } from 'lucide-react';
import Reveal from './Reveal';
import Counter from './Counter';
import { img, programmes } from '../config/school';

// Floating row of figures that overlaps the bottom of a page banner.  items: [{ n, suffix, label, icon }]
export function StatsStrip({ items }) {
  return (
    <div className="relative z-10 mx-auto -mt-14 max-w-5xl px-4">
      <Reveal dir="zoom">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 shadow-2xl ring-1 ring-black/5 md:grid-cols-4">
          {items.map(({ n, suffix, label, icon: Icon, text }) => (
            <div key={label} className="group relative bg-white p-5 text-center transition duration-500 hover:bg-navy-900 hover:text-white">
              {Icon && <Icon className="mx-auto h-5 w-5 text-teal-500 transition group-hover:scale-125 group-hover:text-sun-400" aria-hidden="true" />}
              <dd className="mt-1 font-display text-3xl font-bold text-navy-800 transition group-hover:text-white sm:text-4xl">{text || <Counter to={n} suffix={suffix} />}</dd>
              <dt className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 transition group-hover:text-slate-300">{label}</dt>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal-500 to-sun-400 transition duration-500 group-hover:scale-x-100" />
            </div>))}
        </dl>
      </Reveal>
    </div>
  );
}

// Full-width photo with a quote on top. The photo stays put while the page scrolls (desktop).
export function QuoteBand({ image, quote, by }) {
  return (
    <section className="relative isolate overflow-hidden py-24 text-white" aria-label="Our motto">
      <div className="absolute inset-0 -z-10 bg-cover bg-center md:bg-fixed" style={{ backgroundImage: `url(${img(image)})` }} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/80 via-navy-900/55 to-navy-900/30" />
      <Reveal dir="blur" className="mx-auto max-w-4xl px-4 text-center">
        <Quote className="mx-auto h-10 w-10 text-sun-400" aria-hidden="true" />
        <p className="mt-4 font-display text-3xl font-bold leading-tight drop-shadow sm:text-5xl">{quote}</p>
        {by && <p className="mt-4 text-sm font-semibold uppercase tracking-[.2em] text-teal-200">{by}</p>}
      </Reveal>
    </section>
  );
}

// A numbered, connected row of steps.  steps: [{ icon, t, d }]
export function Journey({ eyebrow, title, text, steps }) {
  return (
    <section className="bg-canvas py-16">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="mx-auto max-w-2xl text-center"><span className="eyebrow">{eyebrow}</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">{title}</h2>{text && <p className="mt-3 text-slate-600">{text}</p>}</Reveal>
        <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-9 hidden border-t-2 border-dashed border-teal-500/40 lg:block" aria-hidden="true" />
          {steps.map(({ icon: Icon, t, d }, n) => (
            <Reveal as="li" key={t} dir="zoom" delay={n * 120} className="group relative rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <span className="relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-royal-500 to-teal-500 text-white shadow-lg transition duration-500 group-hover:rotate-[360deg]"><Icon className="h-8 w-8" aria-hidden="true" /></span>
              <span className="mt-4 block text-xs font-bold uppercase tracking-widest text-teal-600">Step {n + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-navy-800">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p>
            </Reveal>))}
        </ol>
      </div>
    </section>
  );
}

// Questions parents often ask.  items: [{ q, a }]
export function Faq({ title = 'Questions parents ask', items }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16" aria-label={title}>
      <Reveal className="text-center"><span className="eyebrow">Good to know</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">{title}</h2></Reveal>
      <div className="mt-8 space-y-3">
        {items.map(({ q, a }, n) => (
          <Reveal key={q} delay={n * 70}>
            <details className="faq group rounded-2xl bg-white ring-1 ring-slate-200 transition duration-300 open:shadow-xl open:ring-teal-500/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-navy-800 [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="h-5 w-5 shrink-0 text-teal-600 transition duration-300 group-open:rotate-180" aria-hidden="true" /></summary>
              <p className="faq-body px-5 pb-5 text-slate-600">{a}</p>
            </details>
          </Reveal>))}
      </div>
    </section>
  );
}

// Closing call to action.
export function CtaBand({ title = 'Come and see Carmel for yourself', text = 'Send us a message and the school office will reply with everything you need.', to = '/contact', label = 'Enquire now' }) {
  return (
    <section className="px-4 pb-16">
      <Reveal dir="zoom" className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-royal-600 via-royal-500 to-teal-600 p-8 text-white shadow-2xl sm:p-12">
        <span className="orb absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" aria-hidden="true" /><span className="orb absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-sun-400/15" aria-hidden="true" />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div><h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2><p className="mt-2 max-w-xl text-white/90">{text}</p></div>
          <Link to={to} className="btn btn-shine shrink-0 bg-white px-6 py-3 text-navy-800 shadow-lg hover:-translate-y-0.5 hover:bg-sun-400"><MessageSquare className="h-4 w-4" />{label}<ArrowRight className="h-4 w-4" /></Link>
        </div>
      </Reveal>
    </section>
  );
}

// Feature cards with a soft spotlight that follows the pointer.  items: [{ icon, t, d }]
export function Highlights({ eyebrow, title, text, items }) {
  const glow = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); };
  return (
    <section className="relative overflow-hidden bg-canvas py-16" aria-label={title}>
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-royal-500/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4">
        <Reveal dir="blur" className="max-w-2xl"><span className="eyebrow">{eyebrow}</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">{title}</h2>{text && <p className="mt-3 text-slate-600">{text}</p>}</Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t, d }, n) => (
            <Reveal key={t} dir="zoom" delay={(n % 3) * 90}>
              <article className="feat group h-full" onPointerMove={glow}>
                <span className="absolute right-4 top-2 select-none font-display text-6xl font-bold text-slate-100 transition duration-500 group-hover:text-teal-500/20" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-royal-500 to-teal-500 text-white shadow-lg transition duration-500 group-hover:rotate-6 group-hover:scale-110"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <h3 className="relative mt-4 text-lg font-bold text-navy-800">{t}</h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-slate-600">{d}</p>
              </article>
            </Reveal>))}
        </div>
      </div>
    </section>
  );
}

// A row of photos to swipe through (no auto-scrolling).  photos: file names in /images
export function PhotoStrip({ eyebrow = 'Moments', title, text, photos, to = '/gallery', label = 'Open the full gallery' }) {
  return (
    <section className="py-16" aria-label={title}>
      <div className="mx-auto max-w-6xl px-4">
        <Reveal dir="blur" className="flex flex-wrap items-end justify-between gap-4"><div className="max-w-2xl"><span className="eyebrow">{eyebrow}</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">{title}</h2>{text && <p className="mt-2 text-slate-600">{text}</p>}</div>
          <Link to={to} className="btn-ghost group">{label}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link></Reveal>
      </div>
      <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-4 sm:px-[max(1rem,calc((100vw-72rem)/2+1rem))]">
        {photos.map((p, n) => (
          <Reveal key={p} dir="zoom" delay={Math.min(n, 5) * 70} className="shrink-0 snap-start">
            <Link to={to} tabIndex={-1} aria-hidden="true"><img src={img(p)} alt="" loading="lazy" className="shot h-64 w-52 rounded-2xl object-cover shadow-lg ring-1 ring-black/5 sm:h-72 sm:w-60" style={{ marginTop: n % 2 ? '1.25rem' : 0 }} /></Link>
          </Reveal>))}
      </div>
    </section>
  );
}

// Photo panels that open on hover, focus or tap (a column on phones, a row on larger screens).  items: [{ img, title, text }]
export function ExpandPanels({ eyebrow, title, text, items }) {
  const [on, setOn] = useState(0);
  return (
    <section className="py-16" aria-label={title}>
      <div className="mx-auto max-w-6xl px-4">
        <Reveal dir="blur" className="max-w-2xl"><span className="eyebrow">{eyebrow}</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">{title}</h2>{text && <p className="mt-2 text-slate-600">{text}</p>}</Reveal>
        <Reveal dir="zoom" className="mt-8">
          <div className="flex flex-col gap-3 md:h-[27rem] md:flex-row">
            {items.map((it, n) => {
              const a = on === n;
              return (
                <button key={it.title} type="button" onMouseEnter={() => setOn(n)} onFocus={() => setOn(n)} onClick={() => setOn(n)} aria-expanded={a}
                  className={`group relative overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-black/5 transition-all duration-700 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] ${a ? 'h-80 md:h-auto md:flex-[5]' : 'h-20 md:h-auto md:flex-[1]'}`}>
                  <img src={img(it.img)} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition duration-[1200ms] ${a ? 'scale-100' : 'scale-125 saturate-75'}`} />
                  <span className={`absolute inset-0 transition duration-700 ${a ? 'bg-gradient-to-t from-navy-900/75 via-navy-900/5 to-transparent' : 'bg-navy-900/45 group-hover:bg-navy-900/30'}`} />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy-800">{String(n + 1).padStart(2, '0')}</span>
                  <span className={`absolute left-5 font-semibold text-white transition-all duration-500 md:[writing-mode:vertical-rl] ${a ? 'pointer-events-none opacity-0' : 'bottom-4 opacity-100 md:bottom-5'}`}>{it.title}</span>
                  <span className={`absolute inset-x-0 bottom-0 p-5 text-white transition-all duration-700 sm:p-7 ${a ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-6 opacity-0'}`}>
                    <span className="block font-display text-2xl font-bold sm:text-3xl">{it.title}</span>
                    <span className="mt-2 block max-w-md text-sm leading-relaxed text-white/90">{it.text}</span>
                  </span>
                </button>);
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// "Which class suits my child?" slider.  Uses the usual starting ages; the office confirms the right class.
const pick = (age) => (age <= 5 ? 0 : age >= 10 ? 5 : age - 5);
export function AgeFinder() {
  const [age, setAge] = useState(6); const c = programmes[pick(age)];
  const pct = ((age - 3) / 8) * 100;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-royal-600 py-16 text-white" aria-label="Find the right class">
      <div className="aurora-blob pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <Reveal dir="left">
          <span className="eyebrow !text-sun-400">Class finder</span>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Which class is right for your child?</h2>
          <p className="mt-3 max-w-md text-slate-300">Slide to your child’s age and see the usual class. The school office will confirm the best fit.</p>
          <div className="mt-8">
            <div className="mb-3 flex items-end justify-between"><span className="text-sm text-slate-300">Child’s age</span><span key={age} className="animate-popIn font-display text-5xl font-bold text-sun-400">{age}<span className="ml-1 text-lg text-white/70">yrs</span></span></div>
            <input type="range" min="3" max="11" step="1" value={age} onChange={(e) => setAge(+e.target.value)} aria-label="Child’s age in years" aria-valuetext={`${age} years`} className="age-range w-full" style={{ '--p': `${pct}%` }} />
            <div className="mt-2 flex justify-between text-xs text-slate-400" aria-hidden="true">{[3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => <span key={n} className={n === age ? 'font-bold text-white' : ''}>{n}</span>)}</div>
          </div>
        </Reveal>
        <Reveal dir="right">
          <div key={c.id} className="animate-popIn rounded-3xl bg-white/10 p-7 shadow-2xl ring-1 ring-white/20 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-teal-300">{c.level}</p>
            <h3 className="mt-1 font-display text-4xl font-bold">{c.name}</h3>
            <p className="mt-1 text-slate-200">{c.tag}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-100">{c.points.slice(0, 3).map((t) => <li key={t} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sun-400" />{t}</li>)}</ul>
            <div className="mt-6 flex flex-wrap gap-3"><Link to="/contact" className="btn bg-white px-5 py-2.5 text-navy-800 btn-shine hover:bg-sun-400">Enquire about {c.name} <ArrowRight className="h-4 w-4" /></Link><Link to="/classes" className="btn bg-white/10 px-5 py-2.5 text-white hover:bg-white/20">All classes</Link></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
