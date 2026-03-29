'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   User,
   BookOpen,
   Github,
   Linkedin,
   Instagram,
   Twitter,
   Save,
   CheckCircle,
   PlayCircle,
   Clock,
   Loader2,
   ArrowRight,
   Mail,
   ShieldCheck,
   LayoutDashboard,
   Compass,
   Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import Link from 'next/link';

const COURSE_META: Record<number, { title: string, image: string, link: string }> = {
   1: { title: 'Web Development', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', link: '/viewdetails/1' },
   2: { title: 'App Development', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop', link: '/viewdetails/2' },
   3: { title: 'Data Science', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', link: '/viewdetails/3' },
   4: { title: 'Machine Learning', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop', link: '/viewdetails/4' }
};

const ROADMAP_META: Record<string, { title: string, subtitle: string, image: string, link: string }> = {
   'webdev': {
      title: 'WEB DEVELOPMENT ROADMAP',
      subtitle: 'MASTER THE ART OF BUILDING MODERN WEB APPLICATIONS FROM SCRATCH. THIS ROADMAP TAKES YOU THROUGH HTML, CSS, JAVASCRIPT, AND MODERN FRAMEWORKS, GIVING YOU THE COMPLETE TOOLKIT TO BUILD RESPONSIVE AND DYNAMIC WEBSITES.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
      link: '/viewdetails/5'
   },
   'appdev': {
      title: 'APP DEVELOPMENT ROADMAP',
      subtitle: 'ENGINEER NATIVE AND CROSS-PLATFORM MOBILE APPLICATIONS. MASTER REACT NATIVE, FLUTTER, AND MOBILE SYSTEM DESIGN FOR SCALABLE ECOSYSTEMS.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
      link: '/viewdetails/6'
   },
   'datascience': {
      title: 'DATA SCIENCE ROADMAP',
      subtitle: 'DECODE COMPLEX DATASETS INTO ACTIONABLE INTELLIGENCE. MASTER PYTHON, R, AND ADVANCED STATISTICAL MODELS FOR THE NEXT DATA REVOLUTION.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      link: '/viewdetails/7'
   },
   'ml': {
      title: 'MACHINE LEARNING ROADMAP',
      subtitle: 'BUILD SELF-EVOLVING ALGORITHMS AND NEURAL NETWORKS. EXPLORE DEEP LEARNING, PYTORCH, AND LLM ARCHITECTURES FOR ARTIFICIAL INTELLIGENCE.',
      image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop',
      link: '/viewdetails/8'
   }
};

export default function DashboardPage() {
   const [activeTab, setActiveTab] = useState<'learning' | 'roadmaps' | 'profile'>('learning');
   const [courses, setCourses] = useState<any[]>([]);
   const [roadmaps, setRoadmaps] = useState<string[]>([]);
   const [loading, setLoading] = useState(true);
   const [isSaved, setIsSaved] = useState(false);

   const [userInfo, setUserInfo] = useState({
      name: '',
      email: '',
      username: '',
      branch: ''
   });

   const [socialLinks, setSocialLinks] = useState({
      github: '',
      linkedin: '',
      instagram: '',
      twitter: ''
   });

   useEffect(() => {
      const token = localStorage.getItem('token');

      // Load User Info
      setUserInfo({
         name: localStorage.getItem('userName') || 'User',
         email: localStorage.getItem('userEmail') || 'user@eduskill.com',
         username: localStorage.getItem('userUsername') || 'user_core',
         branch: localStorage.getItem('userBranch') || 'General'
      });

      // Load Socials
      setSocialLinks({
         github: localStorage.getItem('social_github') || '',
         linkedin: localStorage.getItem('social_linkedin') || '',
         instagram: localStorage.getItem('social_instagram') || '',
         twitter: localStorage.getItem('social_twitter') || ''
      });

      // Load Courses & Profile
      if (token) {
         setLoading(true);
         Promise.all([
            api.getPurchasedCourses(token),
            api.getProfile(token),
            api.getStartedRoadmaps(token)
         ])
            .then(([coursesRes, profileRes, startedRoadmapsRes]) => {
               if (coursesRes.success) {
                  setCourses(coursesRes.purchasedCourseIds);
               }
               if (startedRoadmapsRes.success) {
                  setRoadmaps(startedRoadmapsRes.startedCourses);
               }
               if (profileRes.success && profileRes.user) {
                  const user = profileRes.user;
                  setUserInfo({
                     name: user.name || '',
                     email: user.email || '',
                     username: user.username || '',
                     branch: user.branch || ''
                  });
               }
            })
            .catch(err => console.error('Dashboard sync error:', err))
            .finally(() => setLoading(false));
      }
   }, []);

   const handleSaveSocials = () => {
      localStorage.setItem('social_github', socialLinks.github);
      localStorage.setItem('social_linkedin', socialLinks.linkedin);
      localStorage.setItem('social_instagram', socialLinks.instagram);
      localStorage.setItem('social_twitter', socialLinks.twitter);

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
   };

   return (
      <div className="min-h-screen bg-[#F9F9F9] font-sans selection:bg-black selection:text-white">
         <Header />

         <main className="max-w-[1400px] mx-auto pt-44 pb-20 px-6">
            {/* Dashboard Header */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
               <div className="space-y-2">
                  <div className="flex items-center gap-3 text-black/40 font-black uppercase tracking-[0.3em] text-[10px]">
                     <LayoutDashboard size={14} /> Global Control Center
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase leading-none">
                     {activeTab === 'learning' ? 'My Learning' : activeTab === 'roadmaps' ? 'My Roadmaps' : 'Personal Core'}
                  </h1>
               </div>

               {/* Tab Switcher */}
               <div className="flex bg-white p-1.5 rounded-full border border-gray-100 shadow-sm">
                  <button
                     onClick={() => setActiveTab('learning')}
                     className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'learning' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:text-black'
                        }`}
                  >
                     Courses
                  </button>
                  <button
                     onClick={() => setActiveTab('roadmaps')}
                     className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'roadmaps' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:text-black'
                        }`}
                  >
                     Roadmaps
                  </button>
                  <button
                     onClick={() => setActiveTab('profile')}
                     className={`px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:text-black'
                        }`}
                  >
                     Profile
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Sidebar Info Card */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl">
                     <div className="flex flex-col items-center text-center space-y-4 mb-8">
                        <div className="w-24 h-24 bg-black text-white rounded-[32px] flex items-center justify-center font-black text-4xl uppercase shadow-2xl rotate-3">
                           {userInfo.name[0]}
                        </div>
                        <div>
                           <h2 className="text-2xl font-black text-black uppercase tracking-tight">{userInfo.name}</h2>
                           <p className="text-xs font-bold text-black/40 uppercase tracking-widest">{userInfo.email}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase tracking-widest px-3 py-1 bg-green-50 rounded-full">
                           <ShieldCheck size={10} /> Identity Verified
                        </div>
                     </div>

                     <div className="space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/30">
                           <span>Access Tier</span>
                           <span className="text-black">Premium Operative</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-black/30">
                           <span>Total Progress</span>
                           <span className="text-black">{courses.length} Active Modules</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Main Content Area */}
               <div className="lg:col-span-8">
                  <AnimatePresence mode="wait">
                     {activeTab === 'learning' ? (
                        <motion.div
                           key="learning"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-6"
                        >
                           {loading ? (
                              <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-gray-100 shadow-xl space-y-4">
                                 <Loader2 size={40} className="animate-spin text-black/20" />
                                 <p className="text-xs font-black text-black/30 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                              </div>
                           ) : courses.length === 0 ? (
                              <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-gray-100 shadow-xl text-center space-y-6">
                                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <BookOpen size={40} className="text-black/10" />
                                 </div>
                                 <h3 className="text-2xl font-black text-black uppercase">No Active Protocols</h3>
                                 <p className="max-w-xs text-black/40 font-bold text-xs uppercase tracking-widest">You have not initiated any educational modules yet.</p>
                                 <Link href="/#courses">
                                    <button className="px-10 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                                       Explore Curriculum —
                                    </button>
                                 </Link>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 gap-4">
                                 {courses.map(courseId => {
                                    const meta = COURSE_META[courseId];
                                    if (!meta) return null;
                                    return (
                                       <div key={courseId} className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl hover:border-black transition-all flex items-center gap-8">
                                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                                             <img src={meta.image} alt={meta.title} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                                          </div>
                                          <div className="flex-1 space-y-3">
                                             <div className="flex justify-between items-start">
                                                <h3 className="text-2xl font-black text-black uppercase tracking-tight leading-none">{meta.title}</h3>
                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-black/30 uppercase tracking-widest">
                                                   <Clock size={12} /> Active
                                                </span>
                                             </div>
                                             <div className="flex gap-6">
                                                <Link href={`/modules/${courseId}`} className="flex items-center gap-2 group/btn">
                                                   <PlayCircle size={20} className="text-black group-hover/btn:scale-110 transition-transform" />
                                                   <span className="font-black text-[11px] uppercase tracking-widest text-black">Action Core</span>
                                                </Link>
                                                <Link href={`/viewdetails/${courseId}`} className="flex items-center gap-2">
                                                   <BookOpen size={20} className="text-black/20" />
                                                   <span className="font-black text-[11px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">Registry</span>
                                                </Link>
                                             </div>
                                          </div>
                                          <ArrowRight className="text-black/10 group-hover:text-black transition-colors" size={24} />
                                       </div>
                                    );
                                 })}
                              </div>
                           )}
                        </motion.div>
                     ) : activeTab === 'roadmaps' ? (
                        <motion.div
                           key="roadmaps"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="space-y-6"
                        >
                           {loading ? (
                              <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-gray-100 shadow-xl space-y-4">
                                 <Loader2 size={40} className="animate-spin text-black/20" />
                                 <p className="text-xs font-black text-black/30 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                              </div>
                           ) : roadmaps.length === 0 ? (
                              <div className="bg-white rounded-[40px] p-20 flex flex-col items-center justify-center border border-gray-100 shadow-xl text-center space-y-6">
                                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Compass size={40} className="text-black/10" />
                                 </div>
                                 <h3 className="text-2xl font-black text-black uppercase">No Active Strategics</h3>
                                 <p className="max-w-xs text-black/40 font-bold text-xs uppercase tracking-widest">You have not initiated any artificial expansion roadmaps.</p>
                                 <Link href="/#roadmaps">
                                    <button className="px-10 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                                       Explore Roadmaps —
                                    </button>
                                 </Link>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 gap-4">
                                 {roadmaps.map(courseKey => {
                                    const meta = ROADMAP_META[courseKey];
                                    if (!meta) return null;
                                    return (
                                       <div key={courseKey} className="group bg-white rounded-[40px] p-12 border border-black/5 shadow-2xl hover:border-black transition-all space-y-8 relative overflow-hidden">
                                          <div className="absolute top-0 right-0 p-8">
                                             <Sparkles size={24} className="text-black/5 group-hover:text-black transition-colors" />
                                          </div>
                                          <div className="flex flex-col space-y-4">
                                             <span className="text-[10px] font-black tracking-[0.4em] text-black/20 uppercase">Core Strategic Path</span>
                                             <h3 className="text-4xl md:text-6xl font-black text-black leading-none tracking-tighter uppercase max-w-2xl">{meta.title}</h3>
                                          </div>
                                          <p className="text-black/40 font-bold text-sm leading-relaxed uppercase tracking-tight max-w-3xl">
                                             {meta.subtitle}
                                          </p>
                                          <div className="flex items-center gap-10 pt-4">
                                             <Link href={meta.link} className="flex items-center gap-4 group/btn">
                                                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-xl">
                                                   <ArrowRight size={24} />
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="font-black text-[12px] uppercase tracking-widest text-black">View Roadmap</span>
                                                   <span className="text-[9px] font-bold uppercase text-black/30 tracking-widest">Access Full Curriculum</span>
                                                </div>
                                             </Link>
                                          </div>
                                          <div className="absolute bottom-0 right-0 w-64 h-64 -mb-10 -mr-10 opacity-[0.03] grayscale pointer-events-none group-hover:opacity-[0.1] transition-all duration-1000 rotate-12">
                                             <img src={meta.image} alt="" className="w-full h-full object-cover rounded-full" />
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           )}
                        </motion.div>
                     ) : (
                        <motion.div
                           key="profile"
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl space-y-10"
                        >
                           <div className="space-y-6">
                              <h3 className="text-xs font-black text-black uppercase tracking-[0.4em] mb-8 border-b border-gray-50 pb-4">Social Interface Connect</h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div className="relative group">
                                    <Github className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={20} />
                                    <input
                                       type="text"
                                       placeholder="GITHUB IDENTIFIER"
                                       value={socialLinks.github}
                                       onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value.toUpperCase() })}
                                       className="w-full pl-16 pr-8 py-5 rounded-full border border-gray-100 bg-gray-50/50 font-black text-black focus:outline-none focus:border-black focus:bg-white transition-all uppercase text-[10px] tracking-widest"
                                    />
                                 </div>
                                 <div className="relative group">
                                    <Linkedin className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={20} />
                                    <input
                                       type="text"
                                       placeholder="LINKEDIN SYNC"
                                       value={socialLinks.linkedin}
                                       onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value.toUpperCase() })}
                                       className="w-full pl-16 pr-8 py-5 rounded-full border border-gray-100 bg-gray-50/50 font-black text-black focus:outline-none focus:border-black focus:bg-white transition-all uppercase text-[10px] tracking-widest"
                                    />
                                 </div>
                                 <div className="relative group">
                                    <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={20} />
                                    <input
                                       type="text"
                                       placeholder="INSTAGRAM CORE"
                                       value={socialLinks.instagram}
                                       onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value.toUpperCase() })}
                                       className="w-full pl-16 pr-8 py-5 rounded-full border border-gray-100 bg-gray-50/50 font-black text-black focus:outline-none focus:border-black focus:bg-white transition-all uppercase text-[10px] tracking-widest"
                                    />
                                 </div>
                                 <div className="relative group">
                                    <Twitter className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={20} />
                                    <input
                                       type="text"
                                       placeholder="X TRANSMISSION"
                                       value={socialLinks.twitter}
                                       onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value.toUpperCase() })}
                                       className="w-full pl-16 pr-8 py-5 rounded-full border border-gray-100 bg-gray-50/50 font-black text-black focus:outline-none focus:border-black focus:bg-white transition-all uppercase text-[10px] tracking-widest"
                                    />
                                 </div>
                              </div>

                              <button
                                 onClick={handleSaveSocials}
                                 className={`w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all mt-4 ${isSaved ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800 shadow-2xl'
                                    }`}
                              >
                                 {isSaved ? <><CheckCircle size={18} /> Registry Updated</> : <><Save size={18} /> Update Digital Core</>}
                              </button>
                           </div>

                           <div className="space-y-6 pt-10 border-t border-gray-50">
                              <h3 className="text-xs font-black text-black uppercase tracking-[0.4em] mb-8">Access Information</h3>
                              <div className="grid grid-cols-2 gap-8">
                                 <div className="space-y-2">
                                    <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Base Identifier</p>
                                    <p className="text-sm font-black text-black uppercase">{userInfo.username}</p>
                                 </div>
                                 <div className="space-y-2">
                                    <p className="text-[9px] font-black text-black/20 uppercase tracking-widest">Deployment Branch</p>
                                    <p className="text-sm font-black text-black uppercase">{userInfo.branch}</p>
                                 </div>
                              </div>
                           </div>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </main>

         <Footer />
      </div>
   );
}
