const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:   { type: String },
  description: { type: String },
  country:  { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  history:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
