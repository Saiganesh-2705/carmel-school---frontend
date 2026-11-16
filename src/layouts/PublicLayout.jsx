import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail, Clock, ArrowUp, MessageCircle, ArrowRight, Facebook, Instagram, Youtube, LogOut, LayoutDashboard } from 'lucide-react';
import Preloader from '../components/Preloader';
import MotionFX from '../components/MotionFX';
import { school, img, programmes, gallery } from '../config/school';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME } from '../utils/roles';

const links = [['/', 'Home'], ['/about', 'About'], ['/classes', 'Classes'], ['/events', 'Events'], ['/notices', 'Notices'], ['/gallery', 'Gallery'], ['/contact', 'Contact']];

export default function PublicLayout() {
  const [open, setOpen] = useState(false); const { pathname } = useLocation(); const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false); const [progress, setProgress] = useState(0); const [showTop, setShowTop] = useState(false); const [hide, setHide] = useState(false);

  const prevPath = useRef(pathname); const [wipe, setWipe] = useState(0);
  useEffect(() => {
    setOpen(false); window.scrollTo(0, 0);
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    setWipe((n) => n + 1);
  }, [pathname]);
  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      // hide the header while reading down the page, bring it back when scrolling up
      if (y < 420 || y < last - 4) setHide(false); else if (y > last + 4) setHide(true);
      last = y;
      setScrolled(y > 24); setShowTop(y > 700); setProgress(h > 0 ? y / h : 0);
    };
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on);
  }, []);

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${school.name}, ${school.address}`)}`;
  const spot = (e) => { const el = e.target.closest?.('.spot'); if (!el) return; const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`); };
  const socials = [[Facebook, 'Facebook', school.social?.facebook], [Instagram, 'Instagram', school.social?.instagram], [Youtube, 'YouTube', school.social?.youtube]].filter(([, , h]) => h);
  const cls = ({ isActive }) => `underline-grow px-1 py-2 text-sm font-semibold ${isActive ? 'active text-royal-600' : 'text-slate-600 hover:text-navy-800'}`;
  return (
    <div className="public relative flex min-h-screen flex-col overflow-x-hidden bg-white text-ink" onPointerMove={spot}>
      <Preloader /><MotionFX />
      <div className="orb orb-a" aria-hidden="true" /><div className="orb orb-b" aria-hidden="true" />
      {wipe > 0 && (
        <div key={wipe} className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 translate-x-full animate-wipe bg-teal-500" style={{ animationDelay: '.12s' }} />
          <div className="absolute inset-0 translate-x-full animate-wipe bg-navy-800" />
        </div>)}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-teal-500" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <header className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur transition-all duration-300 ${hide && !open ? '-translate-y-full' : 'translate-y-0'} ${scrolled ? 'border-slate-200 shadow-md' : 'border-transparent'}`}>
        <div className={`mx-auto flex max-w-6xl items-center gap-4 px-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-20'}`}>
          <Link to="/" className="flex items-center gap-3">
            <img src={img('logo.png')} alt="" className={`transition-all duration-300 ${scrolled ? 'h-9 w-9' : 'h-12 w-12'}`} />
            <span className="leading-tight"><span className="block font-bold text-navy-800">{school.name}</span><span className="block text-xs text-slate-500">{school.motto}</span></span>
          </Link>
          <nav className="ml-auto hidden items-center gap-5 lg:flex" aria-label="Main">
            {links.map(([to, l]) => <NavLink key={to} to={to} end className={cls}>{l}</NavLink>)}
            {user && (<>
              <Link to={ROLE_HOME[user.role]} className="btn-primary btn-shine"><LayoutDashboard className="h-4 w-4" aria-hidden="true" />Dashboard</Link>
              <button onClick={logout} aria-label="Sign out" title="Sign out" className="btn-ghost p-2"><LogOut className="h-4 w-4" /></button>
            </>)}
          </nav>
          <button className="btn-ghost ml-auto lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
        <div className={`grid overflow-hidden transition-[grid-template-rows] duration-300 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <nav className="min-h-0 overflow-hidden" aria-label="Mobile" aria-hidden={!open}>
            <div className="border-t border-slate-200 p-3">
              {links.map(([to, l]) => <NavLink key={to} to={to} end tabIndex={open ? 0 : -1} className={({ isActive }) => `block rounded-md px-3 py-3 font-medium ${isActive ? 'bg-slate-100 text-royal-600' : ''}`}>{l}</NavLink>)}
              {user && <Link to={ROLE_HOME[user.role]} tabIndex={open ? 0 : -1} className="btn-primary mt-2 w-full"><LayoutDashboard className="h-4 w-4" aria-hidden="true" />My dashboard</Link>}
              {user && <button onClick={logout} tabIndex={open ? 0 : -1} className="btn-ghost mt-1 w-full"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1"><div key={pathname} className="page-in"><Outlet /></div></main>

      <footer className="relative mt-24 bg-navy-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative -mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-royal-600 via-royal-500 to-teal-600 p-8 text-white shadow-2xl shadow-navy-900/30 sm:p-12">
            <div className="dots absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="absolute -right-10 -top-10 h-48 w-48 animate-floaty rounded-full bg-sun-400/30 blur-2xl" aria-hidden="true" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl"><h2 className="font-display text-3xl font-bold sm:text-4xl">Give your child a joyful start</h2><p className="mt-2 text-white/85">Ask about admission, classes and a campus visit. The school office will reply with everything you need.</p></div>
              <Link to="/contact" className="btn bg-white px-6 py-3 text-navy-800 shadow-lg hover:-translate-y-0.5 hover:bg-sun-400 btn-shine">Enquire now <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3"><img src={img('logo.png')} alt="" className="h-14 w-14 rounded-full bg-white p-1" /><div><p className="font-display text-xl font-bold text-white">{school.name}</p><p className="text-sm text-teal-500">{school.motto}</p></div></div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">A {school.board} school where children learn through play, music, sport and celebration, in a caring community of sisters, teachers and families.</p>
            {socials.length > 0 && <div className="mt-5 flex gap-2">{socials.map(([Icon, label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="rounded-full bg-white/10 p-2.5 transition hover:-translate-y-1 hover:bg-teal-500 hover:text-white"><Icon className="h-4 w-4" /></a>)}</div>}
          </div>
          <div className="lg:col-span-2"><h2 className="font-sans text-sm font-bold uppercase tracking-widest text-white">Explore</h2><ul className="mt-4 space-y-2.5 text-sm">{links.map(([to, l]) => <li key={to}><Link className="foot-link" to={to}>{l}</Link></li>)}<li><Link className="foot-link" to={user ? ROLE_HOME[user.role] : '/login'}>{user ? 'My dashboard' : 'Admin'}</Link></li></ul></div>
          <div className="lg:col-span-2"><h2 className="font-sans text-sm font-bold uppercase tracking-widest text-white">Classes</h2><ul className="mt-4 space-y-2.5 text-sm">{programmes.map((c) => <li key={c.id}><Link className="foot-link" to={`/classes#${c.id}`}>{c.name}</Link></li>)}</ul></div>
          <div className="lg:col-span-4"><h2 className="font-sans text-sm font-bold uppercase tracking-widest text-white">Visit and contact</h2><ul className="mt-4 space-y-3 text-sm">
            {school.address && <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /><a className="foot-link" href={mapsLink} target="_blank" rel="noopener noreferrer" title="Open in Google Maps">{school.address}</a></li>}
            {school.phone && <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /><a className="foot-link" href={`tel:${school.phone}`}>{school.phone}</a></li>}
            {school.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /><a className="foot-link" href={`mailto:${school.email}`}>{school.email}</a></li>}
            {school.hours && <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />{school.hours}</li>}</ul>
            <div className="mt-5 grid grid-cols-6 gap-1.5" aria-label="Recent photos">{gallery.filter((g) => g.cat === 'Annual Day').slice(0, 6).map((g) => <Link key={g.src} to="/gallery" tabIndex={-1} aria-hidden="true" className="aspect-square overflow-hidden rounded-md"><img src={img(g.src)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-125" /></Link>)}</div>
          </div>
        </div>

        <div className="pointer-events-none select-none overflow-hidden text-center" aria-hidden="true"><p className="watermark -mb-4 text-[22vw] font-bold sm:text-[16vw]">CARMEL</p></div>
        <div className="relative border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs">
            <p>© {new Date().getFullYear()} Skiez Technologies India Private Limited. All rights reserved.</p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-teal-500">Back to top <ArrowUp className="h-3.5 w-3.5 transition group-hover:-translate-y-1" /></button>
          </div>
        </div>
      </footer>

      {pathname !== '/contact' && (
        <Link to="/contact" aria-label="Enquire about admission" className={`group fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full bg-teal-500 p-3.5 text-white shadow-xl shadow-teal-600/30 transition-all duration-300 hover:bg-teal-600 md:flex ${showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
          <MessageCircle className="h-5 w-5" /><span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[8rem] group-hover:pr-1.5">Enquire now</span>
        </Link>)}

      <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`fixed bottom-5 right-4 z-40 rounded-full bg-royal-500 p-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-royal-600 md:right-5 ${showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}><ArrowUp className="h-5 w-5" /></button>
    </div>
  );
}
