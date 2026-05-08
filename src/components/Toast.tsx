'use client';

import { useEffect } from 'react';

export default function Toast({ message, onClear }: { message: string; onClear: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClear, 3000);
    return () => clearTimeout(t);
  }, [message, onClear]);

  return (
    <div className={`toast ${message ? 'show' : ''}`}>
      <span className="toast-icon">✓</span>
      <span>{message || ''}</span>
    </div>
  );
}
