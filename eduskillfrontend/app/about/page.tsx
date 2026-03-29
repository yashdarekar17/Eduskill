'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { 
    Cpu, 
    Map, 
    MessageSquare, 
    CheckCircle2, 
    BarChart3, 
    Zap, 
    ShieldCheck, 
    Layers, 
    Globe2, 
    Code2,
    Database,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" as const, delay: 0.2 } }
};

export default function About() {
    return (
        <div className="bg-[#F9F9F9] min-h-screen font-sans selection:bg-black selection:text-white pb-32">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 tutorly-grid opacity-30 z-0"></div>
                <div className="max-w-screen-xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeInLeft} className="flex-1 space-y-10">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full font-black text-[10px] tracking-[0.2em] uppercase shadow-xl">
                            <Sparkles className="w-4 h-4" />
                            TECHNICAL ARCHITECTURE
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black text-black leading-[0.9] tracking-tighter">
                            ENGINEERING THE <br />
                            <span className="text-black/20">FUTURE</span> OF <br />
                            SKILL ACQUISITION.
                        </h1>
                        <p className="text-xl text-black/60 max-w-2xl leading-relaxed font-medium">
                            Eduskill is a sophisticated Full-Stack learning ecosystem that leverages advanced intelligent processing to personalize the educational journey.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/#courses">
                                <button className="bg-black text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl flex items-center gap-2">
                                    Browse Modules —
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Platform Core Architecture */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-32 bg-white">
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div className="space-y-16">
                            <div className="space-y-6">
                                <h2 className="text-4xl lg:text-6xl font-black text-black tracking-tighter uppercase">STRICT TECHNICAL<br />BREAKDOWN.</h2>
                                <p className="text-xl text-black/40 leading-relaxed font-bold uppercase tracking-tight">
                                    Performance-first architecture focused on interactive mentorship and cognitive clarity.
                                </p>
                            </div>

                            <div className="space-y-12">
                                {/* AI Roadmap Genesis */}
                                <div className="flex gap-8 items-start group">
                                    <div className="p-5 bg-black text-white rounded-[2rem] group-hover:scale-110 transition-transform">
                                        <Map className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter">Dynamic AI Roadmap</h3>
                                        <p className="text-black/60 leading-relaxed font-medium">
                                            Constructing modular career paths via LLM orchestration. Our engine analyzes real-time industry requirements to generate milestone-based curricula.
                                        </p>
                                    </div>
                                </div>

                                {/* Botpress Integration */}
                                <div className="flex gap-8 items-start group">
                                    <div className="p-5 bg-black text-white rounded-[2rem] group-hover:scale-110 transition-transform">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter">Botpress Mentorship</h3>
                                        <p className="text-black/60 leading-relaxed font-medium">
                                            Embedded intelligence within every module. Real-time technical troubleshooting and conceptual clarification provided by context-aware AI agents.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Platform Ecosystem Description */}
                            <div className="bg-[#F9F9F9] p-12 rounded-[50px] space-y-10 border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:border-black/5">
                                <div className="flex items-center gap-4">
                                    <Layers className="w-8 h-8 text-black/20" />
                                    <h4 className="text-3xl font-black text-black uppercase tracking-tighter">Platform Logic</h4>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <h5 className="font-black text-black text-xs uppercase tracking-widest">Adaptive Fluidity</h5>
                                        <div className="h-1 w-8 bg-black/10 mb-2"></div>
                                        <p className="text-[13px] text-black/40 font-bold uppercase">Dynamic pace adjustment based on technical mastery.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="font-black text-black text-xs uppercase tracking-widest">Secure Integrity</h5>
                                        <div className="h-1 w-8 bg-black/10 mb-2"></div>
                                        <p className="text-[13px] text-black/40 font-bold uppercase">Robust authentication protocols for mission-critical access.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Feature */}
                            <div className="p-12 bg-black rounded-[50px] text-white space-y-8 shadow-2xl">
                                <div className="flex items-center gap-4">
                                    <BarChart3 className="w-10 h-10 text-white/20" />
                                    <h4 className="text-3xl font-black uppercase tracking-tighter">ANALYTICS ENGINE</h4>
                                </div>
                                <p className="text-white/40 leading-relaxed font-bold uppercase text-sm tracking-wide">
                                    Backend-driven mastery scores. Correlating quiz delta with completion trajectories to generate pure technical competence metrics.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Design Philosophy */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-32 bg-black text-center mx-4 my-20 rounded-[80px] relative overflow-hidden">
                <div className="absolute inset-0 tutorly-grid opacity-10"></div>
                <div className="max-w-screen-xl mx-auto px-6 relative z-10 space-y-12">
                    <h2 className="text-6xl lg:text-9xl font-black text-white tracking-tighter leading-none">ENGINEERED<br />FOR HUMANS.</h2>
                    <p className="text-white/40 text-xl max-w-4xl mx-auto leading-relaxed font-bold uppercase tracking-tight italic">
                        Design philosophy centered on "Structured Simplification". utilizing white space and premium typography to eliminate information overload.
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 pt-16 border-t border-white/10">
                        <div className="text-center">
                            <div className="text-5xl font-black text-white mb-2 tracking-tighter">100%</div>
                            <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Type Safe</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-black text-white mb-2 tracking-tighter">AI-READY</div>
                            <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Core Architecture</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-black text-white mb-2 tracking-tighter">MODERN</div>
                            <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Next-Gen Stack</div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <Footer />
        </div>
    );
}