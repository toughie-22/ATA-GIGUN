import { useState, useEffect } from 'react';
import { getMovies, getTrendingMovies } from '../api/movieApi';
import HeroSection from '../components/HeroSection';
import MovieSection from '../components/MovieSection';
import { GiChiliPepper } from 'react-icons/gi';
import { Link } from 'react-router-dom';

/* ── Skeleton for the movie card grid ── */
const CardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-pepper-card border border-white/5">
    <div className="skeleton aspect-[2/3]" />
    <div className="p-3 space-y-2">
      <div className="skeleton h-3.5 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  </div>
);

/* ── Full-page skeleton that mirrors the actual Home layout ── */
const HomeSkeleton = () => (
  <div className="min-h-screen">
    {/* Hero skeleton */}
    <div className="relative min-h-[80vh] sm:min-h-screen flex items-center pt-20 bg-[var(--bg-main)]">
      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="skeleton h-5 w-48 rounded-full" />
            <div className="space-y-3">
              <div className="skeleton h-12 sm:h-16 w-4/5 rounded-xl" />
              <div className="skeleton h-12 sm:h-16 w-3/5 rounded-xl" />
              <div className="skeleton h-12 sm:h-16 w-4/5 rounded-xl" />
            </div>
            <div className="skeleton h-16 w-full max-w-md rounded-lg" />
            <div className="flex gap-4">
              <div className="skeleton h-12 w-36 rounded-lg" />
              <div className="skeleton h-12 w-36 rounded-lg" />
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-5">
            <div className="skeleton aspect-[2/3] rounded-3xl" />
          </div>
        </div>
      </div>
    </div>

    {/* Movie section skeletons */}
    <div className="section-container pb-12 space-y-12">
      {[0, 1].map(s => (
        <div key={s} className="py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="skeleton h-6 w-8 rounded" />
            <div className="skeleton h-6 w-40 rounded" />
          </div>
          {/* Responsive skeleton grid matching real breakpoints */}
          <div className="movie-grid grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Home = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [trendingWeek, setTrendingWeek] = useState([]);
  const [trendingMonth, setTrendingMonth] = useState([]);
  const [trendingYear, setTrendingYear] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movies, week, month, year] = await Promise.all([
          getMovies({ limit: 50 }),
          getTrendingMovies('week'),
          getTrendingMovies('month'),
          getTrendingMovies('year'),
        ]);
        setAllMovies(movies);
        setTrendingWeek(week);
        setTrendingMonth(month);
        setTrendingYear(year);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <HomeSkeleton />;

  // Derived sections
  const inCinemas = allMovies.filter(m => m.inCinemas);
  const featured = trendingWeek[0] || allMovies[0] || null;
  const freeMovies = allMovies.filter(m => m.isYouTubeFilm);

  const hasContent = trendingWeek.length > 0 || trendingMonth.length > 0 || trendingYear.length > 0;

  return (
    <div className="min-h-screen">
      <HeroSection featuredMovie={featured} />

      <div className="section-container pb-12 sm:pb-20 space-y-0">

        {/* Empty state if no content */}
        {!hasContent && (
          <div className="text-center py-20 space-y-4">
            <GiChiliPepper className="text-5xl text-pepper-muted/20 mx-auto" aria-hidden="true" />
            <h2 className="text-xl font-bold">No Movies Yet</h2>
            <p className="text-pepper-muted text-sm max-w-xs mx-auto">
              We're adding the heat. Come back soon — or explore what's already listed.
            </p>
            <Link to="/discover" className="btn-primary inline-flex mt-2">
              Browse Movies
            </Link>
          </div>
        )}

        {/* Weekly Trending */}
        {trendingWeek.length > 0 && (
          <div className="pt-8 sm:pt-12">
            <MovieSection
              title="Top Rated This Week"
              emoji="🔥"
              movies={trendingWeek}
              linkTo="/discover?sort=score"
            />
          </div>
        )}

        {/* Monthly Trending */}
        {trendingMonth.length > 0 && (
          <MovieSection
            title="Hits of the Month"
            emoji="🌶️"
            movies={trendingMonth}
            linkTo="/discover?sort=score"
          />
        )}

        {/* Yearly Trending */}
        {trendingYear.length > 0 && (
          <MovieSection
            title="Best of the Year"
            emoji="🏆"
            movies={trendingYear}
            linkTo="/discover?sort=score"
          />
        )}

        {/* In Cinemas */}
        {inCinemas.length > 0 && (
          <MovieSection
            title="Currently in Cinemas"
            emoji="🎬"
            movies={inCinemas}
            linkTo="/discover?inCinemas=true"
          />
        )}

        {/* Free on YouTube */}
        {freeMovies.length > 0 && (
          <MovieSection
            title="Watch Free on YouTube"
            emoji="🍿"
            movies={freeMovies}
            linkTo="/discover?type=youtube"
          />
        )}

        {/* ── About ATA GiGUN Section ── */}
        <div className="about-strip mt-12 sm:mt-16 animate-fade-in">
          <div className="flex items-start gap-4">
            <GiChiliPepper className="text-pepper-red text-2xl sm:text-3xl shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-2">
              <h2
                className="font-black text-[var(--text-main)]"
                style={{ fontSize: 'var(--text-h3)' }}
              >
                What is ATA GiGUN?
              </h2>
              <p className="text-pepper-muted leading-relaxed" style={{ fontSize: 'var(--text-body)' }}>
                <strong className="text-[var(--text-main)]">ATA GiGUN</strong> (Yoruba for{' '}
                <em>ground pepper</em> 🌶️) is Nigeria's home for honest Nollywood film ratings. No
                politics, no hype — just the raw, community-driven heat on every movie that matters.
                Rate, review, and discover the best (and worst) of Nollywood cinema. If it's fire,
                we'll know.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/discover" className="btn-primary text-sm px-4 py-2">
                  Start Exploring
                </Link>
                <Link
                  to="/hall-of-fame"
                  className="btn-ghost text-sm px-4 py-2"
                >
                  View Top Rated
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
