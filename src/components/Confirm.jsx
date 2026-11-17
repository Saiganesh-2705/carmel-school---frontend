import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle, Trash2, HelpCircle } from 'lucide-react';
import Modal from './Modal';

// A professional confirmation window that replaces the browser's plain confirm() box.
// Usage: const confirm = useConfirm(); if (!(await confirm({ title, message, confirmText, tone: 'danger' }))) return;
const Ctx = createContext(() => Promise.resolve(true));
export const useConfirm = () => useContext(Ctx);

export function ConfirmProvider({ children }) {
  const [opts, setOpts] = useState(null); const resolver = useRef(null); const answer = useRef(false);
  const confirm = useCallback((o) => new Promise((resolve) => { answer.current = false; resolver.current = resolve; setOpts(o); }), []);
  const finish = () => { resolver.current?.(answer.current); resolver.current = null; setOpts(null); };
  const tone = opts?.tone || 'danger';
  const Icon = tone === 'danger' ? Trash2 : tone === 'warn' ? AlertTriangle : HelpCircle;
  const ring = { danger: 'bg-red-100 text-red-600', warn: 'bg-amber-100 text-amber-600', info: 'bg-royal-500/15 text-royal-600' }[tone];
  const btn = { danger: 'bg-red-600 hover:bg-red-700 text-white', warn: 'bg-amber-500 hover:bg-amber-600 text-white', info: 'bg-royal-500 hover:bg-royal-600 text-white' }[tone];
  return (
    <Ctx.Provider value={confirm}>
      {children}
      {opts && (
        <Modal key={opts.title} title="" size="sm" onClose={finish}>
          {(close) => (
            <div className="pb-1 text-center">
              <span className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-full ${ring}`}>
                <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-20" /><Icon className="relative h-7 w-7 animate-popIn" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{opts.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{opts.message}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" className="btn-ghost py-2.5 ring-1 ring-slate-200 dark:ring-white/15" autoFocus onClick={close}>{opts.cancelText || 'Cancel'}</button>
                <button type="button" className={`btn py-2.5 shadow-lg ${btn}`} onClick={() => { answer.current = true; close(); }}>{opts.confirmText || 'Confirm'}</button>
              </div>
            </div>)}
        </Modal>)}
    </Ctx.Provider>
  );
}
