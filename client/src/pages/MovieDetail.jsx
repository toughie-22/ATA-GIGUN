import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../api/movieApi';
import ATAScoreBadge from '../components/ATAScoreBadge';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { GiChiliPepper } from 'react-icons/gi';
import { FiCalendar, FiFilm, FiUser, FiGlobe, FiArrowRight, FiPlay } from 'react-icons/fi';

const languageColors = {
  English: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  Yoruba: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  Igbo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  Pidgin: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
  Mixed: 'bg-pink-500/20 text-pink-400 border-pink-500/20',
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const fetchMovie = async () => {
    try {
      const data = await getMovieById(id);
      const { reviews: movieReviews, ...movieData } = data;
      setMovie(movieData);
      setReviews(movieReviews || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Movie not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const handleReviewAdded = (result) => {
    setReviews(prev => [result.review, ...prev]);
    setMovie(prev => ({ ...prev, ataScore: result.ataScore }));
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(prev => prev.filter(r => r._id !== reviewId));
    fetchMovie();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner" />
          <p className="text-pepper-muted text-sm uppercase tracking-widest font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <GiChiliPepper className="text-5xl text-pepper-muted/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-pepper-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      {/* Hero backdrop */}
      <div className="relative h-[60vh] overflow-hidden">
        {movie.posterUrl && !imgError ? (
          <img 
            src={movie.posterUrl} 
            alt="" 
            className="w-full h-full object-cover opacity-20 blur-xl scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pepper-card to-pepper-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/60 to-transparent" />
      </div>

      {/* Movie info overlaying backdrop */}
      <div className="section-container -mt-96 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Poster */}
          <div className="flex-none w-full max-w-[220px] sm:max-w-[280px] md:max-w-[300px] mx-auto md:mx-0">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 aspect-[2/3] bg-pepper-card relative group">
              {!imgError && movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center bg-gradient-to-br from-pepper-card to-pepper-surface">
                  <GiChiliPepper className="text-6xl text-pepper-hot/20 mb-6" />
                  <p className="text-2xl font-black text-pepper-muted/40 uppercase tracking-tighter">
                    {movie.title}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-16">
            <div className="flex flex-wrap items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="font-bold mb-2 animate-fade-in" style={{ fontSize: 'var(--text-h1)' }}>{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-pepper-muted">
                  <span className="flex items-center gap-1"><FiCalendar size={14} /> {movie.year}</span>
                  <span className="flex items-center gap-1"><FiUser size={14} /> {movie.director}</span>
                  {movie.movieLanguage && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${languageColors[movie.movieLanguage] || ''}`}>
                      <FiGlobe className="inline mr-1" size={12} />{movie.movieLanguage}
                    </span>
                  )}
                  {movie.inCinemas && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pepper-hot/20 text-pepper-hot border border-pepper-hot/20">
                      🎬 In Cinemas
                    </span>
                  )}
                </div>
              </div>
              <ATAScoreBadge score={movie.ataScore} size="lg" />
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre?.map((g, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs bg-pepper-card border border-white/10 text-pepper-muted">
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            {movie.synopsis && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-pepper-muted uppercase tracking-widest mb-2">Synopsis</h3>
                <p className="text-[var(--text-main)] opacity-90 leading-relaxed">{movie.synopsis}</p>
              </div>
            )}

            {/* Cast */}
            {movie.cast?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-pepper-muted uppercase tracking-widest mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs bg-pepper-card border border-[var(--border-color)] text-[var(--text-main)]">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Movie (YouTube) */}
        {movie.isYouTubeFilm && movie.fullMovieUrl && (
          <div className="mt-12 p-8 rounded-3xl bg-pepper-card border-2 border-pepper-gold/30 shadow-2xl animate-fade-in text-center">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="p-3 bg-pepper-gold/20 rounded-2xl text-pepper-gold">
                <FiFilm size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Full Movie Available</h3>
                <p className="text-sm text-pepper-muted">This title is available for free on YouTube via official channels.</p>
              </div>
            </div>
            <a 
              href={movie.fullMovieUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-4 shadow-pepper-gold/20"
            >
              Watch on YouTube <FiArrowRight />
            </a>
          </div>
        )}

        {/* Trailer / External Link */}
        {!movie.isYouTubeFilm && movie.trailerUrl && (
          <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="p-2 bg-pepper-muted/10 rounded-lg">
                <FiPlay className="text-pepper-muted" size={20} />
              </div>
              <div>
                <h4 className="font-bold">Interested in this film?</h4>
                <p className="text-xs text-pepper-muted">Watch the trailer or find more info on the official source.</p>
              </div>
            </div>
            <a 
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/10 hover:bg-white/10 transition-all font-semibold text-sm"
            >
              View Official Trailer <FiArrowRight size={14} />
            </a>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ReviewForm movieId={movie._id} onReviewAdded={handleReviewAdded} />
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">
              Reviews ({reviews.length})
            </h3>
            <ReviewList reviews={reviews} onReviewDeleted={handleReviewDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
