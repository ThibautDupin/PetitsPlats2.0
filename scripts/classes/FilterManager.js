/**
 * Gestionnaire de filtres fonctionnel pour l'application
 */

import {
    displayFilterError,
    validateDOMElement,
    handleDataValidationError
} from './ErrorHandler.js';
import { cleanSearchInput } from './RecipeApp.js';

// Variables globales pour les filtres
let recipesList = [];
let filterCategories = {};
let onFiltersChangeCallback = null;

/**
 * Initialise le gestionnaire de filtres avec les données des recettes
 */
export function initializeFilterManager(recipesData) {
    try {
        handleDataValidationError(recipesData, 'recettes', 'initializeFilterManager');
        recipesList = recipesData;
        
        // Configuration des catégories de filtres avec leurs éléments DOM
        filterCategories = {
            ingredients: {
                selectedItems: {},
                dropdownList: document.getElementById('ingredients-list'),
                selectedContainer: document.getElementById('selected-ingredients'),
                searchInput: document.getElementById('ingredients-search')
            },
            appliances: {
                selectedItems: {},
                dropdownList: document.getElementById('appliances-list'),
                selectedContainer: document.getElementById('selected-appliances'),
                searchInput: document.getElementById('appliances-search')
            },
            utensils: {
                selectedItems: {},
                dropdownList: document.getElementById('utensils-list'),
                selectedContainer: document.getElementById('selected-utensils'),
                searchInput: document.getElementById('utensils-search')
            }
        };
        
        // Vérification que tous les éléments DOM requis sont présents
        Object.keys(filterCategories).map(categoryName => {
            const category = filterCategories[categoryName];
            validateDOMElement(category.dropdownList, `${categoryName}-list`, 'initializeFilterManager');
            validateDOMElement(category.selectedContainer, `selected-${categoryName}`, 'initializeFilterManager');
            validateDOMElement(category.searchInput, `${categoryName}-search`, 'initializeFilterManager');
        });
    } catch (error) {
        displayFilterError(error, 'initializeFilterManager');
    }
}

/**
 * Définit la fonction callback à exécuter lors des changements de filtres
 */
export function setOnFiltersChangeCallback(callbackFunction) {
    onFiltersChangeCallback = callbackFunction;
}

/**
 * Extrait tous les éléments uniques pour chaque catégorie de filtres
 */
export function extractUniqueFilterData() {
    const uniqueData = {
        ingredients: {},
        appliances: {},
        utensils: {}
    };

    recipesList.forEach(recipe => {
        // Extraction des ingrédients uniques
        recipe.ingredients.map(ingredientItem => 
            uniqueData.ingredients[ingredientItem.ingredient.toLowerCase()] = true
        );
        
        // Extraction des appareils uniques
        if (recipe.appliance) {
            uniqueData.appliances[recipe.appliance.toLowerCase()] = true;
        }
        
        // Extraction des ustensiles uniques
        if (recipe.ustensils) {
            recipe.ustensils.map(utensilItem => 
                uniqueData.utensils[utensilItem.toLowerCase()] = true
            );
        }
    });

    return {
        ingredients: Object.keys(uniqueData.ingredients).sort(),
        appliances: Object.keys(uniqueData.appliances).sort(),
        utensils: Object.keys(uniqueData.utensils).sort()
    };
}

/**
 * Remplit toutes les listes déroulantes de filtres
 */
export function populateAllFilterDropdowns() {
    const uniqueFilterData = extractUniqueFilterData();
    
    Object.keys(filterCategories).map(categoryName => {
        fillDropdownWithItems(uniqueFilterData[categoryName], categoryName);
    });
}

/**
 * Remplit une liste déroulante avec les éléments fournis
 */
export function fillDropdownWithItems(itemsList, categoryName) {
    const dropdownContainer = filterCategories[categoryName].dropdownList;
    dropdownContainer.innerHTML = '';
    
    const listElements = itemsList.map(itemValue => {
        const listItem = document.createElement('li');
        const linkElement = document.createElement('a');
        linkElement.className = 'dropdown-item';
        linkElement.href = '#';
        linkElement.textContent = itemValue;
        
        linkElement.addEventListener('click', (event) => {
            event.preventDefault();
            addFilterItem(categoryName, itemValue);
        });
        
        listItem.appendChild(linkElement);
        return listItem;
    });
    
    listElements.forEach(element => dropdownContainer.appendChild(element));
}

/**
 * Ajoute un élément à la catégorie de filtre sélectionnée
 */
export function addFilterItem(categoryName, itemValue) {
    try {
        const filterCategory = filterCategories[categoryName];
        
        if (!filterCategory) {
            throw new Error(`Catégorie de filtre invalide: ${categoryName}`);
        }
        
        if (!filterCategory.selectedItems[itemValue]) {
            filterCategory.selectedItems[itemValue] = true;
            createFilterTag(itemValue, categoryName, filterCategory.selectedContainer);
            notifyFiltersChange();
        }
    } catch (error) {
        displayFilterError(error, 'addFilterItem');
    }
}

/**
 * Crée un tag visuel pour un filtre sélectionné
 */
export function createFilterTag(itemValue, categoryName, containerElement) {
    const tagElement = document.createElement('div');
    tagElement.className = 'selected-option';
    tagElement.innerHTML = `${itemValue}<i class="bi bi-x"></i>`;
    
    tagElement.querySelector('i').addEventListener('click', () => {
        removeFilterItem(categoryName, itemValue);
    });
    
    containerElement.appendChild(tagElement);
}

/**
 * Supprime un élément de la catégorie de filtre sélectionnée
 */
export function removeFilterItem(categoryName, itemValue) {
    const filterCategory = filterCategories[categoryName];
    delete filterCategory.selectedItems[itemValue];
    
    // Supprimer le tag visuel du DOM
    Array.from(filterCategory.selectedContainer.querySelectorAll('.selected-option'))
        .filter(tagElement => tagElement.textContent.includes(itemValue))
        .forEach(tagElement => tagElement.remove());
    
    notifyFiltersChange();
}

/**
 * Applique tous les filtres actifs sur la liste de recettes fournie
 */
export function filterRecipesBySelectedFilters(recipesToFilter) {
    return recipesToFilter.filter(recipe => {
        // Filtrage par ingrédients (logique ET - tous les ingrédients sélectionnés doivent être présents)
        const selectedIngredients = Object.keys(filterCategories.ingredients.selectedItems);
        const ingredientsMatch = selectedIngredients.length === 0 || 
            selectedIngredients.every(requiredIngredient => 
                recipe.ingredients.some(ingredient => 
                    ingredient.ingredient.toLowerCase().includes(requiredIngredient)
                )
            );
        
        // Filtrage par appareils (logique OU - au moins un appareil sélectionné doit correspondre)
        const selectedAppliances = Object.keys(filterCategories.appliances.selectedItems);
        const appliancesMatch = selectedAppliances.length === 0 || 
            selectedAppliances.some(requiredAppliance => 
                recipe.appliance && recipe.appliance.toLowerCase().includes(requiredAppliance)
            );
        
        // Filtrage par ustensiles (logique ET - tous les ustensiles sélectionnés doivent être présents)
        const selectedUtensils = Object.keys(filterCategories.utensils.selectedItems);
        const utensilsMatch = selectedUtensils.length === 0 || 
            selectedUtensils.every(requiredUtensil => 
                recipe.ustensils && recipe.ustensils.some(utensil => 
                    utensil.toLowerCase().includes(requiredUtensil)
                )
            );
        
        return ingredientsMatch && appliancesMatch && utensilsMatch;
    });
}

/**
 * Configure la fonctionnalité de recherche dans tous les filtres
 */
export function setupFilterSearchFunctionality() {
    Object.keys(filterCategories).map(categoryName => {
        filterCategories[categoryName].searchInput.addEventListener('input', (event) => {
            searchInDropdownItems(event.target.value, filterCategories[categoryName].dropdownList);
        });
    });
}

/**
 * Filtre les éléments visibles dans une liste déroulante selon le terme de recherche
 */
export function searchInDropdownItems(searchTerm, dropdownContainer) {
    // Nettoyage sécurisé de l'entrée utilisateur
    const cleanSearchTerm = cleanSearchInput(searchTerm);
    
    // Vérification si l'entrée a été modifiée (tentative d'injection détectée)
    if (cleanSearchTerm !== searchTerm) {
        console.warn('Tentative d\'injection détectée dans la recherche de filtre:', searchTerm);
    }
    
    const allItems = dropdownContainer.querySelectorAll('li');
    const normalizedSearchTerm = cleanSearchTerm.toLowerCase();
    
    allItems.forEach(listItem => {
        const itemText = listItem.textContent.toLowerCase();
        listItem.style.display = itemText.includes(normalizedSearchTerm) ? 'block' : 'none';
    });
}

/**
 * Vérifie si des filtres sont actuellement actifs
 */
export function hasActiveFilters() {
    return Object.keys(filterCategories).some(categoryName => 
        Object.keys(filterCategories[categoryName].selectedItems).length > 0
    );
}

/**
 * Extrait les données de filtres compatibles basées sur les recettes filtrées
 */
export function extractCompatibleFilterData(filteredRecipes) {
    const compatibleData = {
        ingredients: {},
        appliances: {},
        utensils: {}
    };

    filteredRecipes.forEach(recipe => {
        // Extraction des ingrédients compatibles
        recipe.ingredients.forEach(ingredientItem => {
            const ingredient = ingredientItem.ingredient.toLowerCase();
            // Ne pas ajouter si l'ingrédient est déjà sélectionné
            if (!filterCategories.ingredients.selectedItems[ingredient]) {
                compatibleData.ingredients[ingredient] = true;
            }
        });
        
        // Extraction des appareils compatibles
        if (recipe.appliance) {
            const appliance = recipe.appliance.toLowerCase();
            // Ne pas ajouter si l'appareil est déjà sélectionné
            if (!filterCategories.appliances.selectedItems[appliance]) {
                compatibleData.appliances[appliance] = true;
            }
        }
        
        // Extraction des ustensiles compatibles
        if (recipe.ustensils) {
            recipe.ustensils.forEach(utensilItem => {
                const utensil = utensilItem.toLowerCase();
                // Ne pas ajouter si l'ustensile est déjà sélectionné
                if (!filterCategories.utensils.selectedItems[utensil]) {
                    compatibleData.utensils[utensil] = true;
                }
            });
        }
    });

    return {
        ingredients: Object.keys(compatibleData.ingredients).sort(),
        appliances: Object.keys(compatibleData.appliances).sort(),
        utensils: Object.keys(compatibleData.utensils).sort()
    };
}

/**
 * Met à jour les filtres pour n'afficher que ceux compatibles avec les recettes filtrées
 */
export function updateCompatibleFilters(filteredRecipes) {
    try {
        const compatibleFilterData = extractCompatibleFilterData(filteredRecipes);
        
        Object.keys(filterCategories).forEach(categoryName => {
            fillDropdownWithItems(compatibleFilterData[categoryName], categoryName);
        });
    } catch (error) {
        displayFilterError(error, 'updateCompatibleFilters');
    }
}

/**
 * Notifie les autres composants qu'un changement de filtres a eu lieu
 */
function notifyFiltersChange() {
    try {
        if (onFiltersChangeCallback) {
            onFiltersChangeCallback();
        }
    } catch (error) {
        displayFilterError(error, 'notifyFiltersChange');
    }
}
