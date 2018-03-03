const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');

exports.homePage = (req, res) => {
  console.log(req.name);
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
