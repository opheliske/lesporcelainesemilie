import Nav from '@/components/Nav';
import ContactFooter from '@/components/ContactFooter';
import Gallery from '@/components/Gallery';
import { getAllOeuvres } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export default async function GaleriePage() {
  const oeuvres = await getAllOeuvres();

  return (
    <>
      <Nav active="galerie" />
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Accueil</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            <span>Galerie</span>
          </div>
          <h1>La <em>galerie</em></h1>
          <p>Toutes les pièces sorties de l&apos;atelier. Cherchez par titre ou affinez avec les filtres.</p>
        </div>
      </header>
      <Gallery oeuvres={oeuvres} />
      <ContactFooter />
    </>
  );
}
