import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { GiChiliPepper } from 'react-icons/gi';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

/* ── Per-breakpoint skeleton grid ── */
const DiscoverSkeleton = () => (
  <div className="movie-grid grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="rounded-xl overflow-hidden bg-pepper-card border border-white/5">
        <div className="skeleton aspect-[2/3]" />
        <div className="p-3 space-y-2">
          <div className="skeleton h-3.5 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre:     searchParams.get('genre') || '',
    language:  searchParams.get('language') || '',
    year:      searchParams.get('year') || '',
    inCinemas: searchParams.get('inCinemas') === 'true',
    sort:      searchParams.get('sort') || '',
    search:    searchParams.get('search') || '',
  });

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.genre)     params.genre = filters.genre;
        if (filters.language)  params.language = filters.language;
        if (filters.year)      params.year = filters.year;
        if (filters.inCinemas) params.inCinemas = 'true';
        if (filters.sort)      params.sort = filters.sort;
        if (filters.search)    params.search = filters.search;
        const data = await getMovies(params);
        setMovies(data);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [filters]);

  // Sync URL search param
  useEffect(() => {
    const search = searchParams.get('search');
    if (search && search !== filters.search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  return (
    /* pt-24 ensures content sits below the 80px fixed navbar with extra buffer */
    <div className="pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-bold mb-1" style={{ fontSize: 'var(--text-h1)' }}>
            {filters.search ? (
              <>Search: <span className="text-gradient">"{filters.search}"</span></>
            ) : (
              <>Discover <span className="text-gradient">Movies</span></>
            )}
          </h1>
          <p className="text-pepper-muted" style={{ fontSize: 'var(--text-body)' }}>
            Browse and filter the best of Nollywood cinema
          </p>
        </div>

        {/* Search bar — theme-aware text/border colors */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              aria-label="Search movies by title"
              className="w-full pl-10 pr-4 py-3 bg-pepper-card border border-[var(--border-color)] rounded-lg text-[var(--text-main)] placeholder:text-pepper-muted focus:outline-none focus:border-pepper-gold/50 focus:ring-1 focus:ring-pepper-gold/20 transition-all"
              style={{ fontSize: 'var(--text-body)' }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results */}
        {loading ? (
          <DiscoverSkeleton />
        ) : movies.length > 0 ? (
          <>
            <p
              className="text-pepper-muted mb-4"
              style={{ fontSize: 'var(--text-sm)' }}
              aria-live="polite"
            >
              {movies.length} movie{movies.length !== 1 ? 's' : ''} found
            </p>
            {/* Responsive grid — 320:1col, 360:2col, 481:3col, 768:4col, 1024:5col */}
            <div className="movie-grid grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              {movies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-20 space-y-4">
            <GiChiliPepper className="text-5xl text-pepper-muted/20 mx-auto" aria-hidden="true" />
            <h2 className="text-xl font-bold">No Movies Found</h2>
            <p className="text-pepper-muted text-sm max-w-xs mx-auto">
              Try adjusting your filters or search for a different title.
              Nollywood has thousands of films — keep looking!
            </p>
            <Link to="/discover" className="btn-primary inline-flex mt-2 text-sm px-5 py-2.5">
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
