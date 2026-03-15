'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutBox, setShowLogoutBox] = useState(false);
  const [profileInitial, setProfileInitial] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const userInitial = localStorage.getItem('userInitial') || 'U';
    setIsLoggedIn(loggedInStatus);
    setProfileInitial(userInitial);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInitial');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogoutBox(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f8f7f3] py-4 shadow-sm">
      <div className="max-w-[85vw] mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/pngaaa.com-3314970.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-[40px] w-auto"
          />
          <h1 className="text-[25px] font-bold text-[#FF6643] tracking-tight">
            EDUSKILL
          </h1>
        </Link>

        <nav className="hidden lg:flex items-center gap-[2.5rem] font-semibold text-gray-800">
          <Link href="/#courses" className="hover:text-[#FF6643] transition-colors">
            Courses
          </Link>
          <Link href="/#roadmaps" className="hover:text-[#FF6643] transition-colors">
            Roadmaps
          </Link>
          <Link href="/about" className="hover:text-[#FF6643] transition-colors">
            About Us
          </Link>
          <Link href="/#contactus" className="hover:text-[#FF6643] transition-colors">
            Contact Us
          </Link>

          {!isLoggedIn ? (
            <Link href="/login">
              <button className="h-[45px] w-[110px] bg-[#FF6643] text-white rounded-full flex justify-center items-center hover:bg-[#e65c00] transition-all shadow-md">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative">
              <div
                onClick={() => setShowLogoutBox(!showLogoutBox)}
                className="w-10 h-10 bg-[#FF6643] text-white rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer shadow-md hover:scale-105 transition-transform z-10"
              >
                {profileInitial}
              </div>

              {showLogoutBox && (
                <div className="absolute top-12 right-0 mt-2 bg-white p-2 rounded-lg shadow-2xl border border-gray-200 z-[100]">
                  <button
                    onClick={handleLogout}
                    className="bg-[#FF6643] text-white px-6 py-2 rounded-md font-bold whitespace-nowrap hover:bg-[#e65c00] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="lg:hidden p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="#000"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="lg:hidden mt-4 p-4 border-t border-gray-200 space-y-4">
          <Link href="/#courses" className="block hover:text-[#FF6643] transition-colors">
            Courses
          </Link>
          <Link href="/#roadmaps" className="block hover:text-[#FF6643] transition-colors">
            Roadmaps
          </Link>
          <Link href="/about" className="block hover:text-[#FF6643] transition-colors">
            About Us
          </Link>
          <Link href="/#contactus" className="block hover:text-[#FF6643] transition-colors">
            Contact Us
          </Link>
          {!isLoggedIn ? (
            <Link href="/login">
              <button className="w-full h-[45px] bg-[#FF6643] text-white rounded-full flex justify-center items-center hover:bg-[#e65c00] transition-all shadow-md">
                Login
              </button>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-[#FF6643] text-white px-6 py-2 rounded-md font-bold hover:bg-[#e65c00] transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
