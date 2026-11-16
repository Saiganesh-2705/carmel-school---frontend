import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Palette, Sparkles, Trophy, HeartHandshake, ArrowRight, MessageSquare, PhoneCall, School, Star, Users, Images, PartyPopper, ShieldCheck } from 'lucide-react';
import Reveal from '../components/Reveal';
import LazyImg from '../components/LazyImg';
import Tilt from '../components/Tilt';
import Counter from '../components/Counter';
import Carousel from '../components/Carousel';
import Lightbox from '../components/Lightbox';
import { school, img, heroSlides, events, annualDay, community, gallery, programmes } from '../config/school';

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % heroSlides.length), 6500); return () => clearInterval(t); }, []);
  const words = school.motto.split(' ');
  const copy = useRef(null); const glow = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const on = () => { const y = Math.min(window.scrollY, 700); if (copy.current) { copy.current.style.transform = `translateY(${y * 0.22}px)`; copy.current.style.opacity = String(1 - y / 900); } };
    window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <section onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const g = glow.current; if (g) { g.style.setProperty('--hx', `${e.clientX - r.left}px`); g.style.setProperty('--hy', `${e.clientY - r.top}px`); g.style.opacity = 1; } }} onPointerLeave={() => { if (glow.current) glow.current.style.opacity = 0; }} className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-navy-900 text-white">
      {heroSlides.map((s, n) => (
        <div key={s.src} className={`absolute inset-0 -z-10 transition-opacity duration-[1400ms] ${n === i ? 'opacity-100' : 'opacity-0'}`} aria-hidden={n !== i}>
          <img src={img(s.src)} alt={n === i ? s.alt : ''} className={`h-full w-full object-cover ${n === i ? 'animate-kenburns' : ''}`} />
        </div>))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/90 via-navy-900/55 to-transparent" />
      <div className="hero-grain absolute inset-0 -z-10" aria-hidden="true" />
      <div ref={glow} className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500" style={{ background: 'radial-gradient(420px circle at var(--hx,50%) var(--hy,50%), rgba(94,234,212,.18), transparent 70%)' }} aria-hidden="true" />
      {[['12%', '18%', 0], ['78%', '14%', 0.8], ['88%', '48%', 1.6], ['62%', '30%', 2.4], ['30%', '10%', 1.2]].map(([l, t, d], n) => (
        <Star key={n} className="absolute -z-10 h-5 w-5 animate-twinkle fill-sun-400 text-sun-400" style={{ left: l, top: t, animationDelay: `${d}s` }} aria-hidden="true" />))}
      <div ref={copy} className="mx-auto w-full max-w-6xl px-4 pb-24 pt-16 will-change-transform">
        <p className="animate-wordIn text-sm font-semibold text-teal-500" style={{ animationDelay: '.1s' }}>{school.name} · {school.board}</p>
        <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] sm:text-7xl lg:text-8xl" aria-label={school.motto}>
          {words.map((w, n) => <span key={w} className={`mr-4 inline-block animate-wordIn ${n === words.length - 1 ? 'text-gradient-light' : ''}`} style={{ animationDelay: `${0.25 + n * 0.18}s` }}>{w}</span>)}
        </h1>
        <p className="animate-wordIn mt-6 max-w-xl text-lg text-slate-200" style={{ animationDelay: '.8s' }}>A school where children learn through play, music, sport and celebration, with teachers who know every child by name.</p>
        <div className="animate-wordIn mt-8 flex flex-wrap gap-3" style={{ animationDelay: '1s' }}>
          <Link to="/contact" className="btn-primary btn-shine px-6 py-3">Enquire about admission</Link>
          <Link to="/events" className="btn bg-white/10 px-6 py-3 text-white backdrop-blur hover:bg-white/20">See our celebrations</Link>
        </div>
        <div className="mt-10 flex gap-2" role="group" aria-label="Choose slide">
          {heroSlides.map((s, n) => <button key={s.src} aria-label={`Show slide ${n + 1}`} aria-current={n === i} onClick={() => setI(n)} className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? 'w-10 bg-teal-500' : 'w-4 bg-white/40 hover:bg-white/70'}`} />)}
        </div>
      </div>
      <a href="#celebrate" aria-label="Scroll down" className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 animate-cue text-white/80 sm:block"><ChevronDown className="h-7 w-7" /></a>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute bottom-0 h-12 w-full fill-white" aria-hidden="true"><path d="M0,40 C240,90 480,0 720,30 C960,60 1200,90 1440,30 L1440,80 L0,80 Z" /></svg>
    </section>
  );
}

function Marquee() {
  const strip = [...events, ...events];
  return (
    <section id="celebrate" className="overflow-hidden py-14" aria-label="School celebrations">
      <Reveal className="mx-auto mb-8 max-w-6xl px-4"><span className="eyebrow">Celebrations</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">Every month has something to celebrate</h2><p className="mt-2 max-w-2xl text-slate-600">Colour days, festivals and ceremonies fill the school year. Hover to pause the strip.</p></Reveal>
      <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {strip.map((e, n) => (
          <Link to="/events" key={n} tabIndex={n >= events.length ? -1 : 0} aria-hidden={n >= events.length} className="group relative block h-64 w-72 shrink-0 overflow-hidden rounded-2xl">
            <img src={img(e.img)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 font-semibold text-white">{e.title}</span>
          </Link>))}
      </div>
    </section>
  );
}

const tiles = [
  { t: 'Learning by making', p: 'summer-class-crafts.jpg', c: 'md:col-span-2 md:row-span-2', d: 'Paper, cups and newspaper become flowers, toys and models.' },
  { t: 'Music and dance', p: 'bharatanatyam.jpg', c: '', d: 'Bharatanatyam and stage performances.' },
  { t: 'Sports', p: 'sports-race.jpg', c: '', d: 'Races, relays and games.' },
  { t: 'Good manners', p: 'table-manners.jpg', c: '', d: 'Children teach each other table manners.' },
  { t: 'Science', p: 'science-exhibition.jpg', c: '', d: 'Solar system and rain-water models.' },
  { t: 'Nature', p: 'green-day.jpg', c: 'md:col-span-2', d: 'Saplings, plants and Green Day.' },
  { t: 'Prayer and values', p: 'morning-prayer.jpg', c: 'md:col-span-2', d: 'The day begins with prayer together.' },
];
function Bento() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Reveal><span className="eyebrow">Campus life</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">Life at {school.name}</h2><p className="mt-2 max-w-2xl text-slate-600">Learning here goes well beyond the blackboard.</p></Reveal>
      <div className="mt-8 grid auto-rows-[200px] gap-4 sm:grid-cols-2 md:grid-cols-4">
        {tiles.map((x, n) => (
          <Reveal key={x.t} dir="zoom" delay={n * 70} className={x.c}>
            <Tilt className="group relative h-full overflow-hidden rounded-2xl shadow-sm">
              <LazyImg src={img(x.p)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white"><h3 className="font-semibold">{x.t}</h3><p className="max-h-0 overflow-hidden text-sm text-slate-200 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 max-md:max-h-16 max-md:opacity-100">{x.d}</p></div>
            </Tilt>
          </Reveal>))}
      </div>
    </section>
  );
}

function Band() {
  const words = ['Learn to Lead', 'Faith', 'Play', 'Music', 'Sport', 'Kindness', 'Celebration'];
  const row = [...words, ...words, ...words, ...words];
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-white py-5" aria-hidden="true">
      <div className="flex w-max animate-drift gap-10 whitespace-nowrap font-display text-5xl font-bold sm:text-6xl">
        {row.map((w, n) => <span key={n} className={`flex items-center gap-10 ${n % 2 ? 'outline-text' : 'text-navy-800'}`}>{w}<Star className="h-6 w-6 fill-sun-400 text-sun-400" /></span>)}
      </div>
    </div>
  );
}

function Programmes() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Reveal className="flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">Our classes</span><h2 className="mt-2 text-3xl text-navy-800 sm:text-4xl">From JKG to Grade III</h2><p className="mt-2 max-w-xl text-slate-600">A joyful start in Pre-Primary and steady growth through the early primary grades.</p></div><Link to="/classes" className="btn-ghost ring-1 ring-slate-200">Explore all classes <ArrowRight className="h-4 w-4" /></Link></Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {programmes.map((c, n) => (
          <Reveal key={c.id} delay={n * 100}>
            <Link to={`/classes#${c.id}`} className="spot lift group block h-full rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600">{c.level}</span>
              <h3 className="mt-2 font-display text-3xl font-bold text-navy-800">{c.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.tag}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-royal-600">Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1.5" /></span>
            </Link>
          </Reveal>))}
      </div>
    </section>
  );
}

const why = [
  { icon: Palette, t: 'Play-based learning', d: 'Colour days, crafts and activities make lessons something children enjoy.' },
  { icon: Sparkles, t: 'Culture and festivals', d: 'Pongal, Independence Day, Christmas and more are celebrated together.' },
  { icon: Trophy, t: 'Stage and field', d: 'Annual Day, Sports Day and graduation give every child a moment to shine.' },
  { icon: HeartHandshake, t: 'Values from day one', d: 'Manners, kindness and care for nature are taught through everyday activities.' },
];
function Why() {
  return (
    <section className="bg-canvas py-14">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal><span className="eyebrow">Why families choose us</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">What children get here</h2></Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ icon: Icon, t, d }, n) => (
            <Reveal key={t} delay={n * 90} className="spot lift group rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-teal-500 group-hover:text-white"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-4 font-semibold text-navy-800">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p>
            </Reveal>))}
        </div>
      </div>
    </section>
  );
}

function AnnualDaySpotlight() {
  const [idx, setIdx] = useState(null);
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-16 text-white sm:py-20" aria-labelledby="annual-h">
      <div className="absolute -right-24 top-0 -z-10 h-80 w-80 animate-floaty rounded-full bg-sun-500/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-20 bottom-0 -z-10 h-72 w-72 animate-floaty rounded-full bg-royal-500/25 blur-3xl" style={{ animationDelay: '3s' }} aria-hidden="true" />
      <Reveal className="mx-auto mb-10 flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4">
        <div><span className="eyebrow !text-sun-400">Annual Day</span><h2 id="annual-h" className="mt-2 text-3xl font-bold sm:text-4xl">A night on stage, <span className="text-gradient-light">a lifetime of memories</span></h2><p className="mt-2 max-w-2xl text-slate-300">Dances, graduation, guests and gifts. Drag, swipe or use the arrows, then tap any photo to see it full size.</p></div>
        <Link to="/events" className="btn bg-white/10 px-5 py-2.5 text-white ring-1 ring-white/20 hover:bg-white/20">All celebrations <ArrowRight className="h-4 w-4" /></Link>
      </Reveal>
      <Carousel items={annualDay} onOpen={setIdx} />
      {idx !== null && <Lightbox items={annualDay} index={idx} onChange={setIdx} onClose={() => setIdx(null)} />}
    </section>
  );
}

function Community() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <Reveal><span className="eyebrow">Faith and care</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">Every day begins with <span className="text-gradient">prayer and gratitude</span></h2></Reveal>
          <Reveal delay={100}><p className="mt-4 text-lg leading-relaxed text-slate-600">The day starts with children praying together under the trees. The sisters who run the school are part of daily life, in the classroom, the office and the courtyard, so each child is looked after and known.</p></Reveal>
          <Reveal delay={200}><ul className="mt-6 space-y-3 text-slate-700">
            {['Morning prayer for the whole school', 'Sisters and teachers who know every child', 'Lessons that sometimes move out into the courtyard'].map((t) => <li key={t} className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />{t}</li>)}
          </ul></Reveal>
          <Reveal delay={300}><Link to="/about" className="btn-primary btn-shine mt-8 px-6 py-3">Meet our school family <ArrowRight className="h-4 w-4" /></Link></Reveal>
        </div>
        <div className="grid grid-cols-6 grid-rows-[repeat(2,11rem)] gap-3 sm:grid-rows-[repeat(2,13rem)]">
          <Reveal dir="zoom" className="col-span-4 row-span-1"><Tilt className="relative h-full overflow-hidden rounded-2xl"><LazyImg src={img(community[0].src)} alt={community[0].alt} className="h-full w-full object-cover" /></Tilt></Reveal>
          <Reveal dir="zoom" delay={120} className="col-span-2 row-span-2"><Tilt className="relative h-full overflow-hidden rounded-2xl"><LazyImg src={img(community[1].src)} alt={community[1].alt} className="h-full w-full object-cover object-top" /></Tilt></Reveal>
          <Reveal dir="zoom" delay={240} className="col-span-4 row-span-1"><Tilt className="relative h-full overflow-hidden rounded-2xl"><LazyImg src={img(community[2].src)} alt={community[2].alt} className="h-full w-full object-cover" /></Tilt></Reveal>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { icon: PartyPopper, to: events.length, suffix: '', label: 'Celebrations through the year' },
  { icon: Images, to: gallery.length, suffix: '', label: 'Photo moments in our gallery' },
  { icon: Users, to: 6, suffix: '', label: 'Portal logins: admin, teacher, student, parent, accountant, librarian' },
  { icon: School, text: school.board, label: 'Board of education' },
];
function Stats() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-royal-600 via-royal-500 to-teal-600 py-14 text-white">
      <div className="dots absolute inset-0 -z-10 opacity-20" aria-hidden="true" />
      <dl className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, to, suffix, text, label }, n) => (
          <Reveal key={label} delay={n * 100} className="text-center">
            <Icon className="mx-auto h-7 w-7 text-sun-400" aria-hidden="true" />
            <dd className="mt-2 text-5xl font-extrabold tabular-nums">{text ? text : <Counter to={to} suffix={suffix} />}</dd>
            <dt className="mx-auto mt-1 max-w-[16rem] text-sm text-white/85">{label}</dt>
          </Reveal>))}
      </dl>
    </section>
  );
}

const steps = [
  { icon: MessageSquare, t: 'Send us a message', d: 'Use the contact form to tell us your child’s age and what you would like to know.' },
  { icon: PhoneCall, t: 'The office replies', d: 'We share the admission process and fees, and fix a time that suits you.' },
  { icon: School, t: 'Visit the campus', d: 'Walk around, meet the teachers and sisters, and see the classrooms for yourself.' },
];
function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <Reveal className="text-center"><span className="eyebrow">Admissions</span><h2 className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">Joining us is simple</h2></Reveal>
      <ol className="relative mt-12 grid gap-8 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-teal-500/40 md:block" aria-hidden="true" />
        {steps.map(({ icon: Icon, t, d }, n) => (
          <Reveal as="li" key={t} delay={n * 140} className="relative text-center">
            <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-teal-600 shadow-lg ring-4 ring-teal-500/20"><Icon className="h-7 w-7" /><span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sun-500 text-xs font-bold text-navy-900">{n + 1}</span></span>
            <h3 className="mt-4 text-lg font-semibold text-navy-800">{t}</h3><p className="mx-auto mt-1 max-w-xs text-sm text-slate-600">{d}</p>
          </Reveal>))}
      </ol>
    </section>
  );
}

function Cta() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-800 py-20 text-white">
      <div className="absolute -left-16 top-6 -z-10 h-56 w-56 animate-floaty rounded-full bg-teal-500/25 blur-2xl" aria-hidden="true" />
      <div className="absolute -right-10 bottom-0 -z-10 h-72 w-72 animate-floaty rounded-full bg-royal-500/30 blur-3xl" style={{ animationDelay: '2s' }} aria-hidden="true" />
      <Reveal className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-4xl font-bold">Come and see the school</h2>
        <p className="mt-3 text-slate-300">Send us a message and the office will reply with the admission process, fees and a time to visit the campus.</p>
        <Link to="/contact" className="btn-primary btn-shine mt-8 px-8 py-3">Contact the school <ArrowRight className="h-4 w-4" /></Link>
      </Reveal>
    </section>
  );
}

export default function Home() { return <><Hero /><Marquee /><Band /><Programmes /><Bento /><AnnualDaySpotlight /><Community /><Stats /><Why /><Steps /><Cta /></>; }
