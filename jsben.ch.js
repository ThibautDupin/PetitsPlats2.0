const sampleRecipes = [
    {
        id: 1,
        name: "Salade de tomates",
        description: "Une délicieuse salade fraîche avec des tomates cerises",
        ingredients: [
            { ingredient: "tomates cerises" },
            { ingredient: "basilic" },
            { ingredient: "mozzarella" }
        ]
    },
    {
        id: 2,
        name: "Pâtes carbonara",
        description: "Recette traditionnelle italienne aux œufs et lardons",
        ingredients: [
            { ingredient: "pâtes" },
            { ingredient: "œufs" },
            { ingredient: "lardons" },
            { ingredient: "parmesan" }
        ]
    },
    {
        id: 3,
        name: "Ratatouille",
        description: "Plat provençal aux légumes du soleil",
        ingredients: [
            { ingredient: "aubergines" },
            { ingredient: "courgettes" },
            { ingredient: "tomates" },
            { ingredient: "poivrons" }
        ]
    }
];


// Fonction déclarative (Filter+some)
function searchInRecipes(searchTerm, recipes = sampleRecipes) {
    if (searchTerm.length < 3) {
        return recipes; 
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    return recipes.filter(recipeData => {
        const nameMatch = recipeData.name.toLowerCase().includes(normalizedSearchTerm);
        
        const descriptionMatch = recipeData.description.toLowerCase().includes(normalizedSearchTerm);
        
        const ingredientMatch = recipeData.ingredients.some(ingredientItem => 
            ingredientItem.ingredient.toLowerCase().includes(normalizedSearchTerm)
        );
        
        return nameMatch || descriptionMatch || ingredientMatch;
    });
};


// Fonction impérative (forEach+if)
let allRecipesList = sampleRecipes;
let currentFilteredRecipes = [];
function searchInRecipes(searchTerm) {
        if (searchTerm.length < 3) {
        currentFilteredRecipes = allRecipesList;
    } else {
        const normalizedSearchTerm = searchTerm.toLowerCase();
        currentFilteredRecipes = [];
        
        allRecipesList.forEach(recipeData => {
            let recipeMatchesSearch = false;
      
            
            if (recipeData.name.toLowerCase().includes(normalizedSearchTerm)) {
                recipeMatchesSearch = true;
            }
            if (!recipeMatchesSearch && recipeData.description.toLowerCase().includes(normalizedSearchTerm)) {
                recipeMatchesSearch = true;
            }
            if (!recipeMatchesSearch) {
                recipeData.ingredients.forEach(ingredientItem => {
                    if (ingredientItem.ingredient.toLowerCase().includes(normalizedSearchTerm)) {
                        recipeMatchesSearch = true;
                    }
                });
            }
            if (recipeMatchesSearch) {
                currentFilteredRecipes.push(recipeData);
            }
        });
    }
    
    
    return currentFilteredRecipes;
}