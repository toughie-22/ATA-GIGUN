import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import FilterBar from '../components/FilterBar';
import { GiChiliPepper } from 'react-icons/gi';

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || '',
    language: searchParams.get('language') || '',
    year: searchParams.get('year') || '',
    inCinemas: searchParams.get('inCinemas') === 'true',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.genre) params.genre = filters.genre;
        if (filters.language) params.language = filters.language;
        if (filters.year) params.year = filters.year;
        if (filters.inCinemas) params.inCinemas = 'true';
        if (filters.sort) params.sort = filters.sort;
        if (filters.search) params.search = filters.search;

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

  // Sync search param from URL
  useEffect(() => {
    const search = searchParams.get('search');
    if (search && search !== filters.search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  return (
    <div className="pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">
            {filters.search ? `Search: "${filters.search}"` : 'Discover Movies'}
          </h1>
          <p className="text-pepper-muted text-sm">
            Browse and filter the best of Nollywood cinema
          </p>
        </div>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full max-w-md px-4 py-2.5 bg-pepper-card border border-white/10 rounded-lg text-sm text-white placeholder-pepper-muted focus:outline-none focus:border-pepper-gold/50 focus:ring-1 focus:ring-pepper-gold/30 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="skeleton aspect-[2/3]" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <p className="text-sm text-pepper-muted mb-4">{movies.length} movie{movies.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <GiChiliPepper className="text-5xl text-pepper-muted/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Movies Found</h3>
            <p className="text-pepper-muted text-sm">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
