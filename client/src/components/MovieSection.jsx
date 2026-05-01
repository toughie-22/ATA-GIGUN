import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import MovieCard from './MovieCard';

const MovieSection = ({ title, movies, linkTo, emoji }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 border-b border-white/5 last:border-0">
      {/* Section header */}
      <div className="flex items-end justify-between mb-4 sm:mb-8 gap-4">
        <div className="space-y-1 group min-w-0">
          <h2
            className="font-black flex items-center gap-2 sm:gap-3 transition-all duration-300 group-hover:translate-x-1"
            style={{ fontSize: 'var(--text-h2)' }}
          >
            {emoji && <span className="shrink-0">{emoji}</span>}
            <span className="bg-gradient-to-r from-[var(--text-main)] to-pepper-gold bg-clip-text text-transparent group-hover:to-pepper-red transition-all duration-500 truncate">
              {title}
            </span>
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-pepper-red to-pepper-gold rounded-full" />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {linkTo && (
            <Link
              to={linkTo}
              className="flex items-center gap-1.5 text-sm font-bold text-pepper-muted hover:text-white transition-colors group/link"
            >
              <span className="hidden sm:inline">Explore All</span>
              <FiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          )}
          {/* Scroll buttons — desktop only */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-pepper-muted hover:text-white hover:bg-white/10 transition-all"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-pepper-muted hover:text-white hover:bg-white/10 transition-all"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        role="list"
        aria-label={title}
      >
        {movies.map((movie, index) => (
          <div
            key={movie._id}
            role="listitem"
            /* Responsive card widths for the horizontal carousel */
            className="flex-none w-[130px] xs:w-[150px] sm:w-[185px] md:w-[210px] lg:w-[220px]"
          >
            <MovieCard
              movie={movie}
              rank={
                title.includes('Rated') || title.includes('Best') || title.includes('Hits')
                  ? index + 1
                  : null
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieSection;
