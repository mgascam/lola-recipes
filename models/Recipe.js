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
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:'You must supply an author'
    }
});

// Define indexes
recipeSchema.index({
    title: 'text',
    description: 'text'
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

recipeSchema.statics.getTopRecipes = function(){
  return this.aggregate([
      // Lookup Recipes and populate their reviews
      { $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'recipe',
          as: 'reviews'
        }
      },
      // filter for only items that have 2 or more reviews
      {
          $match: {
              'reviews.1': { $exists: true }
          }
      },
      // add the average reviews field
      {
          $addFields: {
              averageRating: {
                  $avg: '$reviews.rating'
              }
          }
      },
      // sort it by new field, highest reviews firts
      {
          $sort: {
              averageRating: -1
          }
      },
      // Limit to at most 10
      { $limit: 10 }
  ]);
};

recipeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'recipe'
});

function autopopulate(next) {
    this.populate('reviews');
    next();
}

recipeSchema.pre('find', autopopulate);
recipeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Recipe', recipeSchema);
