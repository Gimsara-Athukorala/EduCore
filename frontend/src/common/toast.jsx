import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

function Toast({ message, isOpen, onClose, duration = 2200 }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[1000] animate-[toastIn_0.25s_ease-out]">
      <div className="flex items-center gap-3 min-w-[280px] max-w-[420px] rounded-xl border border-blue-200 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-4 py-3 text-white shadow-lg">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-100" />
        <p className="text-sm font-medium">{message}</p>
        <button
          type="button"
          aria-label="Close toast"
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-blue-100 hover:bg-white/20 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style>
        {'@keyframes toastIn { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }'}
      </style>
    </div>
  );
}

export default Toast;