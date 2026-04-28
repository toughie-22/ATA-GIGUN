import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteReview, likeReview, dislikeReview } from '../api/reviewApi';
import { followUser } from '../api/userApi';
import { toast } from 'react-toastify';
import { GiChiliPepper } from 'react-icons/gi';
import { FiTrash2, FiThumbsUp, FiThumbsDown, FiUserPlus, FiUserCheck } from 'react-icons/fi';

const ReviewList = ({ reviews: initialReviews, onReviewDeleted }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);

  // Sync state with props when parent updates
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const handleDelete = async (reviewId) => {
    console.log('Attempting to delete review:', reviewId);
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted! 🗑️');
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      if (onReviewDeleted) onReviewDeleted(reviewId);
    } catch (err) {
      console.error('Delete error details:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to delete. Are you the owner?');
    }
  };

  const handleReaction = async (reviewId, action) => {
    if (!user) {
      toast.info('Sign in to react to reviews');
      return;
    }
    try {
      const data = action === 'like' ? await likeReview(reviewId) : await dislikeReview(reviewId);
      setReviews(prev => prev.map(r => 
        r._id === reviewId ? { ...r, likes: data.likes, dislikes: data.dislikes } : r
      ));
    } catch (err) {
      toast.error('Failed to react');
    }
  };

  const handleFollow = async (userId) => {
    if (!user) {
      toast.info('Sign in to follow users');
      return;
    }
    try {
      const data = await followUser(userId);
      setReviews(prev => prev.map(r => {
        if (r.user?._id === userId) {
          return { ...r, user: { ...r.user, followers: data.followers } };
        }
        return r;
      }));
      toast.success('Updated follow status');
    } catch (err) {
      toast.error('Failed to follow');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <GiChiliPepper className="text-4xl text-pepper-muted/30 mx-auto mb-3" />
        <p className="text-pepper-muted text-sm">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => {
        const isFollowing = review.user?.followers?.includes(user?._id);
        const hasLiked = review.likes?.includes(user?._id);
        const hasDisliked = review.dislikes?.includes(user?._id);

        return (
          <div
            key={review._id}
            className="group relative p-8 rounded-[2rem] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-surface)] border border-[var(--border-color)] hover:border-pepper-gold/50 transition-all duration-500 shadow-pepper-xl animate-slide-up"
          >
            {/* Royal Glow Effect */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-pepper-gold/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-8">
              {/* User Identity Column */}
              <div className="flex-none flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pepper-gold via-pepper-hot-light to-pepper-hot p-[2px] shadow-lg shadow-pepper-hot/20 transform group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-2xl bg-pepper-card flex items-center justify-center text-xl font-black text-white">
                      {review.user?.username?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  {review.user?.role === 'critic' && (
                    <div className="absolute -top-2 -right-2 bg-pepper-gold text-pepper-dark text-[8px] font-black px-2 py-1 rounded-md shadow-lg border border-white/20">
                      KING
                    </div>
                  )}
                </div>
                
                {user && user._id !== review.user?._id && review.user?._id && (
                  <button
                    onClick={() => handleFollow(review.user._id)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 ${
                      isFollowing 
                        ? 'bg-pepper-green/20 text-pepper-green border border-pepper-green/30' 
                        : 'bg-pepper-gold text-white shadow-lg shadow-pepper-gold/20 hover:scale-105'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              {/* Content Area */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      {review.user?.username}
                      {review.user?.followers && (
                        <span className="px-2 py-0.5 bg-white/5 rounded-full text-[9px] font-medium text-pepper-muted uppercase tracking-widest border border-white/5">
                          {review.user.followers.length} ROYAL FOLLOWERS
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      {[...Array(10)].map((_, i) => (
                        <GiChiliPepper
                          key={i}
                          className={`text-lg sm:text-xl transition-all duration-300 ${
                            i < review.rating 
                              ? 'text-pepper-hot drop-shadow-[0_0_8px_rgba(255,65,54,0.4)] scale-110' 
                              : 'text-white/10'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-lg font-bold text-pepper-gold">{review.rating}/10</span>
                    </div>
                  </div>
                  
                  <div className="text-xs font-bold text-pepper-muted bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                {review.comment && (
                  <div className="mt-4">
                    <p className="text-xl text-[var(--text-main)] opacity-90 leading-relaxed italic font-medium">
                      "{review.comment}"
                    </p>
                  </div>
                )}

                {/* Social Interactions */}
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReaction(review._id, 'like')}
                      className={`group/btn flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 ${
                        hasLiked 
                          ? 'bg-pepper-gold text-white shadow-xl shadow-pepper-gold/30 scale-105' 
                          : 'bg-white/5 text-pepper-muted hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <FiThumbsUp className={hasLiked ? 'animate-bounce' : 'group-hover/btn:-translate-y-0.5 transition-transform'} />
                      <span>{review.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => handleReaction(review._id, 'dislike')}
                      className={`group/btn flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 ${
                        hasDisliked 
                          ? 'bg-pepper-hot text-white shadow-xl shadow-pepper-hot/30 scale-105' 
                          : 'bg-white/5 text-pepper-muted hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <FiThumbsDown className={hasDisliked ? 'animate-bounce' : 'group-hover/btn:translate-y-0.5 transition-transform'} />
                      <span>{review.dislikes?.length || 0}</span>
                    </button>
                  </div>

                  {user && (user._id?.toString() === review.user?._id?.toString() || user.role === 'admin' || user.role === 'ADMIN') && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-3 rounded-2xl text-pepper-muted hover:text-pepper-hot hover:bg-pepper-hot/10 transition-all ml-auto border border-transparent hover:border-pepper-hot/20"
                      title="Delete review"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
