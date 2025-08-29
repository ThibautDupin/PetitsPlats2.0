/**
 * Fonctions pour gérer l'affichage des cartes de recettes
 */

/**
 * Formate la liste des ingrédients avec leurs quantités et unités
 */
export function formatIngredientsListHTML(ingredientsList) {
    return ingredientsList
        .map(ingredientItem => {
            const ingredientName = ingredientItem.ingredient;
            let quantityAndUnit = '';
            
            if (ingredientItem.quantity) {
                quantityAndUnit = ingredientItem.quantity;
                if (ingredientItem.unit) {
                    quantityAndUnit += ` ${ingredientItem.unit}`;
                }
            }

            return `
                <li class="card-description__item">
                    <span class="card-description__item-ingredients">${ingredientName}</span>
                    ${quantityAndUnit ? `<span class="card-description__item-quantity">${quantityAndUnit}</span>` : ''}
                </li>
            `;
        })
        .join('');
}

/**
 * Génère le code HTML complet d'une carte de recette
 */
export function generateCardHTML(recipeData) {
    return `
        <div class="col-lg-4 col-md-6 col-sm-12 recipes-card">
            <div class="card recipe-card">
                <div class="recipe-card__time">${recipeData.time}min</div>
                <img src="assets/images/${recipeData.image}" 
                     class="card-img-top" 
                     alt="${recipeData.name}"
                     loading="lazy">
                <div class="card-body">
                    <h3 class="card-title">${recipeData.name}</h3>
                    <div class="card-description">
                        <h4 class="card-description__name">Recette</h4>
                        <p class="card-description__text">${recipeData.description}</p>
                        <h4 class="card-description__name">Ingrédients</h4>
                        <ul class="card-description__list">
                            ${formatIngredientsListHTML(recipeData.ingredients)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}
