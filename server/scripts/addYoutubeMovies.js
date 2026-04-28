const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const youtubeMovies = [
  {
    title: "The Figurine (Araromire)",
    year: 2009,
    genre: ["Thriller", "Drama", "Fantasy"],
    director: "Kunle Afolayan",
    synopsis: "Two friends find a mystical figurine in an abandoned shrine which bestows seven years of good luck and seven years of bad luck.",
    isYouTubeFilm: true,
    fullMovieUrl: "https://www.youtube.com/watch?v=R0R0X9X9X9", // Placeholder link
    posterUrl: "https://image.tmdb.org/t/p/w500/7I0pY6vO7V6p6p6p6p6p.jpg",
    ataScore: 88
  },
  {
    title: "Osuofia in London",
    year: 2003,
    genre: ["Comedy"],
    director: "Kingsley Ogoro",
    synopsis: "A villager travels to London to claim his inheritance.",
    isYouTubeFilm: true,
    fullMovieUrl: "https://www.youtube.com/watch?v=Y0Y0Y0Y0Y0", // Placeholder link
    posterUrl: "https://image.tmdb.org/t/p/w500/8J8J8J8J8J8J8J8J8J8J.jpg",
    ataScore: 92
  }
];

const addMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    for (const movieData of youtubeMovies) {
      const exists = await Movie.findOne({ title: movieData.title });
      if (!exists) {
        await Movie.create(movieData);
        console.log(`✅ Added YouTube Film: ${movieData.title}`);
      } else {
        exists.isYouTubeFilm = true;
        exists.fullMovieUrl = movieData.fullMovieUrl;
        await exists.save();
        console.log(`🔄 Updated existing film to YouTube: ${movieData.title}`);
      }
    }

    console.log('✨ YouTube films added successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

addMovies();
