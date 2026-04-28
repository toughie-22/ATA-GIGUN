const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReviews,
  createReview,
  deleteReview,
  toggleReaction,
} = require('../controllers/reviewController');

router.get('/:movieId', getReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

// Social
router.post('/:id/like', protect, (req, res, next) => { req.action = 'like'; next(); }, toggleReaction);
router.post('/:id/dislike', protect, (req, res, next) => { req.action = 'dislike'; next(); }, toggleReaction);

module.exports = router;
