// src/pages/Home.jsx
// =====================================================================================
// PAGE D’ACCUEIL
// - Section HERO avec thème par défaut (Rocket)
// - Image de fond + gradient sombre (lisibilité du texte)
// - Titre + sous-titre dynamiques (selon le thème)
// - Boutons CTA (Signup / Login)
// - Indicateur de scroll (visuel Rocket en bas de l’écran)
// =====================================================================================

import { Link } from "react-router-dom";
import "./Home.css";

// 🎨 Thème par défaut → utilisé si aucun thème n’est fourni en props
const DEFAULT_THEME = {
  name: "Rocket", // Nom affiché (utile dans aria-label)
  heroImage: "/rocket.jpg", // Image de fond (placée dans /public)
  title: "Welcome to your Marvelous World", // Titre principal
  description:
    "Ajoute tes personnages et comics préférés en favoris et construis ton propre univers Marvel.", // Texte descriptif
  titleGlow: "0 0 24px rgba(20, 209, 255, .55)", // Effet lumineux sur le titre
};

const Home = ({ theme = DEFAULT_THEME }) => {
  return (
    <main className="home">
      {/* ------------------------------------------------------------------
          HERO (bannière principale)
          - backgroundImage combine : un dégradé sombre + l’image du thème
          - aria-label : description utile pour accessibilité
          ------------------------------------------------------------------ */}
      <section
        className="hero"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(10,14,24,.85) 0%,
              rgba(10,14,24,.55) 35%,
              rgba(10,14,24,.15) 65%,
              rgba(10,14,24,0) 100%
            ),
            url("${theme.heroImage}")
          `,
        }}
        aria-label={`${theme.name} featured`}
      >
        <div className="hero-content">
          {/* 🏷️ Titre principal (effet lumineux appliqué via theme.titleGlow) */}
          <h1 className="hero-title" style={{ textShadow: theme.titleGlow }}>
            {theme.title}
          </h1>

          {/* 📝 Sous-titre / description */}
          <p className="hero-subtitle">{theme.description}</p>

          {/* CTA (Call To Action) → liens de navigation */}
          <div className="cta-row">
            <Link to="/signup" className="btn btn-gradient">
              Signup
            </Link>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            Indicateur de scroll (Rocket)
            - Petit effet visuel en bas de la section
            - Invite l’utilisateur à descendre
           ------------------------------------------------------------------ */}
        <div className="scroll-indicator rocket">
          <div className="scroll-core" />
          <div className="claws">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
