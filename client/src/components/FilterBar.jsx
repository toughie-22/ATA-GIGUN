const GENRES = ['Action', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Thriller', 'Biography', 'Historical', 'Mystery', 'Faith'];
const LANGUAGES = ['English', 'Yoruba', 'Igbo', 'Pidgin', 'Mixed'];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFilterChange({ genre: '', language: '', year: '', inCinemas: false, sort: '' });
  };

  const hasFilters = filters.genre || filters.language || filters.year || filters.inCinemas || filters.sort;

  return (
    <div className="p-4 rounded-xl bg-pepper-card border border-[var(--border-color)]">
      <div className="flex flex-nowrap md:flex-wrap gap-3 items-end overflow-x-auto no-scrollbar pb-2 md:pb-0">
        {/* Genre */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-pepper-muted mb-1.5">Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleChange('genre', e.target.value)}
            className="w-full px-3 py-2 bg-pepper-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pepper-gold/50 appearance-none cursor-pointer"
          >
            <option value="">All Genres</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Language */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-pepper-muted mb-1.5">Language</label>
          <select
            value={filters.language || ''}
            onChange={(e) => handleChange('language', e.target.value)}
            className="w-full px-3 py-2 bg-pepper-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pepper-gold/50 appearance-none cursor-pointer"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs text-pepper-muted mb-1.5">Year</label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
            className="w-full px-3 py-2 bg-pepper-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pepper-gold/50 appearance-none cursor-pointer"
          >
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-pepper-muted mb-1.5">Sort By</label>
          <select
            value={filters.sort || ''}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-3 py-2 bg-pepper-dark border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-pepper-gold/50 appearance-none cursor-pointer"
          >
            <option value="">Recently Added</option>
            <option value="release">Latest Releases</option>
            <option value="score">ATA Score</option>
            <option value="year">Year</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* In Cinemas toggle */}
        <div className="flex items-center gap-2 pb-0.5">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inCinemas || false}
              onChange={(e) => handleChange('inCinemas', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-pepper-dark rounded-full peer peer-checked:bg-pepper-green border border-white/10 peer-checked:border-pepper-green after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
          </label>
          <span className="text-xs text-pepper-muted whitespace-nowrap">In Cinemas</span>
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={handleReset}
            className="px-3 py-2 text-xs text-pepper-hot hover:bg-white/5 rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
