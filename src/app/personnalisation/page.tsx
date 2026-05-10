import Nav from '@/components/Nav';
import ContactFooter from '@/components/ContactFooter';

export default function PersonnalisationPage() {
  return (
    <>
      <Nav active="personnalisation" />
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Accueil</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            <span>Personnalisation</span>
          </div>
          <h1>Une pièce à <em>votre image</em></h1>
          <p>Naissance, mariage, anniversaire… je crée des porcelaines uniques sur commande.</p>
        </div>
      </header>

      <section className="section">
        <div className="container intro">
          <div className="intro-img">
            <img
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fit,w_800,h_1000,q_auto,f_auto/oeuvres-emilie/enfants_assiettes/tabluever7khcjo9evut.jpg`}
              alt="Assiette cochon Louis"
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
            />
          </div>
          <div>
            <span className="section-eyebrow">Sur commande</span>
            <h2>Chaque pièce<br /><em>raconte une histoire</em>.</h2>
            <p>Un cadeau de naissance avec le prénom de l&apos;enfant. Un service de mariage gravé d&apos;une date. Une collection de tasses pour toute une famille. Chaque commande est un dialogue, un moment partagé autour d&apos;une idée à donner vie.</p>
            <p>Vous me racontez ce que vous avez en tête — motifs, couleurs, mots, formes — et je vous propose une esquisse avant de me lancer à l&apos;atelier.</p>
          </div>
        </div>
      </section>

      <section className="section section-bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Comment ça marche</span>
            <h2 className="section-title">Trois <em>étapes</em>, simplement</h2>
            <p className="section-subtitle">De l&apos;idée à la pièce posée sur votre table.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="step-num">1</div><h3>On échange</h3><p>Vous me racontez votre projet par email. Pour qui, pour quelle occasion, quels motifs et couleurs vous parlent.</p></div>
            <div className="step"><div className="step-num">2</div><h3>Je dessine</h3><p>Je vous envoie une esquisse et un devis. Vous me dites ce qui vous plaît, jusqu&apos;au bon résultat.</p></div>
            <div className="step"><div className="step-num">3</div><h3>Je peins, vous recevez</h3><p>Comptez 3 à 5 semaines selon la pièce. J&apos;emballe avec soin et je vous envoie la pièce finie.</p></div>
          </div>
        </div>
      </section>

      <ContactFooter />
    </>
  );
}
