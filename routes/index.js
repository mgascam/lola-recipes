const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(recipeController.getRecipes));
router.get('/recipes', catchErrors(recipeController.getRecipes));
router.get('/add', recipeController.addRecipe);
router.post('/add', catchErrors(recipeController.createRecipe));

module.exports = router;
