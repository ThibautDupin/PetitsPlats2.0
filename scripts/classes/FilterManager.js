/**
 * Classe pour gérer les filtres de l'application
 */
export class FilterManager {
    constructor(recipes) {
        this.recipes = recipes;
        this.filteredRecipes = recipes;
        
        // Configuration des filtres
        this.filters = {
            ingredients: {
                selected: new Set(),
                list: document.getElementById('ingredients-list'),
                container: document.getElementById('selected-ingredients'),
                search: document.getElementById('ingredients-search')
            },
            appliances: {
                selected: new Set(),
                list: document.getElementById('appliances-list'),
                container: document.getElementById('selected-appliances'),
                search: document.getElementById('appliances-search')
            },
            utensils: {
                selected: new Set(),
                list: document.getElementById('utensils-list'),
                container: document.getElementById('selected-utensils'),
                search: document.getElementById('utensils-search')
            }
        };
    }

    /**
     * Extrait les données uniques pour les filtres
     */
    getUniqueData() {
        const data = {
            ingredients: new Set(),
            appliances: new Set(),
            utensils: new Set()
        };

        this.recipes.forEach(recipe => {
            // Ingrédients
            recipe.ingredients.forEach(ingredient => {
                data.ingredients.add(ingredient.ingredient.toLowerCase());
            });
            
            // Appareils
            if (recipe.appliance) {
                data.appliances.add(recipe.appliance.toLowerCase());
            }
            
            // Ustensiles
            if (recipe.ustensils) {
                recipe.ustensils.forEach(utensil => {
                    data.utensils.add(utensil.toLowerCase());
                });
            }
        });

        return {
            ingredients: Array.from(data.ingredients).sort(),
            appliances: Array.from(data.appliances).sort(),
            utensils: Array.from(data.utensils).sort()
        };
    }

    /**
     * Remplit tous les filtres
     */
    populateAllFilters() {
        const data = this.getUniqueData();
        
        Object.keys(this.filters).forEach(filterType => {
            this.populateDropdown(data[filterType], filterType);
        });
    }

    /**
     * Remplit une liste déroulante
     */
    populateDropdown(items, filterType) {
        const container = this.filters[filterType].list;
        container.innerHTML = '';
        
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = '#';
            a.textContent = item;
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.addFilter(filterType, item);
            });
            
            li.appendChild(a);
            container.appendChild(li);
        });
    }

    /**
     * Ajoute un filtre
     */
    addFilter(filterType, value) {
        const filter = this.filters[filterType];
        
        if (!filter.selected.has(value)) {
            filter.selected.add(value);
            this.createFilterTag(value, filterType, filter.container);
            this.onFiltersChange();
        }
    }

    /**
     * Crée un tag de filtre
     */
    createFilterTag(value, filterType, container) {
        const tag = document.createElement('div');
        tag.className = 'selected-option';
        tag.innerHTML = `${value}<i class="bi bi-x"></i>`;
        
        tag.querySelector('i').addEventListener('click', () => {
            this.removeFilter(filterType, value);
        });
        
        container.appendChild(tag);
    }

    /**
     * Supprime un filtre
     */
    removeFilter(filterType, value) {
        const filter = this.filters[filterType];
        filter.selected.delete(value);
        
        // Supprimer le tag du DOM
        const tags = filter.container.querySelectorAll('.selected-option');
        tags.forEach(tag => {
            if (tag.textContent.includes(value)) {
                tag.remove();
            }
        });
        
        this.onFiltersChange();
    }

    /**
     * Applique tous les filtres actifs
     */
    applyFilters(recipesToFilter) {
        let filtered = [...recipesToFilter];
        
        // Filtrer par ingrédients (ET logique)
        if (this.filters.ingredients.selected.size > 0) {
            filtered = filtered.filter(recipe => 
                Array.from(this.filters.ingredients.selected).every(selectedIngredient =>
                    recipe.ingredients.some(ingredient => 
                        ingredient.ingredient.toLowerCase().includes(selectedIngredient)
                    )
                )
            );
        }
        
        // Filtrer par appareils (OU logique)
        if (this.filters.appliances.selected.size > 0) {
            filtered = filtered.filter(recipe =>
                Array.from(this.filters.appliances.selected).some(selectedAppliance => 
                    recipe.appliance && recipe.appliance.toLowerCase().includes(selectedAppliance)
                )
            );
        }
        
        // Filtrer par ustensiles (ET logique)
        if (this.filters.utensils.selected.size > 0) {
            filtered = filtered.filter(recipe =>
                Array.from(this.filters.utensils.selected).every(selectedUtensil =>
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
    setupFilterSearch() {
        Object.keys(this.filters).forEach(filterType => {
            this.filters[filterType].search.addEventListener('input', (e) => {
                this.filterDropdownItems(e.target.value, this.filters[filterType].list);
            });
        });
    }

    /**
     * Filtre les éléments dans une liste déroulante
     */
    filterDropdownItems(searchTerm, container) {
        const items = container.querySelectorAll('li');
        const term = searchTerm.toLowerCase();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(term) ? 'block' : 'none';
        });
    }

    /**
     * Callback appelé quand les filtres changent
     * À définir par la classe qui utilise FilterManager
     */
    onFiltersChange() {
        // Cette méthode sera surchargée par RecipeApp
    }
}
