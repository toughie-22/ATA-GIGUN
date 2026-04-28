const Review = require('../models/Review');
const User = require('../models/User');
const Movie = require('../models/Movie');
const mongoose = require('mongoose');

// @desc    Get top reviewers and most reviewed movies
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'week', 'month', 'all'
    let dateLimit = new Date();

    if (timeframe === 'week') dateLimit.setDate(dateLimit.getDate() - 7);
    else if (timeframe === 'month') dateLimit.setMonth(dateLimit.getMonth() - 1);
    else dateLimit = new Date(0); // All time

    // 1. Top Reviewers
    const topReviewers = await Review.aggregate([
      { $match: { createdAt: { $gte: dateLimit } } },
      { $group: { _id: '$user', reviewCount: { $sum: 1 } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          reviewCount: 1,
          'userDetails.username': 1,
          'userDetails.avatar': 1,
          'userDetails.role': 1,
          'userDetails.followers': 1
        }
      }
    ]);

    // 2. Most Reviewed Movies
    const mostReviewedMovies = await Review.aggregate([
      { $match: { createdAt: { $gte: dateLimit } } },
      { $group: { _id: '$movie', reviewCount: { $sum: 1 } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'movies',
          localField: '_id',
          foreignField: '_id',
          as: 'movieDetails'
        }
      },
      { $unwind: '$movieDetails' },
      {
        $project: {
          _id: 1,
          reviewCount: 1,
          'movieDetails.title': 1,
          'movieDetails.posterUrl': 1,
          'movieDetails.year': 1,
          'movieDetails.ataScore': 1
        }
      }
    ]);

    res.json({ topReviewers, mostReviewedMovies });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
};

// @desc    Get all reviews by a specific user
// @route   GET /api/users/:id/reviews
// @access  Public
const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('username avatar role followers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const reviews = await Review.find({ user: userId })
      .populate('movie', 'title posterUrl year ataScore')
      .sort({ createdAt: -1 });

    res.json({ user, reviews });
  } catch (error) {
    console.error('UserReviews error:', error);
    res.status(500).json({ message: 'Server error fetching user reviews' });
  }
};

module.exports = {
  getLeaderboard,
  getUserReviews
};
