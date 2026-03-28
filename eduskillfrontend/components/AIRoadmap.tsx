'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, AlertCircle, Compass, Target, Milestone, Calendar, ChevronRight, CheckCircle, Circle, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

// ===== COURSE DEFINITIONS =====
const COURSES = [
  { id: 'webdev', label: 'Web Development' },
  { id: 'appdev', label: 'App Development' },
  { id: 'datascience', label: 'Data Science' },
  { id: 'ml', label: 'Machine Learning' },
];

const COURSE_ID_MAP: Record<number, string> = {
  5: 'webdev',
  6: 'appdev',
  7: 'datascience',
  8: 'ml',
};

// ===== QUESTIONS FOR AI ROADMAP =====
const QUESTIONS = [
    { key: 'dream_job', label: 'What is your dream job title in the next 2 years?', placeholder: 'e.g. ML Engineer at Google' },
    { key: 'skill_gap', label: 'What skill gap do you feel is holding you back most?', placeholder: 'e.g. System Design, DSA, Cloud deployment' },
    { key: 'hours_per_week', label: 'How many hours per week can you dedicate to learning?', placeholder: 'e.g. 10, 20, 5' },
    { key: 'current_project', label: 'What are you currently working on or building?', placeholder: 'e.g. A personal portfolio, an ML project' },
    { key: 'improvement_area', label: 'Which area do you want to improve the most?', placeholder: 'e.g. Backend systems, Competitive programming, Frontend' },
];

interface AIRoadmapProps {
  courseId?: number;
}

export default function AIRoadmap({ courseId }: AIRoadmapProps) {
  const router = useRouter();
  const fixedCourse = courseId ? COURSE_ID_MAP[courseId] : undefined;
  const [activeCourse, setActiveCourse] = useState(fixedCourse || 'webdev');

  // AI Roadmap state
  const [aiRoadmap, setAiRoadmap] = useState<any>(null);
  const [aiMessage, setAiMessage] = useState('');
  const [aiExists, setAiExists] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  
  // Questionnaire state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  // Fetch AI roadmap on mount or course change
  const fetchAiRoadmap = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoadingAi(true);
    try {
      const res = await api.getAiRoadmap(activeCourse, token);
      if (res.success && res.exists) {
        // If it's a legacy format (missing long_term_milestones), force them to regenerate
        if (res.roadmap?.long_term_milestones) {
          setAiRoadmap(res.roadmap);
          setAiMessage(res.aiMessage);
          setAiExists(true);
          if (res.roadmap.long_term_milestones.length > 0) {
            setSelectedMilestone(res.roadmap.long_term_milestones[0].id);
          }
        } else {
          setAiExists(false);
          setAiRoadmap(null);
          setAiMessage('');
        }
      } else {
        setAiExists(false);
        setAiRoadmap(null);
        setAiMessage('');
      }
    } catch { /* not logged in or no roadmap yet */ }
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
        setAiMessage(res.aiMessage);
        setAiExists(true);
        if (res.roadmap?.long_term_milestones?.length > 0) {
          setSelectedMilestone(res.roadmap.long_term_milestones[0].id);
        }
      }
    } catch (err: any) {
      setGenerateError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = async (taskId: string, current: boolean) => {
    if (current) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    try {
      // Optimistically update
      setAiRoadmap((prev: any) => ({
        ...prev,
        daily_tasks: prev.daily_tasks.map((t: any) => t.id === taskId ? { ...t, completed: true } : t)
      }));
      await api.toggleAiTask({ course_key: activeCourse, task_id: taskId }, token);
    } catch (e: any) {
       console.error(e);
       alert("Failed to complete task.");
       fetchAiRoadmap(); // rollback
    }
  };

  const milestones = aiRoadmap?.long_term_milestones || [];
  const dailyTasks = aiRoadmap?.daily_tasks || [];
  const monthlyGoals = aiRoadmap?.monthly_goals || [];
  const filteredTasks = selectedMilestone
      ? dailyTasks.filter((t: any) => t.milestone_id === selectedMilestone)
      : dailyTasks;

  return (
    <div className="w-full max-w-[90vw] mx-auto p-4 md:p-8">
      {/* Header — only show if no courseId (standalone mode) */}
      {!fixedCourse && (
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-600 inline-block text-transparent bg-clip-text">AI Career Architect</h2>
          <p className="font-semibold text-gray-600 text-lg">
            Generate a hyper-personalized path to your dream role
          </p>
        </div>
      )}

      {/* Course Selector Pills — only show if no courseId */}
      {!fixedCourse && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {COURSES.map(course => (
            <button
              key={course.id}
              onClick={() => { setActiveCourse(course.id); }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                activeCourse === course.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {course.label}
            </button>
          ))}
        </div>
      )}

      {/* AI Personalized Content */}
      <div className="md:p-4">
        {loadingAi ? (
          <div className="p-10 text-center">
            <Loader2 size={32} className="animate-spin text-orange-400 mx-auto mb-3" />
            <p className="text-gray-500">Loading your personalized roadmap...</p>
          </div>
        ) : !aiExists ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-8">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inherit transform rotate-3">
                <Sparkles size={40} className="text-orange-500 -rotate-3" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 mb-3">Build Your AI Roadmap</h3>
              <p className="text-gray-500 text-lg">Answer a few quick questions so the AI can build the most robust and personalized career map for you.</p>
            </div>

            <div className="bg-white rounded-[32px] border border-orange-100 shadow-xl shadow-orange-900/5 p-8 md:p-12 space-y-6">
              {QUESTIONS.map(q => (
                  <div key={q.key}>
                      <label className="block text-gray-800 font-bold mb-2">
                          {q.label}
                      </label>
                      <input
                          type="text"
                          placeholder={q.placeholder}
                          value={answers[q.key] || ''}
                          onChange={e => setAnswers({ ...answers, [q.key]: e.target.value })}
                          className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-5 py-4 text-base text-gray-700 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all font-medium"
                      />
                  </div>
              ))}

              <button 
                  onClick={handleGenerateRoadmap} 
                  disabled={isGenerating || Object.keys(answers).length < 2} 
                  className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-5 bg-gradient-to-r from-orange-500 to-orange-500 text-white font-extrabold rounded-2xl hover:from-orange-600 hover:to-orange-600 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl"
              >
                  {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
                  {isGenerating ? 'AI Architect is working...' : '🚀 Generate Complete Career Map'}
              </button>
              {generateError && <p className="text-red-500 text-sm mt-3 flex items-center justify-center gap-1 font-semibold"><AlertCircle size={16} /> {generateError}</p>}
            </div>
          </motion.div>
        ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                {/* ── REBUILD OPTION ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-orange-50 to-orange-50 p-6 rounded-2xl border border-orange-100/50 gap-4">
                  <div>
                      <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-700 text-lg mb-1">Your Dynamic AI Roadmap is Active</h3>
                      <p className="text-sm text-orange-700/80 font-medium">Need to pivot your journey? You can rebuild your AI Roadmap anytime to match new realities.</p>
                  </div>
                  <button onClick={() => setAiExists(false)} className="shrink-0 px-6 py-3 bg-white text-orange-600 border justify-center border-orange-200 shadow-lg shadow-orange-500/10 font-bold text-sm rounded-xl hover:bg-orange-50 hover:scale-105 transition-all flex items-center gap-2">
                    <Sparkles size={16} /> Rebuild Roadmap
                  </button>
                </div>

                {/* ── MILESTONE MAP ── */}
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-8 flex items-center">
                        <Milestone size={32} className="mr-4 text-orange-500" /> Long-Term Phase Execution
                    </h2>
                    <div className="flex gap-5 overflow-x-auto pb-6 snap-x custom-scrollbar">
                        {milestones.map((m: any, i: number) => (
                            <div key={m.id || i} className="flex items-center shrink-0 snap-start">
                                <div
                                    onClick={() => setSelectedMilestone(m.id)}
                                    className={`cursor-pointer w-[300px] p-6 rounded-[24px] border-2 transition-all relative group ${
                                        selectedMilestone === m.id 
                                        ? 'border-orange-500 bg-gradient-to-br from-orange-50/50 to-orange-50/30 shadow-xl shadow-orange-900/5 transform scale-[1.02]' 
                                        : 'border-transparent shadow-md bg-white hover:border-orange-300'
                                    }`}
                                >
                                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-orange-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-extrabold shadow-lg">
                                        {i + 1}
                                    </div>
                                    <p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-3 opacity-80">
                                        {m.timeline || `Phase ${i + 1}`}
                                    </p>
                                    <h4 className="font-extrabold text-gray-800 text-xl mb-3 pr-4 leading-tight">{m.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {m.description}
                                    </p>
                                    {m.skills_to_gain && (
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {m.skills_to_gain.slice(0, 3).map((s: string) => (
                                                <span key={s} className="px-3 py-1 bg-white border border-gray-100 shadow-sm text-gray-600 rounded-lg text-xs font-bold">{s}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {i < milestones.length - 1 && (
                                    <div className="flex items-center px-4 text-gray-300">
                                        <ChevronRight size={32} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SUB-GOALS for selected milestone ── */}
                {selectedMilestone && (() => {
                    const ms = milestones.find((m: any) => m.id === selectedMilestone);
                    if (!ms?.sub_goals?.length) return null;
                    return (
                        <motion.div initial={{opacity:0, scale: 0.95}} animate={{opacity:1, scale:1}} className="bg-gray-50/80 backdrop-blur-sm rounded-[32px] p-8 md:p-10 border border-gray-200/60 shadow-inner">
                            <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center">
                              Core Mechanics: <span className="bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent ml-2">{ms.title}</span>
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {ms.sub_goals.map((sg: any, i: number) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="font-extrabold text-gray-800 mb-2">{sg.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{sg.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })()}

                <div className="flex flex-col gap-12 mt-4">
                   {/* ── MONTHLY GOALS ── */}
                   {monthlyGoals.length > 0 && (
                      <div className="space-y-6">
                         <h2 className="text-3xl font-extrabold text-gray-800 flex items-center">
                              <Calendar size={32} className="mr-4 text-orange-500" /> Progression Target
                         </h2>
                         <div className="space-y-4">
                              {monthlyGoals.map((mg: any, i: number) => (
                                  <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-md flex flex-col justify-center">
                                      <h4 className="text-orange-600 font-extrabold uppercase tracking-widest text-xs mb-2 bg-orange-50 self-start px-3 py-1 rounded-md">{mg.month}</h4>
                                      <p className="font-extrabold text-gray-800 text-xl py-2">{mg.focus}</p>
                                      {mg.deliverables && (
                                          <div className="mt-4 pt-4 border-t border-gray-50 grid gap-2">
                                              {mg.deliverables.map((d: string, j: number) => (
                                                  <div key={j} className="flex items-start text-sm text-gray-600 font-medium">
                                                      <div className="bg-orange-100 p-1 rounded-full mr-3 mt-0.5">
                                                         <Check size={12} className="text-orange-600 shrink-0" strokeWidth={3} />
                                                      </div>
                                                      <span className="leading-snug">{d}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                              ))}
                         </div>
                      </div>
                   )}

                   {/* ── DAILY TASKS (spawning from selected milestone) ── */}
                   <div className="space-y-6">
                      <div className="flex flex-col mb-2">
                          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                              Active Quests 
                          </h2>
                          {selectedMilestone && <span className="text-orange-600 font-bold mt-2">
                              Linked to: {milestones.find((m: any) => m.id === selectedMilestone)?.title}
                          </span>}
                      </div>
                      
                      {/* WEEKLY FOCUS HIGHLIGHT HEADER */}
                      {aiRoadmap?.weekly_focus && (
                          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[24px] p-6 text-white shadow-2xl relative overflow-hidden shrink-0 mt-2">
                              <div className="absolute -top-10 -right-10 text-white/5 rotate-12">
                                  <Target size={180} />
                              </div>
                              <div className="relative z-10 flex items-start gap-4">
                                <div className="bg-orange-500/20 p-3 rounded-2xl">
                                  <Target className="text-orange-400" size={28} />
                                </div>
                                <div>
                                  <h3 className="text-orange-300 font-bold tracking-widest text-xs uppercase mb-1">Week&apos;s Prime Directive</h3>
                                  <p className="text-xl font-extrabold leading-tight">{aiRoadmap.weekly_focus}</p>
                                </div>
                              </div>
                          </div>
                      )}

                      {filteredTasks.length === 0 ? (
                          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[24px] p-10 text-center mt-6">
                              <p className="text-gray-500 font-bold text-lg">No daily routines mapped for this phase.</p>
                          </div>
                      ) : (
                          <div className="space-y-4 pt-2">
                              {filteredTasks.map((task: any) => (
                                  <div key={task.id} 
                                      onClick={() => toggleTask(task.id, task.completed)}
                                      className={`group flex items-start p-6 rounded-[20px] border-2 transition-all cursor-pointer ${
                                          task.completed 
                                          ? 'bg-green-50/80 border-green-200 shadow-inner' 
                                          : 'bg-white border-gray-100 hover:border-orange-300 shadow-md hover:shadow-lg hover:-translate-y-1'
                                      }`}
                                  >
                                      <div className={`mr-5 mt-1 shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-200 group-hover:text-orange-500'}`}>
                                          {task.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
                                      </div>
                                      <div>
                                          <h4 className={`font-extrabold text-lg mb-1.5 transition-colors ${task.completed ? 'text-green-800 line-through opacity-70' : 'text-gray-800 group-hover:text-orange-900'}`}>{task.title}</h4>
                                          <p className={`text-sm leading-relaxed font-medium ${task.completed ? 'text-green-700/60' : 'text-gray-500 group-hover:text-gray-700'}`}>{task.description}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                   </div>
                </div>
            </motion.div>
        )}
      </div>
    </div>
  );
}
