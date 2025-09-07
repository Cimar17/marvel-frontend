// src/pages/Characters.jsx
// =====================================================================================
// LISTE DES PERSONNAGES
// - Récupération paginée + recherche par nom
// - Cartes compactes (image + titre + étoile favoris)
// - UX : badge “i” (quel que soit l’écran) → ouvre une modale avec la description + CTA
// - Favoris stockés en localStorage (clé "marvel_favorites")
// =====================================================================================

import { useEffect, useRef, useState } from "react"; // 👈 + useRef pour gérer le focus de la modale
import { Link } from "react-router-dom";
import axios from "axios";
import "./Cards.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function Characters() {
  // ---------------------------------------------
  // 1) ÉTATS DE DONNÉES (liste, chargement, total)
  // ---------------------------------------------
  // 🔢 charactersList = tableau des résultats affichés
  // 🔄 isLoading = true pendant l'appel API → affiche "Chargement..."
  // 🔢 totalCount = nombre total d'éléments côté API (utile pour la pagination)
  const [charactersList, setCharactersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // ---------------------------------------------
  // 2) RECHERCHE + PAGINATION
  // ---------------------------------------------
  // 🧭 searchName = valeur de l'input de recherche (contrôlé)
  // 📄 page = page courante (démarre à 1)
  // 🧮 pageSize = taille de page demandée à l'API (ici 100)
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 100;

  // ---------------------------------------------
  // 3) FAVORIS (localStorage) — format commun
  //    { identifier, type:"character", label, imageUrl }
  // ---------------------------------------------
  // 💾 On hydrate le state "favorites" depuis localStorage au premier rendu.
  // ℹ️ isFav(id) = helper pur : renvoie true si l'id est déjà dans les favoris.
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("marvel_favorites") || "[]")
  );
  const isFav = (id) => favorites.some((f) => f.identifier === id);

  // ---------------------------------------------
  // 4) MODALE MOBILE (description)
  // ---------------------------------------------
  // 🪟 openModal = booléen qui contrôle l'ouverture/fermeture de la modale
  // 🧍 activeCharacter = objet du personnage actuellement consulté dans la modale
  const [openModal, setOpenModal] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);

  // 🎯 Référence pour focus automatique dans la modale
  const modalRef = useRef(null);

  // 🧠 Accessibilité modale : focus + touche Echap + blocage scroll arrière-plan
  useEffect(() => {
    if (!openModal) return;

    // 🎯 Dès ouverture → on donne le focus au panneau (navigation clavier)
    const t = setTimeout(() => modalRef.current?.focus(), 0);

    // ⌨️ ESC pour fermer proprement la modale
    const onKey = (e) => {
      if (e.key === "Escape") setOpenModal(false);
    };
    window.addEventListener("keydown", onKey);

    // 🚫 Empêche le body de scroller pendant que la modale est ouverte
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 🧹 Cleanup : on restaure tout quand la modale se ferme
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openModal]);

  // ---------------------------------------------
  // 5) CHARGEMENT DES PERSONNAGES (API)
  // ---------------------------------------------
  // 🧲 Effet dépend de [page, searchName] :
  //    → à chaque changement de page ou de filtre "name", on relance la requête.
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);

        // Construire la query string proprement
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        if (searchName.trim()) params.set("name", searchName.trim());

        const { data } = await axios.get(
          `${API_BASE_URL}/characters?${params.toString()}`
        );

        // ✅ On met à jour le tableau affiché + le total côté API
        setCharactersList(data.results || []);
        setTotalCount(Number(data.count || 0));
      } catch (err) {
        console.error("Erreur Characters:", err.message);
        // ❌ En cas d'erreur → liste vide + compteur à 0 (évite crash UI)
        setCharactersList([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, [page, searchName]);

  // ---------------------------------------------
  // 6) FAVORIS : ajout / retrait

  // 🟡 toggleFavorite :
  //    - si 🆔 identifier déjà présent → on le retire
  //    - sinon → on l’ajoute au format standardisé
  //    - on met à jour le state ET le localStorage
  // ---------------------------------------------
  const toggleFavorite = (character) => {
    const id = character._id;
    const exists = isFav(id);

    const next = exists
      ? favorites.filter((f) => f.identifier !== id)
      : [
          ...favorites,
          {
            identifier: id,
            type: "character",
            label: character.name,
            imageUrl: `${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}`,
          },
        ];

    setFavorites(next);
    localStorage.setItem("marvel_favorites", JSON.stringify(next)); // je transforme mon tableau JS (next) en texte JSON, car localStorage ne stocke que des chaînes
  };

  // =====================================================================================
  // RENDU
  // =====================================================================================
  return (
    <section className="cards-section">
      {/* ------------------------------------------------------------------
          HEADER + BARRE DE RECHERCHE
          ------------------------------------------------------------------ */}
      <div className="cards-header">
        <h2 className="section-title">Personnages Marvel</h2>

        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1); // toujours revenir en page 1 après une recherche
          }}
        >
          {/* 🔍 Champ contrôlé : sa valeur vient du state "searchName"
              onChange met à jour ce state → déclenchera l'effet API au submit */}
          <input
            type="text"
            placeholder="Rechercher par nom"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            aria-label="Rechercher un personnage par nom"
          />
          <button type="submit" className="btn btn-primary">
            Rechercher
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------------------
          LISTE DES CARTES
          ------------------------------------------------------------------ */}
      {/* ⏳ Affichage conditionnel : spinner/texte tant que isLoading === true */}
      {isLoading && <p className="muted">Chargement...</p>}

      {/* ✅ Quand les données sont prêtes → on map sur charactersList */}
      {!isLoading && (
        <div className="cards-wrap">
          {charactersList.map((char) => {
            const id = char._id;
            const name = char.name;
            const img = `${char.thumbnail.path}/portrait_uncanny.${char.thumbnail.extension}`;
            const desc = char.description?.trim();

            return (
              <article key={id} className="card character-card">
                {/* Image cliquable => route vers les comics du perso */}
                <Link
                  to={`/characters/${id}/comics`}
                  className="card-thumb"
                  aria-label={`Voir les comics de ${name}`}
                >
                  <img src={img} alt={name} loading="lazy" />
                </Link>

                {/* Titre + étoile favoris (compact) */}
                <div className="card-body">
                  <h3 className="card-title">{name}</h3>

                  {/* ⭐ Icône cliquable :
                      - className dynamique selon isFav(id)
                      - onClick → toggleFavorite(char) met à jour state + storage
                      - aria/ title = accessibilité + tooltip natif */}
                  <span
                    className={`fav-star ${isFav(id) ? "is-active" : ""}`}
                    onClick={() => toggleFavorite(char)}
                    role="button"
                    aria-label={
                      isFav(id) ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                    title={
                      isFav(id) ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                  >
                    {isFav(id) ? "★" : "☆"}
                  </span>
                </div>

                {/* ----------------------------------------------------------------
                    BADGE “i” → OUVRE UNE MODALE DE DESCRIPTION
                    (le badge est affiché quel que soit l’écran,
                    puisque le hover overlay a été désactivé)
                   ---------------------------------------------------------------- */}
                {desc && (
                  <button
                    className="info-badge"
                    onClick={() => {
                      // 🧍 On stocke le personnage actif pour la modale
                      setActiveCharacter(char);
                      // 🪟 Puis on ouvre la modale
                      setOpenModal(true);
                    }}
                    aria-label="Voir la description"
                    title="Voir la description"
                  >
                    i
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------------
          PAGINATION
          ------------------------------------------------------------------ */}
      <div className="cards-footer">
        {/* ◀️ Bouton précédent : désactivé en page 1 */}
        <button
          className="btn btn-ghost"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Précédent
        </button>

        {/* Indicateur de page + total résultats (si fourni par l'API) */}
        <span className="muted">
          Page {page}
          {totalCount > 0 ? ` • ${totalCount} résultats` : ""}
        </span>

        {/* ▶️ Bouton suivant : désactivé si on a atteint la fin (p*size >= total) */}
        <button
          className="btn btn-ghost"
          onClick={() => setPage((p) => p + 1)}
          disabled={page * pageSize >= totalCount}
        >
          Suivant →
        </button>
      </div>

      {/* ------------------------------------------------------------------
       MODALE (description + favoris + CTA)
        - Déclenchée par le badge "i" (tous écrans, desktop & mobile)
         - Focus automatique (accessibilité)
        - Fermeture via clic backdrop ou touche Echap
        - Blocage du scroll derrière la modale
   ------------------------------------------------------------------ */}
      {openModal && activeCharacter && (
        <div className="modal-backdrop" onClick={() => setOpenModal(false)}>
          <div
            ref={modalRef} // 👈 référence pour focus
            className="modal-panel"
            onClick={(e) => e.stopPropagation()} // empêcher la fermeture si on clique dans la modale
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1} // 👈 rend le panneau focalisable
          >
            <header className="modal-head">
              <h3 id="modal-title" className="modal-title">
                {activeCharacter.name}
              </h3>
              <button
                className="modal-close"
                onClick={() => setOpenModal(false)}
                aria-label="Fermer"
                title="Fermer"
              >
                ✕
              </button>
            </header>

            {/* 📝 Contenu textuel : description complète du personnage */}
            <div className="modal-content">
              <p>{activeCharacter.description}</p>
            </div>

            {/* ⚙️ Actions dans la modale :
                - bouton favori (même mécanique que sur les cartes)
                - lien vers /characters/:id/comics (ferme la modale après clic)
            */}
            <footer className="modal-foot">
              <button
                className={`fav-chip ${
                  isFav(activeCharacter._id) ? "is-active" : ""
                }`}
                onClick={() => toggleFavorite(activeCharacter)}
              >
                {isFav(activeCharacter._id) ? "★ Retirer" : "☆ Favori"}
              </button>

              <Link
                to={`/characters/${activeCharacter._id}/comics`}
                className="hover-cta"
                onClick={() => setOpenModal(false)}
              >
                Voir les comics →
              </Link>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
