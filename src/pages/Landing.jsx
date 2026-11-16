import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-800 text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between p-6">
        <span className="flex items-center gap-2 font-semibold"><GraduationCap className="h-6 w-6 text-teal-500" /> School Management System</span>
        <Link to="/login" className="btn-primary">Sign in</Link>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">One workspace for every teacher, student and parent.</h1>
        <p className="mt-5 max-w-xl text-lg text-slate-300">Take attendance, publish results, collect fees and send notices without paper or spreadsheets.</p>
        <Link to="/login" className="btn-primary mt-8 px-6 py-3">Sign in to your account</Link>
      </section>
    </div>
  );
}
