'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ background: '#f5f2ec', color: '#0a0a0f', minHeight: '100vh' }}>
      <style>{`
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          background: #f5f2ec;
          border-bottom: 1px solid #e8e5dc;
        }
        
        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        
        .nav-link {
          text-decoration: none;
          color: #0a0a0f;
          font-size: 0.95rem;
          font-weight: 500;
        }
        
        .nav-cta {
          background: #0a0a0f;
          color: #f5f2ec;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          border: none;
          cursor: pointer;
        }
        
        .nav-cta:hover {
          background: #2a2a2f;
        }
        
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
        }
        
        .hero {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        
        .hero-badge {
          display: inline-block;
          background: #e8e5dc;
          color: #7a9e87;
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }
        
        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: 3.5rem;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          font-weight: 400;
        }
        
        .hero-title-accent {
          color: #7a9e87;
          font-style: italic;
        }
        
        .hero-desc {
          font-size: 1.1rem;
          color: #6b6760;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
        }
        
        .btn-primary {
          background: #6b6760;
          color: white;
          padding: 1rem 2rem;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-primary:hover {
          background: #5a5550;
        }
        
        .btn-secondary {
          background: transparent;
          color: #6b6760;
          padding: 1rem 2rem;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 500;
          border: none;
          cursor: pointer;
        }
        
        .btn-secondary:hover {
          color: #5a5550;
        }
        
        .demo-email {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 4rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .email-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e8e5dc;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        
        .email-from {
          font-weight: 600;
          color: #0a0a0f;
        }
        
        .email-time {
          color: #9b9590;
          font-size: 0.85rem;
        }
        
        .email-subject {
          font-weight: 600;
          margin-bottom: 1rem;
          color: #0a0a0f;
        }
        
        .email-body {
          color: #6b6760;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .email-response {
          background: #f5f2ec;
          border-left: 3px solid #7a9e87;
          padding: 1rem;
          border-radius: 6px;
          color: #6b6760;
          font-style: italic;
        }
        
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #0a0a0f;
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: #9b9590;
          margin-top: 0.5rem;
        }
        
        .section {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .section-desc {
          text-align: center;
          color: #6b6760;
          max-width: 600px;
          margin: 0 auto 3rem;
          font-size: 1.05rem;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s;
        }
        
        .feature-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          transform: translateY(-4px);
        }
        
        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .feature-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #0a0a0f;
        }
        
        .feature-desc {
          color: #6b6760;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .dark-section {
          background: #0a0a0f;
          color: #f5f2ec;
          margin: 0;
          padding: 4rem 2rem;
        }
        
        .dark-section .section-desc {
          color: #b8d4c0;
        }
        
        .dark-feature-card {
          background: rgba(122, 158, 135, 0.1);
          border: 1px solid rgba(122, 158, 135, 0.2);
          padding: 2rem;
          border-radius: 12px;
        }
        
        .dark-feature-title {
          color: #f5f2ec;
        }
        
        .dark-feature-desc {
          color: #b8d4c0;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .pricing-card {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          border: 1px solid #e8e5dc;
          text-align: center;
        }
        
        .pricing-card.featured {
          border: 2px solid #7a9e87;
          transform: scale(1.05);
        }
        
        .price {
          font-family: 'Instrument Serif', serif;
          font-size: 2.5rem;
          margin: 1rem 0;
          color: #0a0a0f;
        }
        
        .price-period {
          color: #6b6760;
          font-size: 0.9rem;
        }
        
        .price-features {
          list-style: none;
          margin: 2rem 0;
          text-align: left;
        }
        
        .price-features li {
          padding: 0.5rem 0;
          color: #6b6760;
          border-bottom: 1px solid #f0ede7;
        }
        
        .price-features li:before {
          content: '✓ ';
          color: #7a9e87;
          font-weight: 600;
          margin-right: 0.5rem;
        }
        
        .price-cta {
          background: #6b6760;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          width: 100%;
          font-weight: 500;
          margin-top: 1.5rem;
          transition: all 0.3s;
        }
        
        .price-cta:hover {
          background: #5a5550;
        }
        
        .how-it-works {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .step {
          text-align: center;
        }
        
        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: #7a9e87;
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .step-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #0a0a0f;
        }
        
        .step-desc {
          color: #6b6760;
          font-size: 0.95rem;
        }
        
        .cta-section {
          text-align: center;
          padding: 3rem 2rem;
          background: white;
          border-radius: 12px;
          margin: 2rem auto;
          max-width: 600px;
        }
        
        .footer {
          background: #0a0a0f;
          color: #9b9590;
          padding: 2rem;
          text-align: center;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .menu-toggle {
            display: block;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .section {
            padding: 2rem 1.5rem;
          }
          
          .pricing-card.featured {
            transform: scale(1);
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-logo">Thea</div>
        <div className="nav-links">
          <a href="#funksjoner" className="nav-link">Funksjoner</a>
          <a href="#priser" className="nav-link">Priser</a>
          <a href="#kontakt" className="nav-link">Kontakt</a>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button className="nav-cta">Kom i gang →</button>
          </Link>
        </div>
        <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">🤖 AI-DREVET KUNDESERVICE</div>
        <h1 className="hero-title">
          Din bedrift svarer<br/>
          <span className="hero-title-accent">alltid i tide</span>
        </h1>
        <p className="hero-desc">
          Thea er en AI-agent som kobler seg til bedriftens e-post og håndterer kundehenvendelser automatisk — på ditt merkevarens stemme.
        </p>
        
        <div className="hero-cta">
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">Start gratis i dag →</button>
          </Link>
          <button className="btn-secondary">Se demo</button>
        </div>

        {/* Demo Email */}
        <div className="demo-email">
          <div className="email-header">
            <div>
              <div className="email-from">Kari Larsen</div>
              <div className="email-subject">Spørsmål om garantien</div>
            </div>
            <div className="email-time">i dag 10:23</div>
          </div>
          <div className="email-body">
            Hei, jeg har kjøpt ett produkt fra dere og jeg lurer på om det er mulig å bytte det hvis jeg ikke er fornøyd?
          </div>
          <div className="email-response">
            ✓ Thea svarte: "Hei Kari! Ja, vi har 30 dagers returrett. Du kan returnere produktet kostnadsfritt innen 30 dager. Send oss meldingen når du er klar, og vi ordner resten. Hilsen [Bedrift]"
          </div>
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">94%</div>
            <div className="stat-label">Automatisk løst</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">&lt;2 min</div>
            <div className="stat-label">Responstid</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Alltid tilgjengelig</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <h2 className="section-title">Hvordan det fungerer</h2>
        <p className="section-desc">
          Fra registrering til aktiv agent på 5 minutter. Ingen teknisk kunnskap nødvendig. Thea konfigurerer seg selv basert på din eksisterende e-posthistorikk.
        </p>
        
        <div className="how-it-works">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-title">Koble til e-post</div>
            <div className="step-desc">Autentiser Gmail eller Outlook i ett klikk</div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-title">Tren agenten</div>
            <div className="step-desc">Thea lærer av dine tidligere svar automatisk</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-title">Sett og glem</div>
            <div className="step-desc">Agenten svarer på innkommende e-poster 24/7</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="dark-section">
        <div className="section">
          <h2 className="section-title">Alt du trenger for profesjonell kundeservice</h2>
          <p className="section-desc">
            Bygget spesielt for norske SMB-er som vil gi enterprise-nivå service uten å ansette flere folk.
          </p>
          
          <div className="features-grid">
            <div className="dark-feature-card">
              <div className="feature-icon">📧</div>
              <div className="dark-feature-title">Gmail & Outlook</div>
              <div className="dark-feature-desc">Kobler seg direkte til dine e-postkontoer via OAuth</div>
            </div>
            <div className="dark-feature-card">
              <div className="feature-icon">🎯</div>
              <div className="dark-feature-title">Kontekstbasert svar</div>
              <div className="dark-feature-desc">Thea forstår ditt oppsett og skriver relevante svar</div>
            </div>
            <div className="dark-feature-card">
              <div className="feature-icon">🛑</div>
              <div className="dark-feature-title">Human overtakelse</div>
              <div className="dark-feature-desc">Eskalerer komplekse spørsmål til deg direkte</div>
            </div>
            <div className="dark-feature-card">
              <div className="feature-icon">📊</div>
              <div className="dark-feature-title">Analytics & Insights</div>
              <div className="dark-feature-desc">Se eksakt hva Thea gjør og hvordan den presterer</div>
            </div>
            <div className="dark-feature-card">
              <div className="feature-icon">🔐</div>
              <div className="dark-feature-title">Enterprise sikkerhet</div>
              <div className="dark-feature-desc">End-to-end kryptering og GDPR-sertifisering</div>
            </div>
            <div className="dark-feature-card">
              <div className="feature-icon">⚙️</div>
              <div className="dark-feature-title">Personalisering</div>
              <div className="dark-feature-desc">Tilpass agentens tone og stil til ditt brand</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section" id="priser">
        <h2 className="section-title">Enkle priser, ingen overraskelser</h2>
        <p className="section-desc">
          Betal månedlig, avslutt når du vil. Alle planer inkluderer fri oppsett og norsk støtte.
        </p>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Starter</h3>
            <div className="price">299 <span className="price-period">kr/mnd</span></div>
            <p style={{ color: '#6b6760', marginBottom: '1.5rem' }}>Perfekt for testing</p>
            <ul className="price-features">
              <li>Opptil 500 e-poster/mnd</li>
              <li>1 e-postkonto</li>
              <li>Grunnleggende analytics</li>
              <li>E-poststøtte</li>
            </ul>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button className="price-cta">Start gratis</button>
            </Link>
          </div>
          
          <div className="pricing-card featured">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Growth</h3>
            <div className="price">990 <span className="price-period">kr/mnd</span></div>
            <p style={{ color: '#6b6760', marginBottom: '1.5rem' }}>Mest populær</p>
            <ul className="price-features">
              <li>Opptil 5000 e-poster/mnd</li>
              <li>5 e-postkontoer</li>
              <li>Avansert analytics</li>
              <li>Slack integrasjon</li>
              <li>Prioritert support</li>
            </ul>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button className="price-cta" style={{ background: '#7a9e87' }}>Start gratis</button>
            </Link>
          </div>
          
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Enterprise</h3>
            <div className="price">2490 <span className="price-period">kr/mnd</span></div>
            <p style={{ color: '#6b6760', marginBottom: '1.5rem' }}>For større bedrifter</p>
            <ul className="price-features">
              <li>Ubegrenset e-poster</li>
              <li>Ubegrenset kontoer</li>
              <li>Custom integrasjoner</li>
              <li>API-tilgang</li>
              <li>Dedikert account manager</li>
            </ul>
            <button className="price-cta">Kontakt oss</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="cta-section">
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '2rem', marginBottom: '1rem' }}>
            Klar til å starte?
          </h2>
          <p style={{ color: '#6b6760', marginBottom: '1.5rem' }}>
            Sett opp på 5 minutter. Ingen kredittkort nødvendig for prøveperioden.
          </p>
          <Link href="/signup" style={{ textDecoration: 'none', display: 'block' }}>
            <button className="btn-primary" style={{ width: '100%' }}>
              Start 14-dagers gratis prøve →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Thea AS. Laget i Norge.</p>
      </footer>
    </div>
  );
}
