import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { ImagePlus, Pencil, Plus, Trash2, FileText, Loader2, Send, Search, Megaphone } from 'lucide-react';
import api, { errMsg } from '../services/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import PageBanner from '../components/PageBanner';
import { useConfirm } from '../components/Confirm';
import NoticeCard, { CATS, noticeImg } from '../components/NoticeCard';
import { useAuth } from '../context/AuthContext';

export function CategoryChips({ rows, value, onChange }) {
  const counts = rows.reduce((a, r) => ({ ...a, [r.category || 'general']: (a[r.category || 'general'] || 0) + 1 }), {});
  const items = [['all', 'All', rows.length], ...Object.entries(CATS).filter(([k]) => counts[k]).map(([k, c]) => [k, c.label, counts[k]])];
  return (
    <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 py-1" role="tablist" aria-label="Filter by category">
      {items.map(([k, label, n]) => (
        <button key={k} role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${value === k ? 'scale-105 bg-gradient-to-r from-royal-500 to-teal-500 text-white shadow-lg shadow-royal-500/30' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:ring-royal-500/50 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'}`}>
          {label} <span className={`ml-1 text-xs ${value === k ? 'text-white/80' : 'text-slate-400'}`}>{n}</span>
        </button>))}
    </div>
  );
}

export default function Notices() {
  const { user } = useAuth(); const admin = user.role === 'admin'; const [sp, setSp] = useSearchParams();
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [editing, setEditing] = useState(null); const [cat, setCat] = useState('all'); const [removing, setRemoving] = useState(null); const [q, setQ] = useState(''); const confirm = useConfirm();
  const load = useCallback(async () => {
    try { const { data } = await api.get('/notices'); setRows(data.data); } catch (e) { toast.error(errMsg(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (sp.get('new')) { setEditing({}); setSp({}, { replace: true }); } }, [sp, setSp]);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => (cat === 'all' || (r.category || 'general') === cat) && (!t || `${r.title} ${r.body}`.toLowerCase().includes(t)));
  }, [rows, cat, q]);
  const stats = [['Total notices', rows.length], ['Published', rows.filter((r) => r.isPublished !== false).length], ['With photo', rows.filter((r) => r.hasImage).length], ['With article', rows.filter((r) => r.hasArticle).length]];
  const remove = async (n) => {
    if (!(await confirm({ title: 'Delete this notice?', message: `“${n.title}” will be removed from the website and cannot be brought back.`, confirmText: 'Yes, delete', tone: 'danger' }))) return;
    setRemoving(n._id);
    try { await Promise.all([api.delete(`/notices/${n._id}`), new Promise((r) => setTimeout(r, 450))]); toast.success('Notice deleted'); setRows((r) => r.filter((x) => x._id !== n._id)); }
    catch (e) { toast.error(errMsg(e)); } finally { setRemoving(null); }
  };
  return (
    <div className="mx-auto max-w-5xl">
      <PageBanner eyebrow={<><Megaphone className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />Updates &amp; notices</>} title="Share news with your school" text="Post notices with photos and full articles. They appear on the website straight away." stats={stats}>
        {admin && <button className="btn bg-white px-5 py-2.5 text-navy-800 shadow-lg btn-shine hover:-translate-y-0.5 hover:bg-sun-400" onClick={() => setEditing({})}><Plus className="h-4 w-4" /> New notice</button>}
      </PageBanner>
      {loading ? <Spinner /> : rows.length === 0 ? (
        <div className="dash-card py-14 text-center"><Megaphone className="mx-auto h-12 w-12 animate-floaty text-teal-500" /><p className="mt-3 font-semibold">No notices yet</p><p className="text-sm text-slate-500">{admin ? 'Use “New notice” to post your first update.' : 'Check back soon.'}</p></div>
      ) : (<>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1"><CategoryChips rows={rows} value={cat} onChange={setCat} /></div>
          <div className="group relative mb-5"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 transition group-focus-within:text-royal-500" /><input aria-label="Search notices" placeholder="Search notices" className="input w-44 pl-9 transition-all duration-500 focus:w-64" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
        {shown.length === 0 ? <p className="dash-card animate-fadeIn text-center text-sm text-slate-500">No notices match your search.</p> : (
        <div key={cat + q} className="grid items-start gap-5 md:grid-cols-2">{shown.map((n, i) => (
          <div key={n._id} className={`${removing === n._id ? 'card-out' : 'animate-wordIn'} ${i === 0 && shown.length > 1 ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
            <NoticeCard n={admin ? n : { ...n, audience: undefined }} featured={i === 0 && shown.length > 1} actions={admin && (
              <div className="flex shrink-0 gap-1">
                <button className="rounded-lg p-2 text-slate-500 transition duration-300 hover:rotate-12 hover:bg-royal-500/10 hover:text-royal-600" aria-label={`Edit ${n.title}`} onClick={() => setEditing(n)}><Pencil className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-slate-500 transition duration-300 hover:scale-110 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${n.title}`} onClick={() => remove(n)}><Trash2 className="h-4 w-4" /></button>
              </div>)} />
          </div>))}
        </div>)}</>)}
      {editing && <NoticeForm initial={editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function NoticeForm({ initial, onClose, onDone }) {
  const confirm = useConfirm();
  const isEdit = !!initial._id;
  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isDirty } } = useForm({ defaultValues: { title: initial.title || '', body: initial.body || '', article: initial.article || '', category: initial.category || 'general', audience: initial.audience || 'both', pinned: !!initial.pinned, isPublished: initial.isPublished !== false } });
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null); const [removeImg, setRemoveImg] = useState(false); const [drag, setDrag] = useState(false);
  const v = watch();
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  const pick = (f) => {
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return toast.error('Choose a JPG, PNG or WebP image');
    if (f.size > 3 * 1024 * 1024) return toast.error('Image must be under 3 MB');
    setFile(f); setPreview(URL.createObjectURL(f)); setRemoveImg(false);
  };
  const shownImg = removeImg ? null : preview || (initial._id && initial.hasImage ? noticeImg(initial) : null);
  const onSubmit = async (val) => {
    const fields = { title: val.title.trim(), body: val.body.trim(), article: (val.article || '').trim(), category: val.category, audience: val.audience, pinned: val.pinned, isPublished: val.isPublished };
    let payload = fields;
    if (file || removeImg) { // an image is involved, so send it as a form
      payload = new FormData(); Object.entries(fields).forEach(([k, x]) => payload.append(k, x));
      if (file) payload.append('image', file); else payload.append('removeImage', 'true');
    }
    try {
      // Make sure the server is the new version before sending photos or articles (an old server would silently drop them or reject the form).
      if (file || removeImg || fields.article || fields.category !== 'general') {
        const h = await api.get('/health').catch(() => null);
        if (!h?.data?.features?.includes('notice-media')) { toast.error('The server is still the old version. Start or deploy the new server (see the documentation), then try again.', { duration: 7000 }); return; }
      }
      if (isEdit) await api.put(`/notices/${initial._id}`, payload); else await api.post('/notices', payload);
      toast.success(isEdit ? 'Notice updated' : 'Notice posted'); onDone();
    } catch (e) { toast.error(errMsg(e)); }
  };
  const st = (i) => ({ animationDelay: `${80 + i * 55}ms` });
  return (
    <Modal guard={async () => !(isDirty || file || removeImg) || (await confirm({ title: 'Discard this notice?', message: 'What you have typed and any photo you chose will be lost.', confirmText: 'Discard', cancelText: 'Keep editing', tone: 'warn' }))} title={isEdit ? 'Edit notice' : 'New notice'} subtitle="Add a photo and a full article if you like. The preview shows how readers will see it." size="xl" onClose={onClose}>
      {(close) => (
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="animate-wordIn" style={st(0)}><label className="label" htmlFor="nt">Title</label><input id="nt" className="input" {...register('title', { required: 'Enter a title', minLength: { value: 3, message: 'Too short' } })} />{errors.title && <p className="err">{errors.title.message}</p>}</div>
            <div className="animate-wordIn" style={st(1)}>
              <span className="label">Cover image <span className="font-normal text-slate-500">(optional, JPG, PNG or WebP, up to 3 MB)</span></span>
              {shownImg ? (
                <div className="group relative overflow-hidden rounded-xl">
                  <img src={shownImg} alt="Cover preview" className="aspect-[16/9] w-full animate-fadeIn object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-900/50 opacity-0 transition group-hover:opacity-100">
                    <label className="btn-primary cursor-pointer text-sm">Change<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files[0])} /></label>
                    <button type="button" className="btn bg-white text-sm text-red-600" onClick={() => { setFile(null); setPreview(null); setRemoveImg(true); }}>Remove</button>
                  </div>
                </div>
              ) : (
                <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-6 text-center text-sm transition-all duration-300 ${drag ? 'scale-[1.02] border-teal-500 bg-teal-500/10' : 'border-slate-300 hover:border-royal-500 hover:bg-royal-500/5 dark:border-white/20'}`}>
                  <ImagePlus className={`h-8 w-8 text-royal-500 transition-transform duration-300 ${drag ? '-translate-y-1 scale-110' : ''}`} /><span className="font-semibold">Drop an image here or click to choose</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files[0])} />
                </label>)}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 animate-wordIn" style={st(2)}>
              <div><label className="label" htmlFor="nc">Category</label><select id="nc" className="input" {...register('category')}>{Object.entries(CATS).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}</select></div>
              <div><label className="label" htmlFor="na">Show on</label><select id="na" className="input" {...register('audience')}><option value="both">Website and admin portal</option><option value="public">Website only</option><option value="portal">Admin portal only</option></select></div>
            </div>
            <div className="animate-wordIn" style={st(3)}><label className="label" htmlFor="nb">Short notice <span className="font-normal text-slate-500">({(v.body || '').length}/3000)</span></label><textarea id="nb" rows={3} maxLength={3000} className="input" {...register('body', { required: 'Write the notice', minLength: { value: 3, message: 'Too short' } })} />{errors.body && <p className="err">{errors.body.message}</p>}</div>
            <div className="animate-wordIn" style={st(4)}><label className="label" htmlFor="nar"><FileText className="mr-1 inline h-4 w-4" />Full article <span className="font-normal text-slate-500">(optional, {(v.article || '').length}/10000). Leave a blank line between paragraphs.</span></label><textarea id="nar" rows={7} maxLength={10000} className="input" placeholder="Write the full story here. Readers see a “Read full article” button." {...register('article')} /></div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm animate-wordIn" style={st(5)}><label className="inline-flex items-center gap-2"><input type="checkbox" {...register('pinned')} /> Pin to top</label><label className="inline-flex items-center gap-2"><input type="checkbox" {...register('isPublished')} /> Published</label></div>
          </div>
          <div className="lg:sticky lg:top-0 lg:self-start">
            <p className="label">Live preview</p>
            <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/5">
              <NoticeCard n={{ ...v, _id: 'preview', createdAt: new Date(), previewImg: shownImg, hasArticle: !!(v.article || '').trim(), title: v.title || 'Your title appears here', body: v.body || 'Your short notice appears here.' }} />
            </div>
            <div className="mt-4 flex justify-end gap-2"><button type="button" className="btn-ghost" onClick={close}>Cancel</button><button className="btn-primary btn-shine min-w-[8.5rem]" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Send className="h-4 w-4" />{isEdit ? 'Save changes' : 'Post notice'}</>}</button></div>
          </div>
        </div>
      </form>)}
    </Modal>
  );
}
