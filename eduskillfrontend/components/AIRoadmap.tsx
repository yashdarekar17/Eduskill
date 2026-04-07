'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, AlertCircle, Compass, Target, Milestone, Calendar, ChevronRight, CheckCircle, Circle, Check, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

// ===== COURSE DEFINITIONS =====
// Universal skill input replaces static categories

const COURSE_ID_MAP: Record<number, string> = {
  5: 'webdev',
  6: 'appdev',
  7: 'datascience',
  8: 'ml',
};

// ===== QUESTIONS =====
const QUESTIONS = [
  { key: 'dream_job', label: 'TARGET ROLE', placeholder: 'e.g. Senior Backend Engineer' },
  { key: 'skill_gap', label: 'SKILL GAPS', placeholder: 'e.g. Distributed Systems' },
  { key: 'hours_per_week', label: 'HOURS / WEEK', placeholder: 'e.g. 15' },
  { key: 'current_project', label: 'ACTIVE PROJECTS', placeholder: 'e.g. Microservice' },
  { key: 'improvement_area', label: 'FOCUS AREA', placeholder: 'e.g. Architecture' },
];

interface AIRoadmapProps {
  courseId?: number;
}

export default function AIRoadmap({ courseId }: AIRoadmapProps) {
  const router = useRouter();
  const fixedCourse = courseId ? COURSE_ID_MAP[courseId] : undefined;
  const [activeCourse, setActiveCourse] = useState(fixedCourse || 'webdev');
  const [searchInput, setSearchInput] = useState(fixedCourse || '');

  const [aiRoadmap, setAiRoadmap] = useState<any>(null);
  const [aiExists, setAiExists] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const slug = searchInput.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setActiveCourse(slug);
    setAiExists(false);
    setAiRoadmap(null);
  };

  const fetchAiRoadmap = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoadingAi(true);
    try {
      const res = await api.getAiRoadmap(activeCourse, token);
      if (res.success && res.exists) {
        if (res.roadmap?.long_term_milestones) {
          setAiRoadmap(res.roadmap);
          setAiExists(true);
          if (res.roadmap.long_term_milestones.length > 0) {
            setSelectedMilestone(res.roadmap.long_term_milestones[0].id);
          }
        } else {
          setAiExists(false);
          setAiRoadmap(null);
        }
      } else {
        setAiExists(false);
        setAiRoadmap(null);
      }
    } catch { /* ignored */ }
    finally { setLoadingAi(false); }
  }, [activeCourse]);

  useEffect(() => { fetchAiRoadmap(); }, [fetchAiRoadmap]);

  const handleGenerateRoadmap = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    setIsGenerating(true);
    setGenerateError('');

    try {
      const res = await api.generateAiRoadmap({
        course_key: activeCourse,
        company_type: 'ai_personalized',
        answers: answers,
      }, token);

      if (res.success) {
        setAiRoadmap(res.roadmap);
        setAiExists(true);
        if (res.roadmap?.long_term_milestones?.length > 0) {
          setSelectedMilestone(res.roadmap.long_term_milestones[0].id);
        }
      }
    } catch (err: any) {
      setGenerateError('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = async (taskId: string, current: boolean) => {
    if (current) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      setAiRoadmap((prev: any) => ({
        ...prev,
        daily_tasks: prev.daily_tasks.map((t: any) => t.id === taskId ? { ...t, completed: true } : t)
      }));
      await api.toggleAiTask({ course_key: activeCourse, task_id: taskId }, token);
    } catch {
      fetchAiRoadmap();
    }
  };

  const milestones = aiRoadmap?.long_term_milestones || [];
  const dailyTasks = aiRoadmap?.daily_tasks || [];
  const monthlyGoals = aiRoadmap?.monthly_goals || [];
  const filteredTasks = selectedMilestone
    ? dailyTasks.filter((t: any) => t.milestone_id === selectedMilestone)
    : dailyTasks;

  return (
    <div className="w-full">
      {/* Refined Header (Removed black bg) */}
      {!fixedCourse && (
        <div className="text-center space-y-4 mb-12 mt-10">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight text-black">AI Architect</h2>
          <p className="font-bold text-black/40 text-lg md:text-xl max-w-2xl mx-auto">
            Neural expansion sequences.
          </p>
        </div>
      )}



      {/* Content */}
      <div className="w-full">
        {loadingAi ? (
          <div className="py-20 text-center">
            <Loader2 size={32} className="animate-spin text-black mx-auto mb-4" />
            <p className="text-black/30 font-bold uppercase tracking-widest text-xs">Calibrating...</p>
          </div>
        ) : !aiExists ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                <Sparkles size={32} />
              </div>
              <h3 className="text-3xl font-bold text-black uppercase tracking-tight mb-2">Calibration</h3>
              <p className="text-black/40 font-bold text-base">Answer to initialize.</p>
            </div>

            <div className="bg-gray-50/50 rounded-[40px] border border-gray-100 p-8 md:p-12 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {QUESTIONS.map(q => (
                  <div key={q.key} className="space-y-2">
                    <label className="block text-black font-bold text-[10px] uppercase tracking-widest ml-2">
                      {q.label}
                    </label>
                    <input
                      type="text"
                      placeholder={q.placeholder}
                      value={answers[q.key] || ''}
                      onChange={e => setAnswers({ ...answers, [q.key]: e.target.value })}
                      className="w-full border border-gray-100 bg-white rounded-2xl px-6 py-4 text-sm font-bold text-black focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateRoadmap}
                disabled={isGenerating || Object.keys(answers).length < 2}
                className="w-full h-[80px] flex items-center justify-center gap-3 bg-black text-white font-bold uppercase tracking-tight rounded-full hover:bg-gray-900 shadow-xl transition-all disabled:opacity-30 text-xl"
              >
                {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
                {isGenerating ? 'Compiling...' : 'Execute'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 m-auto max-w-[95vw]">
            {/* Refined Status Bar (Removed black background as requested) */}
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-1 text-black">Active Matrix</h3>
                <p className="text-black/40 font-bold text-base">Neural roadmap active.</p>
              </div>
              <button onClick={() => setAiExists(false)} className="h-[50px] px-8 bg-black text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-gray-900 transition-all flex items-center gap-2">
                <Sparkles size={14} /> Re-Calibrate
              </button>
            </div>

            {/* Milestone Node Map */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                  <Milestone size={20} />
                </div>
                <h2 className="text-3xl font-black text-black uppercase tracking-tighter">Phase Expansion</h2>
              </div>

              <div className="flex gap-8 overflow-x-auto pt-6 px-6 pb-12 snap-x -mx-6 -mt-6 no-scrollbar">
                {milestones.map((m: any, i: number) => (
                  <div key={m.id || i} className="flex items-center shrink-0 snap-start">
                    <div
                      onClick={() => setSelectedMilestone(m.id)}
                      className={`cursor-pointer w-[300px] p-8 rounded-[32px] border-2 transition-all relative ${selectedMilestone === m.id
                          ? 'bg-black border-black text-white shadow-xl'
                          : 'bg-[#FBFBFB] border-gray-100 hover:border-black/10'
                        }`}
                    >
                      <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${selectedMilestone === m.id ? 'bg-white text-black' : 'bg-black text-white'
                        }`}>
                        {i + 1}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mb-3 block ${selectedMilestone === m.id ? 'text-white/40' : 'text-black/20'}`}>
                        {m.timeline || `Seq ${i + 1}`}
                      </span>
                      <h4 className="text-xl font-bold uppercase tracking-tight mb-3 leading-tight">{m.title}</h4>
                      <p className={`font-bold text-xs leading-relaxed mb-6 line-clamp-3 ${selectedMilestone === m.id ? 'text-white/50' : 'text-black/40'}`}>
                        {m.description}
                      </p>
                    </div>
                    {i < milestones.length - 1 && (
                      <div className="flex items-center px-4 text-black/5">
                        <ChevronRight size={32} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-20">
              {/* Top Section: Focus & Matrix */}
              <div className="space-y-16">
                {aiRoadmap?.weekly_focus && (
                  <div className="bg-gray-50 border border-gray-100 p-10 rounded-[40px] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                      <Zap size={100} />
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center">
                        <Zap size={24} />
                      </div>
                      <h3 className="text-black/30 font-bold tracking-[0.3em] text-[11px] uppercase">Neural Strategic Priority</h3>
                      <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-black max-w-4xl">{aiRoadmap.weekly_focus}</p>
                    </div>
                  </div>
                )}

                {monthlyGoals.length > 0 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                        <Calendar size={24} />
                      </div>
                      <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Target Matrix</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {monthlyGoals.map((mg: any, i: number) => (
                        <div key={i} className="group bg-[#FBFBFB] p-8 rounded-[32px] border border-gray-100 hover:border-black transition-all">
                          <span className="bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">{mg.month}</span>
                          <p className="font-black text-black text-xl uppercase tracking-tight leading-none group-hover:tracking-normal transition-all">{mg.focus}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Section: Quest Log */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                    <Target size={24} />
                  </div>
                  <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Quest Log</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTasks.map((task: any) => (
                    <div key={task.id}
                      onClick={() => toggleTask(task.id, task.completed)}
                      className={`group flex items-start p-8 rounded-[32px] border-2 transition-all cursor-pointer ${task.completed
                          ? 'bg-gray-50 border-gray-100 opacity-40 shadow-inner'
                          : 'bg-white border-gray-100 hover:border-black shadow-xl hover:-translate-y-1'
                        }`}
                    >
                      <div className={`mr-6 mt-1 transition-all ${task.completed ? 'text-black' : 'text-black/10'}`}>
                        {task.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
                      </div>
                      <div className="space-y-2">
                        <h4 className={`font-black text-lg uppercase tracking-tight leading-none ${task.completed ? 'line-through text-black/50' : 'text-black'}`}>{task.title}</h4>
                        <p className={`font-bold text-xs leading-relaxed ${task.completed ? 'text-black/30' : 'text-black/40'}`}>{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
