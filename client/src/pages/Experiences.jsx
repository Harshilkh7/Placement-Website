import { useQuery } from '@tanstack/react-query';
import { Star, PlusCircle, Building2, Calendar, ChevronRight } from 'lucide-react';
import { api } from '../store/authStore';

const Experiences = () => {
  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const accessToken = localStorage.getItem('accessToken');
      const response = await api.get('/api/experiences', {
        headers: accessToken ? { Authorization: 'Bearer ' + accessToken } : {}
      });
      return response.data;
    },
  });

  if (isLoading) return <div className="p-8">Loading experiences...</div>;

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-surface-900 tracking-tight">Interview Experiences</h1>
          <p className="text-surface-500 text-lg font-medium">Learn from seniors who cracked your dream companies.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shadow-primary-200">
          <PlusCircle size={20} /> Share Your Experience
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences?.map((exp) => (
          <div key={exp._id} className="card overflow-hidden flex flex-col group">
            <div className="p-8 space-y-6 flex-grow">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center border border-surface-100 group-hover:border-primary-200 transition-colors">
                  <Building2 className="text-primary-600" size={32} />
                </div>
                <span className={`badge ${exp.offerStatus === 'Accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'} font-black px-4 py-1.5 rounded-full text-sm`}>
                  {exp.offerStatus || 'Reviewed'}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-surface-900 leading-tight group-hover:text-primary-600 transition-colors">{exp.companyName}</h3>
                <p className="text-surface-500 font-bold mt-1 uppercase tracking-wider text-xs">{exp.role}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-surface-600 font-medium">
                  <Calendar size={18} className="text-primary-500" />
                  <span>{new Date(exp.date || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-surface-600 font-medium">
                  <Star size={18} className="text-amber-500" />
                  <span>Difficulty: <span className="font-black text-surface-900">{exp.difficultyRating}/5</span></span>
                </div>
              </div>

              <p className="text-surface-600 line-clamp-3 leading-relaxed font-medium">
                {exp.aiSummary || exp.rounds?.[0]?.content || "No summary available."}
              </p>
            </div>

            <div className="px-8 py-5 bg-surface-50 border-t flex items-center justify-between group-hover:bg-primary-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {(exp.isAnonymous ? 'A' : exp.author?.name?.charAt(0) || 'U')}
                </div>
                <span className="text-sm font-bold text-surface-700">{exp.isAnonymous ? 'Anonymous' : exp.author?.name}</span>
              </div>
              <button className="text-primary-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Read More <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;
