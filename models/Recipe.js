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
  tags: [String]
});

recipeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  next();
  // TODO make more resiliant so slugs are unique
});

module.exports = mongoose.model('Store', recipeSchema);
