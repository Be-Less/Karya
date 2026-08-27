import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await authApi.register({ name, email, password });
      navigate('/login', {
        state: { message: 'Account created successfully! Please sign in.' },
      });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Try a different email.');
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
              Create an account
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Start tracking tasks and collaborating with your team.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#12141d] border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
          {error && (
            <div className="p-2.5 text-xs bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bilesh Bhasinka"
                className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#0d0f15] border border-zinc-700/70 focus:border-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3 bg-zinc-100 hover:bg-white disabled:opacity-40 text-zinc-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {loading && <LoadingSpinner size="sm" />}
              <span>Create account</span>
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-zinc-200 hover:text-white underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}