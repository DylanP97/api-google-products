const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dbDate: { type: String, required: true },
  dbEndDate: { type: String, required: false },
  dbYear: { type: Number, required: true },
  dbEndYear: { type: Number, required: false },
  dbYearDuration: { type: Number, required: false },
  dbYearsDuration: { type: [Number], required: false },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true, default: [] },
  usersDisliked: { type: [String], required: true, default: [] },
});

module.exports = mongoose.model('Product', productSchema);