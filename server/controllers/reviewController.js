const Review = require('../models/Review');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { calculateATAScore } = require('../utils/ataScore');

// @desc    Get all reviews for a movie
// @route   GET /api/reviews/:movieId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate('user', 'username avatar role followers following')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('GetReviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private (authenticated users)
const createReview = async (req, res) => {
  try {
    const { movie: movieId, rating, comment } = req.body;

    // Check movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      movie: movieId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    // Create review
    const review = await Review.create({
      movie: movieId,
      user: req.user._id,
      rating,
      comment: comment || '',
      isCritic: req.user.role === 'critic',
    });

    // Notify followers
    const user = await User.findById(req.user._id);
    if (user && user.followers.length > 0) {
      const notifications = user.followers.map(followerId => ({
        recipient: followerId,
        sender: req.user._id,
        type: 'NEW_COMMENT',
        relatedReview: review._id,
        relatedMovie: movieId,
      }));
      await Notification.insertMany(notifications);
    }

    // Recalculate ATA Score
    const allReviews = await Review.find({ movie: movieId });
    const newATAScore = calculateATAScore(movie.criticScore, allReviews);
    await Movie.findByIdAndUpdate(movieId, { ataScore: newATAScore });

    // Populate user data before returning
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar role followers');

    res.status(201).json({
      review: populatedReview,
      ataScore: newATAScore,
    });
  } catch (error) {
    console.error('CreateReview error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (review owner or admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only the review owner or an admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const movieId = review.movie;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate ATA Score after deletion
    const movie = await Movie.findById(movieId);
    if (movie) {
      const remainingReviews = await Review.find({ movie: movieId });
      const newATAScore = calculateATAScore(movie.criticScore, remainingReviews);
      await Movie.findByIdAndUpdate(movieId, { ataScore: newATAScore });
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('DeleteReview error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

// @desc    Toggle Like/Dislike on a review
// @route   POST /api/reviews/:id/like or /api/reviews/:id/dislike
// @access  Private
const toggleReaction = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;
    const action = req.action; // 'like' or 'dislike' from route

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (action === 'like') {
      // If already liked, remove like
      if (review.likes.includes(userId)) {
        review.likes = review.likes.filter(id => id.toString() !== userId.toString());
      } else {
        // Add like, remove dislike if exists
        review.likes.push(userId);
        review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());
        
        // Notify owner if not self
        if (review.user.toString() !== userId.toString()) {
          await Notification.create({
            recipient: review.user,
            sender: userId,
            type: 'LIKE',
            relatedReview: reviewId,
            relatedMovie: review.movie
          });
        }
      }
    } else {
      // Handle dislike
      if (review.dislikes.includes(userId)) {
        review.dislikes = review.dislikes.filter(id => id.toString() !== userId.toString());
      } else {
        review.dislikes.push(userId);
        review.likes = review.likes.filter(id => id.toString() !== userId.toString());
      }
    }

    await review.save();
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReviews,
  createReview,
  deleteReview,
  toggleReaction,
};
