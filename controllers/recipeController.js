exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addRecipe = (req, res) => {
  res.render('editRecipe', { title: 'Add Recipe' });
};

exports.createRecipe = (req, res) => {
  res.json(req.body);
};
