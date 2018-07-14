const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(recipeController.getRecipes));
router.get('/recipes', catchErrors(recipeController.getRecipes));
router.get('/add',
    authController.isLoggedIn,
    recipeController.addRecipe
);
router.post('/add',
    recipeController.upload,
    catchErrors(recipeController.resize),
    catchErrors(recipeController.createRecipe)
);
router.post('/add/:id',
    recipeController.upload,
    catchErrors(recipeController.resize),
    catchErrors(recipeController.updateRecipe)
);
router.get('/recipes/:id/edit', catchErrors(recipeController.editRecipe));
router.get('/recipe/:slug', catchErrors(recipeController.getRecipeBySlug));
router.get('/tags', catchErrors(recipeController.getRecipesByTag));
router.get('/tags/:tag', catchErrors(recipeController.getRecipesByTag));
router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);
// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);

module.exports = router;
