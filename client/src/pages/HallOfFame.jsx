import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { FiAward, FiStar, FiTrendingUp, FiUser, FiCalendar } from 'react-icons/fi';
import { GiChiliPepper } from 'react-icons/gi';
import ATAScoreBadge from '../components/ATAScoreBadge';

const HallOfFame = () => {
  const [leaderboard, setLeaderboard] = useState({ topReviewers: [], mostReviewedMovies: [] });
  const [timeframe, setTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/leaderboard?timeframe=${timeframe}`);
      setLeaderboard({
        topReviewers: data.topReviewers || [],
        mostReviewedMovies: data.mostReviewedMovies || []
      });
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setLeaderboard({ topReviewers: [], mostReviewedMovies: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-gradient uppercase tracking-tighter">
              Hall of Fame
            </h1>
            <p className="text-pepper-muted font-bold tracking-widest text-xs uppercase">
              Celebrating the Kings of Nollywood Criticism
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 self-start">
            {['week', 'month', 'all'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  timeframe === t 
                    ? 'bg-gradient-to-r from-pepper-gold to-pepper-hot text-white shadow-lg' 
                    : 'text-pepper-muted hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Time' : `This ${t}`}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <GiChiliPepper className="text-5xl text-pepper-hot animate-bounce" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Top Reviewers */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pepper-gold/20 flex items-center justify-center text-pepper-gold">
                  <FiAward size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase">Top Reviewers</h2>
              </div>

              <div className="space-y-4">
                {leaderboard.topReviewers.length > 0 ? (
                  leaderboard.topReviewers.map((reviewer, index) => (
                    <Link
                      key={reviewer._id}
                      to={`/hall-of-fame/user/${reviewer._id}`}
                      className="flex items-center gap-6 p-6 rounded-3xl bg-pepper-card border border-white/5 hover:border-pepper-gold/30 hover:-translate-y-1 transition-all group"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pepper-green to-pepper-gold flex items-center justify-center text-2xl font-black shadow-xl uppercase">
                          {reviewer.userDetails?.username?.[0] || '?'}
                        </div>
                        <div className="absolute -top-2 -left-2 w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-xs font-black text-pepper-gold shadow-lg">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg group-hover:text-pepper-gold transition-colors">
                            {reviewer.userDetails.username}
                          </h3>
                          {reviewer.userDetails.role === 'critic' && (
                            <span className="text-[10px] font-black bg-pepper-gold/20 text-pepper-gold px-2 py-0.5 rounded uppercase tracking-tighter">
                              King
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-pepper-muted font-bold uppercase tracking-widest">
                          {reviewer.reviewCount} Reviews Posted
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-pepper-gold uppercase mb-1">Royal Followers</p>
                        <p className="text-xl font-black">{reviewer.userDetails.followers?.length || 0}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-pepper-muted italic">No reviewers found for this period.</p>
                )}
              </div>
            </div>

            {/* Most Reviewed Movies */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pepper-hot/20 flex items-center justify-center text-pepper-hot">
                  <FiTrendingUp size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase">Trending Discussions</h2>
              </div>

              <div className="space-y-4">
                {leaderboard.mostReviewedMovies.length > 0 ? (
                  leaderboard.mostReviewedMovies.map((movie, index) => (
                    <Link
                      key={movie._id}
                      to={`/movies/${movie._id}`}
                      className="flex items-center gap-6 p-4 rounded-3xl bg-pepper-card border border-white/5 hover:border-pepper-hot/30 hover:-translate-y-1 transition-all group"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={movie.movieDetails?.posterUrl}
                          alt={movie.movieDetails?.title}
                          className="w-16 h-24 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute -top-2 -left-2 w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-xs font-black text-pepper-hot shadow-lg">
                          #{index + 1}
                        </div>
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-bold text-lg group-hover:text-pepper-hot transition-colors line-clamp-1">
                          {movie.movieDetails.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-pepper-muted">{movie.movieDetails.year}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[10px] font-black text-pepper-hot uppercase tracking-widest">
                            {movie.reviewCount} Active Reviews
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <ATAScoreBadge score={movie.movieDetails.ataScore} size="sm" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-pepper-muted italic">No movies found for this period.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HallOfFame;
