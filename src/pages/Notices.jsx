import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import api, { errMsg } from '../services/api';
import Spinner from '../components/Spinner';
import NoticeCard from '../components/NoticeCard';
import { useAuth } from '../context/AuthContext';

export default function Notices() {
  const { user } = useAuth(); const admin = user.role === 'admin'; const [sp, setSp] = useSearchParams();
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [editing, setEditing] = useState(null);
  const load = useCallback(async () => {
    try { const { data } = await api.get('/notices'); setRows(data.data); } catch (e) { toast.error(errMsg(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (sp.get('new')) { setEditing({}); setSp({}, { replace: true }); } }, [sp, setSp]);
  const remove = async (n) => { if (!confirm(`Delete “${n.title}”?`)) return; try { await api.delete(`/notices/${n._id}`); toast.success('Notice deleted'); load(); } catch (e) { toast.error(errMsg(e)); } };
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3"><h1 className="mr-auto text-2xl font-bold">Updates &amp; notices</h1>{admin && <button className="btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" /> New notice</button>}</div>
      {loading ? <Spinner /> : rows.length === 0 ? <p className="card text-center text-sm text-slate-500">No notices yet.{admin && ' Use “New notice” to post the first one.'}</p> : (
        <div className="space-y-3">{rows.map((n) => (
          <NoticeCard key={n._id} n={admin ? n : { ...n, audience: undefined }} actions={admin && (
            <div className="flex shrink-0">
              <button className="btn-ghost p-2" aria-label={`Edit ${n.title}`} onClick={() => setEditing(n)}><Pencil className="h-4 w-4" /></button>
              <button className="btn-ghost p-2 text-red-600" aria-label={`Delete ${n.title}`} onClick={() => remove(n)}><Trash2 className="h-4 w-4" /></button>
            </div>)} />))}
        </div>)}
      {editing && <NoticeForm initial={editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function NoticeForm({ initial, onClose, onDone }) {
  const isEdit = !!initial._id;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { title: initial.title || '', body: initial.body || '', audience: initial.audience || 'both', pinned: !!initial.pinned, isPublished: initial.isPublished !== false } });
  const onSubmit = async (v) => {
    try { if (isEdit) await api.put(`/notices/${initial._id}`, v); else await api.post('/notices', v); toast.success(isEdit ? 'Notice updated' : 'Notice posted'); onDone(); } catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit notice' : 'New notice'}>
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-lg space-y-4" noValidate>
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{isEdit ? 'Edit notice' : 'New notice'}</h2><button type="button" className="btn-ghost" aria-label="Close" onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div><label className="label" htmlFor="nt">Title</label><input id="nt" className="input" {...register('title', { required: 'Enter a title', minLength: { value: 3, message: 'Too short' } })} />{errors.title && <p className="err">{errors.title.message}</p>}</div>
        <div><label className="label" htmlFor="nb">Notice</label><textarea id="nb" rows={5} className="input" {...register('body', { required: 'Write the notice', minLength: { value: 3, message: 'Too short' } })} />{errors.body && <p className="err">{errors.body.message}</p>}</div>
        <div><label className="label" htmlFor="na">Show on</label><select id="na" className="input" {...register('audience')}><option value="both">Website and portal</option><option value="public">Website only</option><option value="portal">Portal only (signed-in users)</option></select></div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><label className="inline-flex items-center gap-2"><input type="checkbox" {...register('pinned')} /> Pin to top</label><label className="inline-flex items-center gap-2"><input type="checkbox" {...register('isPublished')} /> Published</label></div>
        <div className="flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={isSubmitting}>{isEdit ? 'Save changes' : 'Post notice'}</button></div>
      </form>
    </div>
  );
}
