// src/components/Header.jsx
// =====================================================================================
// HEADER — Logo + Navigation + Sélecteur de thème
// -------------------------------------------------------------------------------------
// 🎯 Objectif : afficher un en-tête commun à toute l’application
// - Côté gauche : logo Marvel cliquable (retour à la Home)
// - Centre : navigation (Personnages / Comics / Favoris) visible uniquement en desktop
// - Côté droit :
//   1) un bouton "burger" (mobile seulement) qui ouvre un drawer avec la navigation
//   2) un sélecteur de thème (Rocket, Iron Man, Black Panther), toujours visible
//
// 🔑 States React utilisés :
// - drawerOpen (true/false) → savoir si le menu mobile (drawer) est ouvert
//
// ⌨️ UX bonus : possibilité de fermer le drawer en appuyant sur la touche Escape
//
// 🎨 À propos des icônes SVG :
// Les logos Rocket / Iron Man / Black Panther utilisent des <svg> avec attributs `fill`.
// 👉 C’est volontaire : ce sont des icônes multicolores fixes, donc garder le `fill`
// dans le JSX est plus simple et fidèle graphiquement que de passer par le CSS.
// =====================================================================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ themeKey, setThemeKey }) {
  // 🍔 State local : true/false → indique si le menu mobile (drawer) est ouvert
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔧 Fonction utilitaire : ferme le menu mobile
  const closeDrawer = () => setDrawerOpen(false);

  // ⌨️ Effet secondaire : ajoute un écouteur clavier
  // → si on appuie sur "Escape", setDrawerOpen(false) ferme le menu
  // → return = nettoyage de l'écouteur quand le composant est démonté
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey); // nettoyage
  }, []);

  return (
    <>
      <header className="header">
        {/* =================== LOGO =================== */}
        <div className="brand">
          {/* <Link> permet de revenir à l’accueil ET ferme le drawer si on clique */}
          <Link to="/" onClick={closeDrawer}>
            <img
              src="/marvel-logo.png"
              alt="Marvel Logo"
              className="brand-logo"
            />
          </Link>
        </div>

        {/* =================== NAVIGATION (Desktop) =================== */}
        <nav className="nav">
          {/* Chaque lien pointe vers une route React Router */}
          <Link to="/characters" className="nav-link">
            Personnages
          </Link>
          <Link to="/comics" className="nav-link">
            Comics
          </Link>
          <Link to="/favorites" className="nav-link">
            Favoris
          </Link>
        </nav>

        {/* =================== ACTIONS (à droite) =================== */}
        <div className="actions">
          {/* 🍔 Bouton Burger : toggle du state drawerOpen — affiché uniquement en mobile via CSS */}
          <button
            className="menu-toggle"
            aria-label="Ouvrir le menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)} // toggle on/off - clic → inverse le booléen
          >
            {/* 3 barres du burger */}
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          {/* 🎨 Sélecteur de thème — les 3 boutons restent toujours visibles */}
          <div className="theme-switch">
            {/* Thème Rocket */}

            {/* Bouton fusée (idem Iron Man & Panther) :
            • Ce bouton utilise le state themeKey (mémoire React).
            • Quand on clique → setThemeKey("rocket") écrit "rocket" dans le state.
            • Si le state themeKey === "rocket" → la classe devient "theme-tile is-active" (bouton actif).
            • Sinon → ça reste classe = "theme-tile".*/}

            <button
              className={`theme-tile ${
                themeKey === "rocket" ? "is-active" : ""
              }`}
              onClick={() => setThemeKey("rocket")}
              aria-label="Thème Rocket"
              title="Rocket"
            >
              {/* Icône SVG Rocket (style embarqué directement ici) */}
              <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
                <path
                  d="M44 4c-9 2-18 9-22 18l-1 2-9 3 8 8 3-1c9-4 16-13 18-22l3-8z"
                  fill="#7B61FF"
                />
                <circle cx="38" cy="18" r="5" fill="#14D1FF" />
                <path d="M14 35c-4 1-7 4-8 8 4-1 7-4 8-8z" fill="#FFA24C" />
                <path d="M20 41c-4 1-7 4-8 8 4-1 7-4 8-8z" fill="#FF5D5D" />
                <path d="M26 47c-4 1-7 4-8 8 4-1 7-4 8-8z" fill="#FFD166" />
              </svg>
            </button>

            {/* Thème Iron Man */}
            <button
              className={`theme-tile ${
                themeKey === "ironman" ? "is-active" : ""
              }`}
              onClick={() => setThemeKey("ironman")}
              aria-label="Thème Iron Man"
              title="Iron Man"
            >
              {/* Icône SVG Iron Man */}
              <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 6c11 0 20 9 20 20v12l-6 10H18L12 38V26C12 15 21 6 32 6z"
                  fill="#B71C1C"
                />
                <path d="M18 48h28l-4 8H22l-4-8z" fill="#6B0F12" />
                <path d="M18 26l6-6h16l6 6-3 8H21l-3-8z" fill="#FFD700" />
                <rect
                  x="20"
                  y="28"
                  width="10"
                  height="6"
                  rx="3"
                  fill="#00CFFF"
                />
                <rect
                  x="34"
                  y="28"
                  width="10"
                  height="6"
                  rx="3"
                  fill="#00CFFF"
                />
              </svg>
            </button>

            {/* Thème Black Panther */}
            <button
              className={`theme-tile ${
                themeKey === "panther" ? "is-active" : ""
              }`}
              onClick={() => setThemeKey("panther")}
              aria-label="Thème Black Panther"
              title="Black Panther"
            >
              {/* Icône SVG Black Panther */}
              <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
                <circle cx="16" cy="18" r="6" fill="#7B61FF" />
                <circle cx="28" cy="12" r="5" fill="#7B61FF" />
                <circle cx="40" cy="12" r="5" fill="#7B61FF" />
                <circle cx="52" cy="18" r="6" fill="#7B61FF" />
                <path
                  d="M20 28c8-3 16-3 24 0 6 2 10 7 8 12-2 4-8 6-20 6s-18-2-20-6c-2-5 2-10 8-12z"
                  fill="#3A2A78"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* =================== DRAWER MOBILE =================== */}
      <div
        className={`mobile-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        onClick={closeDrawer} // clic sur l’overlay → ferme le drawer/menu
      >
        <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
          <nav className="drawer-nav">
            {/* Liens du menu mobile (identiques au desktop) */}
            <Link
              to="/characters"
              className="drawer-link"
              onClick={closeDrawer}
            >
              Personnages
            </Link>
            <Link to="/comics" className="drawer-link" onClick={closeDrawer}>
              Comics
            </Link>
            <Link to="/favorites" className="drawer-link" onClick={closeDrawer}>
              Favoris
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
