// 📄 src/pages/CharacterComics.jsx
// - Affiche les comics liés à un personnage sous forme de cartes stylées
// - Récupère l'id depuis l'URL (via useParams)
// - Requête backend : GET /characters/:id/comics

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CharacterComics.css";

export default function CharacterComics() {
  // 🎛️ States
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔑 ID du personnage récupéré dans l’URL
  const { id } = useParams();

  // 🚀 Appel API backend
  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true);

        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/characters/${id}/comics?page=1&limit=10`
        );

        setComics(data.results || []);
      } catch (error) {
        console.error("Erreur front CharacterComics:", error.message);
        setComics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, [id]);

  // 🖼️ Rendu
  return (
    <section className="cards-section">
      <h1 className="section-title">Comics liés au personnage</h1>

      {isLoading && <p className="muted">Chargement...</p>}

      {!isLoading && comics.length === 0 && (
        <p className="muted">Aucun comic trouvé pour ce personnage.</p>
      )}

      <div className="cards-wrap">
        {comics.map((comic) => {
          const imageUrl = `${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}`;

          return (
            <article key={comic._id || comic.title} className="card">
              {/* Image */}
              <div className="card-thumb">
                <img src={imageUrl} alt={comic.title} loading="lazy" />
              </div>

              {/* Contenu */}
              <div className="card-body">
                <h3 className="card-title">{comic.title}</h3>
                <p className="card-description">
                  {comic.description?.trim() ||
                    "Pas de description disponible."}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
