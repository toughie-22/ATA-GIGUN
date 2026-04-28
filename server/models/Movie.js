const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
  },
  genre: {
    type: [String],
    default: [],
  },
  movieLanguage: {
    type: String,
    enum: ['English', 'Yoruba', 'Igbo', 'Pidgin', 'Mixed'],
    default: 'English',
  },
  synopsis: {
    type: String,
    default: '',
  },
  posterUrl: {
    type: String,
    default: '',
  },
  trailerUrl: {
    type: String,
    default: '',
  },
  cast: {
    type: [String],
    default: [],
  },
  director: {
    type: String,
    default: '',
  },
  criticScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  ataScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  inCinemas: {
    type: Boolean,
    default: false,
  },
  releaseDate: {
    type: Date,
  },
  isYouTubeFilm: {
    type: Boolean,
    default: false,
  },
  fullMovieUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Text index for search functionality
movieSchema.index({ title: 'text', synopsis: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
