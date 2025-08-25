import { generateCardHTML } from './RecipeCard.js';
import { 
    initFilterManager, 
    setFiltersUpdateCallback, 
    populateAllFilters, 
    setupFilterSearch, 
    applyFilters 
} from './FilterManager.js';

/**
 * Variables globales pour l'application de recettes
 */
let recipes = [];
let filteredRecipes = [];
let recipesContainer;
let filterNumber;
let errorMessage;

/**
 * Initialise l'application de recettes
 */
export function initRecipeApp(recipesData) {
    recipes = recipesData;
    filteredRecipes = recipesData;
    
    // Éléments DOM
    recipesContainer = document.querySelector('.recipes-cards');
    filterNumber = document.querySelector('.filter-number');
    errorMessage = document.querySelector('#error-message');
    
    // Gestionnaire de filtres
    initFilterManager(recipesData);
    setFiltersUpdateCallback(handleFiltersChange);
    
    // Initialisation
    displayRecipes(recipes);
    updateRecipeCount(recipes.length);
    populateAllFilters();
    setupEventListeners();
}

/**
 * Affiche les recettes dans le conteneur
 */
export function displayRecipes(recipesToDisplay) {
    recipesContainer.innerHTML = '';
    
    if (recipesToDisplay.length === 0) {
        showErrorMessage();
        return;
    }

    hideErrorMessage();
    
    // Génération directe du HTML
    let cardsHTML = '';
    recipesToDisplay.forEach(recipe => {
        cardsHTML += generateCardHTML(recipe);
    });
    recipesContainer.innerHTML = cardsHTML;
}

/**
 * Met à jour le compteur de recettes
 */
export function updateRecipeCount(count) {
    filterNumber.textContent = `${count} recette${count > 1 ? 's' : ''}`;
}

/**
 * Affiche le message d'erreur
 */
export function showErrorMessage() {
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Aucune recette ne correspond à votre recherche… vous pouvez chercher « tarte aux pommes », « poisson », etc.';
    updateRecipeCount(0);
}

/**
 * Cache le message d'erreur
 */
export function hideErrorMessage() {
    errorMessage.style.display = 'none';
}

/**
 * Recherche dans les recettes
 */
export function searchRecipes(searchTerm) {
    if (searchTerm.length < 3) {
        filteredRecipes = recipes;
    } else {
        const term = searchTerm.toLowerCase();
        filteredRecipes = [];
        
        recipes.forEach(recipe => {
            let found = false;
            
            // Recherche dans le nom
            if (recipe.name.toLowerCase().includes(term)) {
                found = true;
            }
            
            // Recherche dans la description
            if (!found && recipe.description.toLowerCase().includes(term)) {
                found = true;
            }
            
            // Recherche dans les ingrédients
            if (!found) {
                recipe.ingredients.forEach(ingredient => {
                    if (ingredient.ingredient.toLowerCase().includes(term)) {
                        found = true;
                    }
                });
            }
            
            if (found) {
                filteredRecipes.push(recipe);
            }
        });
    }
    handleFiltersChange();
}

/**
 * Gère les changements de filtres
 */
export function handleFiltersChange() {
    const filtered = applyFilters(filteredRecipes);
    displayRecipes(filtered);
    updateRecipeCount(filtered.length);
}

/**
 * Configure tous les événements
 */
export function setupEventListeners() {
    // Recherche principale
    const searchInput = document.getElementById('search-input');
    const searchForm = document.querySelector('.search-form');
    
    searchInput.addEventListener('input', (e) => {
        searchRecipes(e.target.value);
    });
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        searchRecipes(searchInput.value);
    });
    
    // Configuration de la recherche dans les filtres
    setupFilterSearch();
}
