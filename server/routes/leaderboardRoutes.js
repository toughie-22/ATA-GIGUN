const express = require('express');
const router = express.Router();
const { getLeaderboard, getUserReviews } = require('../controllers/leaderboardController');

// @route   GET /api/leaderboard
router.get('/', getLeaderboard);

// @route   GET /api/leaderboard/users/:id/reviews
router.get('/users/:id/reviews', getUserReviews);

module.exports = router;
