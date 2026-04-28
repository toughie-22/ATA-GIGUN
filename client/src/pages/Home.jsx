import { useState, useEffect } from 'react';
import { getMovies, getTrendingMovies } from '../api/movieApi';
import HeroSection from '../components/HeroSection';
import MovieSection from '../components/MovieSection';

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
          getTrendingMovies('year')
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

  // Derived sections
  const inCinemas = allMovies.filter(m => m.inCinemas);
  const featured = trendingWeek[0] || allMovies[0] || null;
  const freeMovies = allMovies.filter(m => m.isYouTubeFilm);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-pepper-gold/30 border-t-pepper-gold rounded-full animate-spin" />
          <p className="text-pepper-muted text-sm uppercase tracking-widest font-bold">Heating up...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection featuredMovie={featured} />

      <div className="section-container pb-20 space-y-12">
        {/* Weekly Trending - The Limelight */}
        {trendingWeek.length > 0 && (
          <div className="pt-12">
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

        {/* Other Sections */}
        {inCinemas.length > 0 && (
          <MovieSection
            title="Currently in Cinemas"
            emoji="🎬"
            movies={inCinemas}
            linkTo="/discover?inCinemas=true"
          />
        )}

        {freeMovies.length > 0 && (
          <MovieSection
            title="Watch Free on YouTube"
            emoji="🍿"
            movies={freeMovies}
            linkTo="/discover?type=youtube"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
