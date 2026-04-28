import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiStar, FiCalendar, FiFilm } from 'react-icons/fi';
import { GiChiliPepper } from 'react-icons/gi';
import ATAScoreBadge from '../components/ATAScoreBadge';

const UserHallOfFame = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserReviews();
  }, [id]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/leaderboard/users/${id}/reviews`);
      setData(data);
    } catch (err) {
      console.error('Failed to fetch user reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <GiChiliPepper className="text-5xl text-pepper-hot animate-bounce" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center text-pepper-muted">
      User not found
    </div>
  );

  const { user, reviews } = data;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container">
        <Link to="/hall-of-fame" className="inline-flex items-center gap-2 text-pepper-muted hover:text-white transition-colors mb-8 group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Hall of Fame
        </Link>

        {/* User Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 p-8 rounded-[3rem] bg-gradient-to-br from-pepper-card to-black border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <GiChiliPepper size={200} />
          </div>

          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-pepper-green to-pepper-gold flex items-center justify-center text-5xl font-black shadow-2xl shrink-0">
            {user.username[0].toUpperCase()}
          </div>

          <div className="text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">{user.username}</h1>
                {user.role === 'critic' && (
                  <span className="bg-pepper-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    King Critic
                  </span>
                )}
              </div>
              <p className="text-pepper-muted font-bold tracking-[0.3em] text-xs uppercase">Hall of Fame Member</p>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-pepper-gold uppercase tracking-widest mb-1">Reviews</p>
                <p className="text-2xl font-black">{reviews.length}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-pepper-gold uppercase tracking-widest mb-1">Royal Followers</p>
                <p className="text-2xl font-black">{user.followers?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
          <FiFilm className="text-pepper-gold" /> Critical History
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="p-8 rounded-[2.5rem] bg-pepper-card border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row gap-8">
              <Link to={`/movies/${review.movie._id}`} className="shrink-0 group">
                <img
                  src={review.movie.posterUrl}
                  alt={review.movie.title}
                  className="w-32 h-48 object-cover rounded-3xl shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="flex-grow space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <Link to={`/movies/${review.movie._id}`} className="text-xl font-black hover:text-pepper-gold transition-colors block mb-1 uppercase tracking-tight">
                      {review.movie.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-pepper-muted font-bold uppercase tracking-widest">
                      <FiCalendar /> {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-pepper-muted mr-2">Critic's Verdict:</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <GiChiliPepper
                          key={i}
                          className={`text-xl ${i < review.rating ? 'text-pepper-hot' : 'text-white/10'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative">
                  <span className="absolute -top-3 -left-2 text-4xl text-pepper-gold opacity-20 font-serif">"</span>
                  <p className="text-pepper-muted italic leading-relaxed">
                    {review.comment || "No detailed comment provided for this royal verdict."}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center justify-center gap-2 px-6 border-l border-white/5">
                <p className="text-[10px] font-black text-pepper-muted uppercase tracking-widest">Movie Score</p>
                <ATAScoreBadge score={review.movie.ataScore} size="lg" />
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
              <p className="text-pepper-muted italic">This user hasn't dropped any royal verdicts yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHallOfFame;
