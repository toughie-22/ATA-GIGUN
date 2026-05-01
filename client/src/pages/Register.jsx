import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GiChiliPepper } from 'react-icons/gi';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { register, isAuthenticated, loading: loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (loadingAuth) return null; // Wait for AuthContext to check token on mount

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username) {
      toast.error("We need a username for you — something spicy? 🌶️");
      return false;
    }
    if (username.length < 3) {
      toast.error("Your username needs to be at least 3 characters long.");
      return false;
    }
    if (!email) {
      toast.error("Drop your email address so we can find you.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Hmm, that email doesn't look right. Double-check it?");
      return false;
    }
    if (!password) {
      toast.error("You'll need a password to protect your account 🔒");
      return false;
    }
    if (password.length < 6) {
      toast.error("Your password should be at least 6 characters — make it harder to guess!");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Those passwords don't match. Try again?");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ username: formData.username, email: formData.email, password: formData.password });
      toast.success('Welcome to ATA GiGUN! Time to bring the heat 🌶️');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message;
      toast.error(
        msg?.includes('already') || msg?.includes('use')
          ? `That ${msg.toLowerCase().includes('email') ? 'email' : 'username'} is already taken. Try another or sign in!`
          : msg || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] placeholder:text-pepper-muted text-sm focus:outline-none focus:border-pepper-gold/50 focus:ring-1 focus:ring-pepper-gold/20 transition-all min-h-[44px]";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in space-y-2">
          <GiChiliPepper className="text-4xl text-pepper-red mx-auto" aria-hidden="true" />
          <h1 className="font-bold text-gradient" style={{ fontSize: 'var(--text-h2)' }}>
            Join the Community
          </h1>
          <p className="text-pepper-muted" style={{ fontSize: 'var(--text-body)' }}>
            Discover &amp; review the best of Nollywood — free, always.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-pepper-card border border-[var(--border-color)] shadow-xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Username */}
            <div>
              <label htmlFor="reg-username" className="block text-sm font-semibold text-pepper-muted mb-1.5">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="nollywood_fan"
                  autoComplete="username"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-pepper-muted mb-1.5">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-pepper-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
                <input
                  id="reg-password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pepper-muted hover:text-[var(--text-main)] transition-colors p-1"
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-semibold text-pepper-muted mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showPw ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating your account...' : 'Create Account 🌶️'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-pepper-muted">
            Already part of the crew?{' '}
            <Link to="/login" className="text-pepper-gold hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
