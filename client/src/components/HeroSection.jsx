import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const HeroSection = ({ featuredMovie }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[var(--bg-main)] transition-colors duration-500">
      {/* Background with advanced gradient layering */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {featuredMovie?.posterUrl && !imgError ? (
          <div className="relative w-full h-full">
            <img
              src={featuredMovie.posterUrl}
              alt=""
              className="w-full h-full object-cover opacity-20 dark:opacity-30 blur-[4px]"
              onError={() => setImgError(true)}
            />
            {/* Theme-aware gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-[var(--bg-main)]/40" />
          </div>
        ) : (
          <div className="w-full h-full bg-[var(--bg-main)]" />
        )}
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-pepper-hot/5"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${2 + (i % 3) * 1.5}rem`,
            }}
          >
            <GiChiliPepper />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 section-container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-pepper-card/50 border border-white/10 dark:border-white/5 animate-fade-in shadow-xl backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pepper-hot opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pepper-hot"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-pepper-hot">The Home of Nollywood</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] animate-slide-up text-[var(--text-main)] transition-colors duration-500">
                BRING THE <br />
                <span className="text-gradient">HEAT TO</span> <br />
                NOLLYWOOD
              </h1>
              <p className="text-lg sm:text-xl text-pepper-muted max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Discover, rate, and review the best of Nigerian cinema. From blockbusters to hidden gems — experience the movie score system that matters.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/discover" className="btn-primary flex items-center gap-3 text-lg">
                Explore Movies <FiArrowRight />
              </Link>
              {featuredMovie && (
                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="flex items-center gap-3 px-8 py-3 rounded-lg bg-pepper-card/50 border border-pepper-gold/20 hover:bg-pepper-gold/10 hover:border-pepper-gold/40 transition-all group backdrop-blur-sm"
                >
                  <FiPlay className="text-pepper-gold group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Watch Trailer</span>
                </Link>
              )}
            </div>

            {/* Platform Stats */}
            <div className="flex gap-12 pt-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div>
                <p className="text-3xl font-black">23+</p>
                <p className="text-xs font-bold tracking-widest uppercase text-pepper-muted">Classics</p>
              </div>
              <div className="w-px h-10 bg-pepper-muted/20 self-center" />
              <div>
                <p className="text-3xl font-black">🌶️</p>
                <p className="text-xs font-bold tracking-widest uppercase text-pepper-muted">Certified</p>
              </div>
              <div className="w-px h-10 bg-pepper-muted/20 self-center" />
              <div>
                <p className="text-3xl font-black uppercase">ATA</p>
                <p className="text-xs font-bold tracking-widest uppercase text-pepper-muted">Score System</p>
              </div>
            </div>
          </div>

          {/* Featured Poster Card (Desktop) */}
          {featuredMovie && (
            <div className="hidden lg:block lg:col-span-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative group perspective-1000">
                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 transform transition-transform duration-700 group-hover:scale-[1.02] group-hover:rotate-1 bg-pepper-card">
                  {!imgError && featuredMovie.posterUrl ? (
                    <img
                      src={featuredMovie.posterUrl}
                      alt={featuredMovie.title}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-pepper-card to-pepper-surface">
                      <GiChiliPepper className="text-7xl text-pepper-hot/20 mb-6" />
                      <p className="text-3xl font-black text-pepper-muted/40 uppercase tracking-tighter">
                        {featuredMovie.title}
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-xs font-bold tracking-widest uppercase text-pepper-gold mb-1">Featured Film</p>
                    <h3 className="text-3xl font-bold text-white leading-none">{featuredMovie.title}</h3>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-pepper-gold/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pepper-hot/10 blur-3xl rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
