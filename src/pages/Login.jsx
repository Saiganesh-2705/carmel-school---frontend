import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';
import api, { API_URL, errMsg } from '../services/api';
import { ROLE_HOME } from '../utils/roles';

export default function Login() {
  const { user, login, loading } = useAuth();
  const nav = useNavigate(); const loc = useLocation();
  const [show, setShow] = useState(false); const [error, setError] = useState(''); const [offline, setOffline] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { remember: true } });

  // Tell the user straight away if the backend is not reachable, instead of a silent failed login.
  useEffect(() => { api.get('/health', { timeout: 60000 }).catch(() => setOffline(true)); }, []);

  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />;
  const onSubmit = async (v) => {
    setError('');
    try {
      const u = await login(v.email, v.password, v.remember);
      toast.success(`Welcome, ${u.name}`);
      const from = loc.state?.from?.pathname;
      nav(from && from !== '/login' ? from : ROLE_HOME[u.role], { replace: true });
    } catch (e) { setError(errMsg(e)); }
  };
  return (
    <AuthShell title="Sign in" subtitle="Use the email your school registered for you.">
      {offline && (
        <div role="alert" className="mb-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>The server at <b>{API_URL}</b> is not responding. Start the backend with <code>cd server &amp;&amp; npm run dev</code>, then refresh.</span>
        </div>)}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">{error}</p>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" autoFocus className="input" {...register('email', { required: 'Enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
          {errors.email && <p className="err">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" className="input pr-10" {...register('password', { required: 'Enter your password' })} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-royal-500">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
          {errors.password && <p className="err">{errors.password.message}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('remember')} /> Remember me</label>
          <Link className="text-royal-500 hover:underline" to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" disabled={isSubmitting || loading}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </AuthShell>
  );
}
