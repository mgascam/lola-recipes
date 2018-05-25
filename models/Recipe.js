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

recipeSchema.pre('save', async function (next) {
    if (!this.isModified('title')) {
        next(); // skip it
        return; // stop this function from running
    }
    this.slug = slug(this.title);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug.length) {
      this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
    // TODO make more resilient so slugs are unique
});

recipeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

module.exports = mongoose.model('Recipe', recipeSchema);
