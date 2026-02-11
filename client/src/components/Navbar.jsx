import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, LayoutDashboard, Map, MessageSquare, Code } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-surface-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-primary-600 flex items-center gap-2.5 tracking-tight">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200 rotate-3">
            P
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">PrepPortal AI</span>
        </Link>

        <div className="hidden lg:flex items-center space-x-8 text-surface-600 font-bold">
          <Link to="/" className="hover:text-primary-600 flex items-center gap-2 transition-colors">
            <LayoutDashboard size={20} className="text-primary-500" /> Dashboard
          </Link>
          <Link to="/roadmap" className="hover:text-primary-600 flex items-center gap-2 transition-colors">
            <Map size={20} className="text-primary-500" /> Roadmap
          </Link>
          <Link to="/experiences" className="hover:text-primary-600 flex items-center gap-2 transition-colors">
            <MessageSquare size={20} className="text-primary-500" /> Experiences
          </Link>
          <Link to="/practice" className="hover:text-primary-600 flex items-center gap-2 transition-colors">
            <Code size={20} className="text-primary-500" /> Practice
          </Link>
        </div>

        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-3 pl-6 border-l border-surface-200">
            <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100">
              <User size={20} className="text-primary-600" />
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs text-surface-500 font-bold uppercase tracking-wider">Student</p>
              <p className="text-sm font-extrabold text-surface-900">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
