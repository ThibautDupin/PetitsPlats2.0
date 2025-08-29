// Import des modules
import { recipes } from '../data/recipes.js';
import { initializeRecipeApplication } from './classes/RecipeApp.js';

/**
 * Point d'entrée principal de l'application
 * Initialise l'application de gestion des recettes une fois le DOM chargé
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeRecipeApplication(recipes);
});