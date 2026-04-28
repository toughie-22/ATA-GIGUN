import { Link } from 'react-router-dom';
import { GiChiliPepper } from 'react-icons/gi';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <GiChiliPepper className="text-xl text-pepper-hot" />
            <span className="text-lg font-bold text-gradient">ATA GiGUN</span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-pepper-muted">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
          </div>

          {/* Credit */}
          <p className="text-xs text-pepper-muted">
            Built with 🌶️ by <span className="text-pepper-gold">Pelumi Emmanuel Adeniyi</span>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-pepper-muted/50">
            © {new Date().getFullYear()} ATA GiGUN. Bringing the Heat to Nollywood.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
