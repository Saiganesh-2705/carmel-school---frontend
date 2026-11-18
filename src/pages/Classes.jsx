import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shapes, BookOpenText, Pencil, Calculator, GraduationCap, Microscope, Trophy } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Tilt from '../components/Tilt';
import LazyImg from '../components/LazyImg';
import { programmes, img, school } from '../config/school';
import { StatsStrip, QuoteBand, Journey, Faq, CtaBand, Highlights, PhotoStrip, AgeFinder } from '../components/Sections';
import { Heart, Music, ShieldCheck, Users, BookOpen, Star, Backpack, Lightbulb, Rocket } from 'lucide-react';
import { events as evs } from '../config/school';

const icons = [Shapes, BookOpenText, Pencil, Calculator, Microscope, Trophy];
const tones = ['from-sun-500 to-orange-400', 'from-teal-500 to-emerald-400', 'from-royal-500 to-sky-400', 'from-fuchsia-500 to-rose-400', 'from-violet-500 to-indigo-400', 'from-navy-700 to-royal-500'];

export default function Classes() {
  return (
    <>
      <PageHero eyebrow="Our classes" title="From JKG to Grade V" text={`A clear path for young learners at ${school.name}: a joyful start in Pre-Primary, then growing confidence through the early primary grades.`} image="students-pink-uniform.jpg" chips={[[GraduationCap, 'CBSE'], [Users, 'JKG to Grade V'], [Heart, 'Caring teachers']]} />
      <StatsStrip items={[{ text: 'CBSE', label: 'Board', icon: GraduationCap }, { n: programmes.length, label: 'Class levels', icon: Users }, { text: 'JKG–V', label: 'Age range', icon: BookOpen }, { n: evs.length, suffix: '+', label: 'Celebrations a year', icon: Star }]} />

      <section className="mx-auto max-w-6xl px-4 py-16" aria-label="Learning path">
        <Reveal className="text-center"><span className="eyebrow">Learning path</span><h2 className="mt-2 text-3xl text-navy-800 sm:text-4xl">Step by step, year by year</h2></Reveal>
        <ol className="relative mt-12 grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-6">
          <div className="absolute left-[8.3%] right-[8.3%] top-8 hidden h-0.5 bg-slate-200 md:block" aria-hidden="true"><Reveal className="ladder-line h-full bg-gradient-to-r from-teal-500 via-royal-500 to-sun-500" /></div>
          {programmes.map((c, n) => (
            <Reveal as="li" key={c.id} delay={n * 120} className="relative text-center">
              <a href={`#${c.id}`} className="group block">
                <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${tones[n]} text-white shadow-lg ring-4 ring-white transition duration-300 group-hover:scale-110`}><GraduationCap className="h-7 w-7" /></span>
                <span className="mt-3 block font-semibold text-navy-800">{c.short}</span>
                <span className="block text-xs text-slate-500">{c.level}</span>
              </a>
            </Reveal>))}
        </ol>
      </section>

      <div className="bg-canvas py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4">
          {programmes.map((c, n) => {
            const Icon = icons[n % icons.length]; const flip = n % 2 === 1;
            return (
              <Reveal key={c.id} dir={flip ? 'right' : 'left'}>
                <article id={c.id} className="spot grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 md:grid-cols-5" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`); }}>
                  <div className={`relative flex min-h-[14rem] flex-col justify-between overflow-hidden bg-gradient-to-br ${tones[n]} p-8 text-white md:col-span-2 ${flip ? 'md:order-2' : ''}`}>
                    {c.photo && <LazyImg src={img(c.photo)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-multiply" />}
                    <Icon className="absolute -bottom-6 -right-6 h-40 w-40 animate-floaty text-white/15" aria-hidden="true" />
                    <span className="relative text-xs font-bold uppercase tracking-[.2em] text-white/85">{c.level}</span>
                    <div className="relative"><h2 className="text-4xl font-bold sm:text-5xl">{c.name}</h2><p className="mt-1 text-white/90">{c.tag}</p></div>
                  </div>
                  <div className="p-8 md:col-span-3">
                    <p className="text-lg leading-relaxed text-slate-600">{c.text}</p>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-1">
                      {c.points.map((t) => <li key={t} className="flex items-start gap-3 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />{t}</li>)}
                    </ul>
                    <Link to="/contact" className="btn-primary btn-shine mt-7 px-5 py-2.5">Enquire about {c.name} <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </article>
              </Reveal>);
          })}
        </div>
      </div>
      <AgeFinder />
      <Highlights eyebrow="Beyond the textbook" title="What every class enjoys" text="Learning here is active: children make, sing, play and present." items={[
        { icon: Pencil, t: 'Learning by making', d: 'Paper, cups and newspaper become flowers, toys and models.' },
        { icon: Music, t: 'Music and dance', d: 'Songs, rhymes and stage practice in every grade.' },
        { icon: Trophy, t: 'Sport and games', d: 'Open-air games and races with teachers always close by.' },
        { icon: Microscope, t: 'Science and curiosity', d: 'Simple models and exhibitions that bring lessons to life.' },
        { icon: ShieldCheck, t: 'Safe, small groups', d: 'Teachers give each child attention and encouragement.' },
        { icon: Heart, t: 'Good manners', d: 'Respect and kindness are practised every day.' }]} />
      <PhotoStrip eyebrow="In the classroom" title="Our young learners" photos={['students-pink-uniform.jpg', 'summer-class-crafts.jpg', 'study-outdoors.jpg', 'table-manners.jpg', 'music-class.jpg', 'science-exhibition.jpg']} />
      <Journey eyebrow="The learning journey" title="How a child grows with us" text="Each stage builds on the last, so children move forward with confidence." steps={[
        { icon: Backpack, t: 'JKG & SKG', d: 'Play, rhymes, colours and the first letters and numbers.' },
        { icon: BookOpen, t: 'Grades I and II', d: 'Reading, writing and early mathematics through activities.' },
        { icon: Lightbulb, t: 'Grades III and IV', d: 'Longer reading, problem solving and projects.' },
        { icon: Rocket, t: 'Grade V', d: 'Senior-most children lead assemblies, events and projects.' }]} />
      <Faq items={[
        { q: 'Which board does the school follow?', a: 'Carmel International School is a CBSE school.' },
        { q: 'Which classes are available?', a: 'JKG and SKG in Pre-Primary, and Grades I to V in Primary.' },
        { q: 'How do I ask about admission?', a: 'Send an enquiry from the Contact page. The school office replies with the process and fixes a time that suits you.' },
        { q: 'Can I visit the campus?', a: 'Yes. Mention it in your enquiry and the office will arrange a visit.' }]} />
      <CtaBand title="Ready to join the Carmel family?" text="Tell us your child’s age and the class you are interested in." />
    </>
  );
}
