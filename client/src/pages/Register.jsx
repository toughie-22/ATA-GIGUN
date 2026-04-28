import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GiChiliPepper } from 'react-icons/gi';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password });
      toast.success('Welcome to ATA GiGUN! 🌶️');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <GiChiliPepper className="text-4xl text-pepper-hot mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gradient">Join the Community</h1>
          <p className="text-pepper-muted text-sm mt-1">Discover & review the best of Nollywood</p>
        </div>

        <div className="p-8 rounded-2xl bg-pepper-card border border-white/5 shadow-xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-pepper-muted mb-1.5">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-pepper-muted" size={16} />
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="nollywood_fan"
                  className="w-full pl-10 pr-4 py-3 bg-pepper-surface border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:border-pepper-gold/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-pepper-muted mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-pepper-muted" size={16} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-pepper-surface border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:border-pepper-gold/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-pepper-muted mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-pepper-muted" size={16} />
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-pepper-surface border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:border-pepper-gold/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pepper-muted hover:text-white"
                >
                  {showPw ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-pepper-muted mb-1.5">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-pepper-muted" size={16} />
                <input
                  name="confirmPassword"
                  type={showPw ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-pepper-surface border border-[var(--border-color)] rounded-lg text-sm focus:outline-none focus:border-pepper-gold/50 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-pepper-green to-pepper-green-light text-white font-medium hover:shadow-lg hover:shadow-pepper-green/25 disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-pepper-muted">
            Already have an account? <Link to="/login" className="text-pepper-gold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
