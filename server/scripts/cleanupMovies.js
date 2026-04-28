const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const cleanupMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // 1. Delete movies with missing or invalid poster URLs (General Check)
    const result = await Movie.deleteMany({
      $or: [
        { posterUrl: "" },
        { posterUrl: null },
        { posterUrl: { $exists: false } },
        { posterUrl: { $regex: /null/i } },
        { posterUrl: { $regex: /undefined/i } },
        { posterUrl: { $regex: /placeholder/i } }
      ]
    });

    console.log(`🗑️ Cleanup complete! Deleted ${result.deletedCount} movies without valid poster images.`);
    
    // 2. Specific manual purges for titles mentioned by user
    const specificTitles = [/The Figurine/i, /Osuofia/i];
    for (const titleRegex of specificTitles) {
      const deleted = await Movie.deleteMany({ title: titleRegex });
      if (deleted.deletedCount > 0) {
        console.log(`🗑️ Manually purged ${deleted.deletedCount} instance(s) of "${titleRegex.source}"`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanupMovies();
