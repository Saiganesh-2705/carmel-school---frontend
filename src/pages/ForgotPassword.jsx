import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from '../components/AuthShell';
import api, { errMsg } from '../services/api';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async (v) => { try { await api.post('/auth/forgot-password', v); setSent(true); } catch (e) { toast.error(errMsg(e)); } };
  return (
    <AuthShell title="Reset your password" subtitle="We’ll email you a link that works for 30 minutes.">
      {sent ? <p className="card text-sm">If that email is registered, a reset link is on its way. <Link to="/login" className="text-royal-500 hover:underline">Back to sign in</Link></p> : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" {...register('email', { required: 'Enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
            {errors.email && <p className="err">{errors.email.message}</p>}
          </div>
          <button className="btn-primary w-full" disabled={isSubmitting}>Send reset link</button>
          <p className="text-center text-sm"><Link className="text-royal-500 hover:underline" to="/login">Back to sign in</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
