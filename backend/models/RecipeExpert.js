const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeExpertSchema = new Schema({
  name: { type: String, required: true },
  experts: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('RecipeExpert', recipeExpertSchema);
