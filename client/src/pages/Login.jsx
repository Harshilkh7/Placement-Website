import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md space-y-8 card p-10 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="text-center space-y-2 relative">
          <h2 className="text-4xl font-black text-surface-900 tracking-tight">Welcome Back</h2>
          <p className="text-surface-500 font-medium">Sign in to continue your preparation</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 animate-shake">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-surface-700 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-surface-700">Password</label>
              <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot Password?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg mt-2 shadow-primary-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center relative pt-2">
          <p className="text-surface-500 text-sm font-bold">
            Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 transition-colors underline decoration-2 underline-offset-4 decoration-primary-200 hover:decoration-primary-600">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
