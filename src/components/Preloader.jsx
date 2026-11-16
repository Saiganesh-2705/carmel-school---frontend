import { useEffect, useState } from 'react';
import { school, img } from '../config/school';

// Short branded splash, shown once per browser session.
export default function Preloader() {
  const seen = (() => { try { return sessionStorage.getItem('cis_splash'); } catch { return '1'; } })();
  const [phase, setPhase] = useState(seen ? 'gone' : 'show');
  useEffect(() => {
    if (phase === 'gone') return;
    try { sessionStorage.setItem('cis_splash', '1'); } catch { /* ignore */ }
    const a = setTimeout(() => setPhase('out'), 1300);
    const b = setTimeout(() => setPhase('gone'), 2000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [phase]);
  if (phase === 'gone') return null;
  return (
    <div aria-hidden="true" className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-900 text-white transition-all duration-700 ${phase === 'out' ? 'pointer-events-none -translate-y-full' : ''}`}>
      <div className="absolute h-72 w-72 animate-floaty rounded-full bg-teal-500/20 blur-3xl" />
      <img src={img('logo.png')} alt="" className="relative h-24 w-24 animate-popIn rounded-full bg-white p-2 shadow-2xl" />
      <p className="relative mt-5 animate-fadeIn text-xl font-bold tracking-wide" style={{ animationDelay: '.3s' }}>{school.name}</p>
      <p className="relative mt-1 animate-fadeIn text-sm text-teal-500" style={{ animationDelay: '.5s' }}>{school.motto}</p>
      <div className="relative mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/15"><div className="h-full origin-left animate-load rounded-full bg-teal-500" /></div>
    </div>
  );
}
