// 🔐 Login.jsx — Page de connexion utilisateur
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // 🚪 navigate = redirection
import axios from "axios"; // 📬 requêtes API
import "./Auth.css";

const Login = ({ setUser }) => {
  // ---------------------------------------------
  // 1) États du formulaire (inputs contrôlés)
  // ---------------------------------------------
  const [email, setEmail] = useState(""); // 📧 email saisi par l’utilisateur
  const [password, setPassword] = useState(""); // 🔒 mot de passe saisi

  // ---------------------------------------------
  // 2) État d’envoi
  // ---------------------------------------------
  const [isSubmitting, setIsSubmitting] = useState(false); // ⏳ vrai pendant l’appel API

  // ---------------------------------------------
  // 3) Outils externes
  // ---------------------------------------------
  const navigate = useNavigate(); // 🚪 permet de rediriger l’utilisateur
  const API = import.meta.env.VITE_API_BASE_URL; // 🌍 adresse backend définie dans .env

  // ---------------------------------------------
  // 4) Rendu JSX
  // ---------------------------------------------
  return (
    <main className="page auth-page">
      <div className="auth-container">
        <h1 className="auth-title">Se connecter</h1>

        {/* 📋 Formulaire de login */}
        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault(); // 🚫 éviter le rechargement de la page
            setIsSubmitting(true); // ⏳ on passe en mode "chargement"

            try {
              // 📬 Appel API → POST /user/login
              const { data } = await axios.post(`${API}/user/login`, {
                email,
                password,
              });

              // ✅ Connexion réussie → on stocke le token
              setUser(data.token);

              // 🚪 On redirige vers Home
              navigate("/");
            } catch (error) {
              // ❌ Erreur simple (ex: mauvais mot de passe)
              console.error(
                "Erreur Login:",
                error.response?.data || error.message
              );
            } finally {
              setIsSubmitting(false); // 🔄 on sort du mode "chargement"
            }
          }}
        >
          {/* 📧 Email */}
          <label className="auth-label">
            <span>Email</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email} // 🧠 lié au state
              onChange={(e) => setEmail(e.target.value)} // met à jour le state
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

          {/* 🚀 Bouton (bloqué si isSubmitting = true) */}
          <button className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* 🔄 Lien vers Signup si pas encore inscrit */}
        <p className="auth-switch">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="link-accent">
            Créer un compte
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
