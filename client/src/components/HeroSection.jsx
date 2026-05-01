import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const HeroSection = ({ featuredMovie }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      className="relative flex items-center pt-16 sm:pt-20 overflow-hidden bg-[var(--bg-main)] transition-colors duration-500 min-h-[80vh] sm:min-h-screen"
      aria-label="Hero — Featured Nollywood content"
    >
      {/* ── Blurred background poster ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {featuredMovie?.posterUrl && !imgError ? (
          <div className="relative w-full h-full">
            <img
              src={featuredMovie.posterUrl}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-15 blur-[6px] scale-110"
              onError={() => setImgError(true)}
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-[var(--bg-main)]/50" />
          </div>
        ) : (
          <div className="w-full h-full bg-[var(--bg-main)]" />
        )}
      </div>

      {/* ── Floating chili decorations ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float text-pepper-red/5"
            style={{
              left: `${12 + i * 22}%`,
              top: `${15 + (i % 3) * 22}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${1.2 + (i % 3) * 0.5}rem`,
            }}
          >
            <GiChiliPepper />
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 section-container py-8 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Text block */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-8">

            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pepper-red/10 border border-pepper-red/20 animate-fade-in">
              <GiChiliPepper className="text-pepper-red text-sm" />
              <span className="text-xs font-bold uppercase tracking-widest text-pepper-red">
                Nigeria's #1 Nollywood Ratings Platform
              </span>
            </div>

            {/* ── H1 — fluid scaling via CSS clamp ── */}
            <div className="space-y-2 sm:space-y-4">
              {/* Full headline on 481px+ */}
              <h1
                className="hidden sm:block font-black tracking-tighter leading-[0.9] animate-slide-up text-[var(--text-main)] uppercase"
                style={{ fontSize: 'var(--text-hero)' }}
              >
                THE ULTIMATE <br />
                <span className="text-gradient">NOLLYWOOD</span> <br />
                HEAT CHECK
              </h1>
              {/* Condensed headline on ≤480px — avoids 3 lines on tiny screens */}
              <h1
                className="block sm:hidden font-black tracking-tighter leading-tight animate-slide-up text-[var(--text-main)] uppercase"
                style={{ fontSize: 'clamp(1.6rem, 9vw, 2.4rem)' }}
              >
                NOLLYWOOD <br />
                <span className="text-gradient">HEAT CHECK</span>
              </h1>

              <p
                className="text-pepper-muted max-w-xl leading-relaxed animate-slide-up"
                style={{ fontSize: 'var(--text-body)', animationDelay: '0.2s' }}
              >
                Unfiltered reviews, pure fire insights, and real rewards. Drop the hottest takes —
                our <span className="text-pepper-red font-black">Top 3 Critics win big every 2 months.</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 sm:gap-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/discover"
                className="btn-primary text-sm sm:text-base px-5 py-2.5 sm:px-7 sm:py-3"
              >
                Explore Movies <FiArrowRight />
              </Link>
              {featuredMovie && (
                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-lg bg-pepper-card/50 border border-pepper-gold/20 hover:bg-pepper-gold/10 hover:border-pepper-gold/40 transition-all group backdrop-blur-sm text-sm sm:text-base font-semibold"
                >
                  <FiPlay className="text-pepper-gold group-hover:scale-110 transition-transform shrink-0" />
                  <span>Featured Film</span>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div
              className="flex gap-5 sm:gap-10 pt-2 sm:pt-6 animate-slide-up"
              style={{ animationDelay: '0.6s' }}
              aria-label="Platform statistics"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-black">23+</p>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pepper-muted">Classics</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-pepper-muted/20 self-center" aria-hidden="true" />
              <div>
                <p className="text-2xl sm:text-3xl font-black">🌶️</p>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pepper-muted">Certified</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-pepper-muted/20 self-center" aria-hidden="true" />
              <div>
                <p className="text-2xl sm:text-3xl font-black uppercase">ATA</p>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pepper-muted">Score System</p>
              </div>
            </div>
          </div>

          {/* Featured poster — desktop only */}
          {featuredMovie && (
            <div className="hidden lg:block lg:col-span-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative group">
                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform transition-transform duration-700 group-hover:scale-[1.02] group-hover:rotate-1 bg-pepper-card">
                  {!imgError && featuredMovie.posterUrl ? (
                    <img
                      src={featuredMovie.posterUrl}
                      alt={featuredMovie.title}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-pepper-card to-pepper-surface">
                      <GiChiliPepper className="text-6xl text-pepper-red/20 mb-6" />
                      <p className="text-2xl font-black text-pepper-muted/40 uppercase tracking-tighter">
                        {featuredMovie.title}
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-xs font-bold tracking-widest uppercase text-pepper-gold mb-1">Featured Film</p>
                    <h3 className="text-2xl font-bold text-white leading-snug line-clamp-2">
                      {featuredMovie.title}
                    </h3>
                  </div>
                </div>
                {/* Glow orbs */}
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-pepper-red/10 blur-3xl rounded-full" aria-hidden="true" />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-pepper-gold/10 blur-3xl rounded-full" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
