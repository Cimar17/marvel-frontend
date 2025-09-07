// App.jsx
import "./App.css"; // 🎨 Styles globaux de l’app
import { useState } from "react"; // 🧠 useState = mémoire interne de React
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// 🛣️ React Router : navigation entre les pages

// 📦 Composants/pages
import Header from "./components/Header";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import CharacterComics from "./pages/CharacterComics";
import AllComics from "./pages/AllComics";
import Favorites from "./pages/Favorites";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import THEMES from "./themes"; // 🎨 Thèmes (Rocket, Iron Man, Panther)

export default function App() {
  // ---------------------------------------------
  // 1) AUTHENTIFICATION
  // ---------------------------------------------
  // 💾 userToken = mémoire du token (jeton de connexion)
  //    → récupéré depuis localStorage au démarrage si déjà stocké
  const [userToken, setUserToken] = useState(
    localStorage.getItem("MARVEL_TOKEN") || null
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("MARVEL_USERNAME") || null
  );

  // 🔑 Fonction pour connecter/déconnecter

  const setUser = (token, username = null) => {
    if (token) {
      setUserToken(token);
      localStorage.setItem("MARVEL_TOKEN", token);

      if (username) {
        setUserName(username);
        localStorage.setItem("MARVEL_USERNAME", username);
      }
    } else {
      setUserToken(null);
      setUserName(null);
      localStorage.removeItem("MARVEL_TOKEN");
      localStorage.removeItem("MARVEL_USERNAME");
    }
  };

  // ---------------------------------------------
  // 2) THÈME
  // ---------------------------------------------
  // 🎨 themeKey = clé du thème choisi (rocket, ironman, panther)
  // 💾 récupéré depuis localStorage (sinon valeur par défaut = "rocket")
  const [themeKey, setThemeKey] = useState(
    localStorage.getItem("MARVEL_THEME") || "rocket"
  );
  // 🎭 theme = objet du thème courant (couleurs, image, texte)
  const theme = THEMES[themeKey];

  // 🎛️ Changer de thème → met à jour le state + localStorage
  const handleThemeChange = (key) => {
    setThemeKey(key);
    localStorage.setItem("MARVEL_THEME", key);
  };

  // ---------------------------------------------
  // 3) CURSEUR DÉCORATIF
  // ---------------------------------------------
  // ✨ mousePosition = coordonnées (x,y) de la souris
  //    (sert à déplacer l’effet lumineux "cursor-glow")
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  // ---------------------------------------------
  // 4) RENDU GLOBAL
  // ---------------------------------------------
  return (
    <Router>
      <div
        className="app"
        data-theme={themeKey} // 🌈 attribut pour appliquer le thème courant
        style={{ ["--accent"]: theme.accent }} // 🎨 variable CSS dynamique
        onMouseMove={
          (e) => setMousePosition({ x: e.clientX, y: e.clientY }) // 🖱️ suivi de la souris
        }
      >
        {/* 🧱 Header commun → affiché sur toutes les pages */}
        <Header
          themeKey={themeKey} // 🎨 clé du thème courant (rocket / ironman / panther)
          setThemeKey={handleThemeChange} // 🎛️ fonction pour changer de thème (modifie state + localStorage)
          userName={userName} // 👤 nom de l’utilisateur (affiché si connecté)
          onLogout={() => setUser(null)} // 🔓 action déconnexion (vide le token et le username du localStorage)
        />

        {/* 📚 Déclaration des routes avec React Router */}
        <Routes>
          {/* Page d’accueil ("/") */}
          <Route
            path="/"
            element={
              <Home
                theme={theme} // 🎭 objet thème (couleurs, image, titre du hero)
                userName={userName} // 👤 transmis pour affichage futur (badge / bienvenue)
                userToken={userToken} // 🔑 permet à Home de savoir si l’utilisateur est connecté
                onLogout={() => setUser(null)} // 🔓 bouton "Se déconnecter" visible seulement si connecté
              />
            }
          />
          {/* Liste personnages */}
          <Route path="/characters" element={<Characters />} />
          {/* Comics d’un perso (page dynamique avec :id) */}
          <Route path="/characters/:id/comics" element={<CharacterComics />} />
          {/* Liste des comics */}
          <Route path="/comics" element={<AllComics />} />
          {/* Favoris */}
          <Route path="/favorites" element={<Favorites />} />
          {/* Authentification */}
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/login" element={<LogIn setUser={setUser} />} />
        </Routes>

        {/* 💡 Effet lumineux qui suit la souris */}
        <div
          className="cursor-glow"
          style={{
            transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
          }}
          aria-hidden="true" // accessibilité : ignoré par les lecteurs d’écran
        />
      </div>
    </Router>
  );
}
