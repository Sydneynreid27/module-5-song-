const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      default: 'anonymous',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Song', songSchema);
