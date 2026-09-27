import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 transition-all transform animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-sky-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span className="text-xs leading-relaxed">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
