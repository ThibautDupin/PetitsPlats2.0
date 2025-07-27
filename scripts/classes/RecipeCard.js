/**
 * Fonctions pour gérer l'affichage des cartes de recettes
 */

/**
 * Formate la liste des ingrédients avec quantités et unités
 */
export function formatIngredients(ingredients) {
    return ingredients.map(ingredient => {
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
export function generateCardHTML(recipe) {
    return `
        <div class="col-lg-4 col-md-6 col-sm-12 recipes-card">
            <div class="card recipe-card">
                <div class="recipe-card__time">${recipe.time}min</div>
                <img src="assets/images/${recipe.image}" 
                     class="card-img-top" 
                     alt="${recipe.name}"
                     loading="lazy">
                <div class="card-body">
                    <h3 class="card-title">${recipe.name}</h3>
                    <div class="card-description">
                        <h4 class="card-description__name">Recette</h4>
                        <p class="card-description__text">${recipe.description}</p>
                        <h4 class="card-description__name">Ingrédients</h4>
                        <ul class="card-description__list">
                            ${formatIngredients(recipe.ingredients)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}
