'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Oeuvre } from '@/types/oeuvre';
import { THEMES, CATEGORIES, THEME_LABELS, CATEGORIE_LABELS } from '@/lib/constants';
import Lightbox from './Lightbox';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Gallery({ oeuvres }: { oeuvres: Oeuvre[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [theme, setTheme] = useState(sp.get('theme') || '');
  const [categorie, setCategorie] = useState(sp.get('categorie') || '');
  const [q, setQ] = useState(sp.get('q') || '');
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (theme) params.set('theme', theme);
    if (categorie) params.set('categorie', categorie);
    if (q.trim()) params.set('q', q.trim());
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  }, [theme, categorie, q, router]);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    return oeuvres.filter((o) =>
      (!theme || o.theme === theme) &&
      (!categorie || o.categorie === categorie) &&
      (!nq || norm(o.title).includes(nq))
    );
  }, [oeuvres, theme, categorie, q]);

  const anyFilter = theme || categorie || q.trim();
  const clearAll = () => { setTheme(''); setCategorie(''); setQ(''); };

  return (
    <section className="galerie-section">
      <div className="container">
        <div className="galerie-toolbar">
          <div className="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input type="search" className="search-input" placeholder="Rechercher une œuvre…" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className={`search-clear ${q ? 'show' : ''}`} type="button" onClick={() => setQ('')} aria-label="Effacer">×</button>
          </div>
          <div className="filter-row">
            <span className="filter-label">Thèmes</span>
            <div className="filter-chips">
              <button className={`chip ${!theme ? 'active' : ''}`} onClick={() => setTheme('')}>Tous</button>
              {THEMES.map((t) => (
                <button key={t} className={`chip ${theme === t ? 'active' : ''}`} onClick={() => setTheme(t)}>{THEME_LABELS[t]}</button>
              ))}
            </div>
          </div>
          <div className="filter-row">
            <span className="filter-label">Catégories</span>
            <div className="filter-chips">
              <button className={`chip ${!categorie ? 'active' : ''}`} onClick={() => setCategorie('')}>Toutes</button>
              {CATEGORIES.map((c) => (
                <button key={c} className={`chip ${categorie === c ? 'active' : ''}`} onClick={() => setCategorie(c)}>{CATEGORIE_LABELS[c]}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="galerie-meta">
          <div className="results-count"><strong>{filtered.length}</strong> œuvre{filtered.length > 1 ? 's' : ''}</div>
          {anyFilter ? <button className="clear-all" onClick={clearAll}>Effacer tous les filtres</button> : null}
        </div>
        <div className="galerie-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <h3>Aucune œuvre ne correspond</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
          ) : (
            filtered.map((o, i) => (
              <article className="oeuvre" key={o.publicId} onClick={() => setLbIndex(i)}>
                <img src={o.thumb} alt={o.title} loading="lazy" />
                <div className="oeuvre-info">
                  <h4>{o.title}</h4>
                  <div className="oeuvre-tags">{THEME_LABELS[o.theme]} · {CATEGORIE_LABELS[o.categorie]}</div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {lbIndex !== null && (
        <Lightbox
          oeuvres={filtered}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onChange={setLbIndex}
        />
      )}
    </section>
  );
}
