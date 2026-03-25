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
    <div>
      <Header />

      {/* Hero Section */}
      <motion.section 
        initial="hidden" 
        animate="visible" 
        variants={fadeInUp} 
        className="max-w-[85vw] mx-auto py-16 flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <div className="flex-1 space-y-4">
          <div className="text-[#FF6643] font-semibold text-[30px]">
            INTRODUCING INTERACTIVE
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            Learning courses by AI chatbots.
          </h1>
          <div className="text-3xl font-semibold">
            Learn <span className="text-[#FF6643]">{text}</span>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/assets/code.png"
            alt="Hero"
            width={500}
            height={500}
            className="w-full max-w-lg mx-auto"
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={fadeInUp} 
        className="max-w-[85vw] mx-auto my-20 bg-[#f4f4f4] rounded-[20px] overflow-hidden"
      >
        <header className="bg-[#FF6643] text-white p-6 text-center">
          <h2 className="text-3xl font-bold">Our Program Features</h2>
        </header>
        <div className="p-8 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">
            <Image
              src="/assets/bulb2.png"
              alt="Icon"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <div>
              <h3 className="font-bold text-xl">Creative Thinking</h3>
              <p className="text-gray-600">
                Unlock your creative potential with our tailored workshops.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">
            <Image
              src="/assets/c1.png"
              alt="Icon"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <div>
              <h3 className="font-bold text-xl">Career Planning</h3>
              <p className="text-gray-600">
                Plan your career path with expert guidance.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm flex items-center gap-6">
            <Image
              src="/assets/problem.jpeg"
              alt="Icon"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <div>
              <h3 className="font-bold text-xl">Problem Solving</h3>
              <p className="text-gray-600">
                Enhance skills through practical real-world challenges.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Courses Section */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{once: true, amount: 0.1 }} 
        variants={fadeInUp} 
        id="courses" 
        className="max-w-[85vw] mx-auto py-12"
      >
        <h2 className="text-5xl font-extrabold mb-4">
          Start learning with AI courses
        </h2>
        <p className="text-gray-500 mb-12">
          even if you are not ready with paid courses, there are variety of
          free Roadmaps are available for you
        </p>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courseData.map((course) => (
            <motion.div variants={fadeInUp} key={course.id} className="group">
              <div className="overflow-hidden rounded-[20px]">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={300}
                  height={200}
                  className="w-full transition duration-500 group-hover:scale-110 object-cover"
                />
              </div>
              <Link href={course.link}>
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }} 
                  className={getButtonStyle(course.id)}
                >
                  {getButtonLabel(course.id)}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Roadmaps Section */}
      <motion.section
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.1 }} 
        variants={fadeInUp} 
        id="roadmaps"
        className="max-w-[90vw] mx-auto py-20 px-8 my-20 bg-white/40 backdrop-blur-md rounded-[40px] border border-white shadow-xl shadow-gray-200/50"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-6xl font-extrabold">Roadmaps</h2>
          <p className="font-semibold text-gray-700">
            Here are the free roadmaps for you
          </p>
        </div>
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roadmapData.map((roadmap) => (
            <motion.div variants={fadeInUp} key={roadmap.id} className="group">
              <div className="overflow-hidden rounded-[20px]">
                <Image
                  src={roadmap.image}
                  alt={roadmap.title}
                  width={300}
                  height={200}
                  className="w-full transition duration-500 group-hover:scale-110 object-cover"
                />
              </div>
              <Link href={roadmap.link}>
                <motion.button
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }} 
                  className={`w-full mt-4 font-bold py-3 rounded-[20px] transition-colors ${isLoggedIn && startedRoadmaps.includes(COURSE_ID_MAP[roadmap.id])
                      ? 'bg-white text-[#FF6643] hover:bg-gray-100 shadow-sm border border-gray-200'
                      : 'bg-[#FF6643] text-white hover:bg-[#e65c00]'
                    }`}
                >
                  {isLoggedIn && startedRoadmaps.includes(COURSE_ID_MAP[roadmap.id]) ? 'Continue' : 'Get Free'}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Community Section */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={fadeInUp} 
        className="py-20 text-center space-y-6"
      >
        <h3 className="text-[#FF6643] font-bold text-xl">
          BUILD UP THE COMMUNITY
        </h3>
        <h2 className="text-5xl font-extrabold">
          Join the biggest community of learning
        </h2>
        <div className="max-w-2xl mx-auto text-gray-600">
          Learn, share knowledge with community members and shine from wherever
          you are.
        </div>
        <motion.div variants={scaleIn}>
          <Image
            src="/assets/world4.png"
            alt="Community"
            width={900}
            height={500}
            className="max-w-[900px] w-full mx-auto mt-8"
          />
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={scaleIn}
        className="max-w-[80vw] mx-auto py-8 md:py-0 min-h-[200px] h-auto md:h-[200px] bg-gradient-to-r from-[#eaafc8] to-[#654ea3] rounded-[90px] flex flex-col md:flex-row items-center justify-around px-6 md:px-12 shadow-[13px_13px_0_0_#000] mb-20 gap-6 md:gap-0"
      >
        <div className="text-white font-bold text-3xl text-center md:text-left">
          Join now &amp; get the certificate
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-center">
          <input
            type="search"
            placeholder="Search courses..."
            className="px-6 py-3 bg-white rounded-full w-full sm:w-64 md:w-96 outline-none text-black"
          />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-[#FF6643] text-white px-8 py-3 rounded-full font-bold w-full sm:w-auto hover:bg-[#e65c00] transition-colors whitespace-nowrap">
            Search
          </motion.button>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
