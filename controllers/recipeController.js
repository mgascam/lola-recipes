const mongoose = require('mongoose');
const Recipe = mongoose.model('Recipe');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const User = require('../models/User');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({message: 'That filetype is not allowed'}, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addRecipe = (req, res) => {
    res.render('editRecipe', {title: 'Add Recipe'});
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.createRecipe = async (req, res) => {
    req.body.author = req.user._id;
    const recipe = await (new Recipe(req.body)).save();
    req.flash('success', `Successfully create ${recipe.title}`);
    res.redirect(`/recipe/${recipe.slug}`);
};

exports.getRecipes = async (req, res) => {
    const page = req.params.page || 1;
    const limit = 6;
    const skip = (page * limit) - limit;
    const recipesPromise = Recipe
        .find()
        .skip(skip)
        .limit(limit)
        .sort({
            created: 'desc'
        });
    const countPromise = Recipe.count();

    const [recipes, count] = await Promise.all([
        recipesPromise,
        countPromise
    ]);
    const pages = Math.ceil(count / limit);

    if (!recipes.length && skip) {
        req.flash('info',
            `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
        res.redirect(`/recipes/page/${pages}`);
        return;
    }

    res.render('recipes', {
        title: 'Recipes',
        recipes,
        page,
        pages,
        count
    });
};

const confirmOwner = (recipe, user) => {
    if (!recipe.author.equals(user._id)) {
        throw Error(' You must own a recipe in order to edit it!')
    }
};

exports.editRecipe = async (req, res) => {
    const recipe = await Recipe.findOne({_id: req.params.id});
    confirmOwner(recipe, req.user);
    res.render('editRecipe', {title: `Edit ${recipe.title}`, recipe})
};

exports.updateRecipe = async (req, res) => {
    const recipe = await Recipe.findOneAndUpdate(
        {_id: req.params.id},
        req.body,
        {new: true, runValidators: true}
    ).exec();
    // TODO confirm owner of the store
    req.flash('success', `Successfully updated <strong>${recipe.title}</strong>. <a href="/recipes/${recipe.slug}">View Recipe</a>`);
    res.redirect(`/recipes/${recipe._id}/edit`);
};

exports.getRecipeBySlug = async (req, res, next) => {
    const recipe = await Recipe.findOne({
        slug: req.params.slug
    }).populate('author reviews');
    if (!recipe) return next();
    res.render('recipe', {recipe, title: recipe.title})

};

exports.getRecipesByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || {$exists: true};
    const tagsPromise = Recipe.getTagsList();
    const recipesPromise = Recipe.find({tags: tagQuery});
    const [tags, recipes] = await Promise.all([tagsPromise, recipesPromise]);

    res.render('tag', {tags, title: 'Tags', tag, recipes});
};

exports.searchRecipes = async (req, res) => {
    const recipes = await Recipe.find({
        $text: {
            $search: req.query.q
        }
    }, {
        score: {
            $meta: 'textScore'
        }
    }).sort({
        score: { $meta: 'textScore'}
    });
    res.json(recipes);
};

exports.heartRecipe = async (req,res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User.findByIdAndUpdate(req.user._id,
        { [operator]: { hearts: req.params.id}},
        { new: true }
    );
    res.json(user);
};

exports.getHearts = async (req,res) => {
    const recipes = await Recipe.find({ _id: { $in: req.user.hearts }});
    res.render('recipes', { title: 'Hearted Recipes', recipes });
}

exports.getTopRecipes = async (req, res) => {
    const recipes = await Recipe.getTopRecipes();
    res.render('topRecipes', {
        recipes,
        title: '🌟 Top Recipes!'
    });
};
