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
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.redirect('/');
};
