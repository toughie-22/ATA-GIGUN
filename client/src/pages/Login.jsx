import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GiChiliPepper } from 'react-icons/gi';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const { login, isAuthenticated, loading: loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (loadingAuth) return null; // Wait for AuthContext to check token on mount

  const validate = () => {
    if (!email && !password) {
      toast.error("Looks like you forgot your email and password 😅");
      return false;
    }
    if (!email) {
      toast.error("Drop your email or username to sign in.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back! 🌶️');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message;
      toast.error(
        msg === 'Invalid credentials'
          ? "That doesn't match our records. Try another email/username?"
          : msg || 'Sign in failed — please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in space-y-2">
          <GiChiliPepper className="text-4xl text-pepper-red mx-auto" aria-hidden="true" />
          <h1 className="font-bold text-gradient" style={{ fontSize: 'var(--text-h2)' }}>
            Welcome Back
          </h1>
          <p className="text-pepper-muted" style={{ fontSize: 'var(--text-body)' }}>
            Sign in with your email or username
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-pepper-card border border-[var(--border-color)] shadow-xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-pepper-muted mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com or username"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] placeholder:text-pepper-muted text-sm focus:outline-none focus:border-pepper-gold/50 focus:ring-1 focus:ring-pepper-gold/20 transition-all min-h-[44px]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-pepper-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pepper-muted z-10" size={16} />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] placeholder:text-pepper-muted text-sm focus:outline-none focus:border-pepper-gold/50 focus:ring-1 focus:ring-pepper-gold/20 transition-all min-h-[44px]"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In 🌶️'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-pepper-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-pepper-gold hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
