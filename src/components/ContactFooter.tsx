export default function ContactFooter() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <span className="section-eyebrow">Prendre contact</span>
        <h2>Parlons de <em>votre pièce</em>.</h2>
        <p>N&apos;hésitez pas à m&apos;écrire pour toute question, commande ou simplement échanger autour de la porcelaine peinte.</p>
        <a href="mailto:emilie.carbonaro@gmail.com" className="contact-email">emilie.carbonaro@gmail.com</a>
        <div className="footer-bottom">Les Porcelaines d&apos;Émilie © {new Date().getFullYear()} — Fait avec soin</div>
      </div>
    </section>
  );
}
