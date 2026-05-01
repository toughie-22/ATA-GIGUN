import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const HeroSection = ({ featuredMovie }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <section className="relative flex items-center pt-16 sm:pt-20 overflow-hidden bg-[var(--bg-main)] transition-colors duration-500 min-h-[85vh] sm:min-h-screen">
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

      {/* Animated Background Elements — fewer on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-pepper-hot/5"
            style={{
              left: `${10 + i * 18}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.7}s`,
              fontSize: `${1.5 + (i % 3)}rem`,
            }}
          >
            <GiChiliPepper />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 section-container py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-8">

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] animate-slide-up text-[var(--text-main)] transition-colors duration-500 uppercase">
                THE ULTIMATE <br />
                <span className="text-gradient">NOLLYWOOD</span> <br />
                HEAT CHECK
              </h1>
              <p className="text-sm sm:text-xl text-pepper-muted max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Unfiltered reviews, pure fire insights, and real rewards. Drop the hottest takes—our <span className="text-pepper-hot font-black">Top 3 Critics win big every 2 months.</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/discover" className="btn-primary flex items-center gap-2 text-sm sm:text-lg px-5 py-3 sm:px-8 sm:py-4">
                Explore Movies <FiArrowRight />
              </Link>
              {featuredMovie && (
                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="flex items-center gap-2 px-5 py-3 sm:px-8 sm:py-4 rounded-lg bg-pepper-card/50 border border-pepper-gold/20 hover:bg-pepper-gold/10 hover:border-pepper-gold/40 transition-all group backdrop-blur-sm text-sm sm:text-base"
                >
                  <FiPlay className="text-pepper-gold group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Watch Trailer</span>
                </Link>
              )}
            </div>

            {/* Platform Stats — more compact on mobile */}
            <div className="flex gap-6 sm:gap-12 pt-2 sm:pt-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div>
                <p className="text-2xl sm:text-3xl font-black">23+</p>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pepper-muted">Classics</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-pepper-muted/20 self-center" />
              <div>
                <p className="text-2xl sm:text-3xl font-black">🌶️</p>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pepper-muted">Certified</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-pepper-muted/20 self-center" />
              <div>
                <p className="text-2xl sm:text-3xl font-black uppercase">ATA</p>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pepper-muted">Score System</p>
              </div>
            </div>
          </div>

          {/* Featured Poster Card (Desktop only) */}
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
