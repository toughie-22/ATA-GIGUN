import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';
import ATAScoreBadge from './ATAScoreBadge';

const MovieCard = ({ movie, rank }) => {
  const [imgError, setImgError] = useState(false);

  const languageColors = {
    English: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
    Yoruba: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
    Igbo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
    Pidgin: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
    Mixed: 'bg-pink-500/20 text-pink-400 border-pink-500/20',
  };

  return (
    <Link
      to={`/movies/${movie._id}`}
      className="group block relative rounded-2xl overflow-hidden bg-pepper-card border border-white/5 hover:border-pepper-gold/30 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-pepper-gold/10"
    >
      {/* Ranking Badge */}
      {rank && (
        <div className="absolute top-3 left-3 z-20 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-pepper-gold to-pepper-hot text-white rounded-xl shadow-2xl border border-white/20 transform -rotate-12 group-hover:rotate-0 transition-all duration-500">
          <span className="text-lg font-black tracking-tighter">#{rank}</span>
        </div>
      )}

      {/* Poster Image or Fallback */}
      <div className="relative aspect-[2/3] overflow-hidden bg-pepper-dark">
        {!imgError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          /* Premium CSS Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-pepper-card to-pepper-dark group-hover:scale-110 transition-transform duration-700">
            <GiChiliPepper className="text-4xl text-pepper-hot/20 mb-4 group-hover:scale-125 group-hover:text-pepper-hot/40 transition-all duration-500" />
            <div className="space-y-1">
              <p className="text-lg font-black leading-tight text-pepper-muted/50 uppercase tracking-tighter line-clamp-3">
                {movie.title}
              </p>
              <p className="text-[10px] font-bold tracking-[0.2em] text-pepper-gold/30 uppercase">
                ATA GiGUN Original
              </p>
            </div>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-pepper-dark via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Score Badge */}
        <div className="absolute top-3 right-3 z-20 transform group-hover:scale-110 transition-transform">
          <ATAScoreBadge score={movie.ataScore} size="sm" />
        </div>

        {/* Language badge */}
        {movie.movieLanguage && (
          <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${languageColors[movie.movieLanguage] || 'bg-gray-500/20 text-gray-400 border-white/10'}`}>
            {movie.movieLanguage}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold leading-tight group-hover:text-pepper-gold transition-colors line-clamp-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-pepper-muted">
          <span className="font-semibold">{movie.year}</span>
          <div className="flex gap-1">
            {movie.genre?.slice(0, 1).map((g, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
