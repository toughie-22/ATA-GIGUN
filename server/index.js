const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ------ Middleware ------

// Security headers
app.use(helmet());

// CORS — allow frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any netlify.app subdomain
    if (origin.endsWith('.netlify.app')) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Rate limiting for review submissions (50 reviews / hour)
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: { message: 'Review limit reached. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ------ Routes ------

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Apply review limiter to POST only
app.post('/api/reviews', reviewLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🌶️ ATA GiGUN API is running' });
});

// ------ Global Error Handler ------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ------ Start Server ------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌶️ ATA GiGUN API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start Background Services (Syncing)
  try {
    const initCronJobs = require('./services/cronService');
    initCronJobs();
  } catch (err) {
    console.error('Failed to start background services:', err.message);
  }
});
