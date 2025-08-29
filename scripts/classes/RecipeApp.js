import { generateCardHTML } from './RecipeCard.js';
import { 
    initializeFilterManager, 
    setOnFiltersChangeCallback, 
    populateAllFilterDropdowns, 
    setupFilterSearchFunctionality, 
    filterRecipesBySelectedFilters 
} from './FilterManager.js';
import {
    initializeErrorHandler,
    showNoRecipesFoundMessage,
    hideErrorMessage,
    displayApplicationError,
    validateDOMElement,
    handleDataValidationError
} from './ErrorHandler.js';

/**
 * Variables globales pour l'application de recettes
 */
let allRecipesList = [];
let currentFilteredRecipes = [];
let recipesDisplayContainer;
let recipeCountDisplay;

/**
 * Initialise l'application de gestion des recettes
 */
export function initializeRecipeApplication(recipesData) {
    try {
        // Validation des données d'entrée
        handleDataValidationError(recipesData, 'recettes', 'initializeRecipeApplication');
        
        allRecipesList = recipesData;
        currentFilteredRecipes = recipesData;
        
        // Récupération des éléments DOM nécessaires
        recipesDisplayContainer = document.querySelector('.recipes-cards');
        recipeCountDisplay = document.querySelector('.filter-number');
        const errorDisplayElement = document.querySelector('#error-message');
        
        // Vérification que tous les éléments DOM requis sont présents
        validateDOMElement(recipesDisplayContainer, 'recipes-cards', 'initializeRecipeApplication');
        validateDOMElement(recipeCountDisplay, 'filter-number', 'initializeRecipeApplication');
        validateDOMElement(errorDisplayElement, 'error-message', 'initializeRecipeApplication');
        
        // Initialisation du gestionnaire d'erreurs
        initializeErrorHandler(errorDisplayElement, recipeCountDisplay);
        
        // Initialisation du gestionnaire de filtres
        initializeFilterManager(recipesData);
        setOnFiltersChangeCallback(handleFiltersChangeEvent);
        
        // Affichage initial des données
        displayRecipesInContainer(allRecipesList);
        updateDisplayedRecipeCount(allRecipesList.length);
        populateAllFilterDropdowns();
        setupAllEventListeners();
    } catch (error) {
        displayApplicationError(error, 'initializeRecipeApplication');
    }
}

/**
 * Affiche une liste de recettes dans le conteneur principal
 */
export function displayRecipesInContainer(recipesToDisplay) {
    try {
        validateDOMElement(recipesDisplayContainer, 'recipesDisplayContainer', 'displayRecipesInContainer');
        
        recipesDisplayContainer.innerHTML = '';
        
        if (recipesToDisplay.length === 0) {
            showNoRecipesFoundMessage();
            return;
        }

        hideErrorMessage();
        
        // Génération du HTML pour toutes les cartes de recettes
        const allCardsHTML = recipesToDisplay
            .map(recipeData => generateCardHTML(recipeData))
            .join('');
        recipesDisplayContainer.innerHTML = allCardsHTML;
    } catch (error) {
        displayApplicationError(error, 'displayRecipesInContainer');
    }
}

/**
 * Met à jour l'affichage du nombre de recettes trouvées
 */
export function updateDisplayedRecipeCount(recipeCount) {
    if (recipeCountDisplay) {
        recipeCountDisplay.textContent = `${recipeCount} recette${recipeCount > 1 ? 's' : ''}`;
    }
}

/**
 * Effectue une recherche textuelle dans les recettes
 */
export function searchInRecipes(searchTerm) {
    if (searchTerm.length < 3) {
        currentFilteredRecipes = allRecipesList;
    } else {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        
        currentFilteredRecipes = allRecipesList.filter(recipeData => {
            // Recherche dans le nom de la recette
            const nameMatch = recipeData.name.toLowerCase().includes(normalizedSearchTerm);
            
            // Recherche dans la description de la recette
            const descriptionMatch = recipeData.description.toLowerCase().includes(normalizedSearchTerm);
            
            // Recherche dans les ingrédients
            const ingredientMatch = recipeData.ingredients.some(ingredientItem => 
                ingredientItem.ingredient.toLowerCase().includes(normalizedSearchTerm)
            );
            
            return nameMatch || descriptionMatch || ingredientMatch;
        });
    }
    handleFiltersChangeEvent();
}

/**
 * Gère les événements de changement des filtres
 */
export function handleFiltersChangeEvent() {
    const recipesAfterFiltering = filterRecipesBySelectedFilters(currentFilteredRecipes);
    displayRecipesInContainer(recipesAfterFiltering);
    updateDisplayedRecipeCount(recipesAfterFiltering.length);
}

/**
 * Configure tous les écouteurs d'événements de l'application
 */
export function setupAllEventListeners() {
    try {
        // Récupération des éléments de recherche principale
        const mainSearchInput = document.getElementById('search-input');
        const mainSearchForm = document.querySelector('.search-form');
        
        validateDOMElement(mainSearchInput, 'search-input', 'setupAllEventListeners');
        validateDOMElement(mainSearchForm, 'search-form', 'setupAllEventListeners');
        
        // Écouteur pour la saisie dans le champ de recherche
        mainSearchInput.addEventListener('input', (inputEvent) => {
            searchInRecipes(inputEvent.target.value);
        });
        
        // Écouteur pour la soumission du formulaire de recherche
        mainSearchForm.addEventListener('submit', (submitEvent) => {
            submitEvent.preventDefault();
            searchInRecipes(mainSearchInput.value);
        });
        
        // Configuration de la recherche dans les listes déroulantes de filtres
        setupFilterSearchFunctionality();
    } catch (error) {
        displayApplicationError(error, 'setupAllEventListeners');
    }
}
