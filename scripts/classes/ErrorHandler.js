/**
 * Gestionnaire centralisé des erreurs de l'application
 */

// Variable globale pour l'élément d'affichage des erreurs
let errorDisplayElement = null;
let recipeCountDisplay = null;

/**
 * Initialise le gestionnaire d'erreurs avec les éléments DOM nécessaires
 */
export function initializeErrorHandler(errorElement, countElement) {
    errorDisplayElement = errorElement;
    recipeCountDisplay = countElement;
}

/**
 * Affiche le message d'erreur ou d'absence de résultats
 */
export function showNoRecipesFoundMessage(customErrorMessage = null) {
    if (!errorDisplayElement) {
        console.error('Élément d\'affichage des erreurs introuvable');
        return;
    }
    errorDisplayElement.style.display = 'block';
    const defaultMessage = 'Aucune recette ne correspond à votre recherche… vous pouvez chercher « tarte aux pommes », « poisson », etc.';
    const messageToShow = customErrorMessage || defaultMessage;
    errorDisplayElement.textContent = messageToShow;
    updateRecipeCountToZero();
}

/**
 * Cache le message d'erreur
 */
export function hideErrorMessage() {
    if (!errorDisplayElement) {
        console.error('Élément d\'affichage des erreurs introuvable');
        return;
    }
    errorDisplayElement.style.display = 'none';
}

/**
 * Affiche les erreurs générales de l'application
 */
export function displayApplicationError(error, functionName = '') {
    console.error(`Erreur dans ${functionName}:`, error);
    showNoRecipesFoundMessage('Une erreur est survenue. Veuillez rafraîchir la page.');
}

/**
 * Affiche les erreurs du gestionnaire de filtres
 */
export function displayFilterError(error, functionName = '') {
    console.error(`Erreur dans FilterManager - ${functionName}:`, error);
}

/**
 * Affiche les erreurs liées aux cartes de recettes
 */
export function displayCardError(error, functionName = '') {
    console.error(`Erreur dans RecipeCard - ${functionName}:`, error);
}

/**
 * Met le compteur de recettes à zéro (utilisé lors des erreurs)
 */
function updateRecipeCountToZero() {
    if (recipeCountDisplay) {
        recipeCountDisplay.textContent = '0 recette';
    }
}

/**
 * Vérifie si un élément DOM existe et affiche une erreur si ce n'est pas le cas
 */
export function validateDOMElement(element, elementName, functionName = '') {
    if (!element) {
        const errorMessage = `Élément DOM '${elementName}' introuvable`;
        console.error(`${functionName}: ${errorMessage}`);
        throw new Error(errorMessage);
    }
    return true;
}

/**
 * Gère les erreurs de validation des données
 */
export function handleDataValidationError(data, dataType, functionName = '') {
    if (!data || (Array.isArray(data) && data.length === 0)) {
        const errorMessage = `Données ${dataType} invalides ou vides`;
        console.error(`${functionName}: ${errorMessage}`);
        throw new Error(errorMessage);
    }
    return true;
}
