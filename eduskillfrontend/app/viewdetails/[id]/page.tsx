'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import Header2 from '@/components/Header2';
import ProgressBar from '@/components/ProgressBar';
import Sidebar from '@/components/Sidebar';
import { api } from '@/lib/api';
import Script from 'next/script';
import { Clock, Sparkles, Loader2, ShoppingCart, CheckCircle, ArrowRight, Lock, PartyPopper, ChevronDown } from 'lucide-react';
import CompanyRoadmap from '@/components/CompanyRoadmap';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Define interface for Course Details
interface CourseDetail {
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  level: string;
  content: {
    headings: string[];
    descriptions: string[];
  };
  botpressUrl?: string;
}

// Static data for roadmaps (IDs 5-8) — UNCHANGED
const courseDetails: Record<number, CourseDetail> = {
  5: {
    title: 'Web Development Roadmap',
    description: 'A comprehensive roadmap to becoming a skilled web developer.',
    longDescription: 'Master the art of building modern web applications from scratch. This roadmap takes you through HTML, CSS, JavaScript, and modern frameworks, giving you the complete toolkit to build responsive and dynamic websites.',
    price: 0,
    duration: 'Self-paced',
    level: 'Beginner to Advanced',
    content: {
      headings: ['1. HTML', '2. CSS', '3. JavaScript', '4. Version Control', '5. Frameworks', '6. Deployment'],
      descriptions: [
        'Forms, input types, and Accessibility.',
        'Selectors, Box model, Flexbox/Grid, and Responsive design.',
        'DOM manipulation, Event handling, and Async/Await.',
        'Git basics and GitHub usage.',
        'React, Vue, or Tailwind CSS basics.',
        'Netlify, Vercel, and Domain basics.',
      ],
    },
  },
  6: {
    title: 'App Development Roadmap',
    description: 'A step-by-step guide to mastering mobile application development.',
    longDescription: 'Build cross-platform mobile applications with industry-standard tools. From React Native to Flutter, learn how to create beautiful native apps that work on both iOS and Android from a single codebase.',
    price: 0,
    duration: 'Self-paced',
    level: 'Intermediate',
    content: {
      headings: ['1. React Native', '2. Flutter', '3. Native Development', '4. State Management', '5. Backend Integration', '6. Deployment'],
      descriptions: [
        'Cross-platform mobile development with React.',
        'Beautiful native applications from a single codebase.',
        'iOS and Android native development.',
        'Managing application state effectively.',
        'Connecting apps to backend services.',
        'Publishing apps to app stores.',
      ],
    },
  },
  7: {
    title: 'Data Science Roadmap',
    description: 'Your path to becoming a professional data scientist.',
    longDescription: 'Dive into the world of data science with this comprehensive roadmap. Learn data analysis, visualization, machine learning algorithms, and how to extract meaningful insights from complex datasets.',
    price: 0,
    duration: 'Self-paced',
    level: 'Beginner to Advanced',
    content: {
      headings: ['1. Python Basics', '2. Data Analysis', '3. Statistics', '4. Visualization', '5. Machine Learning Intro', '6. Projects'],
      descriptions: [
        'Python programming fundamentals for data science.',
        'Working with pandas and numpy for data manipulation.',
        'Probability, distributions, and hypothesis testing.',
        'Creating visualizations with matplotlib and seaborn.',
        'Building basic ML models with scikit-learn.',
        'End-to-end data science projects portfolio.',
      ],
    },
  },
  8: {
    title: 'Machine Learning Roadmap',
    description: 'The complete journey to becoming a machine learning expert.',
    longDescription: 'Master the foundations and advanced concepts of machine learning. From supervised learning to deep neural networks, this roadmap equips you with the skills to build intelligent systems that learn from data.',
    price: 0,
    duration: 'Self-paced',
    level: 'Intermediate to Advanced',
    content: {
      headings: ['1. Math Foundations', '2. Supervised Learning', '3. Unsupervised Learning', '4. Deep Learning', '5. NLP & Computer Vision', '6. Deployment'],
      descriptions: [
        'Linear algebra, calculus, and probability for ML.',
        'Regression, classification, and ensemble methods.',
        'Clustering, dimensionality reduction, and anomaly detection.',
        'Neural networks, CNNs, and TensorFlow/PyTorch.',
        'Text processing, image recognition, and transformers.',
        'Deploying ML models to production with APIs.',
      ],
    },
  },
};

// Course descriptions for DB courses (IDs 1-4)
const courseDescriptions: Record<number, { longDescription: string; price: number; duration: string; level: string; highlights: string[] }> = {
  1: {
    longDescription: 'Become a full-stack web developer with this comprehensive course. You\'ll master HTML5, CSS3, JavaScript ES6+, React.js, Node.js, and modern deployment strategies. Build real-world projects including responsive websites, REST APIs, and full-stack applications from scratch.',
    price: 499,
    duration: '12 Weeks',
    level: 'Beginner to Advanced',
    highlights: ['Build 5+ real-world projects', 'Learn React.js & Node.js', 'REST API development', 'Database design & management', 'Modern deployment with CI/CD'],
  },
  2: {
    longDescription: 'Master mobile app development with React Native and Flutter. Learn to build cross-platform apps that look and feel native on both iOS and Android. Cover state management, API integration, push notifications, and app store deployment.',
    price: 499,
    duration: '10 Weeks',
    level: 'Intermediate',
    highlights: ['Cross-platform development', 'React Native & Flutter', 'State management patterns', 'Push notifications & deep links', 'App Store & Play Store deployment'],
  },
  3: {
    longDescription: 'Dive deep into the world of Data Science. Learn Python for data analysis, statistical methods, data visualization with matplotlib and seaborn, machine learning fundamentals with scikit-learn, and build end-to-end data science projects that solve real business problems.',
    price: 499,
    duration: '14 Weeks',
    level: 'Beginner to Advanced',
    highlights: ['Python for data analysis', 'Statistical analysis & probability', 'Data visualization mastery', 'Machine learning with scikit-learn', 'Real-world capstone project'],
  },
  4: {
    longDescription: 'Master Machine Learning from theory to production. Cover supervised & unsupervised learning, neural networks, deep learning with TensorFlow and PyTorch, natural language processing, computer vision, and model deployment. Build AI systems that learn and improve from data.',
    price: 499,
    duration: '16 Weeks',
    level: 'Intermediate to Advanced',
    highlights: ['Supervised & unsupervised learning', 'Deep learning with TensorFlow', 'Natural language processing', 'Computer vision & CNNs', 'Model deployment & MLOps'],
  },
};

// Course IDs 1-4 are fetched from DB
const DB_COURSE_IDS = [1, 2, 3, 4];

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const courseId = parseInt(id);

  // State for DB-backed courses (IDs 1-4)
  const [courseData, setCourseData] = useState<any>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(DB_COURSE_IDS.includes(courseId));
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());

  const isDBCourse = DB_COURSE_IDS.includes(courseId);
  const staticCourse = courseDetails[courseId];

  // ===== CHATBOT STATE (COMMENTED OUT) =====
  // const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!isDBCourse) return;

    const fetchData = async () => {
      try {
        const courseRes = await api.getCourse(courseId);
        if (courseRes.success) {
          setCourseData(courseRes.course);
        }

        // Try to fetch progress and purchase status if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const progressRes = await api.getUserProgress(courseId, token);
            if (progressRes.success) {
              setProgressData(progressRes.progress);
            }
          } catch {
            // User not logged in or progress fetch failed — that's okay
          }

          try {
            const purchaseRes = await api.getPurchasedCourses(token);
            if (purchaseRes.success && purchaseRes.purchasedCourseIds.includes(courseId)) {
              setIsPurchased(true);
            }
          } catch {
            // Not logged in — that's okay
          }
        }
      } catch (error) {
        console.error('Failed to fetch course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, isDBCourse]);

  useEffect(() => {
    if (courseData?.phases) {
      setExpandedPhases(new Set(courseData.phases.map((p: any) => p.id)));
    }
  }, [courseData]);

  const togglePhase = (phaseId: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) next.delete(phaseId);
      else next.add(phaseId);
      return next;
    });
  };

  const initiatePayment = async (courseTitle?: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // alert('Please login to purchase this course!');
      router.push('/login');
      return;
    }

    const title = courseTitle || staticCourse?.title || 'Course';
    setIsProcessing(true);
    try {
      const res = await fetch('https://eduskill-1.onrender.com/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 499,
          name: title,
          description: `Full access to ${title}`,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        alert('Something went wrong while creating order');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Eduskill',
        description: data.description,
        order_id: data.order_id,
        handler: async function (response: any) {
          console.log('Payment Successful', response);
          // Save purchase to database
          try {
            await api.purchaseCourse(courseId, token);
            setIsPurchased(true);
          } catch (err) {
            console.error('Failed to save purchase:', err);
          }
          setIsProcessing(false);
        },
        prefill: {
          name: 'Eduskill User',
          email: 'user@eduskill.com',
          contact: '9999999999',
        },
        theme: { color: '#FF6643' },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            alert('Payment Cancelled');
          },
        },
      };

      // Ensure Razorpay script is loaded before using it
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on('payment.failed', function (response: any) {
        alert('Payment Failed: ' + response.error.description);
        setIsProcessing(false);
      });
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Failed to initiate payment. Please check your network connection.');
      setIsProcessing(false);
    }
  };

  // Loading state for DB courses
  if (isDBCourse && loading) {
    return (
      <div>
        <Header2 />
        <main className="max-w-[85vw] mx-auto py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-xl w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="grid md:grid-cols-[280px_1fr] gap-8 mt-8">
              <div className="h-64 bg-gray-200 rounded-[24px]" />
              <div className="h-96 bg-gray-200 rounded-[30px]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ===== DB Course View (IDs 1-4) — Phases + Modules from API =====
  if (isDBCourse && courseData) {
    const completedModuleIds = new Set<number>(
      (progressData?.modules || [])
        .filter((m: any) => m.completed)
        .map((m: any) => m.module_id)
    );

    const totalModules = progressData?.total_modules || 0;
    const completedModules = progressData?.completed_modules || 0;
    const desc = courseDescriptions[courseId];

    return (
      <div className="min-h-screen bg-white">
        <Header2 />
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />

        <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="max-w-[85vw] mx-auto py-12">
          {/* ===== Modern Course Description Hero ===== */}
          <div className="relative mb-12 rounded-[30px] overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6643]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-1.5 bg-[#FF6643] text-white text-sm font-bold rounded-full">
                  {desc?.level || 'All Levels'}
                </span>
                <span className="px-4 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-full backdrop-blur-sm flex items-center gap-1.5">
                  <Clock size={14} /> {desc?.duration || '12 Weeks'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                {courseData.title}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-6">
                {desc?.longDescription || courseData.description}
              </p>

              {/* Highlights */}
              {desc?.highlights && (
                <div className="flex flex-wrap gap-3 mb-8">
                  {desc.highlights.map((h, i) => (
                    <span key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/90 text-sm backdrop-blur-sm">
                      <Sparkles size={14} className="text-[#FF6643]" /> {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex items-center gap-6">
                {!isPurchased ? (
                  <>
                    <div className="text-3xl font-extrabold text-white">
                      ₹{desc?.price || 499}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => initiatePayment(courseData.title)}
                      disabled={isProcessing}
                      className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#FF6643] to-[#ff8a65] text-white text-lg font-bold rounded-2xl hover:from-[#e65c00] hover:to-[#FF6643] transition-all shadow-lg shadow-[#FF6643]/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <><ShoppingCart size={20} /> Buy Course</>}
                    </motion.button>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-[#FF6643]/10 border border-[#FF6643]/30 rounded-2xl flex items-center gap-2">
                      <CheckCircle size={20} className="text-[#FF6643]" />
                      <span className="text-[#FF6643] font-bold text-lg">Course Purchased</span>
                    </div>
                    {courseData.phases?.[0]?.modules?.[0] && (
                      <Link href={`/modules/${courseData.phases[0].modules[0].id}`}>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-10 py-4 bg-[#FF6643] text-white text-lg font-bold rounded-2xl hover:bg-[#e65c00] transition-all shadow-lg hover:-translate-y-0.5"
                        >
                          <ArrowRight size={20} /> Continue Learning
                        </motion.button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment success banner */}
          {isPurchased && (
            <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-[#FF6643]/20 rounded-2xl text-center flex items-center justify-center gap-2">
              <PartyPopper size={20} className="text-[#FF6643]" />
              <span className="text-[#FF6643] font-bold text-lg">You have full access to this course!</span>
            </div>
          )}

          {/* Progress Bar */}
          {isPurchased && totalModules > 0 && (
            <div className="mb-10 px-6">
              <ProgressBar completed={completedModules} total={totalModules} />
            </div>
          )}

          {/* ===== Course Content (Modules) — Only visible after purchase ===== */}
          {isPurchased ? (
            <div className="grid md:grid-cols-[300px_1fr] gap-8">
              {/* Sidebar */}
              <div className="order-2 md:order-1">
                <Sidebar
                  phases={courseData.phases || []}
                  completedModuleIds={completedModuleIds}
                />
              </div>

              {/* Main Content */}
              <div className="order-1 md:order-2">
                <div className="py-4">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-[#FF6643] pl-4">
                    Course Roadmap
                  </h2>
                  <div className="space-y-6">
                    {(() => {
                      const phases = [...(courseData.phases || [])];
                      if (DB_COURSE_IDS.includes(courseId) && phases.length > 0) {
                        const lastPhase = { ...phases[phases.length - 1] };
                        lastPhase.modules = [
                          ...lastPhase.modules,
                          {
                            id: 9999, // Special ID for certificate
                            title: 'Claim Your Certificate',
                            isCertificate: true
                          }
                        ];
                        phases[phases.length - 1] = lastPhase;
                      }

                      return phases.map((phase: any) => {
                        const isExpanded = expandedPhases.has(phase.id);
                        const totalModulesInPhase = phase.modules.length;
                        const completedInPhase = phase.modules.filter((m: any) => completedModuleIds.has(m.id)).length;
                        const progressPercent = totalModulesInPhase > 0 ? (completedInPhase / totalModulesInPhase) * 100 : 0;

                        return (
                          <div key={phase.id} className="mb-4">
                            <button
                              onClick={() => togglePhase(phase.id)}
                              className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
                            >
                              <span className="font-bold text-gray-800 text-lg">{phase.title}</span>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-400">
                                    {completedInPhase}/{totalModulesInPhase}
                                  </span>
                                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                    <div
                                      className="h-full bg-[#FF6643] transition-all duration-500"
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                                <ChevronDown
                                  size={18}
                                  className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="mt-2 space-y-2">
                                {phase.modules.map((mod: any) => {
                                  const isCertificate = mod.id === 9999;
                                  const isCompleted = completedModuleIds.has(mod.id);
                                  const isCourseFullyCompleted = (progressData?.percentage || 0) === 100;
                                  const isLocked = isCertificate && !isCourseFullyCompleted;

                                  return (
                                    <Link
                                      key={mod.id}
                                      href={isLocked ? '#' : isCertificate ? `/modules/${mod.id}?courseId=${courseId}` : `/modules/${mod.id}`}
                                      onClick={(e) => isLocked && e.preventDefault()}
                                      className={`flex items-center gap-3 p-4 rounded-xl transition-all border ${isCompleted || (isCertificate && isCourseFullyCompleted)
                                        ? 'bg-green-50/50 border-green-100 text-green-700 shadow-sm'
                                        : isLocked
                                          ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                                          : 'bg-white border-gray-100 text-gray-600 hover:border-[#FF6643]/30 hover:shadow-md hover:-translate-y-0.5 group'
                                        }`}
                                    >
                                      {isCertificate ? (
                                        isCourseFullyCompleted ? (
                                          <CheckCircle size={18} className="text-green-500" />
                                        ) : (
                                          <Lock size={18} className="text-gray-400" />
                                        )
                                      ) : isCompleted ? (
                                        <span className="text-green-500 font-bold">✓</span>
                                      ) : (
                                        <span className={`w-2 h-2 rounded-full ${isLocked ? 'bg-gray-300' : 'bg-[#FF6643]'}`} />
                                      )}
                                      <span className="font-medium">
                                        {mod.title}
                                      </span>
                                      {!isLocked && <span className="ml-auto text-[#FF6643] opacity-40 group-hover:opacity-100 transition-opacity">→</span>}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* ===== AI MENTOR (Botpress) ===== */}
                <div className="mt-10 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-[24px] border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-purple-800 text-lg">AI Mentor</h3>
                        <p className="text-purple-600 text-sm">Ask questions about {courseData.title}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-purple-100">
                    <iframe
                      src="https://cdn.botpress.cloud/webchat/v3.0/shareable.html?configUrl=https://files.bpcontent.cloud/2025/02/02/16/20250202160648-VCUOL1UL.json"
                      frameBorder="0"
                      className="w-full h-[500px]"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Module preview when not purchased */
            <div className="py-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-[#FF6643] pl-4">
                What You&apos;ll Learn
              </h2>
              <div className="space-y-4">
                {(courseData.phases || []).map((phase: any) => {
                  const totalModulesInPhase = phase.modules.length;
                  return (
                    <div key={phase.id} className="mb-4">
                      <div className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm text-left">
                        <span className="font-bold text-gray-800 text-lg">{phase.title}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-400">
                            {totalModulesInPhase} Modules
                          </span>
                          <Lock size={18} className="text-gray-300" />
                        </div>
                      </div>
                      <div className="mt-2 space-y-2 opacity-60 ml-4 pl-4 border-l-2 border-gray-100">
                        {phase.modules.map((mod: any) => (
                          <div
                            key={mod.id}
                            className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent text-gray-400"
                          >
                            <Lock size={16} className="text-gray-300" />
                            <span className="font-medium text-sm">{mod.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Buy CTA at bottom */}
              <div className="mt-10 text-center">
                <button
                  onClick={() => initiatePayment(courseData.title)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 justify-center px-12 py-5 bg-gradient-to-r from-[#FF6643] to-[#ff8a65] text-white text-xl font-bold rounded-2xl hover:from-[#e65c00] hover:to-[#FF6643] transition-all shadow-lg shadow-[#FF6643]/30 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <><Loader2 size={22} className="animate-spin" /> Processing...</> : <><ShoppingCart size={22} /> Buy Course — ₹499</>}
                </button>
                <p className="mt-3 text-gray-400 text-sm">One-time payment • Lifetime access</p>
              </div>
            </div>
          )}
        </motion.main>

        <Footer />
      </div>
    );
  }

  // ===== Static Course/Roadmap View (IDs 5-8) — UNCHANGED =====
  if (!staticCourse) {
    return (
      <div>
        <Header />
        <div className="max-w-[85vw] mx-auto py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <Link href="/">
            <button className="bg-[#FF6643] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e65c00] transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header2 />

      <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="max-w-[85vw] mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {staticCourse.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
            {staticCourse.longDescription || staticCourse.description}
          </p>
        </div>

        {/* Interactive Company-Type Roadmap */}
        <CompanyRoadmap courseId={courseId} />
      </motion.main>

      <Footer />
    </div>
  );
}
