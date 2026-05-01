import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';
import { FiArrowRight } from 'react-icons/fi';
import ATAScoreBadge from './ATAScoreBadge';

const languageColors = {
  English: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  Yoruba:  'bg-purple-500/20 text-purple-400 border-purple-500/20',
  Igbo:    'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
  Pidgin:  'bg-amber-500/20 text-amber-400 border-amber-500/20',
  Mixed:   'bg-pink-500/20 text-pink-400 border-pink-500/20',
};

const MovieCard = ({ movie, rank }) => {
  const [imgError, setImgError] = useState(false);
  const [tapped, setTapped] = useState(false);

  const handleTap = (e) => {
    // Only intercept on touch devices to show overlay before navigating
    if (window.matchMedia('(hover: none)').matches) {
      if (!tapped) {
        e.preventDefault();
        setTapped(true);
      }
      // Second tap navigates naturally
    }
  };

  return (
    <Link
      to={`/movies/${movie._id}`}
      onClick={handleTap}
      className="group block relative rounded-2xl overflow-hidden bg-pepper-card border border-white/5 hover:border-pepper-gold/30 hover:-translate-y-1 transition-all duration-400 shadow-lg hover:shadow-pepper-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-pepper-gold"
      aria-label={`${movie.title}${movie.year ? ` (${movie.year})` : ''} — ATA Score: ${movie.ataScore || 0}`}
    >
      {/* Rank badge */}
      {rank && (
        <div className="absolute top-2 left-2 z-20 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pepper-gold to-pepper-red text-white rounded-xl shadow-xl border border-white/20 transform -rotate-12 group-hover:rotate-0 transition-all duration-400">
          <span className="text-xs sm:text-sm font-black">#{rank}</span>
        </div>
      )}

      {/* Poster — enforced 2:3 aspect ratio */}
      <div className="relative aspect-[2/3] overflow-hidden bg-pepper-dark">
        {!imgError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
            onError={() => setImgError(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          /* Fallback when no poster */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-pepper-card to-pepper-dark">
            <GiChiliPepper className="text-3xl sm:text-4xl text-pepper-red/20 mb-3 group-hover:scale-125 group-hover:text-pepper-red/40 transition-all duration-400" />
            <div className="space-y-1">
              <p className="text-sm font-black leading-tight text-pepper-muted/50 uppercase tracking-tighter line-clamp-3">
                {movie.title}
              </p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-pepper-gold/30 uppercase">
                ATA GiGUN
              </p>
            </div>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pepper-dark via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

        {/* ATA Score badge */}
        <div className="absolute top-2 right-2 z-20">
          <ATAScoreBadge score={movie.ataScore} size="sm" />
        </div>

        {/* Language badge */}
        {movie.movieLanguage && (
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${languageColors[movie.movieLanguage] || 'bg-gray-500/20 text-gray-400 border-white/10'}`}>
            {movie.movieLanguage}
          </div>
        )}

        {/* ── Hover / Tap Overlay ──────────────────────────────
            Desktop: shows on CSS hover
            Mobile: shows when tapped (tapped state = true)
        */}
        <div className={`card-tap-overlay z-30 ${tapped ? 'is-tapped' : ''}`}>
          {movie.synopsis && (
            <p className="text-white text-xs leading-relaxed line-clamp-3 mb-3 opacity-90">
              {movie.synopsis}
            </p>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pepper-red text-white text-xs font-bold rounded-lg">
            View Details <FiArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 space-y-1">
        <h3 className="font-bold text-sm leading-tight group-hover:text-pepper-gold transition-colors line-clamp-2" style={{ fontSize: 'var(--text-sm)' }}>
          {movie.title}
        </h3>
        <div className="flex items-center justify-between" style={{ fontSize: 'var(--text-xs)' }}>
          <span className="font-semibold text-pepper-muted">{movie.year}</span>
          <div className="flex gap-1 min-w-0 overflow-hidden">
            {movie.genre?.slice(0, 1).map((g, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 truncate max-w-[80px]">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
