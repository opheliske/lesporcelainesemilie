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
        </div>
      </div>
    </nav>
  );
}
