const GENRES = ['Action', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Thriller', 'Biography', 'Historical', 'Mystery', 'Faith'];
const LANGUAGES = ['English', 'Yoruba', 'Igbo', 'Pidgin', 'Mixed'];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

/* Theme-aware select styles — works in both light and dark mode */
const selectClass = 'w-full px-3 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-pepper-gold/50 appearance-none cursor-pointer transition-colors min-h-[44px]';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFilterChange({ genre: '', language: '', year: '', inCinemas: false, sort: '' });
  };

  const hasFilters = filters.genre || filters.language || filters.year || filters.inCinemas || filters.sort;

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-pepper-card border border-[var(--border-color)]">
      {/* 
        Scrollable row on small screens — each filter item has min-w so
        it doesn't shrink to zero on 360px. Wraps on md+.
      */}
      <div className="flex flex-nowrap md:flex-wrap gap-2 sm:gap-3 items-end overflow-x-auto no-scrollbar pb-1 md:pb-0">

        {/* Genre */}
        <div className="flex-none w-[130px] sm:flex-1 sm:min-w-[130px]">
          <label className="block text-xs text-pepper-muted mb-1.5 font-semibold" htmlFor="filter-genre">
            Genre
          </label>
          <select
            id="filter-genre"
            value={filters.genre || ''}
            onChange={(e) => handleChange('genre', e.target.value)}
            className={selectClass}
          >
            <option value="">All Genres</option>
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Language */}
        <div className="flex-none w-[130px] sm:flex-1 sm:min-w-[130px]">
          <label className="block text-xs text-pepper-muted mb-1.5 font-semibold" htmlFor="filter-language">
            Language
          </label>
          <select
            id="filter-language"
            value={filters.language || ''}
            onChange={(e) => handleChange('language', e.target.value)}
            className={selectClass}
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="flex-none w-[100px] sm:flex-1 sm:min-w-[100px]">
          <label className="block text-xs text-pepper-muted mb-1.5 font-semibold" htmlFor="filter-year">
            Year
          </label>
          <select
            id="filter-year"
            value={filters.year || ''}
            onChange={(e) => handleChange('year', e.target.value)}
            className={selectClass}
          >
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div className="flex-none w-[140px] sm:flex-1 sm:min-w-[140px]">
          <label className="block text-xs text-pepper-muted mb-1.5 font-semibold" htmlFor="filter-sort">
            Sort By
          </label>
          <select
            id="filter-sort"
            value={filters.sort || ''}
            onChange={(e) => handleChange('sort', e.target.value)}
            className={selectClass}
          >
            <option value="">Recently Added</option>
            <option value="release">Latest Releases</option>
            <option value="score">ATA Score</option>
            <option value="year">Year</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        {/* In Cinemas toggle */}
        <div className="flex items-center gap-2 pb-1 shrink-0">
          <label className="relative inline-flex items-center cursor-pointer gap-2" htmlFor="filter-cinemas">
            <input
              id="filter-cinemas"
              type="checkbox"
              checked={filters.inCinemas || false}
              onChange={(e) => handleChange('inCinemas', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[var(--bg-surface)] rounded-full peer peer-checked:bg-pepper-red border border-[var(--border-color)] peer-checked:border-pepper-red after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            <span className="text-xs text-pepper-muted whitespace-nowrap font-semibold">In Cinemas</span>
          </label>
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={handleReset}
            className="flex-none px-3 py-2 text-xs text-pepper-red hover:bg-white/5 rounded-lg transition-colors font-bold min-h-[44px]"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
