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
import AskMentorChat from '@/components/AskMentorChat';
import Script from 'next/script';
import { Clock, Sparkles, Loader2, ShoppingCart, CheckCircle, ArrowRight, Lock, PartyPopper, ChevronDown } from 'lucide-react';
import CompanyRoadmap from '@/components/CompanyRoadmap';
import { motion } from 'framer-motion';



const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
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

// Static data for roadmaps (IDs 5-8)
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
    longDescription: 'Become a full-stack web developer with this comprehensive course. You master HTML5, CSS3, JavaScript ES6+, React.js, Node.js, and modern deployment strategies. Build real-world projects including responsive websites, REST APIs, and full-stack applications from scratch.',
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

  useEffect(() => {
    if (!isDBCourse) return;

    const fetchData = async () => {
      try {
        const courseRes = await api.getCourse(courseId);
        if (courseRes.success) {
          setCourseData(courseRes.course);
        }

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const progressRes = await api.getUserProgress(courseId, token);
            if (progressRes.success) {
              setProgressData(progressRes.progress);
            }
          } catch { /* skip */ }

          try {
            const purchaseRes = await api.getPurchasedCourses(token);
            if (purchaseRes.success && purchaseRes.purchasedCourseIds.includes(courseId)) {
              setIsPurchased(true);
            }
          } catch { /* skip */ }
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
      router.push('/login');
      return;
    }

    const title = courseTitle || staticCourse?.title || 'Course';
    setIsProcessing(true);
    try {
      const data = await api.createOrder({
        amount: 499,
        name: title,
        description: `Full access to ${title}`,
      }, token);

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'Eduskill',
        description: data.description,
        order_id: data.order_id,
        handler: async function (response: any) {
          try {
            // Step 1: Verify Payment on Server
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, token);

            if (verifyRes.success) {
              // Step 2: Record purchase only after successful verification
              await api.purchaseCourse(courseId, token);
              setIsPurchased(true);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Payment Processing Error:', err);
            alert('Error processing payment. Please contact support.');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: 'Eduskill User',
          email: 'user@eduskill.com',
          contact: '9999999999',
        },
        theme: { color: '#000000' },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            alert('Payment Cancelled');
          },
        },
      };

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
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Failed to initiate payment.');
      setIsProcessing(false);
    }
  };

  if (isDBCourse && loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header2 />
        <main className="max-w-[85vw] mx-auto py-32">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-100 rounded-[30px] w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="grid md:grid-cols-[300px_1fr] gap-12 mt-12">
              <div className="h-80 bg-gray-100 rounded-[32px]" />
              <div className="h-[500px] bg-gray-100 rounded-[40px]" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ===== DB Course View (IDs 1-4) =====
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
        <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

        <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="max-w-[100vw] overflow-x-hidden">
          {/* ===== Restored Massive Hero Section (White Background) ===== */}
          <section className="relative bg-white pt-40 pb-20 px-6 md:px-12 border-b border-gray-100">
            <div className="max-w-[85vw] mx-auto relative z-10">
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <span className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {desc?.level || 'Premium Content'}
                </span>
                <span className="px-4 py-1.5 bg-gray-50 text-black/50 text-[10px] font-bold uppercase tracking-widest rounded-full border border-gray-100 flex items-center gap-2">
                  <Clock size={12} /> {desc?.duration || 'Course Program'}
                </span>
              </div>

              <h1 className="text-6xl md:text-9xl font-black text-black mb-12 tracking-tighter leading-[0.85] uppercase">
                {courseData.title}
              </h1>

              <p className="text-xl md:text-2xl text-black/60 font-medium leading-tight max-w-4xl mb-16">
                {desc?.longDescription || courseData.description}
              </p>

              {/* Highlights */}
              {desc?.highlights && (
                <div className="flex flex-wrap gap-4 mb-20">
                  {desc.highlights.map((h, i) => (
                    <span key={i} className="flex items-center gap-3 px-6 py-5 bg-gray-50 border border-gray-100 rounded-[24px] text-black font-bold text-sm transition-all hover:bg-gray-100">
                      <Sparkles size={16} className="text-black/20" /> {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10">
                {!isPurchased ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-black/30 text-[10px] font-bold uppercase tracking-widest mb-1">Project Fee</span>
                      <div className="text-5xl font-black text-black tracking-tight">
                        ₹{desc?.price || 499}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => initiatePayment(courseData.title)}
                      disabled={isProcessing}
                      className="h-[90px] px-16 bg-black text-white text-xl font-black uppercase tracking-tight rounded-full flex justify-center items-center shadow-2xl hover:bg-gray-900 transition-all disabled:opacity-50"
                    >
                      {isProcessing ? <Loader2 size={28} className="animate-spin" /> : <><ShoppingCart className="mr-4" size={28} /> Get Access</>}
                    </motion.button>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                    <div className="h-[90px] px-10 bg-gray-50 border border-gray-100 rounded-full flex items-center gap-4">
                      <CheckCircle size={28} className="text-black" />
                      <span className="text-black font-black tracking-widest text-xs">Unlocked</span>
                    </div>
                    {courseData.phases?.[0]?.modules?.[0] && (
                      <Link href={`/modules/${courseData.phases[0].modules[0].id}`}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-[90px] px-16 bg-black text-white text-xl font-black uppercase tracking-tight rounded-full flex justify-center items-center shadow-2xl hover:bg-gray-900 transition-all"
                        >
                          Continue Learning <ArrowRight className="ml-4" size={28} />
                        </motion.button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ===== Main Content Area ===== */}
          <section className="bg-white py-24 px-6 md:px-12">
            <div className="max-w-[85vw] mx-auto">

              {isPurchased && (
                <div className="mb-20">
                  <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-black text-black tracking-tight uppercase">Program Progress</h2>
                    <span className="text-black font-black text-2xl">{Math.round((completedModules / totalModules) * 100)}%</span>
                  </div>
                  <ProgressBar completed={completedModules} total={totalModules} />
                </div>
              )}

              <div className="grid lg:grid-cols-[400px_1fr] gap-20 items-start">

                {/* Left Column: Sidebar (if purchased) or Highlights */}
                <div className="space-y-12 sticky top-36">
                  {isPurchased ? (
                    <Sidebar
                      phases={courseData.phases || []}
                      completedModuleIds={completedModuleIds}
                    />
                  ) : (
                    <div className="bg-[#FBFBFB] p-12 rounded-[50px] border border-gray-100">
                      <h3 className="text-xl font-black text-black uppercase tracking-widest mb-10">Benefits</h3>
                      <ul className="space-y-8">
                        {['Industry Certificates', 'Expert AI Mentorship', 'Live Community Access', 'Lifetime Repository Updates'].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-6">
                            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center shrink-0 mt-1">
                              <CheckCircle size={14} className="text-white" />
                            </div>
                            <span className="text-black/60 font-bold text-lg leading-tight">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Mentor Trigger */}
                  <div className="bg-gray-50 p-12 rounded-[50px] border border-gray-100 group transition-all hover:border-black/10">
                    <h3 className="text-xl font-black text-black uppercase tracking-widest mb-6">AI Mentor v2.0</h3>
                    <p className="text-black/40 font-bold text-base mb-10">Personalized feedback and code debugging instantly.</p>
                    <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center transition-transform group-hover:rotate-12">
                      <Sparkles className="text-white" size={32} />
                    </div>
                  </div>
                </div>

                {/* Right Column: Roadmap / Curriculum */}
                <div className="space-y-16">
                  <div className="flex items-center justify-between">
                    <h2 className="text-5xl font-black text-black tracking-tighter uppercase">Curriculum</h2>
                  </div>

                  <div className="space-y-6">
                    {(() => {
                      const phases = [...(courseData.phases || [])];
                      if (DB_COURSE_IDS.includes(courseId) && phases.length > 0) {
                        const lastPhase = { ...phases[phases.length - 1] };
                        lastPhase.modules = [...lastPhase.modules, { id: 9999, title: 'Award Ceremony & Certificate', isCertificate: true }];
                        phases[phases.length - 1] = lastPhase;
                      }

                      return phases.map((phase: any) => {
                        const isExpanded = expandedPhases.has(phase.id);
                        const totalModulesInPhase = phase.modules.length;
                        const completedInPhase = phase.modules.filter((m: any) => completedModuleIds.has(m.id)).length;
                        const isPhaseComplete = totalModulesInPhase > 0 && totalModulesInPhase === completedInPhase;

                        return (
                          <div key={phase.id} className="group">
                            <button
                              onClick={() => togglePhase(phase.id)}
                              className={`w-full flex items-center justify-between p-7 rounded-[30px] border transition-all text-left ${isExpanded ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 hover:border-black/20'
                                }`}
                            >
                              <div className="flex items-center gap-8">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-colors ${isExpanded ? 'bg-black text-white' : isPhaseComplete ? 'bg-black text-white' : 'bg-gray-100 text-black/20'
                                  }`}>
                                  {isPhaseComplete ? '✓' : phase.phase_order}
                                </div>
                                <span className="font-black text-xl tracking-tight text-black">
                                  {phase.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-8">
                                <div className="hidden sm:flex flex-col items-end opacity-40">
                                  <span className="text-[10px] font-black uppercase tracking-widest">Phases</span>
                                  <span className="text-sm font-black">{completedInPhase}/{totalModulesInPhase}</span>
                                </div>
                                <ChevronDown
                                  size={24}
                                  className={`transition-transform duration-500 ${isExpanded ? 'rotate-180 text-black' : 'text-black/20'}`}
                                />
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="mt-4 px-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-400">
                                {phase.modules.map((mod: any) => {
                                  const isCertificate = mod.id === 9999;
                                  const isCompleted = completedModuleIds.has(mod.id);
                                  const isCourseFullyCompleted = (progressData?.percentage || 0) === 100;
                                  const isLocked = !isPurchased || (isCertificate && !isCourseFullyCompleted);

                                  return (
                                    <Link
                                      key={mod.id}
                                      href={isLocked ? '#' : isCertificate ? `/modules/${mod.id}?courseId=${courseId}` : `/modules/${mod.id}`}
                                      onClick={(e) => isLocked && e.preventDefault()}
                                      className={`flex items-center gap-5 p-6 rounded-[24px] border-2 transition-all ${isCompleted || (isCertificate && isCourseFullyCompleted)
                                        ? 'bg-white border-black text-black'
                                        : isLocked
                                          ? 'bg-gray-50 border-transparent text-black/10 cursor-not-allowed'
                                          : 'bg-white border-gray-50 text-black/40 hover:border-black/10 hover:text-black group/mod'
                                        }`}
                                    >
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[9px] transition-all ${isCompleted ? 'bg-black text-white' : 'bg-gray-100 text-black/20 group-hover/mod:bg-black group-hover/mod:text-white'
                                        }`}>
                                        {isCompleted ? '✓' : mod.module_order || '•'}
                                      </div>
                                      <span className="font-black text-lg tracking-tight">
                                        {mod.title}
                                      </span>
                                      {!isLocked && <ArrowRight className="ml-auto opacity-0 group-hover/mod:opacity-100 transition-all translate-x-[-15px] group-hover/mod:translate-x-0" size={28} />}
                                      {isLocked && <Lock className="ml-auto opacity-20" size={24} />}
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
              </div>
            </div>
          </section>
        </motion.main>

        <Footer />
        {isPurchased && <AskMentorChat courseId={courseId} />}
      </div>
    );
  }

  // ===== Static Roadmap View (IDs 5-8) =====
  if (!staticCourse) {
    return (
      <div className="min-h-screen bg-white">
        <Header2 />
        <div className="max-w-[85vw] mx-auto py-32 text-center">
          <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">Project Nullified</h1>
          <Link href="/">
            <button className="h-[80px] px-16 bg-black text-white text-xl font-black uppercase tracking-tight rounded-full hover:bg-gray-800 transition-all">
              Return to Laboratory
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header2 />

      <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="w-full">
        {/* Banner Hero for Static Roadmaps (White Background) */}
        <section className="bg-white pt-48 pb-24 px-6 md:px-12 border-b border-gray-100">
          <div className="max-w-[85vw] mx-auto">
            <h1 className="text-6xl md:text-9xl font-black text-black mb-16 tracking-tighter leading-[0.85] uppercase">
              {staticCourse.title}
            </h1>
            <p className="text-2xl md:text-3xl text-black/40 font-medium leading-[1.1] max-w-5xl tracking-tighter">
              {staticCourse.longDescription || staticCourse.description}
            </p>
          </div>
        </section>

        <section className="py-32 px-6 bg-[#FBFBFB]">
          <div className="max-w-[85vw] mx-auto">
            <div className="mb-20">
              <h2 className="text-5xl font-black text-black tracking-tighter uppercase mb-2">Neural Blueprint</h2>
              <p className="text-black/30 font-bold text-xl tracking-tight">Select your professional tier.</p>
            </div>
            {/* Roadmap background refinement within CompanyRoadmap */}
            <CompanyRoadmap courseId={courseId} />
          </div>
        </section>
      </motion.main>

      <Footer />
    </div>
  );
}
