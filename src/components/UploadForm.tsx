'use client';

import { useState, useRef } from 'react';
import { THEMES, CATEGORIES, THEME_LABELS, CATEGORIE_LABELS } from '@/lib/constants';

type BgColor = 'transparent' | 'white' | 'cream' | 'sand' | 'sage';

export default function UploadForm({ onPublished }: { onPublished: (title: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [bgRemoved, setBgRemoved] = useState(false);
  const [bgColor, setBgColor] = useState<BgColor>('transparent');
  const [bgLoading, setBgLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFile(f: File) {
    setFile(f);
    const url = URL.createObjectURL(f);
    setOriginalUrl(url);
    setPreviewUrl(url);
    setBgRemoved(false);
    setBgColor('transparent');
  }

  async function handleRemoveBg() {
    if (!file) return;
    setBgLoading(true);
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file);
      const cleaned = new File([blob], file.name.replace(/\.\w+$/, '.png'), { type: 'image/png' });
      setFile(cleaned);
      setPreviewUrl(URL.createObjectURL(cleaned));
      setBgRemoved(true);
    } catch (e) {
      console.error(e);
      alert("Le traitement a échoué. Vous pouvez publier la photo originale.");
    } finally {
      setBgLoading(false);
    }
  }

  function restoreOriginal() {
    if (!originalUrl) return;
    fetch(originalUrl).then((r) => r.blob()).then((blob) => {
      const f = new File([blob], 'original', { type: blob.type });
      setFile(f);
      setPreviewUrl(originalUrl);
      setBgRemoved(false);
      setBgColor('transparent');
    });
  }

  function reset() {
    setFile(null);
    setPreviewUrl('');
    setOriginalUrl('');
    setBgRemoved(false);
    setBgColor('transparent');
    formRef.current?.reset();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('file', file);
      const r = await fetch('/api/oeuvres', { method: 'POST', body: fd });
      if (!r.ok) throw new Error('Upload échoué');
      const title = String(fd.get('title') || '');
      onPublished(title);
      reset();
    } catch (e) {
      alert('La publication a échoué. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  }

  const previewClasses = ['preview'];
  if (bgRemoved) previewClasses.push('bg-removed', `bg-${bgColor}`);

  const bgSwatchStyles: Record<string, string | undefined> = {
    white: '#fff',
    cream: '#FAF6F0',
    sand: '#F0E8DC',
    sage: '#E5EBDF',
  };

  return (
    <div className="upload-grid">
      {/* Colonne gauche : preview / dropzone */}
      <div>
        {!file ? (
          <label
            className={`dropzone ${drag ? 'drag' : ''}`}
            onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          >
            <div className="dropzone-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3>Glissez votre photo ici</h3>
            <p>ou cliquez pour parcourir vos fichiers</p>
            <p className="small">JPG, PNG ou HEIC · jusqu&apos;à 10 Mo</p>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        ) : (
          <div className={previewClasses.join(' ')}>
            <div className="preview-img" style={{ backgroundImage: `url(${previewUrl})` }} />
            <button className="preview-replace" type="button" onClick={reset}>Remplacer</button>
            {bgLoading && <div className="preview-loading show"><div className="big-spinner" /><div>Suppression du fond…</div></div>}
          </div>
        )}
      </div>

      {/* Colonne droite : formulaire + outils */}
      <form className="form-card" ref={formRef} onSubmit={handleSubmit}>
        <div className="field">
          <label>Titre de l&apos;œuvre <span className="req">*</span></label>
          <input className="input" type="text" name="title" placeholder="ex: Assiette aux pivoines" required />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Thème <span className="req">*</span></label>
            <select className="select" name="theme" required defaultValue="">
              <option value="" disabled>Choisir un thème…</option>
              {THEMES.map((t) => <option key={t} value={t}>{THEME_LABELS[t]}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Catégorie <span className="req">*</span></label>
            <select className="select" name="categorie" required defaultValue="">
              <option value="" disabled>Choisir une catégorie…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORIE_LABELS[c]}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label>Description <span className="field-hint">(optionnelle)</span></label>
          <textarea className="textarea" name="description" placeholder="Quelques mots sur la pièce…" />
        </div>

        {/* Outils image — visible uniquement quand une image est sélectionnée */}
        {file && (
          <div className="tools-panel show">
            <div className="tools-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>
              Outils image
            </div>
            <button type="button" className={`btn-magic ${bgLoading ? 'loading' : ''}`} disabled={bgLoading} onClick={handleRemoveBg}>
              <svg className="magic-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" /></svg>
              <div className="spinner" />
              <span>{bgLoading ? 'Traitement en cours…' : (bgRemoved ? 'Re-traiter la photo' : "Supprimer l'arrière-plan")}</span>
            </button>
            {bgRemoved && (
              <>
                <div className="bg-options show">
                  <span className="bg-options-label">Nouveau fond&nbsp;:</span>
                  {(['transparent', 'white', 'cream', 'sand', 'sage'] as BgColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`bg-swatch ${bgColor === c ? 'active' : ''}`}
                      data-bg={c}
                      style={bgSwatchStyles[c] ? { background: bgSwatchStyles[c] } : undefined}
                      onClick={() => setBgColor(c)}
                      aria-label={c}
                    />
                  ))}
                </div>
                <div className="tools-actions show">
                  <span className="tools-status">Arrière-plan supprimé</span>
                  <button type="button" className="btn-link" onClick={restoreOriginal}>↶ Restaurer l&apos;image originale</button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={reset} disabled={submitting}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={!file || submitting}>
            {submitting ? 'Publication…' : "Publier l'œuvre"}
            {!submitting && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>}
          </button>
        </div>
      </form>
    </div>
  );
}
