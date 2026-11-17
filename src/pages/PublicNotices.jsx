import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import NoticeCard from '../components/NoticeCard';
import Spinner from '../components/Spinner';
import { CategoryChips } from './Notices';
import api from '../services/api';

export default function PublicNotices() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [failed, setFailed] = useState(false); const [cat, setCat] = useState('all');
  useEffect(() => { api.get('/notices/public').then((r) => setRows(r.data.data)).catch(() => setFailed(true)).finally(() => setLoading(false)); }, []);
  const shown = useMemo(() => (cat === 'all' ? rows : rows.filter((r) => (r.category || 'general') === cat)), [rows, cat]);
  return (
    <>
      <PageHero eyebrow="From the school office" title="Notices" text="Admissions, holidays, events and stories from our school." image="annual-day-guests.jpg" />
      <div className="mx-auto max-w-5xl px-4 py-14">
        {loading ? <Spinner /> : failed ? <p className="card text-center text-sm">Notices could not be loaded right now. Please try again shortly.</p>
          : rows.length === 0 ? <p className="card text-center text-sm">There are no notices at the moment.</p> : (<>
            <CategoryChips rows={rows} value={cat} onChange={setCat} />
            <div key={cat} className="grid items-start gap-6 md:grid-cols-2">
              {shown.map((n, i) => (
                <div key={n._id} className={`animate-wordIn ${i === 0 && shown.length > 1 ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 80}ms` }}>
                  <NoticeCard n={{ ...n, audience: undefined }} featured={i === 0 && shown.length > 1} />
                </div>))}
            </div></>)}
        <p className="pt-8 text-center text-sm text-slate-500">School staff can sign in at <Link className="text-royal-500 hover:underline" to="/login">the admin page</Link>.</p>
      </div>
    </>
  );
}
