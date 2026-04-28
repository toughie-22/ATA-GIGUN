const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const User = require('./models/User');
const Review = require('./models/Review');
const movies = require('./data/movies.json');
const { calculateATAScore } = require('./utils/ataScore');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@atagigun.com',
      passwordHash: 'admin123',
      role: 'admin',
    });
    console.log(`Created admin user: ${admin.email}`);

    // Create test user
    const testUser = await User.create({
      username: 'nollywoodfan',
      email: 'fan@atagigun.com',
      passwordHash: 'test1234',
      role: 'user',
    });
    console.log(`Created test user: ${testUser.email}`);

    // Seed movies with initial ATA Score (critic-only)
    const movieDocs = movies.map(m => ({
      ...m,
      ataScore: Math.round(m.criticScore * 0.4),
      releaseDate: new Date(m.releaseDate),
    }));

    const insertedMovies = await Movie.insertMany(movieDocs);
    console.log(`Seeded ${insertedMovies.length} movies`);

    console.log('\n🌶️ Database seeded successfully!');
    console.log('Admin login: admin@atagigun.com / admin123');
    console.log('Test login:  fan@atagigun.com / test1234\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
