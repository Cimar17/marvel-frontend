// src/pages/AllComics.jsx
// =====================================================================================
// LISTE DES COMICS
// - Récupération paginée + recherche par titre
// - Cartes compactes (image + titre + étoile favoris)
// - UX : badge “i” (desktop & mobile) → modale (description + focus/Esc)
// - Favoris stockés en localStorage (clé "marvel_favorites")
// =====================================================================================

/* =========================
   1) IMPORTS (React, HTTP, CSS)
   ========================= */
import { useEffect, useRef, useState } from "react"; // useState = états, useEffect = effets, useRef = focus clavier
import axios from "axios"; // pour appeler l’API HTTP
import "./Cards.css"; // styles partagés (grille, cartes, étoiles, modale)

/* =========================
   2) CONFIG API (URL de base)
   - Si une variable .env existe (VITE_API_BASE_URL) → on l’utilise
   - Sinon on retombe sur http://localhost:4000
   ========================= */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

/* =========================
   3) FAVORIS (localStorage)
   - On stocke tous les favoris dans localStorage, sous la clé "marvel_favorites"
   - localStorage ne sait stocker que du texte → on convertit en JSON string
   ========================= */
const STORAGE_KEY = "marvel_favorites";

// 📥 Lire le tableau de favoris depuis localStorage (ou [] si vide/corrompu)
const readFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY); // récupère le texte
    return raw ? JSON.parse(raw) : []; // convertit texte JSON → tableau
  } catch {
    return []; // si parse échoue → on renvoie un tableau vide
  }
};

// 📤 Écrire (persister) le tableau de favoris dans localStorage
const writeFavorites = (list) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); // tableau JS → texte JSON

/* =====================================================================================
   4) COMPOSANT PRINCIPAL
===================================================================================== */
export default function AllComics() {
  /* ---------------------------------------------
     4.1) ÉTATS DE DONNÉES (liste, chargement, total)
     --------------------------------------------- */
  const [comics, setComics] = useState([]); // 📚 tableau des comics affichés
  const [isLoading, setIsLoading] = useState(true); // ⏳ indique si on charge l’API
  const [totalCount, setTotalCount] = useState(0); // 🔢 total d’éléments côté API

  /* ---------------------------------------------
     4.2) RECHERCHE + PAGINATION
     - searchTitle : valeur de l’input (champ contrôlé)
     - currentPage : page courante (1-based)
     - pageSize    : taille de page demandée à l’API
     - hasNextPage : sert à griser/activer le bouton "Suivant"
     --------------------------------------------- */
  const [searchTitle, setSearchTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const hasNextPage = currentPage * pageSize < totalCount;

  /* ---------------------------------------------
     4.3) FAVORIS (state + localStorage)
     - Structure d’un favori: { identifier, type:"comic", label, imageUrl }
     - favorites : état React → utile pour re-render immédiat
     - isFav(id) : utilitaire qui dit si l’id est déjà en favoris
     - toggleFavorite : ajoute / retire puis synchronise state + storage
     --------------------------------------------- */
  const [favorites, setFavorites] = useState(readFavorites()); // hydrate depuis storage au 1er rendu

  // Vérifie si un comic (par son id) est déjà en favoris
  const isFav = (id) => favorites.some((f) => f.identifier === id);

  // Ajoute ou retire un favori (puis persiste en storage)
  const toggleFavorite = ({ id, label, imageUrl }) => {
    const exists = isFav(id); // true si déjà en favoris
    const next = exists
      ? favorites.filter((f) => f.identifier !== id) // si présent → on le retire
      : [...favorites, { identifier: id, type: "comic", label, imageUrl }]; // sinon → on l’ajoute
    setFavorites(next); // met à jour l’UI (re-render)
    writeFavorites(next); // persiste dans localStorage (mémoire navigateur)
  };

  /* ---------------------------------------------
     4.4) MODALE (description)
     - openModal : booléen (true = ouverte)
     - activeComic : { id, title, description, imageUrl } sélectionné
     - modalRef : pour donner le focus clavier dans la modale (accessibilité)
     --------------------------------------------- */
  const [openModal, setOpenModal] = useState(false);
  const [activeComic, setActiveComic] = useState(null);
  const modalRef = useRef(null);

  // Accessibilité modale : focus auto + fermeture au ESC + blocage du scroll arrière-plan
  useEffect(() => {
    if (!openModal) return; // si la modale est fermée → on ne fait rien

    // 🎯 donne le focus au panneau pour pouvoir naviguer au clavier
    const t = setTimeout(() => modalRef.current?.focus(), 0);

    // ⌨️ écoute ESC pour fermer
    const onKey = (e) => e.key === "Escape" && setOpenModal(false);
    window.addEventListener("keydown", onKey);

    // 🚫 empêche la page derrière de scroller tant que la modale est ouverte
    const prev = document.body.style.overflow; // on mémorise l’ancien style
    document.body.style.overflow = "hidden";

    // 🧹 nettoyage quand la modale se ferme
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev; // on restaure l’état initial
    };
  }, [openModal]);

  /* ---------------------------------------------
     4.5) CHARGEMENT DES COMICS (API)
     - Effet déclenché à chaque changement de page ou de recherche
     - Construit la query string proprement via URLSearchParams
     - Met à jour la liste + le total ou gère l’erreur
     --------------------------------------------- */
  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true); // active le message "Chargement…"

        // 🔗 Prépare les paramètres de la requête
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("pageSize", String(pageSize));
        if (searchTitle.trim()) params.set("title", searchTitle.trim()); // on n’ajoute le filtre que s’il y a du texte

        // 📬 Requête HTTP GET (axios formate l’URL complète)
        const { data } = await axios.get(
          `${API_BASE_URL}/comics?${params.toString()}`
        );

        // ✅ Mise à jour des états avec des valeurs sûres
        setComics(data?.results || []); // tableau de comics
        setTotalCount(Number(data?.count || 0)); // total renvoyé par l’API
      } catch (err) {
        console.error("Erreur API (comics):", err.message);
        // ❌ En cas d’erreur : on vide la liste et on met le compteur à 0
        setComics([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false); // on coupe l’état "chargement"
      }
    };

    fetchComics();
  }, [currentPage, searchTitle]); // 🔄 relance si page ou recherche change

  /* =====================================================================================
     5) RENDU JSX (UI)
     ===================================================================================== */
  return (
    <section className="cards-section">
      {/* ------------------------------------------------------------------
          HEADER + BARRE DE RECHERCHE
          - Input contrôlé : sa valeur vient de searchTitle (state)
          - Submit : empêche le rechargement de la page + reset page=1
          ------------------------------------------------------------------ */}
      <div className="cards-header">
        <h2 className="section-title">Comics Marvel</h2>

        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault(); // empêche le "rechargement" du formulaire
            setCurrentPage(1); // quand on recherche → on revient page 1
          }}
        >
          <input
            type="text"
            placeholder="Rechercher par titre"
            value={searchTitle} // valeur affichée = state
            onChange={(e) => setSearchTitle(e.target.value)} // met à jour le state
            aria-label="Rechercher un comic par titre"
          />
          <button type="submit" className="btn btn-primary">
            Rechercher
          </button>
        </form>
      </div>

      {/* ------------------------------------------------------------------
          LISTE DES CARTES
          - Pendant le chargement → message
          - Sinon → grille de cartes (Cards.css s’occupe du layout)
          ------------------------------------------------------------------ */}
      {isLoading && <p className="muted">Chargement des comics…</p>}

      {!isLoading && (
        <div className="cards-wrap">
          {comics.map((comic) => {
            // 🧩 On sécurise toutes les lectures (?.) pour éviter les crashs
            const id = comic?._id;
            const title = comic?.title || "Titre indisponible";

            // 📝 On récupère la "vraie" description (string non vide après trim)
            const rawDescription = (comic?.description || "").trim();
            // Texte affiché dans la modale (fallback si vide)
            const description =
              rawDescription || "Pas de description disponible.";

            // 🖼️ Construction de l’URL image
            const path = comic?.thumbnail?.path || "";
            const extension = comic?.thumbnail?.extension || "jpg";
            const imageUrl = `${path}/portrait_uncanny.${extension}`;

            return (
              <article key={id} className="card" aria-label={title}>
                {/* 🖼️ VIGNETTE IMAGE */}
                <div className="card-thumb">
                  <img src={imageUrl} alt={title} loading="lazy" />
                </div>

                {/* 🏷️ TITRE + ⭐ FAVORI (étoile simple) */}
                <div className="card-body">
                  <h3 className="card-title">{title}</h3>

                  {/* className dynamique :
                      - "fav-star is-active" si déjà en favoris → étoile jaune
                      - "fav-star" sinon → étoile grise */}
                  <span
                    className={`fav-star ${isFav(id) ? "is-active" : ""}`}
                    onClick={() =>
                      // clique sur l’étoile → ajoute/retire des favoris
                      toggleFavorite({ id, label: title, imageUrl })
                    }
                    role="button"
                    aria-label={
                      isFav(id) ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                    title={
                      isFav(id) ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                  >
                    {/* Contenu de l’étoile :
                        - "★" si favori
                        - "☆" sinon */}
                    {isFav(id) ? "★" : "☆"}
                  </span>
                </div>

                {/* ℹ️ BADGE “i” → n’apparaît QUE s’il existe une vraie description
                    (rawDescription non vide). Clic = ouvre la modale. */}
                {rawDescription && (
                  <button
                    className="info-badge"
                    onClick={() => {
                      // on prépare l’objet à afficher dans la modale
                      setActiveComic({ id, title, description, imageUrl });
                      setOpenModal(true); // on ouvre la modale
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
          - Précédent désactivé en page 1
          - Suivant désactivé si on a atteint la fin (hasNextPage = false)
          ------------------------------------------------------------------ */}
      <div className="cards-footer">
        <button
          className="btn btn-ghost"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ← Précédent
        </button>

        {/* Indicateur de page + total (si fourni) */}
        <span className="muted">
          Page {currentPage}
          {totalCount > 0 ? ` • ${totalCount} résultats` : ""}
        </span>

        <button
          className="btn btn-ghost"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={!hasNextPage}
        >
          Suivant →
        </button>
      </div>

      {/* ------------------------------------------------------------------
          MODALE (description + bouton favori)
          - Backdrop cliquable = ferme
          - Panneau bloque la propagation (ne se ferme pas si on clique dedans)
          - Focus auto + fermeture au ESC + blocage scroll (voir useEffect)
          ------------------------------------------------------------------ */}
      {openModal && activeComic && (
        <div className="modal-backdrop" onClick={() => setOpenModal(false)}>
          <div
            ref={modalRef} // pour donner le focus clavier
            className="modal-panel"
            onClick={(e) => e.stopPropagation()} // empêche la fermeture si on clique DANS la modale
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title-comic"
            tabIndex={-1} // rend le panneau focalisable (focus())
          >
            <header className="modal-head">
              <h3 id="modal-title-comic" className="modal-title">
                {activeComic.title}
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

            {/* 📝 Description complète */}
            <div className="modal-content">
              <p>{activeComic.description}</p>
            </div>

            {/* ⭐ Bouton favori (même logique que la carte) */}
            <footer className="modal-foot">
              <button
                className={`fav-chip ${
                  isFav(activeComic.id) ? "is-active" : ""
                }`}
                onClick={() =>
                  toggleFavorite({
                    id: activeComic.id,
                    label: activeComic.title,
                    imageUrl: activeComic.imageUrl,
                  })
                }
              >
                {isFav(activeComic.id) ? "★ Retirer" : "☆ Favori"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
