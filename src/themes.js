// src/themes.js
// ✅ Thèmes harmonisés : même “recipe” de glow pour chaque thème

const THEMES = {
  rocket: {
    name: "Rocket",
    heroImage: "/rocket.jpg",
    accent: "#14D1FF",
    title: "Welcome to your Marvelous World",
    description:
      "Ajoute tes personnages et comics préférés en favoris et construis ton propre univers Marvel.",
    // Glow doux et cohérent (2 couches, même intensité que les autres)
    titleGlow:
      "0 0 10px rgba(20, 209, 255, 0.45), 0 0 18px rgba(20, 209, 255, 0.25)",
  },

  ironman: {
    name: "Iron Man",
    heroImage: "/ironman.jpg",
    accent: "#FFD700",
    title: "Welcome to your Marvelous World",
    description:
      "Ajoute tes personnages et comics préférés en favoris et construis ton propre univers Marvel.",
    // ✨ Même recette que Rocket/Panther, juste avec l’accent du thème
    titleGlow:
      "0 0 10px rgba(255, 215, 0, 0.45), 0 0 18px rgba(255, 215, 0, 0.25)",
  },

  panther: {
    name: "Black Panther",
    heroImage: "/black-panther.jpg",
    accent: "#7B61FF",
    title: "Welcome to your Marvelous World",
    description:
      "Ajoute tes personnages et comics préférés en favoris et construis ton propre univers Marvel.",
    titleGlow:
      "0 0 10px rgba(123, 97, 255, 0.45), 0 0 18px rgba(123, 97, 255, 0.25)",
  },
};

export default THEMES;
