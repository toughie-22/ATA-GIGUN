import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createReview } from '../api/reviewApi';
import { toast } from 'react-toastify';
import { GiChiliPepper } from 'react-icons/gi';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="p-6 rounded-xl bg-pepper-card border border-white/5 text-center">
        <GiChiliPepper className="text-3xl text-pepper-muted mx-auto mb-2" />
        <p className="text-pepper-muted text-sm">
          <a href="/login" className="text-pepper-gold hover:underline">Sign in</a> to leave a review
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setLoading(true);
    try {
      const result = await createReview({ movie: movieId, rating, comment });
      toast.success('Review submitted! 🌶️');
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded(result);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-pepper-card border border-white/5">
      <h3 className="text-2xl font-bold mb-6">Leave Your Review</h3>

      {/* Pepper rating */}
      <div className="mb-8">
        <label className="block text-lg text-pepper-muted mb-4">Your Rating</label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setRating(num)}
              onMouseEnter={() => setHoverRating(num)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-all duration-150 hover:scale-125"
            >
              <GiChiliPepper
                className={`text-4xl sm:text-5xl transition-colors ${
                  num <= (hoverRating || rating)
                    ? 'text-pepper-hot drop-shadow-[0_0_8px_rgba(255,65,54,0.5)]'
                    : 'text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-xl text-pepper-gold mt-2 inline-block font-bold">{rating}/10</span>
        )}
      </div>

      {/* Comment */}
      <div className="mb-8">
        <label className="block text-lg text-pepper-muted mb-4">Your Review (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={6}
          placeholder="What did you think of this movie?"
          className="w-full px-6 py-4 bg-pepper-surface border border-[var(--border-color)] rounded-xl text-lg focus:outline-none focus:border-pepper-gold/50 focus:ring-1 focus:ring-pepper-gold/30 resize-none transition-all"
        />
        <div className="text-right text-sm text-pepper-muted mt-2">
          {comment.length}/1000
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-pepper-green to-pepper-green-light text-white font-bold text-xl hover:shadow-lg hover:shadow-pepper-green/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Submitting...' : 'Submit Review 🌶️'}
      </button>
    </form>
  );
};

export default ReviewForm;
