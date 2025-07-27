/**
 * Gestionnaire de filtres fonctionnel pour l'application
 */

// Variables globales pour les filtres
let recipes = [];
let filters = {};
let onFiltersUpdateCallback = null;

/**
 * Initialise le gestionnaire de filtres
 */
export function initFilterManager(recipesData) {
    recipes = recipesData;
    
    // Configuration des filtres
    filters = {
        ingredients: {
            selected: {},
            list: document.getElementById('ingredients-list'),
            container: document.getElementById('selected-ingredients'),
            search: document.getElementById('ingredients-search')
        },
        appliances: {
            selected: {},
            list: document.getElementById('appliances-list'),
            container: document.getElementById('selected-appliances'),
            search: document.getElementById('appliances-search')
        },
        utensils: {
            selected: {},
            list: document.getElementById('utensils-list'),
            container: document.getElementById('selected-utensils'),
            search: document.getElementById('utensils-search')
        }
    };
}

/**
 * Définit le callback à appeler lors des mises à jour de filtres
 */
export function setFiltersUpdateCallback(callback) {
    onFiltersUpdateCallback = callback;
}

/**
 * Extrait les données uniques pour les filtres
 */
export function getUniqueData() {
    const data = {
        ingredients: {},
        appliances: {},
        utensils: {}
    };

    recipes.forEach(recipe => {
        // Ingrédients
        recipe.ingredients.forEach(ingredient => {
            data.ingredients[ingredient.ingredient.toLowerCase()] = true;
        });
        
        // Appareils
        if (recipe.appliance) {
            data.appliances[recipe.appliance.toLowerCase()] = true;
        }
        
        // Ustensiles
        if (recipe.ustensils) {
            recipe.ustensils.forEach(utensil => {
                data.utensils[utensil.toLowerCase()] = true;
            });
        }
    });

    return {
        ingredients: Object.keys(data.ingredients).sort(),
        appliances: Object.keys(data.appliances).sort(),
        utensils: Object.keys(data.utensils).sort()
    };
}

/**
 * Remplit tous les filtres
 */
export function populateAllFilters() {
    const data = getUniqueData();
    
    Object.keys(filters).forEach(filterType => {
        populateDropdown(data[filterType], filterType);
    });
}

/**
 * Remplit une liste déroulante
 */
export function populateDropdown(items, filterType) {
    const container = filters[filterType].list;
    container.innerHTML = '';
    
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = '#';
        a.textContent = item;
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            addFilter(filterType, item);
        });
        
        li.appendChild(a);
        container.appendChild(li);
    });
}

/**
 * Ajoute un filtre
 */
export function addFilter(filterType, value) {
    const filter = filters[filterType];
    
    if (!filter.selected[value]) {
        filter.selected[value] = true;
        createFilterTag(value, filterType, filter.container);
        handleFiltersUpdate();
    }
}

/**
 * Crée un tag de filtre
 */
export function createFilterTag(value, filterType, container) {
    const tag = document.createElement('div');
    tag.className = 'selected-option';
    tag.innerHTML = `${value}<i class="bi bi-x"></i>`;
    
    tag.querySelector('i').addEventListener('click', () => {
        removeFilter(filterType, value);
    });
    
    container.appendChild(tag);
}

/**
 * Supprime un filtre
 */
export function removeFilter(filterType, value) {
    const filter = filters[filterType];
    delete filter.selected[value];
    
    // Supprimer le tag du DOM
    const tags = filter.container.querySelectorAll('.selected-option');
    tags.forEach(tag => {
        if (tag.textContent.includes(value)) {
            tag.remove();
        }
    });
    
    handleFiltersUpdate();
}

/**
 * Applique tous les filtres actifs
 */
export function applyFilters(recipesToFilter) {
    let filtered = [...recipesToFilter];
    
    // Filtrer par ingrédients (ET logique)
    if (Object.keys(filters.ingredients.selected).length > 0) {
        filtered = filtered.filter(recipe => 
            Object.keys(filters.ingredients.selected).every(selectedIngredient =>
                recipe.ingredients.some(ingredient => 
                    ingredient.ingredient.toLowerCase().includes(selectedIngredient)
                )
            )
        );
    }
    
    // Filtrer par appareils (OU logique)
    if (Object.keys(filters.appliances.selected).length > 0) {
        filtered = filtered.filter(recipe =>
            Object.keys(filters.appliances.selected).some(selectedAppliance => 
                recipe.appliance && recipe.appliance.toLowerCase().includes(selectedAppliance)
            )
        );
    }
    
    // Filtrer par ustensiles (ET logique)
    if (Object.keys(filters.utensils.selected).length > 0) {
        filtered = filtered.filter(recipe =>
            Object.keys(filters.utensils.selected).every(selectedUtensil =>
                recipe.ustensils && recipe.ustensils.some(utensil => 
                    utensil.toLowerCase().includes(selectedUtensil)
                )
            )
        );
    }
    
    return filtered;
}

/**
 * Configure la recherche dans les filtres
 */
export function setupFilterSearch() {
    Object.keys(filters).forEach(filterType => {
        filters[filterType].search.addEventListener('input', (e) => {
            filterDropdownItems(e.target.value, filters[filterType].list);
        });
    });
}

/**
 * Filtre les éléments dans une liste déroulante
 */
export function filterDropdownItems(searchTerm, container) {
    const items = container.querySelectorAll('li');
    const term = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
    });
}

/**
 * Gère les mises à jour de filtres
 */
function handleFiltersUpdate() {
    if (onFiltersUpdateCallback) {
        onFiltersUpdateCallback();
    }
}
