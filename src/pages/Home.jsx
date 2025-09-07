// src/pages/Home.jsx
// =====================================================================================
// PAGE D’ACCUEIL
// - Section HERO avec thème par défaut (Rocket)
// - Image de fond + gradient sombre (lisibilité du texte)
// - Titre + sous-titre dynamiques (selon le thème)
// - Boutons CTA (Signup / Login) ou Se déconnecter si connecté
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

// 🔁 Ajout de 2 props :
// - userToken → savoir si l’utilisateur est connecté ou non
// - onLogout  → fonction à appeler pour se déconnecter (supprime le token)
const Home = ({ theme = DEFAULT_THEME, userToken, onLogout }) => {
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

          {/* CTA (Call To Action) → zone des boutons principaux */}
          <div className="cta-row">
            {userToken ? (
              // ✅ Cas 1 : si userToken existe → l’utilisateur est connecté
              // Donc on lui montre :
              // - un bouton "Se déconnecter" (qui appelle onLogout quand on clique)
              // - un raccourci direct vers la page "Personnages"
              <>
                <button
                  type="button"
                  className="btn btn-gradient"
                  onClick={onLogout} // 🔴 quand on clique → déconnexion
                >
                  {" "}
                  Se déconnecter
                </button>
                <Link to="/characters" className="btn btn-outline">
                  {" "}
                  Voir les personnages
                </Link>
              </>
            ) : (
              // ❌ Cas 2 : si userToken n’existe pas → utilisateur non connecté
              // Donc on lui propose seulement de s’inscrire ou de se connecter
              <>
                <Link to="/signup" className="btn btn-gradient">
                  Signup
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
