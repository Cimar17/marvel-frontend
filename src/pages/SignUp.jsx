// 📝 Signup.jsx — Page d'inscription utilisateur
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 🚪 navigate = redirection
import axios from "axios"; // 📬 pour parler avec l’API
import "./Auth.css";

const Signup = ({ setUser }) => {
  // ---------------------------------------------
  // 1) États des inputs (formulaire contrôlé)
  // ---------------------------------------------
  const [username, setUsername] = useState(""); // 👤 pseudo
  const [email, setEmail] = useState(""); // 📧 email
  const [password, setPassword] = useState(""); // 🔒 mot de passe
  const [isSubmitting, setIsSubmitting] = useState(false); // ⏳ envoi en cours ?

  // ---------------------------------------------
  // 2) Navigate + API
  // ---------------------------------------------
  const navigate = useNavigate(); // 🚪 redirection après succès
  const API = import.meta.env.VITE_API_BASE_URL; // 🌍 URL du backend

  // ---------------------------------------------
  // 3) Soumission du formulaire
  // ---------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault(); // 🚫 stoppe le rechargement de page
    setIsSubmitting(true);

    try {
      // 📬 Appel API → on envoie email + username + password
      const { data } = await axios.post(`${API}/user/signup`, {
        email,
        username,
        password,
      });

      // ✅ On stocke le token reçu via setUser (App.jsx s’occupe du localStorage)
      setUser(data.token);

      // 🚪 Redirection vers l’accueil
      navigate("/");
    } catch (error) {
      // ❌ Gestion d’erreur simple (console)
      console.error("Erreur Signup:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false); // 🔄 on enlève l’état "chargement"
    }
  };

  // ---------------------------------------------
  // 4) Rendu JSX
  // ---------------------------------------------
  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Créer un compte</h1>

        {/* 📋 Formulaire contrôlé */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* 👤 Username */}
          <label className="auth-label">
            <span>Nom d’utilisateur</span>
            <input
              className="auth-input"
              type="text"
              placeholder="Nom d'utilisateur"
              value={username} // 📌 lié au state
              onChange={(e) => setUsername(e.target.value)} //  met à jour le state
              required
            />
          </label>

          {/* 📧 Email */}
          <label className="auth-label">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* 🔒 Mot de passe */}
          <label className="auth-label">
            <span>Mot de passe</span>
            <input
              className="auth-input"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {/* 🚀 Bouton avec état "chargement" */}
          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={isSubmitting} // 🔒 bloque si envoi en cours
          >
            {isSubmitting ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        {/* 🔄 Lien vers login si déjà inscrit */}
        <p className="auth-switch">
          Déjà un compte ?{" "}
          <Link to="/login" className="link-accent">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
