const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(recipeController.getRecipes));
router.get('/recipes', catchErrors(recipeController.getRecipes));
router.get('/add', recipeController.addRecipe);
router.post('/add',
    recipeController.upload,
    catchErrors(recipeController.resize),
    catchErrors(recipeController.createRecipe)
);
router.post('/add/:id',
    recipeController.upload,
    catchErrors(recipeController.resize),
    catchErrors(recipeController.updateRecipe));
router.get('/recipes/:id/edit', catchErrors(recipeController.editRecipe));
router.get('/recipe/:slug', catchErrors(recipeController.getRecipeBySlug));
router.get('/tags', catchErrors(recipeController.getRecipesByTag))
router.get('/tags/:tag', catchErrors(recipeController.getRecipesByTag))


module.exports = router;
