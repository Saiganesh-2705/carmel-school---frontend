import { Loader2 } from 'lucide-react';
export default function Spinner({ full }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'min-h-screen' : 'py-12'}`} role="status" aria-label="Loading">
      <Loader2 className="h-6 w-6 animate-spin text-royal-500" />
    </div>
  );
}
