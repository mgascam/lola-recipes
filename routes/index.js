const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.homePage);
router.get('/add', recipeController.addRecipe);
router.post('/add', recipeController.createRecipe);

module.exports = router;
