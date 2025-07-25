/**
 * Fonctions utilitaires pour l'application de recettes
 */

/**
 * Normalise une chaîne de caractères (minuscules, sans accents)
 * @param {string} str - Chaîne à normaliser
 * @returns {string} Chaîne normalisée
 */
export function normalizeString(str) {
    return str.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Débounce une fonction pour éviter les appels trop fréquents
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai d'attente en ms
 * @returns {Function} Fonction débouncée
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Formate le pluriel français
 * @param {number} count - Nombre d'éléments
 * @param {string} singular - Forme singulière
 * @param {string} plural - Forme plurielle (optionnel)
 * @returns {string} Texte formaté
 */
export function formatPlural(count, singular, plural = singular + 's') {
    return `${count} ${count > 1 ? plural : singular}`;
}
