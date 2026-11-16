import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Bell, Inbox, Megaphone, UserPlus, Globe, Users, UserCheck, ArrowUpRight, Sparkles, Star, CalendarDays } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Counter from '../components/Counter';
import Reveal from '../components/Reveal';
import NoticeCard, { fmtDate } from '../components/NoticeCard';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const BASE = '/admin';

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="text-right">
      <p className="font-display text-4xl font-bold tabular-nums sm:text-5xl">{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}<span className="ml-1 text-lg text-white/60">{now.toLocaleTimeString('en-IN', { second: '2-digit' }).slice(-2)}</span></p>
      <p className="mt-1 flex items-center justify-end gap-2 text-sm text-white/80"><CalendarDays className="h-4 w-4" aria-hidden="true" />{now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value, to, grad, n }) {
  return (
    <Reveal dir="zoom" delay={n * 90}>
      <Link to={to} className="dash-card group block h-full">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg transition duration-500 group-hover:rotate-12 group-hover:scale-110`}><Icon className="h-6 w-6" /></span>
        <p className="mt-4 text-4xl font-extrabold tabular-nums">{typeof value === 'number' ? <Counter to={value} /> : <span className="skeleton inline-block h-9 w-16 rounded-lg align-middle" />}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-slate-300 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-teal-500" aria-hidden="true" />
        <span className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${grad} transition-transform duration-500 group-hover:scale-x-100`} />
      </Link>
    </Reveal>
  );
}

const actions = [
  { to: `${BASE}/notices?new=1`, icon: Megaphone, t: 'Post an update', d: 'Notice for the website or portal', grad: 'from-royal-500 to-sky-400' },
  { to: `${BASE}/messages`, icon: Inbox, t: 'Read enquiries', d: 'Admission and contact messages', grad: 'from-amber-500 to-orange-400' },
  { to: `${BASE}/users`, icon: UserPlus, t: 'Admin accounts', d: 'Add or manage who can sign in', grad: 'from-teal-500 to-emerald-400' },
  { to: '/', icon: Globe, t: 'View website', d: 'See what visitors see', grad: 'from-fuchsia-500 to-rose-400', ext: true },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null); const [notices, setNotices] = useState([]);
  useEffect(() => {
    api.get('/notices').then((r) => setNotices(r.data.data.slice(0, 4))).catch(() => {});
    api.get('/stats/overview').then((r) => setStats(r.data.data)).catch(() => {});
  }, []);
  const newMsgs = stats?.messages.new ?? 0; const handled = Math.max((stats?.messages.total ?? 0) - newMsgs, 0);
  const donut = [{ name: 'New', value: newMsgs, c: '#f5b020' }, { name: 'Handled', value: handled, c: '#14a39a' }];
  const hasMsgs = (stats?.messages.total ?? 0) > 0;

  return (
    <div className="space-y-8">
      <section className="aurora-card relative isolate overflow-hidden rounded-3xl p-6 text-white shadow-2xl shadow-royal-600/20 sm:p-9">
        <div className="aurora" aria-hidden="true" />
        {[['8%', '20%', 0], ['46%', '12%', 1], ['70%', '70%', 2]].map(([l, t, d], i) => <Star key={i} className="absolute -z-10 h-4 w-4 animate-twinkle fill-sun-400 text-sun-400" style={{ left: l, top: t, animationDelay: `${d}s` }} aria-hidden="true" />)}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="animate-wordIn">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />Admin workspace</p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{greeting()}, {user.name.split(' ')[0]}</h1>
            <p className="mt-2 max-w-lg text-white/85">You have full control of the school website and portal. {newMsgs > 0 ? <>There {newMsgs === 1 ? 'is' : 'are'} <b>{newMsgs} new enquir{newMsgs === 1 ? 'y' : 'ies'}</b> waiting.</> : 'No new enquiries right now.'}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`${BASE}/notices?new=1`} className="btn bg-white px-5 py-2.5 text-navy-800 shadow-lg btn-shine hover:-translate-y-0.5 hover:bg-sun-400"><Megaphone className="h-4 w-4" aria-hidden="true" />Post an update</Link>
              <Link to={`${BASE}/messages`} className="btn bg-white/15 px-5 py-2.5 text-white backdrop-blur hover:bg-white/25">Open enquiries</Link>
            </div>
          </div>
          <div className="animate-wordIn" style={{ animationDelay: '.15s' }}><Clock /></div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat n={0} icon={Users} label="Admin accounts" value={stats?.users.total} to={`${BASE}/users`} grad="from-royal-500 to-sky-400" />
        <Stat n={1} icon={UserCheck} label="Active accounts" value={stats?.users.active} to={`${BASE}/users`} grad="from-teal-500 to-emerald-400" />
        <Stat n={2} icon={Inbox} label="New enquiries" value={stats?.messages.new} to={`${BASE}/messages`} grad="from-amber-500 to-orange-400" />
        <Stat n={3} icon={Bell} label="Published notices" value={stats?.notices} to={`${BASE}/notices`} grad="from-fuchsia-500 to-rose-400" />
      </div>

      <section aria-label="Quick actions">
        <Reveal><h2 className="mb-3 text-lg font-semibold">Quick actions</h2></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map(({ to, icon: Icon, t, d, grad, ext }, n) => (
            <Reveal key={t} delay={n * 80}>
              <Link to={to} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="dash-card group flex items-center gap-4">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-white shadow-lg transition duration-500 group-hover:scale-110 group-hover:-rotate-6`}><Icon className="h-7 w-7" /></span>
                <span><span className="block font-semibold">{t}</span><span className="block text-sm text-slate-500 dark:text-slate-400">{d}</span></span>
              </Link>
            </Reveal>))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal dir="left" className="dash-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Latest enquiries</h2><Link className="text-sm font-medium text-royal-500 hover:underline" to={`${BASE}/messages`}>View all</Link></div>
          {stats?.recentMessages?.length ? (
            <ul className="space-y-2">{stats.recentMessages.map((m, n) => (
              <li key={m._id} className="animate-wordIn" style={{ animationDelay: `${n * 80}ms` }}>
                <Link to={`${BASE}/messages`} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-white/5">
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-royal-500 font-bold text-white">{m.name[0]}{m.status === 'new' && <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-sun-500" /></span>}</span>
                  <span className="min-w-0 flex-1"><span className="block font-medium">{m.name}</span><span className="block truncate text-sm text-slate-500">{m.message}</span></span>
                  <span className="shrink-0 text-xs text-slate-500">{fmtDate(m.createdAt)}</span>
                </Link>
              </li>))}</ul>
          ) : <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-white/5">No enquiries yet. They will appear here when parents use the Contact page.</p>}
        </Reveal>

        <Reveal dir="right" className="dash-card">
          <h2 className="text-lg font-semibold">Enquiry status</h2>
          <div className="relative mx-auto mt-2 h-48 w-48">
            {hasMsgs ? (<>
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={donut} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={4} cornerRadius={8} stroke="none" animationDuration={1200}>{donut.map((d) => <Cell key={d.name} fill={d.c} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-extrabold">{stats.messages.total}</span><span className="text-xs text-slate-500">total</span></div>
            </>) : <div className="flex h-full items-center justify-center rounded-full border-4 border-dashed border-slate-200 text-center text-xs text-slate-500 dark:border-white/10">No enquiries<br />yet</div>}
          </div>
          <div className="mt-2 flex justify-center gap-5 text-sm">{donut.map((d) => <span key={d.name} className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.c }} />{d.name} <b>{d.value}</b></span>)}</div>
          <h3 className="mb-2 mt-6 text-sm font-semibold text-slate-500">Recent sign-ins</h3>
          {stats?.recentLogins?.length ? <ul className="space-y-2 text-sm">{stats.recentLogins.map((u) => <li key={u._id} className="flex justify-between gap-2"><span className="truncate">{u.name}</span><span className="shrink-0 text-xs text-slate-500">{fmtDate(u.lastLoginAt)}</span></li>)}</ul> : <p className="text-sm text-slate-500">No sign-ins recorded yet.</p>}
        </Reveal>
      </div>

      <section>
        <Reveal className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Notice board</h2><Link className="text-sm font-medium text-royal-500 hover:underline" to={`${BASE}/notices`}>Manage notices</Link></Reveal>
        {notices.length ? <div className="grid gap-3 lg:grid-cols-2">{notices.map((n, i) => <Reveal key={n._id} delay={i * 80}><NoticeCard n={n} /></Reveal>)}</div> : <p className="dash-card text-sm text-slate-500">No notices yet. Use “Post an update” to publish the first one.</p>}
      </section>
    </div>
  );
}
