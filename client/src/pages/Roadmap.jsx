import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Circle, Clock, ChevronRight, Map } from 'lucide-react';
import { api } from '../store/authStore';

const Roadmap = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    targetCompanies: '',
    branch: '',
    year: '',
    availableHoursPerDay: '2',
    skillLevel: 'Beginner',
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [updatingTask, setUpdatingTask] = useState(null);

  const { data: roadmap, isLoading, error } = useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const response = await api.get('/api/roadmaps/me');
      return response.data;
    },
    retry: false,
  });

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const createRoadmap = async (event) => {
    event.preventDefault();
    setFormError('');

    const targetCompanies = form.targetCompanies
      .split(',')
      .map((company) => company.trim())
      .filter(Boolean);

    if (!targetCompanies.length || !form.branch.trim() || !form.year.trim()) {
      setFormError('Please fill in companies, branch and year.');
      return;
    }

    setCreating(true);
    try {
      await api.post('/api/roadmaps', {
        ...form,
        targetCompanies,
        availableHoursPerDay: Number(form.availableHoursPerDay),
      });
      await queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Could not generate roadmap.');
    } finally {
      setCreating(false);
    }
  };

  const toggleTask = async (weekIndex, topicIndex) => {
    const key = `${weekIndex}-${topicIndex}`;
    setUpdatingTask(key);
    try {
      await api.patch('/api/roadmaps/task', { weekIndex, topicIndex });
      await queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    } finally {
      setUpdatingTask(null);
    }
  };

  if (isLoading) return <div className="p-8">Loading roadmap...</div>;

  if (error || !roadmap) {
    return (
      <div className="card p-8 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <Map className="text-primary-600" size={40} />
          </div>
          <h2 className="text-3xl font-black text-surface-900">Create Your AI Roadmap</h2>
          <p className="text-surface-500 font-medium">Tell us your placement target and AI will build a week-by-week plan.</p>
        </div>

        <form onSubmit={createRoadmap} className="space-y-4">
          <input className="input" name="targetCompanies" value={form.targetCompanies} onChange={updateField} placeholder="Target companies (e.g. Google, Microsoft)" />
          <input className="input" name="branch" value={form.branch} onChange={updateField} placeholder="Branch (e.g. CSE)" />
          <input className="input" name="year" value={form.year} onChange={updateField} placeholder="Year (e.g. 3rd)" />
          <input className="input" name="availableHoursPerDay" type="number" min="1" max="16" value={form.availableHoursPerDay} onChange={updateField} placeholder="Hours per day" />
          <select className="input" name="skillLevel" value={form.skillLevel} onChange={updateField}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {formError && <p className="text-red-600 font-semibold">{formError}</p>}
          <button className="btn-primary w-full py-3" disabled={creating}>
            {creating ? 'Generating roadmap...' : 'Generate AI Roadmap'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-surface-900 tracking-tight">Your AI Roadmap</h1>
          <p className="text-surface-500 text-lg font-medium flex items-center gap-2">Targeting <span className="text-primary-600 font-bold">{roadmap.targetCompanies.join(', ')}</span></p>
        </div>
        <div className="bg-white border border-surface-200 px-6 py-3 rounded-2xl shadow-soft flex items-center gap-3">
          <Clock className="text-primary-600" size={24} />
          <div><p className="text-xs font-bold text-surface-400 uppercase">Daily Commitment</p><p className="text-lg font-black text-surface-900">{roadmap.availableHoursPerDay}h / day</p></div>
        </div>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-200 before:to-transparent">
        {roadmap.plan.map((week, wIndex) => (
          <div key={wIndex} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-surface-200 group-hover:bg-primary-500 text-surface-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500"><span className="font-black text-sm">{week.week}</span></div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card overflow-hidden">
              <div className="bg-surface-50 px-6 py-4 border-b flex justify-between items-center"><h2 className="text-xl font-black text-surface-800">Week {week.week}</h2><span className="badge bg-primary-50 text-primary-700 font-black">{week.topics.filter(t => t.isCompleted).length}/{week.topics.length} Done</span></div>
              <div className="divide-y divide-surface-100">
                {week.topics.map((topic, tIndex) => {
                  const taskKey = `${wIndex}-${tIndex}`;
                  return (
                    <div key={tIndex} className="p-6 space-y-4 hover:bg-primary-50/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4"><button disabled={updatingTask === taskKey} onClick={() => toggleTask(wIndex, tIndex)} className="mt-1 transition-transform active:scale-90 disabled:opacity-50" aria-label="Toggle task completion">{topic.isCompleted ? <CheckCircle className="text-emerald-500" size={26} fill="currentColor" fillOpacity={0.1} /> : <Circle className="text-surface-300 hover:text-primary-400" size={26} />}</button><div><h3 className="font-black text-lg text-surface-800 leading-tight">{topic.title}</h3><div className="mt-3 flex flex-wrap gap-2">{topic.tasks.map((task, k) => <span key={k} className="text-[10px] font-black uppercase tracking-widest bg-white border border-surface-200 text-surface-500 px-2 py-1 rounded-md shadow-sm">{task}</span>)}</div></div></div><ChevronRight className="text-surface-300" size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
