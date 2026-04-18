import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

function Toast({ message, isOpen, onClose, duration = 2200, variant = 'success' }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  const isError = variant === 'error';
  const containerClass = isError
    ? 'border-red-200 bg-gradient-to-r from-[#B91C1C] to-[#EF4444]'
    : 'border-blue-200 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]';
  const iconClass = isError ? 'text-red-100' : 'text-blue-100';

  return (
    <div className="fixed top-4 right-4 z-[1000] animate-[toastIn_0.25s_ease-out]">
      <div className={`flex items-center gap-3 min-w-[280px] max-w-[420px] rounded-xl border px-4 py-3 text-white shadow-lg ${containerClass}`}>
        {isError ? (
          <AlertCircle className={`h-5 w-5 shrink-0 ${iconClass}`} />
        ) : (
          <CheckCircle2 className={`h-5 w-5 shrink-0 ${iconClass}`} />
        )}
        <p className="text-sm font-medium">{message}</p>
        <button
          type="button"
          aria-label="Close toast"
          onClick={onClose}
          className={`ml-auto rounded-md p-1 hover:bg-white/20 transition ${iconClass}`}
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

Toast.propTypes = {
  message: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  duration: PropTypes.number,
  variant: PropTypes.oneOf(['success', 'error']),
};

export default Toast;