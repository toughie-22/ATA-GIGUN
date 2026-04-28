const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies (with filters)
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const { genre, year, language: movieLanguage, inCinemas, search, sort, page = 1, limit = 50 } = req.query;
    
    // Always filter out movies without posters or with known broken placeholders
    const query = {
      posterUrl: { 
        $exists: true, 
        $ne: "", 
        $not: /placeholder|null|undefined|8J8J8J8J|7I0pY6vO/i 
      }
    };

    if (genre) {
      query.genre = { $in: genre.split(',') };
    }

    if (year) {
      query.year = Number(year);
    }

    if (movieLanguage) {
      query.movieLanguage = movieLanguage;
    }

    if (inCinemas === 'true') {
      query.inCinemas = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sort === 'score') sortOptions = { ataScore: -1 };
    if (sort === 'year') sortOptions = { year: -1 };
    if (sort === 'title') sortOptions = { title: 1 };
    if (sort === 'release') sortOptions = { releaseDate: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const movies = await Movie.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    res.json(movies);
  } catch (error) {
    console.error('GetMovies error:', error);
    res.status(500).json({ message: 'Server error fetching movies' });
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Fetch reviews for this movie
    const reviews = await Review.find({ movie: movie._id })
      .populate('user', 'username avatar role')
      .sort({ createdAt: -1 });

    res.json({ ...movie.toObject(), reviews });
  } catch (error) {
    console.error('GetMovieById error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error fetching movie' });
  }
};

// @desc    Create a new movie
// @route   POST /api/movies
// @access  Admin only
const createMovie = async (req, res) => {
  try {
    const {
      title, year, genre, movieLanguage, synopsis,
      posterUrl, trailerUrl, cast, director,
      criticScore, inCinemas, releaseDate,
    } = req.body;

    const movie = await Movie.create({
      title, year, genre, movieLanguage, synopsis,
      posterUrl, trailerUrl, cast, director,
      criticScore: criticScore || 0,
      ataScore: Math.round((criticScore || 0) * 0.4),
      inCinemas: inCinemas || false,
      releaseDate,
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error('CreateMovie error:', error);
    res.status(500).json({ message: 'Server error creating movie' });
  }
};

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Admin only
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('UpdateMovie error:', error);
    res.status(500).json({ message: 'Server error updating movie' });
  }
};

// @desc    Delete a movie
// @route   DELETE /api/movies/:id
// @access  Admin only
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Also delete all reviews for this movie
    await Review.deleteMany({ movie: req.params.id });

    res.json({ message: 'Movie and associated reviews deleted' });
  } catch (error) {
    console.error('DeleteMovie error:', error);
    res.status(500).json({ message: 'Server error deleting movie' });
  }
};

// @desc    Get trending movies (Top rated per week/month/year)
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'week', 'month', 'year', 'all'
    let dateLimit = new Date();

    if (timeframe === 'week') dateLimit.setDate(dateLimit.getDate() - 7);
    else if (timeframe === 'month') dateLimit.setMonth(dateLimit.getMonth() - 1);
    else if (timeframe === 'year') dateLimit.setFullYear(dateLimit.getFullYear() - 1);
    else dateLimit = new Date(0); // All time

    const movies = await Movie.find({
      $or: [
        { releaseDate: { $gte: dateLimit } },
        { createdAt: { $gte: dateLimit } }
      ],
      posterUrl: { $ne: '', $exists: true }
    })
    .sort({ ataScore: -1, criticScore: -1 })
    .limit(10);

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getTrendingMovies,
};
