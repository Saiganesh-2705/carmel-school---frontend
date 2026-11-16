import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserCog, UserCircle, Bell, Inbox, Globe, Menu, Moon, Sun, LogOut, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROLE_HOME, ROLE_LABELS, API_ORIGIN } from '../utils/roles';

// Nav grows as modules are built. Only routes that exist are listed.
const NAV = {
  common: [{ to: 'notices', label: 'Notices', icon: Bell }, { to: 'profile', label: 'Profile', icon: UserCircle }],
  admin: [{ to: 'users', label: 'User management', icon: UserCog }, { to: 'messages', label: 'Enquiries', icon: Inbox }],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth(); const { dark, toggle } = useTheme(); const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(false); const [open, setOpen] = useState(false);
  const base = ROLE_HOME[user.role];
  const items = [{ to: '', label: 'Dashboard', icon: LayoutDashboard }, ...(['admin', 'super_admin'].includes(user.role) ? NAV.admin : []), ...NAV.common];
  const link = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-royal-500 text-white' : 'text-slate-300 hover:bg-white/10'}`;

  const sidebar = (
    <nav className="flex h-full flex-col bg-navy-800 p-3 text-white">
      <div className="mb-4 flex items-center gap-2 px-2 py-2 font-semibold"><img src="/images/logo.png" alt="" className="h-8 w-8 shrink-0 rounded-full bg-white p-0.5" />{!collapsed && <span>CIS Portal</span>}</div>
      <ul className="space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={label}><NavLink end={to === ''} to={`${base}/${to}`.replace(/\/$/, '')} className={link} onClick={() => setOpen(false)}><Icon className="h-5 w-5 shrink-0" />{!collapsed && label}</NavLink></li>
        ))}
      </ul>
      <Link to="/" className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10"><Globe className="h-5 w-5 shrink-0" />{!collapsed && 'Back to website'}</Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <div className={`hidden lg:block ${collapsed ? 'w-16' : 'w-60'} shrink-0 transition-[width]`}><div className={`fixed inset-y-0 ${collapsed ? 'w-16' : 'w-60'}`}>{sidebar}</div></div>
      {open && (<div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 w-64">{sidebar}<button aria-label="Close menu" className="absolute right-2 top-3 text-white" onClick={() => setOpen(false)}><X /></button></div></div>)}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-slate-200 bg-white px-4 dark:border-white/10 dark:bg-navy-800">
          <button className="btn-ghost lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <button className="btn-ghost hidden lg:inline-flex" aria-label="Toggle sidebar" onClick={() => setCollapsed((c) => !c)}>{collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}</button>
          <div className="flex-1" />
          <button className="btn-ghost" aria-label="Toggle dark mode" onClick={toggle}>{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <div className="flex items-center gap-2 px-2">
            {user.photo ? <img src={API_ORIGIN + user.photo} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">{user.name[0]}</span>}
            <div className="hidden text-sm leading-tight sm:block"><div className="font-semibold">{user.name}</div><div className="text-xs text-slate-500 dark:text-slate-400">{ROLE_LABELS[user.role]}</div></div>
          </div>
          <button className="btn-ghost" aria-label="Sign out" onClick={() => { logout(); nav('/login'); }}><LogOut className="h-5 w-5" /></button>
        </header>
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
