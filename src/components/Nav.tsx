import Link from 'next/link';

type Active = 'home' | 'galerie' | 'personnalisation';

export default function Nav({ active }: { active?: Active }) {
  const cls = (a: Active) => (active === a ? 'active' : '');
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="logo">Les Porcelaines d&apos;<span>Émilie</span></Link>
        <div className="nav-links">
          <Link href="/" className={cls('home')}>Accueil</Link>
          <Link href="/galerie" className={cls('galerie')}>Galerie</Link>
          <Link href="/personnalisation" className={cls('personnalisation')}>Personnalisation</Link>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          <a href="#contact" className="nav-cta">Me contacter</a>
          <Link href="/admin" className="nav-login" title="Espace Émilie">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}
