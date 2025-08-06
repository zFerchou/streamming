const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  url:         { type: String, required: true },
  thumbnail:   { type: String },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:        [String],
  likes:       { type: Number, default: 0 },
  views:       { type: Number, default: 0 },
  moments:     [Number], // segundos guardados como favoritos
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
