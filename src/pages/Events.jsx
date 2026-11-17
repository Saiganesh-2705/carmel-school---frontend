import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Expand } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import LazyImg from '../components/LazyImg';
import Tilt from '../components/Tilt';
import Lightbox from '../components/Lightbox';
import AlbumGrid from '../components/AlbumGrid';
import { events, img, annualDay } from '../config/school';

export default function Events() {
  const [idx, setIdx] = useState(null);
  return (
    <>
      <PageHero eyebrow="Through the school year" title="Celebrations and events" text="Colour days, festivals, sports and Annual Day: a look at what the year holds for our children." image="pongal-celebration.jpg" />
      <AlbumGrid heading="Latest celebrations" text="Photo albums from our recent days and events. Tap an album to see every photo." limit={6} link />
      <div className="relative mx-auto max-w-5xl px-4 py-16">
        <div className="absolute inset-y-16 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-teal-500/0 via-teal-500/50 to-teal-500/0 md:block" aria-hidden="true" />
        <ol className="space-y-12">
          {events.map((e, n) => {
            const left = n % 2 === 0;
            return (
              <li key={e.title} className="relative md:grid md:grid-cols-2 md:gap-14">
                <span className="absolute left-1/2 top-8 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-teal-500 ring-4 ring-white md:block" aria-hidden="true" />
                <Reveal dir={left ? 'left' : 'right'} className={`overflow-hidden rounded-2xl ring-1 ring-slate-200 ${left ? '' : 'md:order-2'}`}>
                  <LazyImg src={img(e.img)} alt={e.title} className="h-64 w-full object-cover transition duration-700 hover:scale-105" />
                </Reveal>
                <Reveal dir={left ? 'right' : 'left'} delay={120} className={`mt-4 flex flex-col justify-center md:mt-0 ${left ? '' : 'md:order-1 md:text-right'}`}>
                  <h2 className="text-2xl font-bold text-navy-800">{e.title}</h2>
                  <p className="mt-2 text-slate-600">{e.text}</p>
                </Reveal>
              </li>);
          })}
        </ol>
      </div>

      <section className="bg-navy-900 py-16 text-white" aria-labelledby="ad-h">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal><span className="eyebrow !text-sun-400">Annual Day highlights</span><h2 id="ad-h" className="mt-2 text-3xl font-bold sm:text-4xl">Dance, awards and graduation</h2><p className="mt-2 max-w-2xl text-slate-300">Tap any photo to open it full size and flip through the whole evening.</p></Reveal>
          <div className="mt-8 grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] md:grid-cols-4">
            {annualDay.map((a, n) => {
              const big = n === 0 || n === 3 ? 'col-span-2 row-span-2' : n === 6 ? 'md:col-span-2' : '';
              return (
                <Reveal key={a.src} dir="zoom" delay={(n % 4) * 70} className={big}>
                  <Tilt as="button" onClick={() => setIdx(n)} aria-label={`Open photo: ${a.title}`} className="group relative block h-full w-full overflow-hidden rounded-2xl text-left">
                    <LazyImg src={img(a.src)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-transparent to-transparent" />
                    <Expand className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/15 p-2 opacity-0 backdrop-blur transition group-hover:opacity-100" aria-hidden="true" />
                    <span className="absolute bottom-3 left-4 font-semibold">{a.title}</span>
                  </Tilt>
                </Reveal>);
            })}
          </div>
          <Reveal className="mt-12 text-center"><Link to="/gallery" className="btn-primary btn-shine px-6 py-3">See every photo in the gallery</Link></Reveal>
        </div>
      </section>
      {idx !== null && <Lightbox items={annualDay} index={idx} onChange={setIdx} onClose={() => setIdx(null)} />}
    </>
  );
}
