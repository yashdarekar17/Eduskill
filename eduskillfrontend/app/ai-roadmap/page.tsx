'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIRoadmap from '@/components/AIRoadmap';

export default function AiRoadmapPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-20">
        <AIRoadmap />
      </main>

      <Footer />
    </div>
  );
}
