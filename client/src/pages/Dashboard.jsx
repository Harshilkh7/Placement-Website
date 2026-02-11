import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, BookOpen, MessageSquare, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Readiness Score', value: user?.profile?.readinessScore || '78', icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Coding Problems', value: '12/50', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Mock Interviews', value: '3', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-surface-900 tracking-tight">
            Welcome back, <span className="text-primary-600">{user?.name}!</span> 👋
          </h1>
          <p className="text-surface-500 text-lg font-medium">Here's what's happening with your preparation today.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-primary-200">
          <Award size={20} /> Upgrade to Pro
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6 flex items-center space-x-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-surface-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-surface-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <LayoutDashboard className="text-primary-600" /> Current Roadmap
            </h2>
            <span className="badge bg-primary-100 text-primary-700">Week 2 of 12</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-surface-800">Advanced Data Structures</p>
                <p className="text-surface-500 font-medium">Focus: Graphs and Dynamic Programming</p>
              </div>
              <p className="text-primary-600 font-black text-xl">45%</p>
            </div>
            
            <div className="w-full bg-surface-100 rounded-full h-4 overflow-hidden border border-surface-200 p-1">
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 h-full rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100">
                <p className="text-xs font-bold text-surface-400 uppercase">Up Next</p>
                <p className="font-bold text-surface-700">Dijkstra's Algorithm</p>
              </div>
              <div className="p-4 bg-surface-50 rounded-xl border border-surface-100">
                <p className="text-xs font-bold text-surface-400 uppercase">Daily Goal</p>
                <p className="font-bold text-surface-700">Solve 3 Medium Problems</p>
              </div>
            </div>
            
            <Link to="/roadmap" className="btn-secondary w-full text-center block mt-4 font-black">
              Continue Learning →
            </Link>
          </div>
        </div>

        <div className="card p-8 space-y-6">
          <h2 className="text-2xl font-black">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-200 hover:border-primary-400 hover:bg-primary-50 transition-all text-left group">
              <p className="font-black text-surface-800 group-hover:text-primary-700 transition-colors">Resume Analysis</p>
              <p className="text-sm text-surface-500 font-medium">Upload and get AI feedback</p>
            </button>
            
            <button className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group">
              <p className="font-black text-surface-800 group-hover:text-emerald-700 transition-colors">Mock Interview</p>
              <p className="text-sm text-surface-500 font-medium">Start 1-on-1 AI session</p>
            </button>
            
            <Link to="/experiences" className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left block group">
              <p className="font-black text-surface-800 group-hover:text-purple-700 transition-colors">Senior Experiences</p>
              <p className="text-sm text-surface-500 font-medium">Real interview questions</p>
            </Link>
            
            <button className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-200 hover:border-amber-400 hover:bg-amber-50 transition-all text-left group">
              <p className="font-black text-surface-800 group-hover:text-amber-700 transition-colors">Practice Contest</p>
              <p className="text-sm text-surface-500 font-medium">Compete with peers live</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
