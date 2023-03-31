const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
  userId: { type: String, required: true },
  user: { type: Object, required: false },
  username: { type: String, required: false },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  imageUrl: { type: String, required: true },
  yearLaunched: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: { type: [String], required: true, default: [] },
  usersDisliked: { type: [String], required: true, default: [] },
});

module.exports = mongoose.model('Product', productSchema);