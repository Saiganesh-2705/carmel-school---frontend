import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send, MessageSquare, PhoneCall, School } from 'lucide-react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import api, { errMsg } from '../services/api';
import { school } from '../config/school';

const topics = [['admission', 'Admission'], ['general', 'General question'], ['other', 'Something else']];
const next = [[MessageSquare, 'You send a message', 'Tell us your child’s age and what you would like to know.'], [PhoneCall, 'The office replies', 'We share the admission process and fees.'], [School, 'You visit the campus', 'Meet the teachers and see the classrooms.']];

function Confetti() {
  const cols = ['#14a39a', '#2f5fd0', '#f5b020', '#ff6b9d', '#7c5cff'];
  return <div className="pointer-events-none absolute inset-x-0 top-0 h-0" aria-hidden="true">{Array.from({ length: 28 }, (_, i) => <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, background: cols[i % 5], animationDelay: `${(i % 7) * 0.08}s`, '--dx': `${((i * 53) % 120) - 60}px` }} />)}</div>;
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues: { subject: 'admission' } });
  const subject = watch('subject'); const msg = watch('message') || '';
  const onSubmit = async (v) => {
    if (!v.email && !v.phone) return toast.error('Give an email or a phone number so we can reply');
    try { await api.post('/contact', v); setSent(true); } catch (e) { toast.error(errMsg(e)); }
  };
  const info = [[MapPin, 'Visit us', school.address, school.address && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${school.name}, ${school.address}`)}`], [Phone, 'Call us', school.phone, school.phone && `tel:${school.phone}`], [Mail, 'Email us', school.email, school.email && `mailto:${school.email}`], [Clock, 'Office hours', school.hours]].filter(([, , t]) => t);
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact us" text="Questions about admission, classes or a campus visit? Send us a message and the school office will reply." image="blue-day.jpg" />
      <div className="mx-auto -mt-16 grid max-w-6xl gap-8 px-4 pb-20 md:grid-cols-5">
        <Reveal dir="up" className="relative z-10 md:col-span-3">
          <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-navy-900/10 ring-1 ring-slate-200 sm:p-9">
            {sent ? (
              <div className="relative py-10 text-center"><Confetti />
                <span className="mx-auto flex h-16 w-16 animate-popIn items-center justify-center rounded-full bg-teal-500/15 text-teal-600"><CheckCircle2 className="h-9 w-9" /></span>
                <h2 className="mt-4 text-2xl text-navy-800">Message sent</h2><p className="mx-auto mt-2 max-w-sm text-slate-600">Thank you. The school office will reply soon.</p>
                <button className="btn-ghost mt-6 ring-1 ring-slate-200" onClick={() => setSent(false)}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div><h2 className="text-2xl text-navy-800">Send us a message</h2><p className="mt-1 text-sm text-slate-500">We usually reply within a working day.</p></div>
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register('website')} />
                <input type="hidden" {...register('subject')} />
                <div role="group" aria-label="Topic" className="flex flex-wrap gap-2">{topics.map(([v, l]) => <button type="button" key={v} aria-pressed={subject === v} onClick={() => setValue('subject', v)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${subject === v ? 'scale-105 bg-royal-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{l}</button>)}</div>
                <div><label className="label" htmlFor="name">Your name</label><input id="name" className="input" {...register('name', { required: 'Enter your name', minLength: { value: 2, message: 'Too short' } })} />{errors.name && <p className="err">{errors.name.message}</p>}</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />{errors.email && <p className="err">{errors.email.message}</p>}</div>
                  <div><label className="label" htmlFor="phone">Phone</label><input id="phone" type="tel" className="input" {...register('phone', { pattern: { value: /^[0-9+\-\s()]{7,20}$/, message: 'Enter a valid phone number' } })} />{errors.phone && <p className="err">{errors.phone.message}</p>}</div>
                </div>
                <div><label className="label" htmlFor="message">Message</label><textarea id="message" rows={5} className="input" {...register('message', { required: 'Write a short message', minLength: { value: 5, message: 'Too short' }, maxLength: { value: 2000, message: 'Keep it under 2000 characters' } })} /><div className="mt-1 flex justify-between text-xs"><span className="err !mt-0">{errors.message?.message}</span><span className="text-slate-400">{msg.length} / 2000</span></div></div>
                <button className="btn-primary btn-shine w-full py-3 sm:w-auto sm:px-8" disabled={isSubmitting}><Send className="h-4 w-4" />{isSubmitting ? 'Sending…' : 'Send message'}</button>
                <p className="text-xs text-slate-500">Please give an email or phone number so we can reply.</p>
              </form>)}
          </div>
        </Reveal>
        <Reveal dir="right" className="space-y-5 md:col-span-2 md:pt-20">
          {info.map(([Icon, t, v, href], n) => (
            <div key={t} className="spot lift flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-semibold text-navy-800">{t}</h3>{href ? <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-slate-600 hover:text-royal-600">{v}</a> : <p className="text-slate-600">{v}</p>}</div></div>))}
          {school.mapEmbedUrl && <iframe title="School location" src={school.mapEmbedUrl} loading="lazy" className="h-64 w-full rounded-2xl border-0 shadow-sm" />}
          <div className="rounded-2xl bg-navy-800 p-6 text-white"><h3 className="font-display text-xl font-bold">What happens next</h3>
            <ol className="mt-4 space-y-4">{next.map(([Icon, t, d], n) => <li key={t} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sun-400"><Icon className="h-4 w-4" /></span><div><p className="text-sm font-semibold">{n + 1}. {t}</p><p className="text-sm text-slate-300">{d}</p></div></li>)}</ol></div>
        </Reveal>
      </div>
    </>
  );
}
