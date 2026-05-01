import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNotifications, markNotificationsRead } from '../api/userApi';
import { GiChiliPepper } from 'react-icons/gi';
import { FiSearch, FiMenu, FiX, FiLogOut, FiUser, FiSun, FiMoon, FiBell } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleMarkRead = async () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && notifications.some(n => !n.isRead)) {
      try {
        await markNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error('Failed to mark as read');
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  /** Returns true if the current path matches the given route */
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `text-sm font-bold uppercase tracking-widest transition-colors relative pb-1 ${
      isActive(path)
        ? 'text-pepper-gold nav-link-active'
        : 'text-pepper-muted hover:text-pepper-gold'
    }`;

  const mobileLinkClass = (path) =>
    `flex items-center gap-4 text-3xl font-black uppercase tracking-tighter transition-colors ${
      isActive(path) ? 'text-pepper-gold' : 'hover:text-pepper-gold'
    }`;

  const getNotifMessage = (n) => {
    switch (n.type) {
      case 'FOLLOW': return 'started following you';
      case 'LIKE': return `liked your review of ${n.relatedMovie?.title || 'a movie'}`;
      case 'NEW_COMMENT': return `posted a new review for ${n.relatedMovie?.title || 'a movie'}`;
      default: return 'sent you a notification';
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group shrink-0" aria-label="ATA GiGUN home">
            <GiChiliPepper className="text-3xl text-pepper-red group-hover:rotate-12 transition-transform duration-300 shrink-0" />
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-gradient uppercase leading-none">
              ATA GiGUN
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center justify-center flex-grow gap-10">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/discover" className={navLinkClass('/discover')}>Browse</Link>
            <Link to="/hall-of-fame" className={navLinkClass('/hall-of-fame')}>Top Rated</Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative group ml-2">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pepper-muted group-focus-within:text-pepper-gold transition-colors z-10" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search movies"
                className="w-44 lg:w-60 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-text-main focus:outline-none focus:border-pepper-gold/50 focus:w-72 transition-all duration-400 placeholder:text-pepper-muted"
              />
            </form>
          </div>

          {/* ── Right Side: Auth + Theme Toggle + Hamburger ── */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">

            {/* Notification Bell + Profile Avatar (desktop authenticated) */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleMarkRead}
                    aria-label="Notifications"
                    aria-expanded={notifOpen}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-pepper-muted hover:text-pepper-gold hover:border-pepper-gold/30 transition-all relative"
                  >
                    <FiBell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-pepper-red text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-pepper-dark animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-pepper-card border border-white/10 shadow-2xl z-50 overflow-hidden animate-slide-down">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-sm font-bold">Notifications</p>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-sm text-pepper-muted text-center">No notifications yet</p>
                        ) : (
                          notifications.slice(0, 10).map(n => (
                            <div
                              key={n._id}
                              className={`p-4 border-b border-white/5 last:border-0 ${!n.isRead ? 'bg-pepper-gold/5' : ''}`}
                            >
                              <p className="text-xs font-bold">{n.sender?.username || 'Someone'}</p>
                              <p className="text-xs text-pepper-muted mt-0.5">{getNotifMessage(n)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile avatar */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Profile menu"
                    aria-expanded={profileOpen}
                    className="flex items-center gap-2 p-1 rounded-full border-2 border-white/10 hover:border-pepper-gold/50 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pepper-red to-pepper-gold flex items-center justify-center text-sm font-black text-white shadow-xl">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  </button>

                  {/* Profile dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-pepper-card border border-white/10 shadow-2xl z-50 overflow-hidden animate-slide-down">
                      <div className="p-4 border-b border-white/10">
                        <p className="text-sm font-bold truncate">{user?.username}</p>
                        <p className="text-xs text-pepper-muted truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-pepper-red hover:bg-white/5 transition-colors font-semibold"
                        >
                          <FiLogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary hidden md:inline-flex px-5 py-2 text-xs uppercase font-black tracking-widest"
              >
                Sign In
              </Link>
            )}

            {/* ── THEME TOGGLE — always visible, outside hamburger ── */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-pepper-muted hover:text-pepper-gold hover:border-pepper-gold/30 transition-all shrink-0"
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* ── HAMBURGER — opens full mobile menu ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-gradient-to-br from-pepper-gold via-pepper-hot-light to-pepper-red text-white hover:scale-105 transition-all shadow-lg shadow-pepper-red/20"
            >
              <div className="flex flex-col gap-1.5 shrink-0">
                <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`h-0.5 w-3 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2 w-5' : ''}`} />
              </div>
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em]">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="glass border-t border-[var(--border-color)] fixed inset-0 top-20 z-40 overflow-y-auto animate-slide-down"
        >
          <div className="section-container py-8 space-y-8 pb-32">

            {/* User info banner */}
            {isAuthenticated && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pepper-red to-pepper-gold flex items-center justify-center text-xl font-bold shadow-lg shrink-0">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-base truncate">{user?.username}</p>
                  <p className="text-xs text-pepper-muted truncate">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pepper-muted" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search movies"
                className="w-full pl-12 pr-4 py-3.5 bg-pepper-card border border-white/10 rounded-2xl text-base text-text-main placeholder:text-pepper-muted focus:outline-none focus:border-pepper-gold/50"
              />
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Navigation links */}
              <div className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-pepper-gold mb-2">Navigate</h3>
                <Link to="/" className={mobileLinkClass('/')}>
                  {isActive('/') && <span className="w-1.5 h-6 bg-pepper-red rounded-full shrink-0" />}
                  Home
                </Link>
                <Link to="/discover" className={mobileLinkClass('/discover')}>
                  {isActive('/discover') && <span className="w-1.5 h-6 bg-pepper-red rounded-full shrink-0" />}
                  Browse
                </Link>
                <Link to="/hall-of-fame" className={mobileLinkClass('/hall-of-fame')}>
                  {isActive('/hall-of-fame') && <span className="w-1.5 h-6 bg-pepper-red rounded-full shrink-0" />}
                  Top Rated
                </Link>
              </div>

              {/* Account */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-pepper-gold mb-2">Account</h3>

                {isAuthenticated && (
                  <button
                    onClick={() => { handleMarkRead(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-between w-full text-xl font-black hover:text-pepper-gold transition-colors uppercase tracking-tighter"
                  >
                    <span className="flex items-center gap-3"><FiBell /> Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-pepper-red text-white text-xs rounded-full">{unreadCount}</span>
                    )}
                  </button>
                )}

                <div className="pt-6 mt-4 border-t border-white/10">
                  {isAuthenticated ? (
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-3 text-xl font-black text-pepper-red uppercase tracking-tighter"
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-primary flex items-center justify-center py-4 text-lg uppercase font-black w-full"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
