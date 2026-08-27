import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const successMessage = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await authApi.login({ email, password });
      if (res.token) {
        login(res.token);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 font-bold text-base shadow-sm">
            K
          </div>
          <div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Sign in to Karya
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Welcome back. Enter your details below.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#12141d] border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          {successMessage && (
            <div className="p-2.5 text-xs bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 rounded-lg">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-2.5 text-xs bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@work.com"
                className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>Sign in</span>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-zinc-200 hover:text-white underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
