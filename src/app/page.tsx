import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactFooter from '@/components/ContactFooter';

export const dynamic = 'force-dynamic';
import Carousel from '@/components/Carousel';
import { getPinnedOeuvres } from '@/lib/cloudinary';

export default async function HomePage() {
  const recent = await getPinnedOeuvres();

  return (
    <>
      <Nav active="home" />

      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">Porcelaines peintes à la main</div>
            <h1>L&apos;art de la table,<br /><em>fait main</em>.</h1>
            <p>Chaque pièce est unique, peinte avec patience et tendresse dans mon atelier. Découvrez une collection de porcelaines pensées pour égayer votre quotidien.</p>
            <div className="hero-buttons">
              <Link href="/galerie" className="btn btn-primary">Découvrir les œuvres →</Link>
              <Link href="/personnalisation" className="btn btn-ghost">Personnalisation</Link>
            </div>
          </div>
          <div className="hero-art">
            {recent[0] && <div className="hero-tile hero-tile-1"><img src={recent[0].thumb} alt="" /></div>}
            {recent[1] && <div className="hero-tile hero-tile-2"><img src={recent[1].thumb} alt="" /></div>}
            {recent[2] && <div className="hero-tile hero-tile-3"><img src={recent[2].thumb} alt="" /></div>}
          </div>
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Collection</span>
            <h2 className="section-title">Pièces <em>à la une</em></h2>
            <p className="section-subtitle">Une sélection des dernières créations sorties de l&apos;atelier.</p>
          </div>
          <Carousel oeuvres={recent} />
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/galerie" className="btn btn-primary">Accéder à la galerie →</Link>
          </div>
        </div>
      </section>

      <ContactFooter />
    </>
  );
}
