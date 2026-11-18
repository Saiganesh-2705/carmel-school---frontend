import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Sprout, Handshake, ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import LazyImg from '../components/LazyImg';
import Tilt from '../components/Tilt';
import { school, img } from '../config/school';
import { StatsStrip, QuoteBand, Journey, Faq, CtaBand, Highlights, PhotoStrip, ExpandPanels } from '../components/Sections';
import { ShieldCheck, Languages, Palette, Sunrise, Pencil, Music, Trophy, Users, GraduationCap, Star, Calendar } from 'lucide-react';
import { programmes as progs, events as evs, gallery as gal } from '../config/school';

const values = [
  { icon: Heart, t: 'Kindness', d: 'Children learn to care for friends, teachers and the people around them.' },
  { icon: BookOpen, t: 'Curiosity', d: 'Questions are welcome in every class, in the courtyard and on the stage.' },
  { icon: Sprout, t: 'Growth', d: 'From saplings on Green Day to graduation caps, we celebrate each step.' },
  { icon: Handshake, t: 'Respect', d: 'Good manners and discipline are practised every day, not just taught.' },
];
// Replace this copy with the school's own mission, history and leadership details.
export default function About() {
  return (
    <>
      <PageHero eyebrow={school.motto} title={`About ${school.name}`} text="A CBSE school where every child is known, cared for and encouraged to lead." image="campus-gate.jpg" chips={[[GraduationCap, 'CBSE school'], [Heart, 'Learn to Lead'], [Users, 'JKG to Grade V']]} />
      <StatsStrip items={[{ text: school.board, label: 'Board', icon: GraduationCap }, { n: progs.length, label: 'Class levels', icon: Users }, { n: evs.length, suffix: '+', label: 'Celebrations a year', icon: Calendar }, { n: gal.length, suffix: '+', label: 'Photos shared', icon: Star }]} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-slate-700">
          <Reveal><p>{school.name} is a {school.board} school. Our motto, “{school.motto}”, is on our crest and in our classrooms: we want every child to grow into someone who can think, speak up and help others.</p></Reveal>
          <Reveal delay={80}><p>Children here learn letters and numbers, but also music, dance and sport. Colour days, Pongal, Independence Day and Christmas bring the whole school together, Annual Day gives them a stage, and graduation gives the youngest learners a day to remember.</p></Reveal>
          <Reveal delay={160}><p>Teachers, sisters and staff work with parents so that each child feels known and safe at school.</p></Reveal>
          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <Reveal dir="zoom" className="lift rounded-2xl bg-canvas p-5"><h2 className="font-semibold text-navy-800">Our mission</h2><p className="mt-1 text-base">To give every child a joyful start to learning and the confidence to lead.</p></Reveal>
            <Reveal dir="zoom" delay={100} className="lift rounded-2xl bg-canvas p-5"><h2 className="font-semibold text-navy-800">What we value</h2><p className="mt-1 text-base">Kindness, discipline, curiosity and respect for others.</p></Reveal>
          </div>
        </div>
        <div className="space-y-4">
          <Reveal dir="right"><Tilt className="relative overflow-hidden rounded-2xl"><LazyImg src={img('music-class.jpg')} alt="A music class around a keyboard" className="w-full object-cover" /></Tilt></Reveal>
          <Reveal dir="right" delay={120}><Tilt className="relative overflow-hidden rounded-2xl"><LazyImg src={img('independence-day-song.jpg')} alt="Children singing on Independence Day with their teachers" className="w-full object-cover" /></Tilt></Reveal>
          <Reveal dir="right" delay={240}><Tilt className="relative overflow-hidden rounded-2xl"><LazyImg src={img('study-outdoors.jpg')} alt="Children writing in notebooks in the courtyard while a sister watches" className="w-full object-cover" /></Tilt></Reveal>
        </div>
      </div>

      <section className="bg-canvas py-16" aria-labelledby="values-h">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center"><span className="eyebrow">What we stand for</span><h2 id="values-h" className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">Our values</h2></Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, t, d }, n) => (
              <Reveal key={t} delay={n * 90} className="lift group rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-teal-500 group-hover:text-white"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-4 font-semibold text-navy-800">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p>
              </Reveal>))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16" aria-labelledby="family-h">
        <Reveal className="max-w-2xl"><span className="eyebrow">Our school family</span><h2 id="family-h" className="mt-2 text-3xl font-bold text-navy-800 sm:text-4xl">The sisters, teachers and staff</h2>
          <p className="mt-3 text-slate-600">A school is its people. The sisters, teachers and staff below welcome every child each morning.</p></Reveal>
        {/* When you have names and roles, add them in the figcaption of each photo. */}
        <div className="mt-10 grid gap-5 md:grid-cols-5">
          <Reveal dir="zoom" className="md:col-span-3"><figure><Tilt className="relative overflow-hidden rounded-2xl shadow-lg"><LazyImg src={img('sisters-group.jpg')} alt="Seven sisters standing together for a group photo" className="w-full object-cover" /></Tilt><figcaption className="mt-2 text-sm text-slate-500">The sisters of the school community</figcaption></figure></Reveal>
          <div className="grid gap-5 md:col-span-2">
            <Reveal dir="zoom" delay={120}><figure><Tilt className="relative overflow-hidden rounded-2xl shadow-lg"><LazyImg src={img('annual-day-staff-group.jpg')} alt="Teachers, sisters and guests posing together on Annual Day" className="w-full object-cover" /></Tilt><figcaption className="mt-2 text-sm text-slate-500">Teachers and guests on Annual Day</figcaption></figure></Reveal>
            <Reveal dir="zoom" delay={240}><figure><Tilt className="relative overflow-hidden rounded-2xl shadow-lg"><LazyImg src={img('sisters-registers.jpg')} alt="Two teachers and a sister going through registers in the school office" className="w-full object-cover" /></Tilt><figcaption className="mt-2 text-sm text-slate-500">In the school office</figcaption></figure></Reveal>
          </div>
        </div>
        <Reveal className="mt-12 text-center"><Link to="/gallery" className="btn-primary btn-shine px-6 py-3">See more in the gallery <ArrowRight className="h-4 w-4" /></Link></Reveal>
      </section>
      <Highlights eyebrow="Why families choose Carmel" title="A caring school with a strong foundation" text="Small things done well every day: that is what children and parents notice first." items={[
        { icon: ShieldCheck, t: 'A safe, caring campus', d: 'Sisters and teachers know every child by name and watch over them throughout the day.' },
        { icon: BookOpen, t: 'CBSE curriculum', d: 'A clear, well-paced path from JKG to Grade V that prepares children for higher classes.' },
        { icon: Palette, t: 'Arts and celebration', d: 'Colour days, Annual Day and cultural events give every child a stage.' },
        { icon: Trophy, t: 'Sport and teamwork', d: 'Races, relays and games build fitness, fair play and friendship.' },
        { icon: Languages, t: 'Confident speakers', d: 'Songs, recitations and assemblies help children speak with confidence.' },
        { icon: Heart, t: 'Faith and values', d: 'Prayer, kindness and respect are practised together every morning.' }]} />
      <ExpandPanels eyebrow="Our approach" title="Learn. Play. Celebrate. Lead." text="Four ideas that shape every school day. Hover or tap a photo to open it." items={[
        { img: 'study-outdoors.jpg', title: 'Learn', text: 'Reading, writing and numbers taught with patience, activities and plenty of encouragement.' },
        { img: 'sports-race.jpg', title: 'Play', text: 'Open-air games and races teach teamwork, fitness and fair play.' },
        { img: 'blue-day.jpg', title: 'Celebrate', text: 'Colour days, festivals and Annual Day give every child a reason to shine.' },
        { img: 'independence-day-song.jpg', title: 'Lead', text: 'Children speak, sing and take charge on stage, building confidence for life.' }]} />
      <PhotoStrip title="Life at Carmel" text="A few moments from classrooms, the stage and the field." photos={['music-class.jpg', 'sports-race.jpg', 'green-day.jpg', 'science-exhibition.jpg', 'bharatanatyam.jpg', 'morning-prayer.jpg']} />
      <Journey eyebrow="A day at Carmel" title="From morning prayer to home time" text="Every day follows a gentle rhythm that keeps children happy and learning." steps={[
        { icon: Sunrise, t: 'Morning prayer', d: 'The day begins with prayer and a thought for the day, together.' },
        { icon: Pencil, t: 'Classroom learning', d: 'Reading, writing, numbers and activities in small, caring groups.' },
        { icon: Music, t: 'Music, art and dance', d: 'Songs, crafts and stage practice that build confidence.' },
        { icon: Trophy, t: 'Sport and play', d: 'Games and races in the open air, with teachers always watching.' }]} />
      <QuoteBand image="annual-day-hoop-dance.jpg" quote={`“${school.motto}”`} by={school.name} />
      <CtaBand title="Want to know more about Carmel?" text="Visit the campus, meet the teachers and see the classrooms for yourself." label="Contact the office" />
    </>
  );
}
