/**
 * ATA Score Calculation Engine
 *
 * Formula: ataScore = (criticScore * 0.4) + (avgUserRating * 10 * 0.6)
 *
 * - criticScore: 0-100 (editorial/press opinion)
 * - avgUserRating: average of user ratings (1-10 scale), normalized to 100
 * - Critics carry 40% weight, audience carries 60% weight
 * - Final score: 0-100
 */

const calculateATAScore = (criticScore, reviews) => {
  if (!reviews || reviews.length === 0) {
    return Math.round(criticScore * 0.4);
  }

  const avgUserRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const audienceScore = avgUserRating * 10; // normalize to 0-100
  const ataScore = (criticScore * 0.4) + (audienceScore * 0.6);

  return Math.round(Math.min(100, Math.max(0, ataScore)));
};

/**
 * Get the label for a given ATA Score
 */
const getScoreLabel = (score) => {
  if (score >= 85) return { label: 'Pepper Hot', emoji: '🌶️🌶️🌶️', description: 'Certified Classic' };
  if (score >= 70) return { label: 'Still Hot', emoji: '🌶️🌶️', description: 'Strong Recommend' };
  if (score >= 50) return { label: 'Mild Pepper', emoji: '🌶️', description: 'Worth Watching' };
  return { label: 'Dry Pepper', emoji: '❌', description: 'Proceed with Caution' };
};

module.exports = { calculateATAScore, getScoreLabel };
