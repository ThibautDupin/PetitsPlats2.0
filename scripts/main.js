// Import des modules
import { recipes } from '../data/recipes.js';
import { initRecipeApp } from './classes/RecipeApp.js';

/**
 * Point d'entrée de l'application
 * Initialise l'application de recettes quand le DOM est chargé
 */
document.addEventListener('DOMContentLoaded', () => {
    initRecipeApp(recipes);
});