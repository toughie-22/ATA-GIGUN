import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import MovieCard from './MovieCard';

const MovieSection = ({ title, movies, linkTo, emoji }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-12 border-b border-white/5 last:border-0">
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1 group">
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 transition-all duration-300 group-hover:translate-x-2">
            {emoji && <span className="text-3xl drop-shadow-lg">{emoji}</span>}
            <span className="bg-gradient-to-r from-[var(--text-main)] to-pepper-gold bg-clip-text text-transparent group-hover:to-pepper-hot transition-all duration-500">
              {title}
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-pepper-hot to-pepper-gold rounded-full shadow-[0_0_10px_rgba(255,65,54,0.4)]" />
        </div>
        
        <div className="flex items-center gap-4">
          {linkTo && (
            <Link
              to={linkTo}
              className="flex items-center gap-2 text-sm font-bold text-pepper-muted hover:text-white transition-colors group"
            >
              Explore All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-pepper-muted hover:text-white hover:bg-white/10 transition-all"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-pepper-muted hover:text-white hover:bg-white/10 transition-all"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {movies.map((movie, index) => (
          <div key={movie._id} className="flex-none w-[200px] sm:w-[240px] md:w-[260px]">
            <MovieCard movie={movie} rank={title.includes('Rated') || title.includes('Best') || title.includes('Hits') ? index + 1 : null} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieSection;
