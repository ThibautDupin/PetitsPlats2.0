/**
 * Gestionnaire de filtres fonctionnel pour l'application
 */

import {
    displayFilterError,
    validateDOMElement,
    handleDataValidationError
} from './ErrorHandler.js';

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
        Object.keys(filterCategories).forEach(categoryName => {
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
        recipe.ingredients.forEach(ingredientItem => {
            uniqueData.ingredients[ingredientItem.ingredient.toLowerCase()] = true;
        });
        
        // Extraction des appareils uniques
        if (recipe.appliance) {
            uniqueData.appliances[recipe.appliance.toLowerCase()] = true;
        }
        
        // Extraction des ustensiles uniques
        if (recipe.ustensils) {
            recipe.ustensils.forEach(utensilItem => {
                uniqueData.utensils[utensilItem.toLowerCase()] = true;
            });
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
    
    Object.keys(filterCategories).forEach(categoryName => {
        fillDropdownWithItems(uniqueFilterData[categoryName], categoryName);
    });
}

/**
 * Remplit une liste déroulante avec les éléments fournis
 */
export function fillDropdownWithItems(itemsList, categoryName) {
    const dropdownContainer = filterCategories[categoryName].dropdownList;
    dropdownContainer.innerHTML = '';
    
    itemsList.forEach(itemValue => {
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
        dropdownContainer.appendChild(listItem);
    });
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
    const existingTags = filterCategory.selectedContainer.querySelectorAll('.selected-option');
    existingTags.forEach(tagElement => {
        if (tagElement.textContent.includes(itemValue)) {
            tagElement.remove();
        }
    });
    
    notifyFiltersChange();
}

/**
 * Applique tous les filtres actifs sur la liste de recettes fournie
 */
export function filterRecipesBySelectedFilters(recipesToFilter) {
    let filteredRecipes = [];
    
    recipesToFilter.forEach(recipe => {
        let shouldIncludeRecipe = true;
        
        // Filtrage par ingrédients (logique ET - tous les ingrédients sélectionnés doivent être présents)
        if (Object.keys(filterCategories.ingredients.selectedItems).length > 0) {
            const selectedIngredientsList = Object.keys(filterCategories.ingredients.selectedItems);
            let allIngredientsFound = true;
            
            for (let i = 0; i < selectedIngredientsList.length; i++) {
                const requiredIngredient = selectedIngredientsList[i];
                let ingredientFoundInRecipe = false;
                
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    if (recipe.ingredients[j].ingredient.toLowerCase().includes(requiredIngredient)) {
                        ingredientFoundInRecipe = true;
                        break;
                    }
                }
                
                if (!ingredientFoundInRecipe) {
                    allIngredientsFound = false;
                    break;
                }
            }
            
            if (!allIngredientsFound) {
                shouldIncludeRecipe = false;
            }
        }
        
        // Filtrage par appareils (logique OU - au moins un appareil sélectionné doit correspondre)
        if (shouldIncludeRecipe && Object.keys(filterCategories.appliances.selectedItems).length > 0) {
            const selectedAppliancesList = Object.keys(filterCategories.appliances.selectedItems);
            let applianceFoundInRecipe = false;
            
            for (let i = 0; i < selectedAppliancesList.length; i++) {
                const requiredAppliance = selectedAppliancesList[i];
                if (recipe.appliance && recipe.appliance.toLowerCase().includes(requiredAppliance)) {
                    applianceFoundInRecipe = true;
                    break;
                }
            }
            
            if (!applianceFoundInRecipe) {
                shouldIncludeRecipe = false;
            }
        }
        
        // Filtrage par ustensiles (logique ET - tous les ustensiles sélectionnés doivent être présents)
        if (shouldIncludeRecipe && Object.keys(filterCategories.utensils.selectedItems).length > 0) {
            const selectedUtensilsList = Object.keys(filterCategories.utensils.selectedItems);
            let allUtensilsFound = true;
            
            for (let i = 0; i < selectedUtensilsList.length; i++) {
                const requiredUtensil = selectedUtensilsList[i];
                let utensilFoundInRecipe = false;
                
                if (recipe.ustensils) {
                    for (let j = 0; j < recipe.ustensils.length; j++) {
                        if (recipe.ustensils[j].toLowerCase().includes(requiredUtensil)) {
                            utensilFoundInRecipe = true;
                            break;
                        }
                    }
                }
                
                if (!utensilFoundInRecipe) {
                    allUtensilsFound = false;
                    break;
                }
            }
            
            if (!allUtensilsFound) {
                shouldIncludeRecipe = false;
            }
        }
        
        if (shouldIncludeRecipe) {
            filteredRecipes.push(recipe);
        }
    });
    
    return filteredRecipes;
}

/**
 * Configure la fonctionnalité de recherche dans tous les filtres
 */
export function setupFilterSearchFunctionality() {
    Object.keys(filterCategories).forEach(categoryName => {
        filterCategories[categoryName].searchInput.addEventListener('input', (event) => {
            searchInDropdownItems(event.target.value, filterCategories[categoryName].dropdownList);
        });
    });
}

/**
 * Filtre les éléments visibles dans une liste déroulante selon le terme de recherche
 */
export function searchInDropdownItems(searchTerm, dropdownContainer) {
    const allItems = dropdownContainer.querySelectorAll('li');
    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    allItems.forEach(listItem => {
        const itemText = listItem.textContent.toLowerCase();
        listItem.style.display = itemText.includes(normalizedSearchTerm) ? 'block' : 'none';
    });
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
