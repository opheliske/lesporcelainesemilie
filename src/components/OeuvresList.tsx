'use client';

import { useEffect, useState } from 'react';
import type { Oeuvre } from '@/types/oeuvre';
import { THEME_LABELS, CATEGORIE_LABELS } from '@/lib/constants';
import EditModal from './EditModal';

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function OeuvresList({
  onCountChange,
  onDeleted,
  onEdited,
}: {
  onCountChange: (n: number) => void;
  onDeleted: (title: string) => void;
  onEdited: (title: string) => void;
}) {
  const [items, setItems] = useState<Oeuvre[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Oeuvre | null>(null);

  useEffect(() => {
    fetch('/api/oeuvres')
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        onCountChange(data.length);
        setLoading(false);
      });
  }, [onCountChange]);

  const nq = norm(q);
  const visible = items.filter((o) => !nq || norm(o.title).includes(nq));

  async function handleDelete(o: Oeuvre) {
    if (!confirm(`Supprimer « ${o.title} » ?`)) return;
    const r = await fetch(`/api/oeuvres/${encodeURIComponent(o.publicId)}`, { method: 'DELETE' });
    if (r.ok) {
      const next = items.filter((it) => it.publicId !== o.publicId);
      setItems(next);
      onCountChange(next.length);
      onDeleted(o.title);
    }
  }

  function handleSaved(updated: Oeuvre) {
    const next = items.map((it) => (it.publicId === updated.publicId ? updated : it));
    setItems(next);
    setEditing(null);
    onEdited(updated.title);
  }

  return (
    <>
      <div className="list-toolbar">
        <div className="list-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input type="search" placeholder="Rechercher une œuvre…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <span className="user-name">{items.length} œuvre{items.length > 1 ? 's' : ''} au total</span>
      </div>
      <div className="oeuvre-list">
        {loading ? (
          <div>Chargement…</div>
        ) : (
          visible.map((o) => (
            <article className="oeuvre-item" key={o.publicId}>
              <div className="oeuvre-thumb">
                <img src={o.thumb} alt={o.title} />
                <div className="oeuvre-actions">
                  <button className="icon-btn edit" title="Modifier" onClick={() => setEditing(o)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="icon-btn delete" title="Supprimer" onClick={() => handleDelete(o)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" /></svg>
                  </button>
                </div>
              </div>
              <div className="info">
                <h4>{o.title}</h4>
                <div className="tags">
                  <span className="tag theme">{THEME_LABELS[o.theme]}</span>
                  <span className="tag cat">{CATEGORIE_LABELS[o.categorie]}</span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {editing && (
        <EditModal
          oeuvre={editing}
          onSave={handleSaved}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
