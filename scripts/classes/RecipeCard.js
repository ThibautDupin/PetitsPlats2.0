/**
 * Classe pour gérer l'affichage des cartes de recettes
 */
export class RecipeCard {
    constructor(recipe) {
        this.recipe = recipe;
    }

    /**
     * Formate la liste des ingrédients avec quantités et unités
     */
    formatIngredients() {
        return this.recipe.ingredients.map(ingredient => {
            const ingredientText = ingredient.ingredient;
            let quantityText = '';
            
            if (ingredient.quantity) {
                quantityText = ingredient.quantity;
                if (ingredient.unit) {
                    quantityText += ` ${ingredient.unit}`;
                }
            }

            return `
                <li class="card-description__item">
                    <span class="card-description__item-ingredients">${ingredientText}</span>
                    ${quantityText ? `<span class="card-description__item-quantity">${quantityText}</span>` : ''}
                </li>
            `;
        }).join('');
    }

    /**
     * Génère le HTML d'une carte de recette
     */
    generateCardHTML() {
        return `
            <div class="col-lg-4 col-md-6 col-sm-12 recipes-card">
                <div class="card recipe-card">
                    <div class="recipe-card__time">${this.recipe.time}min</div>
                    <img src="assets/images/${this.recipe.image}" 
                         class="card-img-top" 
                         alt="${this.recipe.name}"
                         loading="lazy">
                    <div class="card-body">
                        <h3 class="card-title">${this.recipe.name}</h3>
                        <div class="card-description">
                            <h4 class="card-description__name">Recette</h4>
                            <p class="card-description__text">${this.recipe.description}</p>
                            <h4 class="card-description__name">Ingrédients</h4>
                            <ul class="card-description__list">
                                ${this.formatIngredients()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
