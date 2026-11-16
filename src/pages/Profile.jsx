import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api, { errMsg } from '../services/api';

export default function Profile() {
  const { user, setUser, adopt } = useAuth();
  const p = useForm({ defaultValues: { name: user.name, phone: user.phone || '' } });
  const c = useForm();
  const saveProfile = async (v) => {
    const fd = new FormData(); fd.append('name', v.name); fd.append('phone', v.phone || '');
    if (v.photo?.[0]) fd.append('photo', v.photo[0]);
    try { const { data } = await api.put('/auth/profile', fd); setUser(data.user); toast.success('Profile saved'); } catch (e) { toast.error(errMsg(e)); }
  };
  const savePw = async (v) => {
    try { const { data } = await api.put('/auth/change-password', v); adopt(data); c.reset(); toast.success('Password changed'); } catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={p.handleSubmit(saveProfile)} className="card space-y-4" noValidate>
        <h2 className="font-semibold">Personal details</h2>
        <div><label className="label" htmlFor="name">Name</label><input id="name" className="input" {...p.register('name', { required: 'Enter your name', minLength: { value: 2, message: 'Too short' } })} />{p.formState.errors.name && <p className="err">{p.formState.errors.name.message}</p>}</div>
        <div><label className="label" htmlFor="phone">Phone</label><input id="phone" className="input" {...p.register('phone')} /></div>
        <div><label className="label" htmlFor="photo">Profile photo (JPG, PNG or WebP, up to 2 MB)</label><input id="photo" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" {...p.register('photo')} /></div>
        <button className="btn-primary" disabled={p.formState.isSubmitting}>Save changes</button>
      </form>
      <form onSubmit={c.handleSubmit(savePw)} className="card space-y-4" noValidate>
        <h2 className="font-semibold">Change password</h2>
        <div><label className="label" htmlFor="cur">Current password</label><input id="cur" type="password" autoComplete="current-password" className="input" {...c.register('currentPassword', { required: 'Enter your current password' })} />{c.formState.errors.currentPassword && <p className="err">{c.formState.errors.currentPassword.message}</p>}</div>
        <div><label className="label" htmlFor="new">New password</label><input id="new" type="password" autoComplete="new-password" className="input" {...c.register('newPassword', { required: 'Enter a new password', minLength: { value: 8, message: 'Use at least 8 characters' }, validate: (v) => (/[A-Za-z]/.test(v) && /\d/.test(v)) || 'Include a letter and a number' })} />{c.formState.errors.newPassword && <p className="err">{c.formState.errors.newPassword.message}</p>}</div>
        <button className="btn-primary" disabled={c.formState.isSubmitting}>Change password</button>
      </form>
    </div>
  );
}
