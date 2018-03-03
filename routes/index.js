const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', recipeController.homePage);
router.get('/add', recipeController.addRecipe);
router.post('/add', catchErrors(recipeController.createRecipe));

module.exports = router;
