'use client';

import { useState } from 'react';
import Link from 'next/link';
import UploadForm from './UploadForm';
import OeuvresList from './OeuvresList';
import Toast from './Toast';

export default function AdminApp({ initiallyLoggedIn }: { initiallyLoggedIn: boolean }) {
  const [loggedIn, setLoggedIn] = useState(initiallyLoggedIn);
  const [tab, setTab] = useState<'add' | 'list'>('add');
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState('');

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const password = fd.get('password');
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setError(data.error || 'Mot de passe incorrect');
      return;
    }
    setLoggedIn(true);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="logo">Les Porcelaines d&apos;<span>Émilie</span></div>
          <h1>Espace <em>Émilie</em></h1>
          <p className="subtitle">Connectez-vous pour ajouter de nouvelles œuvres au site.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <input type="password" name="password" className="input" placeholder="Mot de passe" autoFocus required />
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Se connecter →</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <Link href="/" className="topbar-logo">Les Porcelaines d&apos;<span>Émilie</span></Link>
          <div className="topbar-divider" />
          <div className="topbar-title">Espace privé</div>
        </div>
        <div className="topbar-right">
          <span className="user-name">Bonjour Émilie</span>
          <button className="btn-text" onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>
      <main className="main">
        <div className="admin-header">
          <h1>Mes <em>œuvres</em></h1>
          <p>Ajoutez de nouvelles photos, classez-les par thème et catégorie. Tout est mis en ligne immédiatement.</p>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>Ajouter une œuvre</button>
          <button className={`tab ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
            Toutes mes œuvres <span className="tab-badge">{count}</span>
          </button>
        </div>
        {tab === 'add' ? (
          <UploadForm onPublished={(t) => { setToast(`Œuvre « ${t} » publiée`); setTab('list'); }} />
        ) : (
          <OeuvresList onCountChange={setCount} onDeleted={(t) => setToast(`« ${t} » supprimée`)} onEdited={(t) => setToast(`« ${t} » modifiée`)} />
        )}
      </main>
      <Toast message={toast} onClear={() => setToast('')} />
    </>
  );
}
