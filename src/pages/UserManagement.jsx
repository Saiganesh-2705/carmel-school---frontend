import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { KeyRound, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import api, { errMsg } from '../services/api';
import Spinner from '../components/Spinner';
import { fmtDate } from '../components/NoticeCard';
import { useAuth } from '../context/AuthContext';

const pwRules = { required: 'Enter a password', minLength: { value: 8, message: 'Use at least 8 characters' }, validate: (v) => (/[A-Za-z]/.test(v) && /\d/.test(v)) || 'Include a letter and a number' };

export default function UserManagement() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState([]); const [page, setPage] = useState(1); const [pages, setPages] = useState(1);
  const [search, setSearch] = useState(''); const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: 'add' | 'edit' | 'password', user? }

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/users', { params: { page, search } }); setRows(data.data); setPages(data.pagination.pages); }
    catch (e) { toast.error(errMsg(e)); } finally { setLoading(false); }
  }, [page, search]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const toggle = async (u) => { try { await api.patch(`/users/${u._id}/active`, { isActive: !u.isActive }); toast.success(u.isActive ? 'Account disabled' : 'Account enabled'); load(); } catch (e) { toast.error(errMsg(e)); } };
  const remove = async (u) => { if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return; try { await api.delete(`/users/${u._id}`); toast.success('User deleted'); load(); } catch (e) { toast.error(errMsg(e)); } };
  const done = () => { setModal(null); load(); };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-bold">Admin accounts</h1>
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><input aria-label="Search users" placeholder="Search name or email" className="input pl-8" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} /></div>
        <button className="btn-primary" onClick={() => setModal({ type: 'add' })}><Plus className="h-4 w-4" /> Add admin</button>
      </div>
      <div className="card overflow-x-auto p-0">
        {loading ? <Spinner /> : rows.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No admin accounts match.</p> : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500 dark:border-white/10"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Last sign-in</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
            <tbody>{rows.map((u) => (
              <tr key={u._id} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                <td className="p-3 font-medium">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">Admin</td>
                <td className="p-3 text-slate-500">{u.lastLoginAt ? fmtDate(u.lastLoginAt) : 'Never'}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.isActive ? 'bg-teal-500/15 text-teal-600' : 'bg-red-500/15 text-red-600'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                <td className="whitespace-nowrap p-3 text-right">
                  <button className="btn-ghost p-2" aria-label={`Edit ${u.name}`} onClick={() => setModal({ type: 'edit', user: u })}><Pencil className="h-4 w-4" /></button>
                  <button className="btn-ghost p-2" aria-label={`Reset password for ${u.name}`} onClick={() => setModal({ type: 'password', user: u })}><KeyRound className="h-4 w-4" /></button>
                  <button className="btn-ghost" onClick={() => toggle(u)} disabled={u._id === me._id}>{u.isActive ? 'Disable' : 'Enable'}</button>
                  <button className="btn-ghost p-2 text-red-600" aria-label={`Delete ${u.name}`} onClick={() => remove(u)} disabled={u._id === me._id}><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>))}</tbody>
          </table>)}
      </div>
      {pages > 1 && <div className="mt-4 flex items-center justify-center gap-3 text-sm"><button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>Page {page} of {pages}<button className="btn-ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>}
      {modal?.type === 'add' && <UserForm onClose={() => setModal(null)} onDone={done} />}
      {modal?.type === 'edit' && <UserForm initial={modal.user} onClose={() => setModal(null)} onDone={done} />}
      {modal?.type === 'password' && <ResetPassword user={modal.user} onClose={() => setModal(null)} onDone={done} />}
    </div>
  );
}

function Modal({ title, onClose, children, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={title}>
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4" noValidate>
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button type="button" className="btn-ghost" aria-label="Close" onClick={onClose}><X className="h-4 w-4" /></button></div>
        {children}
      </form>
    </div>
  );
}

function UserForm({ initial, onClose, onDone }) {
  const isEdit = !!initial;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { name: initial?.name || '', email: initial?.email || '', phone: initial?.phone || '', role: 'admin' } });
  const onSubmit = async (v) => {
    try {
      if (isEdit) { await api.put(`/users/${initial._id}`, { name: v.name, phone: v.phone }); toast.success('User updated'); }
      else { await api.post('/users', v); toast.success('User created'); }
      onDone();
    } catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <Modal title={isEdit ? 'Edit admin' : 'Add admin'} onClose={onClose} onSubmit={handleSubmit(onSubmit)}>
      <div><label className="label" htmlFor="n">Name</label><input id="n" className="input" {...register('name', { required: 'Enter a name', minLength: { value: 2, message: 'Too short' } })} />{errors.name && <p className="err">{errors.name.message}</p>}</div>
      <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" disabled={isEdit} className="input disabled:opacity-60" {...register('email', isEdit ? {} : { required: 'Enter an email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />{errors.email && <p className="err">{errors.email.message}</p>}</div>
      <div><label className="label" htmlFor="ph">Phone (optional)</label><input id="ph" className="input" {...register('phone')} /></div>
      {!isEdit && <div><label className="label" htmlFor="p">Temporary password</label><input id="p" type="password" autoComplete="new-password" className="input" {...register('password', pwRules)} />{errors.password && <p className="err">{errors.password.message}</p>}</div>}
      <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={isSubmitting}>{isEdit ? 'Save changes' : 'Create admin'}</button></div>
    </Modal>
  );
}

function ResetPassword({ user, onClose, onDone }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const onSubmit = async (v) => { try { await api.post(`/users/${user._id}/reset-password`, v); toast.success('Password updated'); onDone(); } catch (e) { toast.error(errMsg(e)); } };
  return (
    <Modal title={`Reset password: ${user.name}`} onClose={onClose} onSubmit={handleSubmit(onSubmit)}>
      <p className="text-sm text-slate-500 dark:text-slate-400">Set a new temporary password. {user.name} will be signed out everywhere and must sign in again.</p>
      <div><label className="label" htmlFor="np">New password</label><input id="np" type="password" autoComplete="new-password" className="input" {...register('password', pwRules)} />{errors.password && <p className="err">{errors.password.message}</p>}</div>
      <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={isSubmitting}>Update password</button></div>
    </Modal>
  );
}
