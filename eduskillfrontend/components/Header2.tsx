'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown, LayoutDashboard, ShieldCheck } from 'lucide-react';

export default function Header2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileInitial, setProfileInitial] = useState('');
  const [userName, setUserName] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const userInitial = localStorage.getItem('userInitial') || 'U';
    const storedName = localStorage.getItem('userName') || 'User';

    setIsLoggedIn(loggedInStatus);
    setProfileInitial(userInitial);
    setUserName(storedName);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInitial');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setShowDropdown(false);
    router.push('/');
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-[700px] mx-auto bg-white/80 backdrop-blur-lg border border-gray-200/50 py-3 px-6 rounded-full shadow-xl flex justify-between items-center transition-all hover:shadow-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[18px] font-black text-black tracking-tighter group-hover:tracking-normal transition-all duration-300">
            EDUSKILL
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-semibold text-[13px] uppercase tracking-wider text-black/70">
          <Link href="/#courses" className="hover:text-black transition-colors">Courses</Link>
          <Link href="/#roadmaps" className="hover:text-black transition-colors">Roadmaps</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>

          {!isLoggedIn ? (
            <Link href="/login">
              <button className="h-[38px] px-6 bg-black text-white rounded-full flex justify-center items-center hover:bg-gray-800 transition-all text-xs font-bold uppercase tracking-widest active:scale-95">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 group focus:outline-none"
              >
                <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-black text-sm cursor-pointer shadow-md group-hover:scale-105 transition-transform uppercase ring-2 ring-transparent group-hover:ring-black/5">
                  {profileInitial}
                </div>
                <ChevronDown size={14} className={`text-black/40 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-12 right-0 w-[200px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-[100] origin-top-right overflow-hidden"
                  >
                    <div className="space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                      >
                        <LayoutDashboard size={16} className="text-black/30 group-hover:text-black transition-colors" />
                        <span className="font-black text-[10px] uppercase tracking-widest text-black/60 group-hover:text-black">My Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition-colors group text-left"
                      >
                        <LogOut size={16} className="text-black/30 group-hover:text-red-500 transition-colors" />
                        <span className="font-black text-[10px] uppercase tracking-widest text-black/60 group-hover:text-red-500">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden p-1 text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {showSidebar && (
        <div className="md:hidden mt-3 max-w-[90vw] mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <Link href="/#courses" onClick={() => setShowSidebar(false)} className="block font-bold text-lg text-black uppercase tracking-tight">Courses</Link>
          <Link href="/#roadmaps" onClick={() => setShowSidebar(false)} className="block font-bold text-lg text-black uppercase tracking-tight">Roadmaps</Link>
          <Link href="/about" onClick={() => setShowSidebar(false)} className="block font-bold text-lg text-black uppercase tracking-tight">About Us</Link>

          {!isLoggedIn ? (
            <Link href="/login" onClick={() => setShowSidebar(false)} className="block">
              <button className="w-full h-12 bg-black text-white rounded-2xl flex justify-center items-center font-bold text-lg uppercase tracking-widest">
                Login
              </button>
            </Link>
          ) : (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <Link href="/dashboard" onClick={() => setShowSidebar(false)} className="block">
                <button className="w-full h-12 flex items-center justify-center gap-3 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                  <LayoutDashboard size={18} /> My Dashboard
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full h-12 border border-gray-100 rounded-2xl font-bold uppercase tracking-widest text-xs text-black"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
