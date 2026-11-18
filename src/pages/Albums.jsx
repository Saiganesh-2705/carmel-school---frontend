import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Images, ImagePlus, CalendarDays, Loader2, Send, Eye, EyeOff } from 'lucide-react';
import api, { errMsg } from '../services/api';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import PageBanner from '../components/PageBanner';
import PhotoPicker, { usePhotoPicker, appendPhotos } from '../components/PhotoPicker';
import { ALBUM_CATS, albumPhoto, albumDate } from '../components/AlbumGrid';
import { useConfirm } from '../components/Confirm';

const dateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));

export default function Albums() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [editing, setEditing] = useState(null);
  const [cat, setCat] = useState('all'); const [removing, setRemoving] = useState(null); const [sp, setSp] = useSearchParams(); const confirm = useConfirm();
  const load = useCallback(async () => {
    try { const { data } = await api.get('/albums'); setRows(data.data); } catch (e) { toast.error(errMsg(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (sp.get('new')) { setEditing({}); setSp({}, { replace: true }); } }, [sp, setSp]);
  const shown = useMemo(() => rows.filter((r) => cat === 'all' || r.category === cat), [rows, cat]);
  const cats = [...new Set(rows.map((r) => r.category))];
  const stats = [['Albums', rows.length], ['Published', rows.filter((r) => r.isPublished).length], ['Photos', rows.reduce((n, r) => n + r.photos.length, 0)], ['Drafts', rows.filter((r) => !r.isPublished).length]];
  const remove = async (a) => {
    if (!(await confirm({ title: 'Delete this album?', message: `“${a.title}” and all ${a.photos.length} of its photos will be removed from the website for good.`, confirmText: 'Yes, delete', tone: 'danger' }))) return;
    setRemoving(a._id);
    try { await Promise.all([api.delete(`/albums/${a._id}`), new Promise((r) => setTimeout(r, 450))]); toast.success('Album deleted'); setRows((r) => r.filter((x) => x._id !== a._id)); }
    catch (e) { toast.error(errMsg(e)); } finally { setRemoving(null); }
  };
  return (
    <div className="mx-auto max-w-5xl">
      <PageBanner eyebrow={<><Images className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />Events &amp; gallery</>} title="Celebration photo albums" text="Create an album for Blue Day, Children's Day, Sports Day and more. Albums appear on the Events and Gallery pages." stats={stats}>
        <button className="btn bg-white px-5 py-2.5 text-navy-800 shadow-lg btn-shine hover:-translate-y-0.5 hover:bg-sun-400" onClick={() => setEditing({})}><Plus className="h-4 w-4" /> New album</button>
      </PageBanner>
      {loading ? <Spinner /> : rows.length === 0 ? (
        <div className="dash-card py-14 text-center"><Images className="mx-auto h-12 w-12 animate-floaty text-teal-500" /><p className="mt-3 font-semibold">No albums yet</p><p className="text-sm text-slate-500">Use “New album” to add photos from your first celebration.</p></div>
      ) : (<>
        {cats.length > 1 && (
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto py-1" role="tablist" aria-label="Filter albums">
            {['all', ...cats].map((c) => <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-300 ${cat === c ? 'scale-105 bg-gradient-to-r from-royal-500 to-teal-500 text-white shadow-lg' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:-translate-y-0.5 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10'}`}>{c === 'all' ? 'All' : ALBUM_CATS[c]}</button>)}
          </div>)}
        <div key={cat} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <div key={a._id} className={`dash-card spot group !p-0 ${removing === a._id ? 'card-out' : 'animate-wordIn'}`} style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                {a.photos[0] ? <img src={albumPhoto(a, a.photos[0], 600)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /> : <div className="flex h-full items-center justify-center text-slate-400"><Images className="h-10 w-10" /></div>}
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy-800">{ALBUM_CATS[a.category]}</span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white"><Images className="h-3.5 w-3.5" />{a.photos.length}</span>
                {!a.isPublished && <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-white"><EyeOff className="h-3.5 w-3.5" />Draft</span>}
              </div>
              <div className="flex items-start gap-2 p-4">
                <div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{a.title}</h3><p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="h-3.5 w-3.5" />{albumDate(a.eventDate)}{a.isPublished && <><span>·</span><Eye className="h-3.5 w-3.5" />Live</>}</p></div>
                <button className="inline-flex items-center gap-1 rounded-lg bg-teal-500/10 px-2.5 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-500/20" onClick={() => setEditing(a)}><ImagePlus className="h-3.5 w-3.5" />Add photos</button>
                <button className="rounded-lg p-2 text-slate-500 transition duration-300 hover:rotate-12 hover:bg-royal-500/10 hover:text-royal-600" aria-label={`Edit ${a.title}`} onClick={() => setEditing(a)}><Pencil className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 text-slate-500 transition duration-300 hover:scale-110 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${a.title}`} onClick={() => remove(a)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>))}
        </div></>)}
      {editing && <AlbumForm rows={rows} initial={editing} onClose={() => setEditing(null)} onDone={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function AlbumForm({ rows, initial, onClose, onDone }) {
  const confirm = useConfirm(); const isEdit = !!initial._id; const [prog, setProg] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({ defaultValues: { title: initial.title || '', description: initial.description || '', category: initial.category || 'celebration', eventDate: dateInput(initial.eventDate), isPublished: initial.isPublished !== false } });
  const picker = usePhotoPicker(isEdit ? initial.photos.map((id) => ({ id, url: albumPhoto(initial, id, 300) })) : [], 500, 500);
  const st = (i) => ({ animationDelay: `${80 + i * 55}ms` });
  const onSubmit = async (v) => {
    const fields = { title: v.title.trim(), description: (v.description || '').trim(), category: v.category, eventDate: v.eventDate, isPublished: v.isPublished };
    try {
      const h = await api.get('/health').catch(() => null);
      if (!h?.data?.features?.includes('albums')) { toast.error('The server is still the old version. Start or deploy the new server (see the documentation), then try again.', { duration: 7000 }); return; }
      const BATCH = 20; const files = picker.added.map((a) => a.file);
      const batches = []; for (let i = 0; i < files.length; i += BATCH) batches.push(files.slice(i, i + BATCH));
      const send = async (id, list, first) => {
        const fd = new FormData(); if (!merge) Object.entries(fields).forEach(([k, x]) => fd.append(k, x));
        list.forEach((f) => fd.append('images', f));
        if (first && picker.removed.length) fd.append('removeImages', JSON.stringify(picker.removed));
        const r = id ? await api.put(`/albums/${id}`, fd) : await api.post('/albums', fd); return r.data.data._id;
      };
      let id = initial._id; let merge = false;
      // Same celebration already on the site? Offer to add the new photos to it instead of making a duplicate card.
      const twin = !isEdit && files.length ? rows.find((r) => r.title.trim().toLowerCase() === fields.title.toLowerCase()) : null;
      if (twin && (await confirm({ title: `“${twin.title}” already exists`, message: `Add these ${files.length} photos to the existing album (${twin.photos.length} photos) instead of creating a second one?`, confirmText: 'Add to existing album', cancelText: 'Create separate album', tone: 'info' }))) { id = twin._id; merge = true; }
      if (!picker.changed) { await api.put(`/albums/${id}`, fields); }
      else if (!batches.length) { id = await send(id, [], true); }
      else {
        let done = 0; setProg({ done, total: files.length });
        try {
          for (let b = 0; b < batches.length; b++) { id = await send(id, batches[b], b === 0); done += batches[b].length; setProg({ done, total: files.length }); }
        } catch (e) { setProg(null); toast.error(`${done} of ${files.length} photos were saved before a problem happened: ${errMsg(e)} Open the album and add the rest.`, { duration: 9000 }); onDone(); return; }
      }
      setProg(null); toast.success(merge ? 'Photos added to the existing album' : isEdit ? 'Album updated' : 'Album published'); onDone();
    } catch (e) { toast.error(errMsg(e)); }
  };
  return (
    <Modal guard={async () => !!prog ? false : !(isDirty || picker.changed) || (await confirm({ title: 'Discard this album?', message: 'What you have typed and any photos you chose will be lost.', confirmText: 'Discard', cancelText: 'Keep editing', tone: 'warn' }))}
      title={isEdit ? 'Edit album' : 'New album'} subtitle="One album per celebration. Up to 500 photos." size="lg" onClose={onClose}>
      {(close) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="animate-wordIn" style={st(0)}><label className="label" htmlFor="at">Album name</label><input id="at" className="input" placeholder="For example: Blue Day" {...register('title', { required: 'Enter a name', minLength: { value: 3, message: 'Too short' } })} />{errors.title && <p className="err">{errors.title.message}</p>}</div>
          <div className="grid gap-4 sm:grid-cols-2 animate-wordIn" style={st(1)}>
            <div><label className="label" htmlFor="ac">Type</label><select id="ac" className="input" {...register('category')}>{Object.entries(ALBUM_CATS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
            <div><label className="label" htmlFor="ad">Date of the event</label><input id="ad" type="date" className="input" {...register('eventDate', { required: 'Choose the date' })} />{errors.eventDate && <p className="err">{errors.eventDate.message}</p>}</div>
          </div>
          <div className="animate-wordIn" style={st(2)}><label className="label" htmlFor="ads">Short description <span className="font-normal text-slate-500">(optional)</span></label><textarea id="ads" rows={3} maxLength={2000} className="input" placeholder="What happened on this day?" {...register('description')} /></div>
          <div className="animate-wordIn" style={st(3)}><PhotoPicker picker={picker} hint="Select up to 500 at once. The first photo is the album cover." /></div>
          {prog && <div className="h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={prog.done} aria-valuemax={prog.total} aria-label="Upload progress"><div className="h-full rounded-full bg-gradient-to-r from-royal-500 to-teal-500 transition-all duration-500" style={{ width: `${(prog.done / prog.total) * 100}%` }} /></div>}
          <label className="inline-flex items-center gap-2 text-sm animate-wordIn" style={st(4)}><input type="checkbox" {...register('isPublished')} /> Published (visible on the website)</label>
          <div className="flex justify-end gap-2 pt-1"><button type="button" className="btn-ghost" onClick={close}>Cancel</button><button className="btn-primary btn-shine min-w-[8.5rem]" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />{prog ? `${prog.done}/${prog.total}` : 'Saving…'}</> : <><Send className="h-4 w-4" />{isEdit ? 'Save changes' : 'Publish album'}</>}</button></div>
        </form>)}
    </Modal>
  );
}
