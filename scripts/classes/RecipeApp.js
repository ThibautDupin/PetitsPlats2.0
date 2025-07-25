import { RecipeCard } from './RecipeCard.js';
import { FilterManager } from './FilterManager.js';

/**
 * Classe principale pour gérer l'application de recettes
 */
export class RecipeApp {
    constructor(recipes) {
        this.recipes = recipes;
        this.filteredRecipes = recipes;
        
        // Éléments DOM
        this.recipesContainer = document.querySelector('.recipes-cards');
        this.filterNumber = document.querySelector('.filter-number');
        this.errorMessage = document.querySelector('#error-message');
        
        // Gestionnaire de filtres
        this.filterManager = new FilterManager(recipes);
        this.filterManager.onFiltersChange = () => this.handleFiltersChange();
        
        this.init();
    }

    /**
     * Initialise l'application
     */
    init() {
        this.displayRecipes(this.recipes);
        this.updateRecipeCount(this.recipes.length);
        this.filterManager.populateAllFilters();
        this.setupEventListeners();
    }

    /**
     * Affiche les recettes dans le conteneur
     */
    displayRecipes(recipesToDisplay) {
        this.recipesContainer.innerHTML = '';
        
        if (recipesToDisplay.length === 0) {
            this.showErrorMessage();
            return;
        }

        this.hideErrorMessage();
        
        // Utilisation de DocumentFragment pour de meilleures performances
        const fragment = document.createDocumentFragment();
        recipesToDisplay.forEach(recipe => {
            const card = new RecipeCard(recipe);
            const div = document.createElement('div');
            div.innerHTML = card.generateCardHTML();
            fragment.appendChild(div.firstElementChild);
        });
        
        this.recipesContainer.appendChild(fragment);
    }

    /**
     * Met à jour le compteur de recettes
     */
    updateRecipeCount(count) {
        this.filterNumber.textContent = `${count} recette${count > 1 ? 's' : ''}`;
    }

    /**
     * Affiche le message d'erreur
     */
    showErrorMessage() {
        this.errorMessage.style.display = 'block';
        this.errorMessage.textContent = 'Aucune recette ne correspond à votre recherche… vous pouvez chercher « tarte aux pommes », « poisson », etc.';
        this.updateRecipeCount(0);
    }

    /**
     * Cache le message d'erreur
     */
    hideErrorMessage() {
        this.errorMessage.style.display = 'none';
    }

    /**
     * Recherche dans les recettes
     */
    searchRecipes(searchTerm) {
        if (searchTerm.length < 3) {
            this.filteredRecipes = this.recipes;
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredRecipes = this.recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(term) ||
                recipe.description.toLowerCase().includes(term) ||
                recipe.ingredients.some(ingredient => 
                    ingredient.ingredient.toLowerCase().includes(term)
                )
            );
        }
        this.handleFiltersChange();
    }

    /**
     * Gère les changements de filtres
     */
    handleFiltersChange() {
        const filtered = this.filterManager.applyFilters(this.filteredRecipes);
        this.displayRecipes(filtered);
        this.updateRecipeCount(filtered.length);
    }

    /**
     * Configure tous les événements
     */
    setupEventListeners() {
        // Recherche principale
        const searchInput = document.getElementById('search-input');
        const searchForm = document.querySelector('.search-form');
        
        searchInput.addEventListener('input', (e) => {
            this.searchRecipes(e.target.value);
        });
        
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchRecipes(searchInput.value);
        });
        
        // Configuration de la recherche dans les filtres
        this.filterManager.setupFilterSearch();
    }
}
