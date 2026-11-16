import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthShell from '../components/AuthShell';
import api, { errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLE_HOME } from '../utils/roles';

export default function ResetPassword() {
  const { token } = useParams(); const nav = useNavigate(); const { adopt } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async (v) => {
    try { const { data } = await api.post(`/auth/reset-password/${token}`, { password: v.password }); adopt(data); toast.success('Password updated'); nav(ROLE_HOME[data.user.role], { replace: true }); }
    catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <AuthShell title="Choose a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="password">New password</label>
          <input id="password" type="password" autoComplete="new-password" className="input" {...register('password', { required: 'Enter a password', minLength: { value: 8, message: 'Use at least 8 characters' }, validate: (v) => (/[A-Za-z]/.test(v) && /\d/.test(v)) || 'Include a letter and a number' })} />
          {errors.password && <p className="err">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" autoComplete="new-password" className="input" {...register('confirm', { validate: (v) => v === watch('password') || 'Passwords do not match' })} />
          {errors.confirm && <p className="err">{errors.confirm.message}</p>}
        </div>
        <button className="btn-primary w-full" disabled={isSubmitting}>Save new password</button>
      </form>
    </AuthShell>
  );
}
