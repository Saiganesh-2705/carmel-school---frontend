import { ArrowLeft } from 'lucide-react';
import { school, img } from '../config/school';
import { Link } from 'react-router-dom';
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <aside className="hidden flex-col justify-between bg-navy-800 p-12 text-white lg:flex">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold"><img src={img('logo.png')} alt="" className="h-10 w-10 rounded-full bg-white p-0.5" /> {school.name}</Link>
        <div>
          <p className="max-w-md text-3xl font-semibold leading-snug">Sign in to the school portal.</p>
          <p className="mt-4 max-w-md text-slate-300">Teachers, students, parents and staff each sign in to a workspace built for their role.</p>
        </div>
        <p className="text-sm text-slate-400">Authorized users only</p>
      </aside>
      <main className="flex flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link to="/" className="inline-flex items-center gap-2 font-semibold hover:text-royal-500"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to website</Link>
          <nav aria-label="Website" className="flex gap-4 text-slate-500 dark:text-slate-400">
            <Link className="hover:text-royal-500" to="/about">About</Link><Link className="hover:text-royal-500" to="/notices">Notices</Link><Link className="hover:text-royal-500" to="/contact">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-sm">
            <Link to="/" className="mb-6 flex items-center gap-2 font-semibold lg:hidden"><img src={img('logo.png')} alt="" className="h-9 w-9 rounded-full" />{school.name}</Link>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
