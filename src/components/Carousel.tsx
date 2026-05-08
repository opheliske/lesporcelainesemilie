'use client';

import { useEffect, useRef, useState } from 'react';
import type { Oeuvre } from '@/types/oeuvre';
import { THEME_LABELS, CATEGORIE_LABELS } from '@/lib/constants';
import Lightbox from './Lightbox';

export default function Carousel({ oeuvres }: { oeuvres: Oeuvre[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const pct = max > 0 ? Math.min(100, (el.scrollLeft / max) * 100) : 100;
      setProgress(pct);
      setAtStart(el.scrollLeft <= 2);
      setAtEnd(el.scrollLeft >= max - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scroll = (dir: -1 | 1) => {
    const el = wrapRef.current;
    if (!el) return;
    const card = el.querySelector('.featured-card');
    if (!card) return;
    const w = card.getBoundingClientRect().width + 20;
    el.scrollBy({ left: dir * w * 2, behavior: 'smooth' });
  };

  return (
    <div className="carousel">
      <div className="carousel-track-wrap" ref={wrapRef}>
        <div className="carousel-track">
          {oeuvres.map((o, i) => (
            <div className="featured-card" key={o.publicId} onClick={() => setLbIndex(i)}>
              <img src={o.thumb} alt={o.title} loading="lazy" />
              <div className="featured-meta">
                <span>{THEME_LABELS[o.theme]} · {CATEGORIE_LABELS[o.categorie]}</span>
                <h4>{o.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-controls">
        <div className="carousel-progress">
          <div className="carousel-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="carousel-buttons">
          <button className="carousel-btn" disabled={atStart} onClick={() => scroll(-1)} aria-label="Précédent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button className="carousel-btn" disabled={atEnd} onClick={() => scroll(1)} aria-label="Suivant">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>

      {lbIndex !== null && (
        <Lightbox
          oeuvres={oeuvres}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onChange={setLbIndex}
        />
      )}
    </div>
  );
}
