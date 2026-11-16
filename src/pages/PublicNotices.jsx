import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import NoticeCard from '../components/NoticeCard';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function PublicNotices() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [failed, setFailed] = useState(false);
  useEffect(() => { api.get('/notices/public').then((r) => setRows(r.data.data)).catch(() => setFailed(true)).finally(() => setLoading(false)); }, []);
  return (
    <>
      <PageHero eyebrow="From the school office" title="Notices" text="Admissions, holidays, meetings and everything parents should know." image="annual-day-guests.jpg" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
        {loading ? <Spinner /> : failed ? <p className="card text-center text-sm">Notices could not be loaded right now. Please try again shortly.</p>
          : rows.length === 0 ? <p className="card text-center text-sm">There are no notices at the moment.</p>
            : rows.map((n, i) => <Reveal key={n._id} delay={i * 60}><NoticeCard n={{ ...n, audience: undefined }} /></Reveal>)}
        <p className="pt-4 text-center text-sm text-slate-500">Parents and staff can see more inside the <Link className="text-royal-500 hover:underline" to="/login">school portal</Link>.</p>
      </div>
    </>
  );
}
