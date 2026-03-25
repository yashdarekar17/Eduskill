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
        <div className="bg-[#f8f7f3] min-h-screen font-sans selection:bg-[#FF6643] selection:text-white pb-12">
            <Header />

            {/* Hero Section */}
            <section className="relative pt-10 pb-32 overflow-hidden border-b border-gray-100">
                <div className="max-w-screen-xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeInLeft} className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6643]/10 text-[#FF6643] rounded-full font-bold text-sm tracking-widest uppercase">
                            <Sparkles className="w-4 h-4" />
                            Technical Deep Dive
                        </div>
                        <h1 className="text-3xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tighter">
                            Engineering the <br />
                            <span className="text-[#FF6643]">Future</span> of <br />
                            Skill Acquisition.
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                            Eduskill is a sophisticated Full-Stack learning ecosystem that leverages advanced intelligent processing to personalize the educational journey. Built for clarity, mastery, and efficiency.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/#courses">
                                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all transform hover:-translate-y-1 shadow-xl flex items-center gap-2">
                                    Browse Core Modules
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="/#roadmaps">
                                <button className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold text-lg hover:border-[#FF6643] hover:text-[#FF6643] transition-all transform hover:-translate-y-1">
                                    View AI Roadmaps
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div initial="hidden" animate="visible" variants={zoomIn} className="flex-1 relative">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FF6643]/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-20 bg-white/40 backdrop-blur-2xl border border-white/40 p-5 rounded-[50px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                            <Image
                                src="/assets/about_hero.png"
                                alt="Platform Architecture Preview"
                                width={800}
                                height={800}
                                className="rounded-[40px] w-full"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Platform Core Architecture */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24 bg-white">
                <div className="max-w-screen-xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Technical Breakdown</h2>
                                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                                    Eduskill is built with a modern tech stack focused on performance, scalability, and user engagement. It bridges the gap between static content and interactive mentorship.
                                </p>
                            </div>

                            <div className="space-y-10">
                                {/* AI Roadmap Genesis */}
                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-[#f8f7f3] rounded-2xl text-[#FF6643]">
                                        <Map className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-gray-900">Dynamic AI Roadmap Genesis</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Utilizing advanced LLMs (Large Language Models) via API integration, the platform constructs modular career paths. Whether it's Web Development or Machine Learning, our engine analyzes industry requirements to generate a structured, milestone-based curriculum tailored to the current job market.
                                        </p>
                                    </div>
                                </div>

                                {/* Botpress Integration */}
                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-[#f8f7f3] rounded-2xl text-[#FF6643]">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-gray-900">Integrated Botpress Mentorship</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            We've embedded an intelligent orchestration layer using Botpress. This provides a constant mentorship presence within every module. The AI agent maintains context of the user's progress, offering real-time technical troubleshooting and conceptual clarification without leaving the platform.
                                        </p>
                                    </div>
                                </div>

                                {/* Assessment System */}
                                <div className="flex gap-6 items-start">
                                    <div className="p-4 bg-[#f8f7f3] rounded-2xl text-[#FF6643]">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-gray-900">Multi-Phase Assessment Logic</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Knowledge retention is validated through a sophisticated quiz engine. Instead of simple MCQ systems, Eduskill implements topic-wise weakness detection. The backend analyzes quiz results to identify specific conceptual gaps, allowing for targeted revision and mastery of difficult subjects.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Platform Ecosystem Description */}
                            <div className="bg-[#f8f7f3] p-12 rounded-[50px] space-y-8 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Layers className="w-6 h-6 text-[#FF6643]" />
                                    <h4 className="text-2xl font-black text-gray-900">Platform Ecosystem</h4>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        The architecture of Eduskill is designed around **Scalable Modularity**. Every learning path is a collection of decoupled components, allowing for seamless updates and integration of new technologies without disrupting the user experience.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <h5 className="font-black text-gray-900 text-sm uppercase">Adaptive Fluidity</h5>
                                            <p className="text-sm text-gray-500">The interface adapts to the learner's speed, providing more depth where needed.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="font-black text-gray-900 text-sm uppercase">Secure Integrity</h5>
                                            <p className="text-sm text-gray-500">Built with robust authentication and data protection protocols.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="font-black text-gray-900 text-sm uppercase">Seamless Sync</h5>
                                            <p className="text-sm text-gray-500">Progress is synchronized across all sessions with real-time state persistence.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <h5 className="font-black text-gray-900 text-sm uppercase">Modern Core</h5>
                                            <p className="text-sm text-gray-500">Utilizing high-performance frameworks and type-safe development patterns.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Feature */}
                            <div className="p-10 bg-gray-900 rounded-[50px] text-white space-y-6">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-8 h-8 text-[#FF6643]" />
                                    <h4 className="text-2xl font-black">Performance Analytics</h4>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-medium">
                                    The "Accuracy Tracker" is a backend-driven analytics module that calculates real-time mastery scores. By correlating quiz data with module completion rates, the platform provides a mathematical representation of a user's technical competence in a specific area.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Design Philosophy */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24 bg-[#FF6643] rounded-[60px] mx-4 my-20 relative overflow-hidden shadow-2xl shadow-[#FF6643]/20">
                <div className="max-w-screen-xl mx-auto px-6 text-center relative z-10 space-y-8">
                    <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight">Engineered for Humans.</h2>
                    <p className="text-white/80 text-lg max-w-4xl mx-auto leading-relaxed">
                        Educational platforms often suffer from "Information Overload." The design philosophy of Eduskill centers on "Structured Simplification." By utilizing white space, premium typography, and subtle micro-animations, we create a cognitive environment where technical learning feels intuitive and less daunting.
                    </p>
                    <div className="flex justify-center gap-8 pt-10">
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-2">100%</div>
                            <div className="text-xs text-white/60 font-black uppercase tracking-widest">Type Safe</div>
                        </div>
                        <div className="w-[1px] h-16 bg-white/20 hidden sm:block"></div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-2">AI-Ready</div>
                            <div className="text-xs text-white/60 font-black uppercase tracking-widest">Architecture</div>
                        </div>
                        <div className="w-[1px] h-16 bg-white/20 hidden sm:block"></div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-2">Fast</div>
                            <div className="text-xs text-white/60 font-black uppercase tracking-widest">Next-Gen Stack</div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <svg width="100%" height="100%">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
            </motion.section>

            {/* Project Goal Section */}
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="py-24 bg-white">
                <div className="max-w-screen-xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-gray-900 tracking-tight">Solving Educational Fragmenting</h2>
                            <p className="text-lg text-gray-600 leading-relaxed italic">
                                "The hardest part of learning to code isn't the code itself, it's knowing what to learn next."
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Eduskill solves the "fragmentation problem" by unifying high-quality content with a centralized progress tracker and an AI that acts as a compass. The platform is designed to take a learner from absolute zero to job-ready by providing a clear, uninterrupted path.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 border border-gray-100 rounded-3xl space-y-3 hover:border-[#FF6643]/30 transition-all">
                                <div className="text-[#FF6643]"><Zap className="w-8 h-8" /></div>
                                <h4 className="font-black text-gray-900 uppercase tracking-wide">High Performance</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">Built with Turbopack for lightning-fast module reloading and build times.</p>
                            </div>
                            <div className="p-6 border border-gray-100 rounded-3xl space-y-3 hover:border-[#FF6643]/30 transition-all">
                                <div className="text-[#FF6643]"><Code2 className="w-8 h-8" /></div>
                                <h4 className="font-black text-gray-900 uppercase tracking-wide">Clean Code</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">Adheres to SOLID principles and modular component architecture.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 order-1 lg:order-2 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6643]/20 to-purple-500/20 rounded-[60px] blur-3xl opacity-30"></div>
                        <Image 
                            src="/assets/world4.png"
                            alt="Project Visualization"
                            width={1000}
                            height={600}
                            className="relative rounded-[50px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 cursor-pointer"
                        />
                    </div>
                </div>
            </motion.section>

            {/* CTA / Contact Section */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={zoomIn} className="max-w-screen-xl mx-auto px-6 pb-30 pt-10">
                <div className="bg-gray-950 rounded-[70px] p-24 text-center space-y-10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6643]/10 via-transparent to-blue-500/10 transition-transform duration-1000 group-hover:scale-110"></div>
                    <h2 className="text-5xl lg:text-6xl font-black text-white relative z-10 leading-tight tracking-tighter">
                        Experience the <br />
                        <span className="text-[#FF6643]">Showcase</span> in Action.
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto relative z-10 font-medium">
                        Explore the integrated AI modules and see how technical education is evolving.
                    </p>
                    <div className="relative z-10 pt-6 flex flex-wrap justify-center gap-6">
                        <Link href="/signup">
                            <button className="bg-[#FF6643] text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-[#e65c00] transition-all transform hover:scale-105 shadow-2xl shadow-[#FF6643]/30">
                                Launch Platform
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="bg-white/5 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all transform hover:scale-105">
                                User Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            <Footer />
        </div>
    );
}