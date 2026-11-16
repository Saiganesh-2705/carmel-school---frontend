import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, Trash2 } from 'lucide-react';
import api, { errMsg } from '../services/api';
import Spinner from '../components/Spinner';
import { fmtDate } from '../components/NoticeCard';

const TABS = [['', 'All'], ['new', 'New'], ['read', 'Read'], ['replied', 'Replied']];
const BADGE = { new: 'bg-sun-400/25 text-amber-700', read: 'bg-slate-200 text-slate-600', replied: 'bg-teal-500/15 text-teal-600' };

export default function Messages() {
  const [rows, setRows] = useState([]); const [status, setStatus] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/contact', { params: { status: status || undefined, limit: 50 } }); setRows(data.data); } catch (e) { toast.error(errMsg(e)); } finally { setLoading(false); }
  }, [status]);
  useEffect(() => { load(); }, [load]);
  const mark = async (m, s) => { try { await api.patch(`/contact/${m._id}/status`, { status: s }); load(); } catch (e) { toast.error(errMsg(e)); } };
  const remove = async (m) => { if (!confirm(`Delete the message from ${m.name}?`)) return; try { await api.delete(`/contact/${m._id}`); toast.success('Message deleted'); load(); } catch (e) { toast.error(errMsg(e)); } };
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center gap-3"><h1 className="mr-auto text-2xl font-bold">Enquiries</h1>
        <div className="flex gap-1" role="tablist" aria-label="Filter by status">{TABS.map(([v, l]) => <button key={l} role="tab" aria-selected={status === v} className={`btn ${status === v ? 'bg-royal-500 text-white' : 'btn-ghost'}`} onClick={() => setStatus(v)}>{l}</button>)}</div>
      </div>
      {loading ? <Spinner /> : rows.length === 0 ? <p className="card text-center text-sm text-slate-500">No messages here. Enquiries from the Contact page appear in this list.</p> : (
        <div className="space-y-3">{rows.map((m) => (
          <article key={m._id} className="card">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">{m.name}</h2><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BADGE[m.status]}`}>{m.status}</span>
              <span className="rounded-full bg-royal-500/10 px-2 py-0.5 text-xs capitalize text-royal-600">{m.subject}</span>
              <span className="ml-auto text-xs text-slate-500">{fmtDate(m.createdAt)}</span>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {m.email && <a className="btn-ghost" href={`mailto:${m.email}?subject=Re: your enquiry to Carmel International School`}><Mail className="h-4 w-4" />{m.email}</a>}
              {m.phone && <a className="btn-ghost" href={`tel:${m.phone}`}><Phone className="h-4 w-4" />{m.phone}</a>}
              <span className="flex-1" />
              {m.status !== 'read' && <button className="btn-ghost" onClick={() => mark(m, 'read')}>Mark read</button>}
              {m.status !== 'replied' && <button className="btn-ghost" onClick={() => mark(m, 'replied')}>Mark replied</button>}
              <button className="btn-ghost text-red-600" aria-label={`Delete message from ${m.name}`} onClick={() => remove(m)}><Trash2 className="h-4 w-4" /></button>
            </div>
          </article>))}
        </div>)}
    </div>
  );
}
