import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCog, UserCircle, Bell, Inbox, Globe, Menu, Moon, Sun, LogOut, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { ROLE_HOME, ROLE_LABELS, API_ORIGIN } from '../utils/roles';

const NAV = [
  { to: '', label: 'Dashboard', icon: LayoutDashboard }, { to: 'notices', label: 'Updates & notices', icon: Bell },
  { to: 'messages', label: 'Enquiries', icon: Inbox, badge: true }, { to: 'users', label: 'Admin accounts', icon: UserCog }, { to: 'profile', label: 'My profile', icon: UserCircle },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth(); const { dark, toggle } = useTheme(); const nav = useNavigate(); const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false); const [open, setOpen] = useState(false); const [fresh, setFresh] = useState(0);
  const base = ROLE_HOME[user.role];
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); api.get('/stats/overview').then((r) => setFresh(r.data.data.messages.new)).catch(() => {}); }, [pathname]);
  const spot = (e) => { const el = e.target.closest?.('.dash-card'); if (!el) return; const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`); };
  const link = ({ isActive }) => `nav-item group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${isActive ? 'nav-active text-white' : 'text-slate-300 hover:translate-x-1 hover:bg-white/10 hover:text-white'}`;

  const sidebar = (
    <nav className="relative flex h-full flex-col overflow-hidden bg-navy-900 p-3 text-white">
      <div className="side-glow" aria-hidden="true" />
      <div className="relative mb-6 flex items-center gap-3 px-2 py-3"><img src="/images/logo.png" alt="" className="h-10 w-10 shrink-0 animate-floaty rounded-full bg-white p-0.5 shadow-lg" />{!collapsed && <span className="leading-tight"><span className="block font-display text-lg font-bold">Carmel</span><span className="block text-xs text-teal-500">Admin portal</span></span>}</div>
      <ul className="relative space-y-1">
        {NAV.map(({ to, label, icon: Icon, badge }, n) => (
          <li key={label} className="animate-slideNext" style={{ animationDelay: `${n * 70}ms` }}>
            <NavLink end={to === ''} to={`${base}/${to}`.replace(/\/$/, '')} className={link} title={collapsed ? label : undefined}>
              <Icon className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-125" />{!collapsed && <span className="flex-1">{label}</span>}
              {badge && fresh > 0 && <span className="rounded-full bg-sun-500 px-2 py-0.5 text-xs font-bold text-navy-900">{fresh}</span>}
            </NavLink>
          </li>))}
      </ul>
      <Link to="/" className="relative mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"><Globe className="h-5 w-5 shrink-0" />{!collapsed && 'Back to website'}</Link>
    </nav>
  );

  return (
    <div className="dash-bg flex min-h-screen" onPointerMove={spot}>
      <div className={`hidden lg:block ${collapsed ? 'w-[4.5rem]' : 'w-64'} shrink-0 transition-[width] duration-300`}><div className={`fixed inset-y-0 ${collapsed ? 'w-[4.5rem]' : 'w-64'} transition-[width] duration-300`}>{sidebar}</div></div>
      {open && (<div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 animate-fadeIn bg-black/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-64 animate-slideNext">{sidebar}<button aria-label="Close menu" className="absolute right-2 top-3 text-white" onClick={() => setOpen(false)}><X /></button></div></div>)}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-slate-200/70 bg-white/75 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-navy-800/75">
          <button className="btn-ghost lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <button className="btn-ghost hidden lg:inline-flex" aria-label="Toggle sidebar" onClick={() => setCollapsed((c) => !c)}>{collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}</button>
          <div className="flex-1" />
          <Link to={`${base}/messages`} className="btn-ghost relative" aria-label={`${fresh} new enquiries`}><Inbox className="h-5 w-5" />{fresh > 0 && <span className="absolute right-1 top-1 flex h-4 w-4"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-400 opacity-75" /><span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-sun-500 text-[10px] font-bold text-navy-900">{fresh > 9 ? '9+' : fresh}</span></span>}</Link>
          <button className="btn-ghost" aria-label="Toggle dark mode" onClick={toggle}>{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <div className="flex items-center gap-2 px-2">
            {user.photo ? <img src={API_ORIGIN + user.photo} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-teal-500/40" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-royal-500 text-sm font-bold text-white">{user.name[0]}</span>}
            <div className="hidden text-sm leading-tight sm:block"><div className="font-semibold">{user.name}</div><div className="text-xs text-slate-500 dark:text-slate-400">{ROLE_LABELS[user.role]}</div></div>
          </div>
          <button className="btn-ghost" aria-label="Sign out" onClick={() => { logout(); nav('/login'); }}><LogOut className="h-5 w-5" /></button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><div key={pathname} className="page-in"><Outlet /></div></main>
      </div>
    </div>
  );
}
