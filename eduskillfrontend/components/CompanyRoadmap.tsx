'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, Briefcase, Building2, Rocket, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// ===== COURSE DEFINITIONS =====
const COURSES = [
  { id: 'webdev', label: 'Web Development' },
  { id: 'appdev', label: 'App Development' },
  { id: 'datascience', label: 'Data Science' },
  { id: 'ml', label: 'Machine Learning' },
];

const COMPANY_TABS = [
  { id: 'startup', label: 'Initial Startups', icon: Rocket },
  { id: 'service', label: 'Service Based', icon: Building2 },
  { id: 'product', label: 'Product Based', icon: Briefcase },
  { id: 'faang', label: 'FAANG Companies', icon: Star },
];

interface Topic { name: string; subtopics: { name: string }[]; note?: string; }

// ===== ROADMAP DATA =====
const roadmapData: Record<string, Record<string, Topic[]>> = {
  webdev: {
    startup: [
      { name: 'Modern HTML/CSS', subtopics: [{ name: 'Tailwind CSS' }, { name: 'Semantic Markup' }, { name: 'Responsive Layouts' }] },
      { name: 'JavaScript Mastery', subtopics: [{ name: 'ES6+ Features' }, { name: 'Promises/Async' }, { name: 'DOM Manipulation' }] },
      { name: 'React Framework', subtopics: [{ name: 'Hooks' }, { name: 'Context API' }, { name: 'Component Patterns' }] },
      { name: 'Deployment', subtopics: [{ name: 'Vercel/Netlify' }, { name: 'Git Workflow' }, { name: 'CI/CD Basics' }] },
    ],
    service: [
      { name: 'Enterprise Foundations', subtopics: [{ name: 'Angular or Vue.js' }, { name: 'TypeScript Mastery' }, { name: 'SASS/SCSS' }] },
      { name: 'Backend Integration', subtopics: [{ name: 'Java/Node REST APIs' }, { name: 'Microservices Basics' }, { name: 'SQL/NoSQL' }] },
      { name: 'Testing Standards', subtopics: [{ name: 'Unit Testing (Jest)' }, { name: 'Manual QA' }, { name: 'Documentation' }] },
      { name: 'Project Management', subtopics: [{ name: 'Agile/Scrum' }, { name: 'Jira Basics' }, { name: 'Client Communication' }] },
    ],
    product: [
      { name: 'State Architecture', subtopics: [{ name: 'Redux Toolkit' }, { name: 'Zustand' }, { name: 'Immersive UI' }] },
      { name: 'Performance Optimization', subtopics: [{ name: 'Next.js SSR/Static' }, { name: 'Code Splitting' }, { name: 'Asset Prefetching' }] },
      { name: 'UX Engineering', subtopics: [{ name: 'Framer Motion' }, { name: 'Design Systems' }, { name: 'Accessibility (A11y)' }] },
      { name: 'DevOps & Monitoring', subtopics: [{ name: 'Docker/K8s' }, { name: 'Sentry/Logging' }, { name: 'Analytics Integration' }] },
    ],
    faang: [
      { name: 'Computer Science Core', subtopics: [{ name: 'Advanced DS/Algo' }, { name: 'Algorithm Efficiency' }, { name: 'System Design Patterns' }] },
      { name: 'Browser Internals', subtopics: [{ name: 'Rendering Engines' }, { name: 'V8 Engine Optimization' }, { name: 'Network Protocols' }] },
      { name: 'Scalable Architecture', subtopics: [{ name: 'Micro-Frontends' }, { name: 'Graph QL' }, { name: 'Edge Computing' }] },
      { name: 'Reliability Engineering', subtopics: [{ name: 'Automated E2E Testing' }, { name: 'Security Audits' }, { name: 'Large Scale Deployments' }] },
    ]
  },
  appdev: {
    startup: [
      { name: 'Mobile Fundamentals', subtopics: [{ name: 'React Native Basics' }, { name: 'Flutter Introduction' }, { name: 'App Lifecycle' }] },
      { name: 'Fast Development', subtopics: [{ name: 'Firebase Integration' }, { name: 'Expo Workflow' }, { name: 'Rapid Prototyping' }] },
    ],
    service: [
      { name: 'Native Integration', subtopics: [{ name: 'Swift Basics' }, { name: 'Kotlin Basics' }, { name: 'Native Modules' }] },
      { name: 'Enterprise App Patterns', subtopics: [{ name: 'Offline Data Storage' }, { name: 'Enterprise Security' }, { name: 'Multi-lingual Apps' }] },
    ],
    product: [
      { name: 'Experience Focused', subtopics: [{ name: 'Smooth Animations' }, { name: 'Push Notifications' }, { name: 'In-App Purchases' }] },
      { name: 'Production Quality', subtopics: [{ name: 'Performance Tuning' }, { name: 'Memory Management' }, { name: 'Detailed Analytics' }] },
    ],
    faang: [
      { name: 'High-Level Architecture', subtopics: [{ name: 'Cross-platform Optimization' }, { name: 'Scalable Mobile Backends' }, { name: 'Advanced Concurrency' }] },
      { name: 'Standard Compliance', subtopics: [{ name: 'Accessibility standards' }, { name: 'Security Encryption' }, { name: 'Deep System Integration' }] },
    ]
  },
  datascience: {
    startup: [
      { name: 'Data Essentials', subtopics: [{ name: 'Python for Data' }, { name: 'Pandas/Numpy' }, { name: 'Basic ETL' }] },
      { name: 'Insights Generation', subtopics: [{ name: 'Visual Dashboards' }, { name: 'Exploratory Analysis' }, { name: 'Reporting' }] },
    ],
    service: [
      { name: 'Structured Pipelines', subtopics: [{ name: 'SQL Databases' }, { name: 'Data Cleaning' }, { name: 'Statistical Testing' }] },
      { name: 'Deployment Focus', subtopics: [{ name: 'Power BI / Tableau' }, { name: 'BigQuery / Snowflake' }, { name: 'Cloud Basics' }] },
    ],
    product: [
      { name: 'Feature Engineering', subtopics: [{ name: 'Advanced Selection' }, { name: 'Dimensionality Reduction' }, { name: 'A/B Testing' }] },
      { name: 'Production Data', subtopics: [{ name: 'Real-time Streaming' }, { name: 'Airflow Orchestration' }, { name: 'Scalable ETL' }] },
    ],
    faang: [
      { name: 'Research & Scale', subtopics: [{ name: 'Advanced Analytics' }, { name: 'Research Methodologies' }, { name: 'Petabyte-scale Processing' }] },
      { name: 'System Design', subtopics: [{ name: 'Distributed Systems' }, { name: 'Algorithmic Fairness' }, { name: 'Strategic Decisioning' }] },
    ]
  },
  ml: {
    startup: [
      { name: 'ML Basics', subtopics: [{ name: 'Scikit-Learn' }, { name: 'Regression/Classification' }, { name: 'Model Evaluation' }] },
      { name: 'Applied AI', subtopics: [{ name: 'OpenAI API' }, { name: 'Simple HuggingFace' }, { name: 'API Wrappers' }] },
    ],
    service: [
      { name: 'Classical Models', subtopics: [{ name: 'Model Refinement' }, { name: 'Pipeline Integration' }, { name: 'Custom Visualizations' }] },
      { name: 'Client Implementations', subtopics: [{ name: 'Edge AI Basics' }, { name: 'Cost Optimization' }, { name: 'Client Dashboards' }] },
    ],
    product: [
      { name: 'Deep Learning', subtopics: [{ name: 'Neural Networks' }, { name: 'TensorFlow/PyTorch' }, { name: 'Fine-tuning Models' }] },
      { name: 'MLOps', subtopics: [{ name: 'Model Versioning' }, { name: 'Continuous Training' }, { name: 'Monitoring drift' }] },
    ],
    faang: [
      { name: 'Core Innovation', subtopics: [{ name: 'Transformers & LLMs' }, { name: 'Computer Vision Core' }, { name: 'Reinforcement Learning' }] },
      { name: 'Large Scale Inference', subtopics: [{ name: 'High-Throughput APIs' }, { name: 'Custom Hardware (TPU)' }, { name: 'Security in AI' }] },
    ]
  }
};

const COURSE_ID_MAP: Record<number, string> = {
  5: 'webdev',
  6: 'appdev',
  7: 'datascience',
  8: 'ml',
};

interface CompanyRoadmapProps {
  courseId?: number;
}

export default function CompanyRoadmap({ courseId }: CompanyRoadmapProps) {
  const router = useRouter();
  const fixedCourse = courseId ? COURSE_ID_MAP[courseId] : undefined;
  const [activeCourse, setActiveCourse] = useState(fixedCourse || 'webdev');
  const [activeTab, setActiveTab] = useState('startup');
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [togglingKeys, setTogglingKeys] = useState<Set<string>>(new Set());

  const fetchProgress = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await api.getRoadmapProgress(activeCourse, activeTab, token);
      if (res.success) setCompletedSet(new Set(res.completedKeys));
    } catch { /* ignored */ }
  }, [activeCourse, activeTab]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const toggleTopic = (topicName: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicName)) { next.delete(topicName); } else { next.add(topicName); }
      return next;
    });
  };

  const handleSubtopicClick = async (topicName: string, subtopicName: string) => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const key = `${topicName}::${subtopicName}`;
    if (togglingKeys.has(key)) return;
    setTogglingKeys(prev => new Set(prev).add(key));

    setCompletedSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); } else { next.add(key); }
      return next;
    });

    try {
      await api.toggleRoadmapSubtopic({
        course_key: activeCourse,
        company_type: activeTab,
        topic_name: topicName,
        subtopic_name: subtopicName,
      }, token);
    } catch (error: any) {
      alert(`Failed to save progress: ${error.message || 'Server error'}`);
       setCompletedSet(prev => {
        const next = new Set(prev);
        if (next.has(key)) { next.delete(key); } else { next.add(key); }
        return next;
      });
    } finally {
      setTogglingKeys(prev => { const n = new Set(prev); n.delete(key); return n; });
    }
  };

  const getTopicProgress = (topic: Topic) => {
    let done = 0;
    for (const sub of topic.subtopics) {
      if (completedSet.has(`${topic.name}::${sub.name}`)) done++;
    }
    return done;
  };

  const topics = (roadmapData[activeCourse] && roadmapData[activeCourse][activeTab]) || [];

  return (
    <div className="w-full">
      {/* Course Pills */}
      {!fixedCourse && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {COURSES.map(course => (
            <button
              key={course.id}
              onClick={() => { setActiveCourse(course.id); setExpandedTopics(new Set()); }}
              className={`h-[50px] px-8 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                activeCourse === course.id
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-black/40 border-2 border-transparent hover:border-black/5'
              }`}
            >
              {course.label}
            </button>
          ))}
        </div>
      )}

      {/* Interface Container */}
      <div className="overflow-hidden">
        {/* Tier Tabs */}
        <div className="border-b border-gray-100 flex overflow-x-auto">
          <div className="flex min-w-max">
            {COMPANY_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setExpandedTopics(new Set()); }}
                  className={`flex items-center gap-3 px-6 md:px-8 py-6 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${
                    isActive
                      ? 'text-black border-black'
                      : 'text-black/30 border-transparent hover:text-black/60'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-black' : 'text-black/20'} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Roadmap Nodes */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="py-8 space-y-3">
          {topics.length > 0 ? (
            topics.map((topic, idx) => {
              const isExpanded = expandedTopics.has(topic.name);
              const count = topic.subtopics.length;
              const done = getTopicProgress(topic);
              const isTopicComplete = done === count && count > 0;
              const pct = count > 0 ? Math.round((done / count) * 100) : 0;

              return (
                <motion.div
                  variants={itemVariants}
                  key={`${activeTab}-${topic.name}`}
                  className={`rounded-[24px] border transition-all ${
                    isExpanded ? 'border-gray-200 bg-gray-50/30' : 'border-gray-50 bg-[#FBFBFB] hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleTopic(topic.name)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                  >
                    <div className="flex items-center gap-5">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                          isTopicComplete ? 'bg-black text-white' : 'bg-white text-black/20 border-2 border-gray-50 group-hover:border-black/10'
                       }`}>
                          {isTopicComplete ? '✓' : idx + 1}
                       </div>
                       <span className={`font-bold text-lg tracking-tight transition-colors ${isExpanded ? 'text-black' : 'text-black/40 group-hover:text-black'}`}>
                          {topic.name}
                       </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex flex-col items-end opacity-40">
                         <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-black transition-all duration-500" style={{ width: `${pct}%` }} />
                         </div>
                      </div>
                      <ChevronDown size={20} className={`transition-transform duration-500 ${isExpanded ? 'rotate-180 text-black' : 'text-black/10'}`} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 mt-1 flex flex-col gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="grid md:grid-cols-2 gap-2">
                        {topic.subtopics.map((sub, sIdx) => {
                          const subKey = `${topic.name}::${sub.name}`;
                          const isCompleted = completedSet.has(subKey);
                          const isToggling = togglingKeys.has(subKey);

                          return (
                            <button
                              key={sIdx}
                              onClick={() => handleSubtopicClick(topic.name, sub.name)}
                              disabled={isToggling}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-2 text-left ${
                                isCompleted 
                                  ? 'bg-black border-black text-white' 
                                  : 'bg-white border-transparent text-black/30 hover:border-black/5 hover:text-black'
                              } ${isToggling ? 'opacity-50' : ''}`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                                isCompleted ? 'bg-white border-white' : 'bg-black/5 border-transparent'
                              }`}>
                                {isCompleted && <Check size={10} className="text-black" strokeWidth={4} />}
                              </div>
                              <span className="font-bold text-xs tracking-tight">
                                {sub.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="py-20 text-center">
               <p className="text-black/20 font-bold tracking-widest text-xs">Curriculum syncing in progress...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
