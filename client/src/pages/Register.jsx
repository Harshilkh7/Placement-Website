import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const { register, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
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
          <h2 className="text-4xl font-black text-surface-900 tracking-tight">Create Account</h2>
          <p className="text-surface-500 font-medium">Join thousands of students preparing with AI</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 animate-shake">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            {error}
          </div>
        )}

        <form className="space-y-5 relative" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-surface-700 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-surface-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-surface-700 ml-1">Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-surface-700 ml-1">You are a...</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input-field appearance-none"
            >
              <option value="student">Student</option>
              <option value="senior">Senior Contributor</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg mt-4 shadow-primary-200"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-surface-500 font-bold text-sm relative">
          Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 transition-colors underline decoration-2 underline-offset-4 decoration-primary-200 hover:decoration-primary-600">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
