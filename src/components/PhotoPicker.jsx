import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImagePlus, X } from 'lucide-react';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Shrinks a photo to at most 1920 px on its long side as a JPEG (usually 300 KB to 900 KB), so hundreds of photos upload quickly.
async function shrink(file) {
  try {
    const bmp = await createImageBitmap(file); const k = Math.min(1, 1920 / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); bmp.close?.();
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.86));
    if (blob && blob.size < file.size) return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch { /* use the original */ }
  return file.size <= 8 * 1024 * 1024 ? file : null;
}

// Everything needed to pick many photos for a form: photos already saved (can be removed), new photos (previewed), limits and messages.
export function usePhotoPicker(existing = [], max = 500, perSave = 500) {
  const [kept, setKept] = useState(existing); const [busy, setBusy] = useState(0); const [removed, setRemoved] = useState([]); const [added, setAdded] = useState([]);
  useEffect(() => () => added.forEach((a) => URL.revokeObjectURL(a.url)), []); // eslint-disable-line
  const total = kept.length + added.length;
  const pickMany = async (list) => {
    const files = Array.from(list || []); if (!files.length) return;
    let skipped = 0; const room = Math.max(max - total, 0);
    const okType = files.filter((f) => { const ok = TYPES.includes(f.type) && f.size <= 30 * 1024 * 1024; if (!ok) skipped += 1; return ok; });
    const take = okType.slice(0, room); skipped += okType.length - take.length;
    setBusy(take.length); const out = [];
    for (let i = 0; i < take.length; i += 4) {
      const done = await Promise.all(take.slice(i, i + 4).map(shrink));
      done.forEach((f) => { if (f) out.push(f); else skipped += 1; }); setBusy(take.length - Math.min(i + 4, take.length));
    }
    if (skipped) toast.error(`${skipped} photo${skipped > 1 ? 's were' : ' was'} skipped. Use JPG, PNG or WebP photos, up to ${max} in one album.`);
    setAdded((a) => [...a, ...out.map((file) => ({ file, url: URL.createObjectURL(file), key: `${file.name}-${file.size}-${Math.random()}` }))]);
  };
  const dropKept = (p) => { setKept((k) => k.filter((x) => x.id !== p.id)); setRemoved((r) => [...r, p.id]); };
  const dropAdded = (p) => { URL.revokeObjectURL(p.url); setAdded((a) => a.filter((x) => x.key !== p.key)); };
  return { kept, added, removed, total, max, busy, perSave, pickMany, dropKept, dropAdded, urls: [...kept.map((k) => k.url), ...added.map((a) => a.url)], changed: removed.length > 0 || added.length > 0 };
}

// Adds the photo fields to a FormData.
export const appendPhotos = (fd, picker) => { picker.added.forEach((a) => fd.append('images', a.file)); if (picker.removed.length) fd.append('removeImages', JSON.stringify(picker.removed)); };

export default function PhotoPicker({ picker, hint }) {
  const [drag, setDrag] = useState(false);
  const { kept, added, total, max, perSave, pickMany, dropKept, dropAdded } = picker;
  const canAdd = total < max; const busy = picker.busy;
  return (
    <div>
      <span className="label">Photos <span className="font-normal text-slate-500">(JPG, PNG or WebP) · {total}/{max}</span></span>
      {total > 0 && (
        <div className="mb-2 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
          {[...kept.map((k) => ({ ...k, old: true })), ...added].map((p, i) => (
            <div key={p.id || p.key} className="group relative aspect-square animate-popIn overflow-hidden rounded-xl ring-1 ring-slate-200" style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}>
              <img src={p.url} alt={`Photo ${i + 1}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              {i === 0 && <span className="absolute left-1 top-1 rounded-full bg-teal-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Cover</span>}
              <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => (p.old ? dropKept(p) : dropAdded(p))} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100 focus:opacity-100"><X className="h-3.5 w-3.5" /></button>
            </div>))}
        </div>)}
      {canAdd ? (
        <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); pickMany(e.dataTransfer.files); }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-5 text-center text-sm transition-all duration-300 ${drag ? 'scale-[1.02] border-teal-500 bg-teal-500/10' : 'border-slate-300 hover:border-royal-500 hover:bg-royal-500/5 dark:border-white/20'}`}>
          <ImagePlus className={`h-8 w-8 text-royal-500 transition-transform duration-300 ${drag ? '-translate-y-1 scale-110' : ''}`} />
          <span className="font-semibold">{total ? 'Add more photos' : 'Drop photos here or click to choose'}</span>
          <span className="text-xs text-slate-500">{hint || `Select as many as you like, up to ${max} in one album`}</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { pickMany(e.target.files); e.target.value = ''; }} />
        </label>
      ) : <p className="rounded-xl bg-slate-100 p-3 text-center text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300">Album is full ({max} photos).</p>}
      {busy > 0 && <p className="mt-2 text-center text-xs font-medium text-royal-600" role="status">Preparing photos… {busy} left</p>}
    </div>
  );
}
