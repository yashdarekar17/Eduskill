'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

const courseData = [
  {
    id: 1,
    title: 'Web Development',
    image: '/assets/Gemini_Generated_Image_94qy0h94qy0h94qy.jpeg',
    link: '/viewdetails/1',
  },
  {
    id: 2,
    title: 'App Development',
    image: '/assets/Gemini_Generated_Image_t0a8jst0a8jst0a8.jpeg',
    link: '/viewdetails/2',
  },
  {
    id: 3,
    title: 'Data Science',
    image: '/assets/Gemini_Generated_Image_v108apv108apv108.jpeg',
    link: '/viewdetails/3',
  },
  {
    id: 4,
    title: 'Machine Learning',
    image: '/assets/Gemini_Generated_Image_wf2791wf2791wf27.jpeg',
    link: '/viewdetails/4',
  },
];

const roadmapData = [
  {
    id: 5,
    title: 'Web Development Roadmap',
    image: '/assets/Gemini_Generated_Image_7j17r77j17r77j17.jpeg',
    link: '/viewdetails/5',
  },
  {
    id: 6,
    title: 'App Development Roadmap',
    image: '/assets/Gemini_Generated_Image_3gm9f13gm9f13gm9.jpeg',
    link: '/viewdetails/6',
  },
  {
    id: 7,
    title: 'Data Science Roadmap',
    image: '/assets/Gemini_Generated_Image_9z60pk9z60pk9z60.jpeg',
    link: '/viewdetails/7',
  },
  {
    id: 8,
    title: 'Machine Learning Roadmap',
    image: '/assets/Gemini_Generated_Image_cxsn3rcxsn3rcxsn.jpeg',
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
      <section className="max-w-[85vw] mx-auto py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
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
      </section>

      {/* Features Section */}
      <section className="max-w-[85vw] mx-auto my-20 bg-[#f4f4f4] rounded-[20px] overflow-hidden">
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
      </section>

      {/* Courses Section */}
      <section id="courses" className="max-w-[85vw] mx-auto py-12">
        <h2 className="text-5xl font-extrabold mb-4">
          Start learning with AI courses
        </h2>
        <p className="text-gray-500 mb-12">
          even if you are not ready with paid courses, there are variety of
          free Roadmaps are available for you
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courseData.map((course) => (
            <div key={course.id} className="group">
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
                <button className={getButtonStyle(course.id)}>
                  {getButtonLabel(course.id)}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmaps Section */}
      <section
        id="roadmaps"
        className="max-w-[90vw] mx-auto py-20 px-8 my-20 bg-white/40 backdrop-blur-md rounded-[40px] border border-white shadow-xl shadow-gray-200/50"
      >
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-6xl font-extrabold">Roadmaps</h2>
          <p className="font-semibold text-gray-700">
            Here are the free roadmaps for you
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roadmapData.map((roadmap) => (
            <div key={roadmap.id} className="group">
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
                <button
                  className={`w-full mt-4 font-bold py-3 rounded-[20px] transition-colors ${
                    isLoggedIn && startedRoadmaps.includes(COURSE_ID_MAP[roadmap.id])
                      ? 'bg-white text-[#FF6643] hover:bg-gray-100 shadow-sm border border-gray-200'
                      : 'bg-[#FF6643] text-white hover:bg-[#e65c00]'
                  }`}
                >
                  {isLoggedIn && startedRoadmaps.includes(COURSE_ID_MAP[roadmap.id]) ? 'Continue' : 'Get Free'}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 text-center space-y-6">
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
        <Image
          src="/assets/world4.png"
          alt="Community"
          width={900}
          height={500}
          className="max-w-[900px] w-full mx-auto mt-8"
        />
      </section>

      {/* CTA Section */}
      <div className="max-w-[80vw] mx-auto h-[200px] bg-gradient-to-r from-[#eaafc8] to-[#654ea3] rounded-[90px] flex flex-col md:flex-row items-center justify-around px-12 shadow-[13px_13px_0_0_#000] mb-20">
        <div className="text-white font-bold text-3xl">
          Join now &amp; get the certificate
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search courses..."
            className="px-6 py-3 bg-white rounded-full w-64 md:w-96 outline-none"
          />
          <button className="bg-[#FF6643] text-white px-8 py-3 rounded-full font-bold hover:bg-[#e65c00] transition-colors">
            Search
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
