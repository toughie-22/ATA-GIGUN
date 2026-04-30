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
          <div className="flex items-center justify-center h-96">
            <GiChiliPepper className="text-6xl text-pepper-hot animate-bounce" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Top Reviewers Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-pepper-gold/20 flex items-center justify-center text-pepper-gold shadow-lg shadow-pepper-gold/10">
                  <FiAward size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">The Royal Council</h2>
                  <p className="text-[10px] font-black text-pepper-muted uppercase tracking-widest">Top Critics of the Realm</p>
                </div>
              </div>

              <div className="space-y-6">
                {leaderboard.topReviewers.length > 0 ? (
                  <>
                    {/* SPOTLIGHT: #1 Reviewer */}
                    <Link
                      to={`/hall-of-fame/user/${leaderboard.topReviewers[0]._id}`}
                      className="relative block p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-pepper-gold/20 via-pepper-card to-pepper-card border-2 border-pepper-gold/40 shadow-2xl shadow-pepper-gold/5 group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                        <FiAward size={80} className="md:w-[120px] md:h-[120px]" />
                      </div>
                      
                      <div className="flex items-center gap-5 md:gap-8 relative z-10">
                        <div className="relative">
                          <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-pepper-gold to-yellow-600 flex items-center justify-center text-2xl md:text-4xl font-black shadow-2xl border-2 md:border-4 border-black">
                            {leaderboard.topReviewers[0].userDetails?.username?.[0] || '?'}
                          </div>
                          <div className="absolute -top-2 -left-2 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-pepper-gold text-black flex items-center justify-center text-xs md:text-sm font-black shadow-lg">
                            #1
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h3 className="text-xl md:text-3xl font-black group-hover:text-pepper-gold transition-colors uppercase tracking-tight">
                            {leaderboard.topReviewers[0].userDetails?.username}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-pepper-gold text-black text-[10px] font-black rounded-full uppercase">Current King</span>
                            <span className="text-xs font-bold text-pepper-muted uppercase tracking-widest">
                              {leaderboard.topReviewers[0].reviewCount} Reviews
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* The Rest of Top 10 */}
                    <div className="grid grid-cols-1 gap-4 pt-4">
                      {leaderboard.topReviewers.slice(1).map((reviewer, index) => (
                        <Link
                          key={reviewer._id}
                          to={`/hall-of-fame/user/${reviewer._id}`}
                          className="flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                        >
                          <div className="w-8 text-center font-black text-pepper-muted group-hover:text-white transition-colors">
                            {index + 2}
                          </div>
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pepper-green to-pepper-gold/50 flex items-center justify-center text-lg font-black shrink-0 uppercase">
                            {reviewer.userDetails?.username?.[0] || '?'}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold group-hover:text-pepper-gold transition-colors">{reviewer.userDetails?.username}</h4>
                            <p className="text-[10px] font-bold text-pepper-muted uppercase tracking-widest">{reviewer.reviewCount} Reviews</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-pepper-gold uppercase">{reviewer.userDetails?.followers?.length || 0} Fans</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-pepper-muted italic">The Royal Council is empty for now...</p>
                )}
              </div>
            </div>

            {/* Trending Discussions Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-pepper-hot/20 flex items-center justify-center text-pepper-hot shadow-lg shadow-pepper-hot/10">
                  <FiTrendingUp size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">The Red Carpet</h2>
                  <p className="text-[10px] font-black text-pepper-muted uppercase tracking-widest">Most Talked About Films</p>
                </div>
              </div>

              <div className="space-y-6">
                {leaderboard.mostReviewedMovies.length > 0 ? (
                  <>
                    {/* SPOTLIGHT: #1 Movie */}
                    <Link
                      to={`/movies/${leaderboard.mostReviewedMovies[0]._id}`}
                      className="relative block p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-pepper-hot/20 via-pepper-card to-pepper-card border-2 border-pepper-hot/40 shadow-2xl shadow-pepper-hot/5 group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <GiChiliPepper size={100} className="md:w-[160px] md:h-[160px] text-pepper-hot" />
                      </div>

                      <div className="flex items-center gap-5 md:gap-8 relative z-10">
                        <div className="relative shrink-0">
                          <img
                            src={leaderboard.mostReviewedMovies[0].movieDetails?.posterUrl}
                            alt={leaderboard.mostReviewedMovies[0].movieDetails?.title}
                            className="w-20 h-32 md:w-24 md:h-36 object-cover rounded-2xl shadow-2xl border-2 border-white/10"
                          />
                          <div className="absolute -top-2 -left-2 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-pepper-hot text-white flex items-center justify-center text-xs md:text-sm font-black shadow-lg">
                            #1
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl md:text-3xl font-black group-hover:text-pepper-hot transition-colors uppercase tracking-tight leading-tight">
                            {leaderboard.mostReviewedMovies[0].movieDetails?.title}
                          </h3>
                          <div className="flex items-center gap-4">
                            <ATAScoreBadge score={leaderboard.mostReviewedMovies[0].movieDetails?.ataScore || 0} size="md" />
                            <span className="text-xs font-bold text-pepper-muted uppercase tracking-widest">
                              {leaderboard.mostReviewedMovies[0].reviewCount} Active Reviews
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* The Rest of Top 10 */}
                    <div className="grid grid-cols-1 gap-4 pt-4">
                      {leaderboard.mostReviewedMovies.slice(1).map((movie, index) => (
                        <Link
                          key={movie._id}
                          to={`/movies/${movie._id}`}
                          className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                        >
                          <div className="w-8 text-center font-black text-pepper-muted group-hover:text-white transition-colors">
                            {index + 2}
                          </div>
                          <img
                            src={movie.movieDetails?.posterUrl}
                            alt={movie.movieDetails?.title}
                            className="w-12 h-16 object-cover rounded-lg shadow-lg shrink-0"
                          />
                          <div className="flex-grow">
                            <h4 className="font-bold group-hover:text-pepper-hot transition-colors line-clamp-1">{movie.movieDetails?.title}</h4>
                            <p className="text-[10px] font-bold text-pepper-muted uppercase tracking-widest">{movie.reviewCount} Reviews</p>
                          </div>
                          <div className="shrink-0">
                            <ATAScoreBadge score={movie.movieDetails?.ataScore || 0} size="sm" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-pepper-muted italic">The Red Carpet is empty for now...</p>
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
