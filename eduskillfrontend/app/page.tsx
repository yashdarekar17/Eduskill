'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const courseData = [
  {
    id: 1,
    title: 'Web Development',
    image: '/assets/course_web_dev.png',
    link: '/viewdetails/1',
  },
  {
    id: 2,
    title: 'App Development',
    image: '/assets/course_app_dev.png',
    link: '/viewdetails/2',
  },
  {
    id: 3,
    title: 'Data Science',
    image: '/assets/course_data_science.png',
    link: '/viewdetails/3',
  },
  {
    id: 4,
    title: 'Machine Learning',
    image: '/assets/course_ml.png',
    link: '/viewdetails/4',
  },
];

const roadmapData = [
  {
    id: 5,
    title: 'Web Development Roadmap',
    image: '/assets/roadmap_web_dev.png',
    link: '/viewdetails/5',
  },
  {
    id: 6,
    title: 'App Development Roadmap',
    image: '/assets/roadmap_app_dev.png',
    link: '/viewdetails/6',
  },
  {
    id: 7,
    title: 'Data Science Roadmap',
    image: '/assets/roadmap_data_science.png',
    link: '/viewdetails/7',
  },
  {
    id: 8,
    title: 'Machine Learning Roadmap',
    image: '/assets/roadmap_ml.png',
    link: '/viewdetails/8',
  },
];

const COURSE_ID_MAP: Record<number, string> = {
  5: 'webdev',
  6: 'appdev',
  7: 'datascience',
  8: 'ml',
};

const TYPING_TEXTS = [
  'Web development',
  'App development',
  'Data Science',
  'Machine Learning',
];

export default function Home() {
  const [text, setText] = useState('');
  const indexRef = useRef(0);
  const charIndexRef = useRef(0);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const [startedRoadmaps, setStartedRoadmaps] = useState<string[]>([]);
  const [debugMsg, setDebugMsg] = useState('Fetching...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (token && loggedIn) {
      api.getPurchasedCourses(token)
        .then((res) => {
          if (res.success) {
            setPurchasedIds(res.purchasedCourseIds);
          }
        })
        .catch(() => { });

      api.getStartedRoadmaps(token)
        .then((res) => {
          if (res.success) {
            setStartedRoadmaps(res.startedCourses);
            setDebugMsg('Success: ' + JSON.stringify(res.startedCourses));
          } else {
            setDebugMsg('API Failed: ' + JSON.stringify(res));
          }
        })
        .catch((err) => {
          setDebugMsg('Catch Error: ' + err.message);
        });
    } else {
      setDebugMsg('Not logged in or no token');
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startTyping = () => {
      intervalId = setInterval(() => {
        const currentTextArray = TYPING_TEXTS[indexRef.current];

        if (charIndexRef.current < currentTextArray.length) {
          const currentChar = currentTextArray[charIndexRef.current];
          setText((prev) => prev + currentChar);
          charIndexRef.current += 1;
        } else {
          // Text complete, pause and reset
          clearInterval(intervalId);
          timeoutId = setTimeout(() => {
            setText('');
            charIndexRef.current = 0;
            indexRef.current = (indexRef.current + 1) % TYPING_TEXTS.length;
            startTyping();
          }, 1000);
        }
      }, 100);
    };

    startTyping();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const getButtonLabel = (courseId: number) => {
    if (!isLoggedIn) return 'View Details';
    if (purchasedIds.includes(courseId)) return 'Continue Learning';
    return 'Buy Course';
  };

  const getButtonStyle = (courseId: number) => {
    if (isLoggedIn && purchasedIds.includes(courseId)) {
      return 'w-full mt-4 bg-white text-[#FF6643] font-bold py-3 rounded-[20px] hover:bg-gray-200 transition-all shadow-md';
    }
    return 'w-full mt-4 bg-[#FF6643] text-white font-bold py-3 rounded-[20px] hover:bg-[#e65c00] transition-colors';
  };

  return (
    <div className="bg-[#F9F9F9] min-h-screen font-sans selection:bg-black selection:text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-30 pb-20 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Faint Grid Texture */}
        <div className="absolute inset-0 tutorly-grid opacity-30 z-0"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl"
        >
          <div className="flex justify-center gap-3 mb-8">
            <span className="px-5 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              NEW ERA OF EDTECH
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-black leading-[0.9] tracking-tighter mb-10">
            BUILD SKILLS.<br />
            <span className="text-black/20">NEW OPPORTUNITIES.</span>
          </h1>

          <div className="text-xl md:text-2xl font-bold text-black/60 mb-12 flex justify-center items-center gap-2">
            Master <span className="text-black border-b-2 border-black inline-block min-w-[150px]">{text}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/#courses">
              <button className="px-10 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl hover:bg-gray-800">
                Explore Courses —
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Stat Pills (Hero Decorations) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="hidden lg:block absolute left-[10%] top-[40%] bg-white p-4 rounded-3xl shadow-xl border border-gray-100 z-20"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
              ].map((url, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={url} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase leading-none">125k+</div>
              <div className="text-[10px] font-bold text-black/40 uppercase">AI ROADMAP MAKER</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="hidden lg:block absolute right-[12%] top-[35%] bg-white py-4 px-6 rounded-3xl shadow-xl border border-gray-100 z-20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black uppercase mb-1">100+</div>
              <div className="text-[10px] font-bold text-black/40 uppercase">AI EXPERTS</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Modules Bento Section */}
      <section className="hidden md:block max-w-[95vw] mx-auto py-20 px-6">
        <div className="mb-16">
          <h2 className="text-6xl font-black text-black tracking-tighter mb-4">Core Modules.</h2>
          <p className="text-xl text-black/40 font-bold max-w-2xl leading-relaxed">
            Curated learning paths designed to accelerate your career through AI-enhanced mentorship and structured curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
          {/* Main Card */}
          <div className="lg:col-span-7 group relative rounded-[40px] overflow-hidden bg-gray-100 shadow-xl transition-all hover:shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1400&auto=format&fit=crop"
              alt="Creative Thinking"
              fill
              className="object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex gap-2 mb-6">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  NEW MODULE
                </span>
                <span className="px-4 py-1.5 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  24 Lessons
                </span>
              </div>
              <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Creative Thinking</h3>
              <p className="max-w-md text-white/60 font-bold text-sm mb-8 uppercase leading-relaxed">
                Master the art of divergent thinking and complex problem solving through design methodology.
              </p>
              <button className="px-8 py-3 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex-1 group relative rounded-[40px] overflow-hidden bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
                alt="Career Planning"
                fill
                className="object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 p-10 flex justify-between items-end text-white">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">Career Planning</h3>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">8-Week Roadmap</p>
                </div>
                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center translate-x-4 group-hover:translate-x-0 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-1 group relative rounded-[40px] overflow-hidden bg-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="Problem Solving"
                fill
                className="object-cover opacity-40 grayscale group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-10 flex justify-between items-end text-white">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-1">Problem Solving</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Advanced Tactics</p>
                </div>
                <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center translate-x-4 group-hover:translate-x-0 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="max-w-[95vw] mx-auto py-32 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black text-black leading-tight tracking-tighter">
              START LEARNING<br />WITH AI MODULES.
            </h2>
          </div>
          <div className="text-black/40 font-bold uppercase tracking-widest text-xs py-2 border-b-2 border-black/10">
            Selected Programs (4)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courseData.slice(0, 4).map((course) => (
            <div key={course.id} className="group relative">
              <div className="aspect-[4/3] rounded-[40px] overflow-hidden bg-gray-100 mb-6 transition-all group-hover:shadow-2xl group-hover:-translate-y-2">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 flex justify-end">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-black mb-4 uppercase tracking-tighter">{course.title}</h3>
              <Link href={course.link}>
                <button className={`w-full py-4 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all border ${isLoggedIn && purchasedIds.includes(course.id)
                  ? 'bg-transparent border-black text-black hover:bg-black hover:text-white'
                  : 'bg-black text-white hover:bg-gray-800 border-black'
                  }`}>
                  {getButtonLabel(course.id)} —
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmaps" className="bg-black text-white py-32">
        <div className="max-w-[95vw] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none">ROADMAPS</h2>
            <p className="max-w-xl text-white/40 font-bold text-lg uppercase tracking-tight italic">
              Uncover the logical path between your current status and job-ready technical competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {roadmapData.slice(0, 4).map((roadmap) => (
              <div key={roadmap.id} className="group">
                <div className="aspect-[3/4] rounded-[40px] border border-white/10 overflow-hidden mb-6 relative hover:border-white/30 transition-all">
                  <Image
                    src={roadmap.image}
                    alt={roadmap.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{roadmap.title}</h3>
                    <Link href={roadmap.link}>
                      <button className="w-full py-3 rounded-full bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90 transition-all">
                        {isLoggedIn && startedRoadmaps.includes(COURSE_ID_MAP[roadmap.id]) ? 'Continue —' : 'Get Roadmap —'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Roadmap CTA */}
          <div className="relative group max-w-4xl mx-auto bg-white/5 border border-white/10 p-12 rounded-[50px] text-center backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <h3 className="text-3xl font-black mb-6 uppercase">WANT SOMETHING BUILT JUST FOR YOU?</h3>
            <p className="text-white/40 font-bold mb-10 max-w-lg mx-auto uppercase tracking-wide text-xs">Answer a few quick questions so the AI can build the most robust and personalized career map for you.</p>
            <Link href="/ai-roadmap">
              <button className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm">
                ✨ Generate AI Roadmap
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final Community Section */}
      <section className="py-40 text-center px-4 bg-white">
        <h3 className="text-xs font-black text-black/30 uppercase tracking-[0.5em] mb-8">BUILD UP THE COMMUNITY</h3>
        <h2 className="text-5xl md:text-8xl font-black text-black tracking-tighter mb-12">JOIN THE BIGGEST<br />COMMUNITY OF LEARNING.</h2>
        <div className="max-w-3xl mx-auto">
          <Image
            src="/assets/world4.png"
            alt="Community Map"
            width={1200}
            height={600}
            className="w-full h-auto grayscale opacity-90 brightness-75 transition-all hover:grayscale-0 hover:brightness-100 duration-1000"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
