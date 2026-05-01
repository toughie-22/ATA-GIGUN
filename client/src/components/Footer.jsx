import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-color)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* Top row: brand + tagline */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GiChiliPepper className="text-xl text-pepper-red" aria-hidden="true" />
              <span className="text-lg font-black text-gradient">ATA GiGUN</span>
            </div>
            <p className="text-xs text-pepper-muted max-w-xs leading-relaxed">
              <em>ATA GiGUN</em> — Yoruba for <em>ground pepper</em> 🌶️. Nigeria's home for
              honest Nollywood ratings and discovery.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-pepper-muted">Explore</p>
                <div className="flex flex-col gap-2">
                  <Link to="/" className="text-pepper-muted hover:text-[var(--text-main)] transition-colors min-h-[unset]">Home</Link>
                  <Link to="/discover" className="text-pepper-muted hover:text-[var(--text-main)] transition-colors min-h-[unset]">Browse Movies</Link>
                  <Link to="/hall-of-fame" className="text-pepper-muted hover:text-pepper-gold transition-colors min-h-[unset] font-semibold">🏆 Top Rated</Link>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-pepper-muted">Account</p>
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="text-pepper-muted hover:text-[var(--text-main)] transition-colors min-h-[unset]">Sign In</Link>
                  <Link to="/register" className="text-pepper-muted hover:text-[var(--text-main)] transition-colors min-h-[unset]">Create Account</Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom row: copyright */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-pepper-muted/60">
            © {new Date().getFullYear()} ATA GiGUN. Bringing the Heat to Nollywood.
          </p>
          <p className="text-xs text-pepper-muted/50">
            Built with 🌶️ by{' '}
            <span className="text-pepper-gold">Pelumi Emmanuel Adeniyi</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
