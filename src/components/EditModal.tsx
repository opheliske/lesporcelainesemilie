'use client';

import { useEffect, useRef, useState } from 'react';
import type { Oeuvre, Theme, Categorie } from '@/types/oeuvre';
import { THEMES, CATEGORIES, THEME_LABELS, CATEGORIE_LABELS } from '@/lib/constants';

interface Props {
  oeuvre: Oeuvre;
  onSave: (updated: Oeuvre) => void;
  onClose: () => void;
}

export default function EditModal({ oeuvre, onSave, onClose }: Props) {
  const [title, setTitle] = useState(oeuvre.title);
  const [description, setDescription] = useState(oeuvre.description);
  const [theme, setTheme] = useState<Theme>(oeuvre.theme);
  const [categorie, setCategorie] = useState<Categorie>(oeuvre.categorie);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function handleFile(f: File) {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('theme', theme);
    fd.append('categorie', categorie);
    if (file) fd.append('file', file);

    const r = await fetch(`/api/oeuvres/${encodeURIComponent(oeuvre.publicId)}`, {
      method: 'PATCH',
      body: fd,
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      setError(d.error || 'Erreur lors de la sauvegarde');
      setSaving(false);
      return;
    }
    onSave(await r.json());
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier l&apos;œuvre</h2>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-img-row">
            <div className="modal-preview" onClick={() => fileInputRef.current?.click()}>
              <img src={preview ?? oeuvre.thumb} alt={oeuvre.title} />
              <div className="modal-replace-hint">Remplacer l&apos;image</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.heic"
              hidden
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {file && <p className="modal-file-name">{file.name}</p>}
          </div>

          <div className="modal-fields">
            <label className="field">
              <span className="field-label">Titre</span>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label className="field">
              <span className="field-label">Description</span>
              <textarea className="input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <div className="field-row">
              <label className="field">
                <span className="field-label">Thème</span>
                <select className="input" value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                  {THEMES.map((t) => <option key={t} value={t}>{THEME_LABELS[t]}</option>)}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Catégorie</span>
                <select className="input" value={categorie} onChange={(e) => setCategorie(e.target.value as Categorie)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORIE_LABELS[c]}</option>)}
                </select>
              </label>
            </div>
            {error && <p className="edit-error">{error}</p>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Sauvegarde…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
