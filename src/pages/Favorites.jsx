// src/pages/Favorites.jsx
// =====================================================================================
// FAVORIS — vue homogène avec Characters / AllComics
// - Source de vérité : localStorage (clé "marvel_favorites")
// - Format attendu : { identifier, type: "character"|"comic", label, imageUrl }
//   🆔 "identifier" = ID unique (personnage ou comic). On standardise toujours ce nom,
//   même si l’API renvoie "_id", pour garder une structure uniforme dans le storage.
// - UI : mêmes cartes compactes (image + titre + étoile) + mêmes classes CSS (Cards.css)
// - Action : cliquer sur ★ retire (ou ré-ajoute) l’élément et synchronise le storage
// - Navigation : si type === "character" → la vignette mène vers /characters/:id/comics
// =====================================================================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Cards.css";

const STORAGE_KEY = "marvel_favorites";

/* ---------------------------------------------
   Helpers localStorage (centralisés et réutilisables)
   --------------------------------------------- */
function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); // lit une chaîne JSON (ou null)
    return raw ? JSON.parse(raw) : []; // chaîne JSON -> tableau JS
  } catch {
    return []; // si le JSON est corrompu, on sécurise
  }
}
function writeFavorites(list) {
  // tableau JS -> chaîne JSON (localStorage ne stocke que du texte)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Favorites() {
  // ---------------------------------------------
  // 1) ÉTAT INITIAL : hydraté depuis localStorage une seule fois
  //    useMemo évite de relire localStorage à chaque rendu.
  // ---------------------------------------------
  const initial = useMemo(() => readFavorites(), []);
  const [favorites, setFavorites] = useState(initial);

  // ---------------------------------------------
  // 2) ACTION : ajouter / retirer un favori
  //    - si 🆔 identifier déjà présent → on filtre pour le retirer
  //    - sinon → on l’ajoute à la fin (format standardisé)
  //    - toujours synchroniser le state ET le localStorage
  // ---------------------------------------------
  const toggleFavorite = (fav) => {
    const exists = favorites.some((i) => i.identifier === fav.identifier); // 🆔
    const next = exists
      ? favorites.filter((i) => i.identifier !== fav.identifier) // retire
      : [...favorites, fav]; // ajoute

    setFavorites(next); // met à jour l’UI
    writeFavorites(next); // persiste dans localStorage
  };

  // ---------------------------------------------
  // 3) RENDU
  // ---------------------------------------------
  return (
    <section className="cards-section">
      {/* ------------------------------------------------------------------
          EN-TÊTE (aligné avec les autres pages)
          ------------------------------------------------------------------ */}
      <div className="cards-header">
        <h2 className="section-title">Mes favoris</h2>
      </div>

      {/* ------------------------------------------------------------------
          ÉTAT VIDE
          ------------------------------------------------------------------ */}
      {favorites.length === 0 ? (
        <p className="muted">
          Aucun favori pour l’instant. Ajoute des personnages ou des comics en
          cliquant sur ★.
        </p>
      ) : (
        /* --------------------------------------------------------------
           LISTE DES CARTES (mêmes classes que Characters / AllComics)
           -------------------------------------------------------------- */
        <div className="cards-wrap">
          {favorites.map((item) => {
            const { identifier, type, label, imageUrl } = item; // 🆔 id standardisé

            // Personnage → image cliquable vers /characters/:id/comics
            // Comic      → image non cliquable (pas de page dédiée ici)
            return (
              <article key={`${type}-${identifier}`} className="card">
                {type === "character" ? (
                  <Link
                    to={`/characters/${identifier}/comics`}
                    className="card-thumb"
                    aria-label={`Voir les comics de ${label}`}
                  >
                    <img src={imageUrl} alt={label} loading="lazy" />
                  </Link>
                ) : (
                  <div className="card-thumb">
                    <img src={imageUrl} alt={label} loading="lazy" />
                  </div>
                )}

                {/* Corps : titre + étoile (toujours active ici) */}
                <div className="card-body">
                  <h3 className="card-title">{label}</h3>

                  {/* ⭐ Cliquer retire l’élément des favoris
                      (mise à jour du state + persistance storage) */}
                  <span
                    className="fav-star is-active"
                    onClick={() => toggleFavorite(item)}
                    role="button"
                    aria-label="Retirer des favoris"
                    title="Retirer des favoris"
                  >
                    ★
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
