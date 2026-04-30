import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNotifications, markNotificationsRead } from '../api/userApi';
import { GiChiliPepper } from 'react-icons/gi';
import { FiSearch, FiMenu, FiX, FiLogOut, FiUser, FiSun, FiMoon, FiBell } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000); // Poll every minute
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

  const getNotifMessage = (n) => {
    switch (n.type) {
      case 'FOLLOW': return 'started following you';
      case 'LIKE': return `liked your review of ${n.relatedMovie?.title || 'a movie'}`;
      case 'NEW_COMMENT': return `posted a new review for ${n.relatedMovie?.title || 'a movie'}`;
      default: return 'sent you a notification';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="w-full px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo - Start from the edge */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <GiChiliPepper className="text-3xl text-pepper-hot group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-black tracking-tighter text-gradient uppercase">ATA GiGUN</span>
          </Link>

          {/* Center Nav - Primary Links */}
          <div className="hidden lg:flex items-center justify-center flex-grow gap-12">
            <Link to="/" className="text-sm font-bold uppercase tracking-widest text-pepper-muted hover:text-pepper-gold transition-colors">Home</Link>
            <Link to="/discover" className="text-sm font-bold uppercase tracking-widest text-pepper-muted hover:text-pepper-gold transition-colors">Discover</Link>
            <Link to="/hall-of-fame" className="text-sm font-black uppercase tracking-widest text-pepper-gold hover:text-white transition-all hover:scale-110">Hall of Fame</Link>
            
            {/* Search (Desktop) - Integrated into center flow */}
            <form onSubmit={handleSearch} className="hidden md:relative md:block group ml-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-pepper-muted group-focus-within:text-pepper-gold transition-colors" />
              <input
                type="text"
                placeholder="SEARCH MOVIES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-text-main focus:outline-none focus:border-pepper-gold/50 focus:w-80 transition-all duration-500"
              />
            </form>
          </div>

          {/* Right Side - Actions & Hamburger (Last edge) */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            {/* Notification Bell & Profile (Desktop) */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-6">
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleMarkRead}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-pepper-muted hover:text-pepper-gold hover:border-pepper-gold/30 transition-all relative"
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-pepper-hot text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-pepper-dark animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {/* ... existing notification dropdown ... */}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full border-2 border-white/10 hover:border-pepper-gold/50 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pepper-green to-pepper-gold flex items-center justify-center text-sm font-black text-white shadow-xl">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  </button>
                  {/* ... existing profile dropdown ... */}
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary hidden md:block px-8 py-3 text-xs uppercase font-black tracking-widest">
                Sign In
              </Link>
            )}

            {/* STANDALONE THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-pepper-muted hover:text-pepper-gold hover:border-pepper-gold/30 transition-all"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* THE ROYAL HAMBURGER */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pepper-gold via-pepper-hot-light to-pepper-hot text-white hover:scale-105 transition-all shadow-lg shadow-pepper-hot/20 group"
            >
              <div className="flex flex-col gap-1">
                <span className={`h-0.5 w-5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`h-0.5 w-5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 w-3 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5 w-5' : ''}`} />
              </div>
              <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em]">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Side menu */}
      {mobileMenuOpen && (
        <div className="glass border-t border-[var(--border-color)] h-screen animate-slide-down overflow-y-auto fixed inset-0 top-20">
          <div className="section-container py-8 space-y-8 pb-32">
            {/* User Profile Info */}
            {isAuthenticated && (
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pepper-green to-pepper-gold flex items-center justify-center text-xl font-bold shadow-lg">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg">{user?.username}</p>
                  <p className="text-xs text-pepper-muted">{user?.email}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSearch} className="relative md:hidden">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-pepper-muted" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-pepper-card border border-white/10 rounded-2xl text-lg text-text-main"
              />
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-pepper-gold mb-4">Navigation</h3>
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-3xl font-black hover:text-pepper-gold transition-colors uppercase tracking-tighter">
                  Home
                </Link>
                <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-3xl font-black hover:text-pepper-gold transition-colors uppercase tracking-tighter">
                  Discover
                </Link>
                <Link to="/hall-of-fame" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-3xl font-black text-pepper-gold hover:text-white transition-colors uppercase tracking-tighter">
                  Hall of Fame
                </Link>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-pepper-gold mb-4">Social & Account</h3>
                {isAuthenticated && (
                  <button 
                    onClick={() => { handleMarkRead(); setMobileMenuOpen(false); }} 
                    className="flex items-center justify-between w-full text-2xl font-black hover:text-pepper-gold transition-colors uppercase tracking-tighter"
                  >
                    <span className="flex items-center gap-4"><FiBell /> Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-pepper-hot text-white text-xs rounded-full">{unreadCount}</span>
                    )}
                  </button>
                )}

                <div className="pt-8 mt-8 border-t border-white/10">
                  {isAuthenticated ? (
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                      className="flex items-center gap-4 text-2xl font-black text-pepper-hot uppercase tracking-tighter"
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="btn-primary flex items-center justify-center py-5 text-2xl uppercase font-black"
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
