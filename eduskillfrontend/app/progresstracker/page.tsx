'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

interface TrackerProgress {
  [key: string]: number;
}

export default function ProgressTrackerPage() {
  const [webDevProgress, setWebDevProgress] = useState(0);
  const [appDevProgress, setAppDevProgress] = useState(0);
  const [uiUxProgress, setUiUxProgress] = useState(0);
  const [dataScienceProgress, setDataScienceProgress] = useState(0);

  const handleWebDevChange = (points: number, isChecked: boolean) => {
    setWebDevProgress((prev) => (isChecked ? prev + points : prev - points));
  };

  const handleAppDevChange = (points: number, isChecked: boolean) => {
    setAppDevProgress((prev) => (isChecked ? prev + points : prev - points));
  };

  const handleUiUxChange = (points: number, isChecked: boolean) => {
    setUiUxProgress((prev) => (isChecked ? prev + points : prev - points));
  };

  const handleDataScienceChange = (points: number, isChecked: boolean) => {
    setDataScienceProgress((prev) => (isChecked ? prev + points : prev - points));
  };

  const progressBarWidth = (value: number) => {
    const max = 100;
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div>
      <Header />

      <main className="max-w-[85vw] mx-auto mt-16 grid grid-cols-1 md:grid-cols-1 gap-8 pb-20">
        {/* Web Development Section */}
        <section className="tracker-card p-8 rounded-[32px] shadow-sm bg-white/80 backdrop-blur-md border border-white/50">
          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#FF6643] rounded-full"></span>
            Web Development
          </h2>
          <div className="relative w-full h-6 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="progress-bar absolute top-0 left-0 h-full bg-[#FF6643] flex items-center justify-center text-[10px] text-white font-bold transition-all"
              style={{ width: `${progressBarWidth(webDevProgress)}%` }}
            >
              {progressBarWidth(webDevProgress) > 5
                ? `${Math.round(progressBarWidth(webDevProgress))}%`
                : ''}
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Learn HTML</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(10, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">CSS Mastery</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(10, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">JavaScript</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(30, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">
                Frameworks (React/Angular)
              </span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Backend (Node.js)</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(10, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">SQL & No-SQL Databases</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(10, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Deployment (Vercel/AWS)</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleWebDevChange(10, e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* App Development Section */}
        <section className="tracker-card p-8 rounded-[32px] shadow-sm bg-white/80 backdrop-blur-md border border-white/50">
          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#FF6643] rounded-full"></span>
            App Development
          </h2>
          <div className="relative w-full h-6 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="progress-bar absolute top-0 left-0 h-full bg-[#FF6643] flex items-center justify-center text-[10px] text-white font-bold transition-all"
              style={{ width: `${progressBarWidth(appDevProgress)}%` }}
            >
              {progressBarWidth(appDevProgress) > 5
                ? `${Math.round(progressBarWidth(appDevProgress))}%`
                : ''}
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Basic Web Dev Knowledge</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleAppDevChange(10, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">React Native/Flutter Basics</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleAppDevChange(25, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">UI/UX Design for Apps</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleAppDevChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">APIs & Backend Integration</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleAppDevChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">App Testing & Deployment</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleAppDevChange(10, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Advanced App Features</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleAppDevChange(15, e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* UI/UX Design Section */}
        <section className="tracker-card p-8 rounded-[32px] shadow-sm bg-white/80 backdrop-blur-md border border-white/50">
          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#FF6643] rounded-full"></span>
            UI/UX Design
          </h2>
          <div className="relative w-full h-6 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="progress-bar absolute top-0 left-0 h-full bg-[#FF6643] flex items-center justify-center text-[10px] text-white font-bold transition-all"
              style={{ width: `${progressBarWidth(uiUxProgress)}%` }}
            >
              {progressBarWidth(uiUxProgress) > 5
                ? `${Math.round(progressBarWidth(uiUxProgress))}%`
                : ''}
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Design Principles</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleUiUxChange(15, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Color Theory & Typography</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleUiUxChange(15, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Wireframing (Figma/Adobe XD)</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleUiUxChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Prototyping</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleUiUxChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">User Research & Testing</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleUiUxChange(15, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Design Systems</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleUiUxChange(15, e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* Data Science Section */}
        <section className="tracker-card p-8 rounded-[32px] shadow-sm bg-white/80 backdrop-blur-md border border-white/50">
          <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#FF6643] rounded-full"></span>
            Data Science
          </h2>
          <div className="relative w-full h-6 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="progress-bar absolute top-0 left-0 h-full bg-[#FF6643] flex items-center justify-center text-[10px] text-white font-bold transition-all"
              style={{ width: `${progressBarWidth(dataScienceProgress)}%` }}
            >
              {progressBarWidth(dataScienceProgress) > 5
                ? `${Math.round(progressBarWidth(dataScienceProgress))}%`
                : ''}
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Python for Data Science</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleDataScienceChange(15, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Data Analysis (Pandas/NumPy)</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleDataScienceChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Data Visualization</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleDataScienceChange(15, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Machine Learning Basics</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleDataScienceChange(20, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Deep Learning</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleDataScienceChange(15, e.target.checked)}
              />
            </label>
            <label className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-transparent hover:border-[#FF6643]/20 transition-all cursor-pointer">
              <span className="font-medium">Big Data & Cloud</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-[#FF6643]"
                onChange={(e) => handleDataScienceChange(15, e.target.checked)}
              />
            </label>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
