import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, Inbox, UserCircle, UserCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NoticeCard, { fmtDate } from '../components/NoticeCard';
import { ROLE_HOME, ROLE_LABELS } from '../utils/roles';

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

function Stat({ icon: Icon, label, value, to, tone = 'text-royal-500' }) {
  const body = (<div className="card flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className={`rounded-lg bg-slate-100 p-3 dark:bg-white/10 ${tone}`}><Icon className="h-6 w-6" /></span><div><p className="text-2xl font-bold">{value ?? '–'}</p><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p></div></div>);
  return to ? <Link to={to}>{body}</Link> : body;
}

export default function RoleDashboard() {
  const { user } = useAuth(); const admin = ['admin', 'super_admin'].includes(user.role); const base = ROLE_HOME[user.role];
  const [stats, setStats] = useState(null); const [notices, setNotices] = useState([]);
  useEffect(() => {
    api.get('/notices').then((r) => setNotices(r.data.data.slice(0, 4))).catch(() => {});
    if (admin) api.get('/stats/overview').then((r) => setStats(r.data.data)).catch(() => {});
  }, [admin]);
  const chart = stats ? Object.entries(stats.users.byRole).map(([r, count]) => ({ role: ROLE_LABELS[r] || r, count })) : [];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">{greeting()}, {user.name.split(' ')[0]}</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{ROLE_LABELS[user.role]} workspace</p></div>

      {admin ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat icon={Users} label="Total users" value={stats?.users.total} to={`${base}/users`} />
            <Stat icon={UserCheck} label="Active accounts" value={stats?.users.active} to={`${base}/users`} tone="text-teal-500" />
            <Stat icon={Inbox} label="New enquiries" value={stats?.messages.new} to={`${base}/messages`} tone="text-amber-500" />
            <Stat icon={Bell} label="Published notices" value={stats?.notices} to={`${base}/notices`} tone="text-violet-500" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="card lg:col-span-2"><h2 className="mb-3 font-semibold">Users by role</h2>
              {chart.length ? <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="role" tick={{ fontSize: 11 }} interval={0} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" name="Users" fill="#2f5fd0" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div> : <p className="text-sm text-slate-500">No data yet.</p>}
            </section>
            <section className="card"><h2 className="mb-3 font-semibold">Recent sign-ins</h2>
              {stats?.recentLogins?.length ? <ul className="space-y-2 text-sm">{stats.recentLogins.map((u) => <li key={u._id} className="flex justify-between gap-2"><span className="truncate">{u.name}</span><span className="shrink-0 text-xs text-slate-500">{fmtDate(u.lastLoginAt)}</span></li>)}</ul> : <p className="text-sm text-slate-500">No sign-ins recorded yet.</p>}
            </section>
          </div>
          <section className="card"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Latest enquiries</h2><Link className="text-sm text-royal-500 hover:underline" to={`${base}/messages`}>View all</Link></div>
            {stats?.recentMessages?.length ? <ul className="divide-y divide-slate-100 text-sm dark:divide-white/5">{stats.recentMessages.map((m) => <li key={m._id} className="flex items-center gap-3 py-2"><span className="font-medium">{m.name}</span><span className="min-w-0 flex-1 truncate text-slate-500">{m.message}</span><span className="shrink-0 text-xs text-slate-500">{fmtDate(m.createdAt)}</span></li>)}</ul> : <p className="text-sm text-slate-500">No enquiries yet.</p>}
          </section>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Stat icon={UserCircle} label="Your profile and password" value="Manage" to={`${base}/profile`} />
          <Stat icon={Bell} label="School notices" value={notices.length} to={`${base}/notices`} tone="text-violet-500" />
        </div>
      )}

      <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Notice board</h2><Link className="text-sm text-royal-500 hover:underline" to={`${base}/notices`}>All notices</Link></div>
        {notices.length ? <div className="grid gap-3 lg:grid-cols-2">{notices.map((n) => <NoticeCard key={n._id} n={{ ...n, audience: undefined }} />)}</div> : <p className="card text-sm text-slate-500">No notices right now.</p>}
      </section>
    </div>
  );
}
