const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Please enter a recipe title!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    photo: String
});

recipeSchema.pre('save', function (next) {
    if (!this.isModified('title')) {
        next(); // skip it
        return; // stop this function from running
    }
    this.slug = slug(this.title);
    next();
    // TODO make more resilient so slugs are unique
});

module.exports = mongoose.model('Recipe', recipeSchema);
