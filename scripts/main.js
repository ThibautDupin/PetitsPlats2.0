// Import des modules
import { recipes } from '../data/recipes.js';
import { RecipeApp } from './classes/RecipeApp.js';

/**
 * Point d'entrée de l'application
 * Initialise l'application de recettes quand le DOM est chargé
 */
document.addEventListener('DOMContentLoaded', () => {
    new RecipeApp(recipes);
});