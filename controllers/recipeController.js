const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addRecipe = (req, res) => {
  res.render('editRecipe', { title: 'Add Recipe' });
};

exports.createRecipe = async (req, res) => {
    const recipe = await (new Recipe(req.body)).save();
    req.flash('success', `Successfully create ${recipe.title}`);
    res.redirect(`/recipe/${recipe.slug}`);
};

exports.getRecipes = async (req, res) => {
    const recipes = await Recipe.find();
    res.render('recipes', { title: 'Recipes', recipes });
};

exports.editRecipe = async (req, res) => {
   const recipe = await Recipe.findOne({ _id: req.params.id });
   // TODO confirm owner of the store
   res.render('editRecipe', { title: `Edit ${recipe.title}`, recipe })
};

exports.updateRecipe = async (req, res) => {
    const recipe = await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true }
    ).exec();
    // TODO confirm owner of the store
    req.flash('success', `Successfully updated <strong>${recipe.title}</strong>. <a href="/recipes/${recipe.slug}">View Recipe</a>`);
    res.redirect(`/recipes/${recipe._id}/edit`);
};