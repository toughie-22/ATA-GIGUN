const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('../models/Movie');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TMDB_API_KEY = '8cbe31f2035213733d35ab43e07039d2';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const syncMovies = async () => {
  try {
    console.log('🌶️ ATA GiGUN: Starting movie synchronization with TMDB...');
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const movies = await Movie.find({});
    console.log(`Found ${movies.length} movies to sync.`);

    for (const movie of movies) {
      console.log(`Searching for: ${movie.title}...`);
      
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          params: {
            api_key: TMDB_API_KEY,
            query: movie.title,
            year: movie.year
          }
        });

        if (response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          
          movie.posterUrl = result.poster_path ? `${IMAGE_BASE_URL}${result.poster_path}` : movie.posterUrl;
          // We could add a backdropUrl field to the model if we wanted to
          
          // Optional: Update description if it's very short or missing
          if (!movie.synopsis || movie.synopsis.length < 50) {
            movie.synopsis = result.overview || movie.synopsis;
          }

          await movie.save();
          console.log(`✅ Synced: ${movie.title}`);
        } else {
          console.log(`⚠️ No results found for: ${movie.title}`);
        }
      } catch (err) {
        console.error(`❌ Error syncing ${movie.title}:`, err.message);
      }
      
      // Sleep for a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('✨ Synchronization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal Error:', error);
    process.exit(1);
  }
};

syncMovies();
