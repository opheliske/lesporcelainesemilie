'use client';

import { useEffect } from 'react';
import type { Oeuvre } from '@/types/oeuvre';
import { THEME_LABELS, CATEGORIE_LABELS } from '@/lib/constants';

interface Props {
  oeuvres: Oeuvre[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function Lightbox({ oeuvres, index, onClose, onChange }: Props) {
  const o = oeuvres[index];
  const hasPrev = index > 0;
  const hasNext = index < oeuvres.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onChange(index - 1);
      if (e.key === 'ArrowRight' && hasNext) onChange(index + 1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, hasPrev, hasNext, onClose, onChange]);

  if (!o) return null;

  return (
    <div className="lb-backdrop" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Fermer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <button
        className="lb-nav lb-prev"
        onClick={(e) => { e.stopPropagation(); onChange(index - 1); }}
        disabled={!hasPrev}
        aria-label="Précédent"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <div className="lb-content" onClick={(e) => e.stopPropagation()}>
        <img className="lb-img" src={o.full} alt={o.title} />
        <div className="lb-caption">
          <span className="lb-tags">{THEME_LABELS[o.theme]} · {CATEGORIE_LABELS[o.categorie]}</span>
          <h3 className="lb-title">{o.title}</h3>
          <span className="lb-counter">{index + 1} / {oeuvres.length}</span>
        </div>
      </div>

      <button
        className="lb-nav lb-next"
        onClick={(e) => { e.stopPropagation(); onChange(index + 1); }}
        disabled={!hasNext}
        aria-label="Suivant"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
  );
}
