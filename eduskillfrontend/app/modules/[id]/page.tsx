'use client';

import Header2 from '@/components/Header2';
import Footer from '@/components/Footer';
import QuizSection from '@/components/QuizSection';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getStaticModuleContent } from '@/lib/moduleContent';
import { Award, Download, Loader2, CheckCircle, ArrowRight, ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ModulePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const moduleId = parseInt(id);
    const isCertificateModule = moduleId === 9999;
    const searchParams = useSearchParams();
    const courseIdParam = searchParams.get('courseId');

    const [moduleData, setModuleData] = useState<any>(null);
    const [allModules, setAllModules] = useState<any[]>([]);
    const [nextModuleId, setNextModuleId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [marking, setMarking] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchModule = async () => {
            let currentModule: any = null;

            if (isCertificateModule) {
                if (courseIdParam) {
                    try {
                        const res = await api.getCourse(parseInt(courseIdParam));
                        if (res.success) {
                            setModuleData({
                                title: 'Claim Your Certificate',
                                course_title: res.course.title,
                                course_id: res.course.id,
                                isCertificate: true
                            });
                        }
                    } catch (error) {
                        console.error('Failed to fetch course for certificate:', error);
                    }
                }
                setLoading(false);
                return;
            }

            try {
                const res = await api.getModule(moduleId);
                if (res.success) {
                    currentModule = res.module;
                    setModuleData(currentModule);

                    const courseRes = await api.getCourse(currentModule.course_id);
                    if (courseRes.success) {
                        const flattenedModules: any[] = [];
                        courseRes.course.phases.forEach((phase: any) => {
                            phase.modules.forEach((mod: any) => {
                                flattenedModules.push({ ...mod, course_id: currentModule.course_id });
                            });
                        });
                        setAllModules(flattenedModules);

                        const currentIndex = flattenedModules.findIndex(m => m.id === moduleId);
                        if (currentIndex !== -1 && currentIndex < flattenedModules.length - 1) {
                            setNextModuleId(flattenedModules[currentIndex + 1].id);
                        } else if (currentIndex === flattenedModules.length - 1) {
                            setNextModuleId(9999);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch module or course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchModule();
    }, [moduleId, isCertificateModule, courseIdParam]);

    const handleDownloadCertificate = async () => {
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('userName') || 'Eduskill User';
        const userId = parseInt(localStorage.getItem('userId') || '0');

        if (!token) return;
        if (!moduleData?.course_id || !moduleData?.course_title) return;

        setGenerating(true);
        try {
            const blob = await api.generateCertificate({
                userId,
                courseId: moduleData.course_id,
                name: userName,
                course: moduleData.course_title
            }, token);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Certificate_${moduleData.course_title.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Certificate generation failed:', error);
        } finally {
            setGenerating(false);
        }
    };

    const handleMarkComplete = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setMarking(true);
        try {
            await api.markModuleComplete(moduleId, token);
            setCompleted(true);
        } catch { /* ignored */ }
        finally { setMarking(false); }
    };

    const handleQuizSubmit = async (data: { module_id: number; score: number; total: number }) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        await api.submitQuiz(data, token);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header2 />
                <div className="max-w-[85vw] mx-auto py-32 text-center">
                    <Loader2 size={32} className="animate-spin text-black mx-auto mb-6" />
                    <p className="text-black font-bold tracking-widest text-xs">Accessing Sequence...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!moduleData) {
        return (
            <div className="min-h-screen bg-white">
                <Header2 />
                <div className="max-w-[85vw] mx-auto py-32 text-center">
                    <h1 className="text-4xl font-bold mb-8 uppercase tracking-tight">Sequence Not Found</h1>
                    <Link href="/">
                        <button className="h-[60px] px-10 bg-black text-white text-lg font-bold uppercase rounded-full hover:bg-gray-800 transition-all">
                            Return to Lab
                        </button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // ===== Refined Certificate View =====
    if (isCertificateModule) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header2 />
                <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="flex-grow max-w-[85vw] mx-auto w-full py-20 flex items-center justify-center">
                    <div className="w-full max-w-[800px] bg-white border border-gray-100 rounded-[50px] p-12 md:p-20 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-[80px] -mr-20 -mt-20" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="mb-10 p-6 bg-black text-white rounded-[32px] shadow-xl rotate-6 animate-pulse">
                                <Award size={64} />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-black">
                                Level 100 <br /> Achieved
                            </h1>
                            
                            <p className="text-lg md:text-xl text-black/40 font-bold max-w-xl mb-12 leading-relaxed">
                                You have successfully mastercoded every phase of <span className="text-black">{moduleData.course_title}</span>.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                                <button
                                    onClick={handleDownloadCertificate}
                                    disabled={generating}
                                    className="h-[75px] w-full sm:flex-1 bg-black text-white text-lg font-bold uppercase tracking-tight rounded-full flex items-center justify-center hover:bg-gray-900 shadow-xl disabled:opacity-50"
                                >
                                    {generating ? <Loader2 size={24} className="animate-spin" /> : <><Download size={20} className="mr-3" /> Export Diploma</>}
                                </button>
                                
                                <div className="h-[75px] px-8 bg-gray-50 border border-gray-100 rounded-full flex items-center gap-3">
                                    <Trophy size={20} className="text-black/20" />
                                    <span className="text-black font-bold uppercase tracking-widest text-[10px] whitespace-nowrap">Core Mastery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.main>
                <Footer />
            </div>
        );
    }

    // ===== Standard Module View =====
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header2 />
            <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="flex-grow max-w-[85vw] mx-auto w-full py-12">
                
                {/* Protocol Breadcrumb */}
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/20 mb-10">
                    <Link href="/" className="hover:text-black transition-colors">Lab</Link>
                    <ArrowRight size={12} />
                    <Link href={`/viewdetails/${moduleData.course_id}`} className="hover:text-black transition-colors">
                        {moduleData.course_title}
                    </Link>
                    <ArrowRight size={12} />
                    <span className="text-black/40">Sequence {moduleData.title}</span>
                </div>

                {/* Module Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10 mb-16">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="px-5 py-1.5 bg-gray-100 text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                                {moduleData.phase_title}
                            </span>
                            <span className="text-black/20 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={12} /> Masterclass Access
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-tight leading-tight max-w-4xl">
                            {moduleData.title}
                        </h1>
                    </div>

                    <div className="shrink-0 pb-1">
                        {completed ? (
                            <div className="h-[70px] px-10 bg-gray-50 text-black/40 text-sm font-bold uppercase tracking-widest rounded-full flex items-center gap-3 border border-gray-100">
                                <CheckCircle size={20} /> Module Synced
                            </div>
                        ) : (
                            <button
                                onClick={handleMarkComplete}
                                disabled={marking}
                                className="h-[70px] px-10 bg-black text-white text-sm font-bold uppercase tracking-tight rounded-full flex items-center justify-center hover:bg-gray-900 shadow-xl transition-all disabled:opacity-30"
                            >
                                {marking ? <Loader2 size={18} className="animate-spin text-white" /> : 'Finalize Sequence ✓'}
                            </button>
                        )}
                    </div>
                </div>


                {/* Content */}
                <div className="max-w-[95vw] mx-auto mb-24">
                    <div className="text-black/50 font-medium text-lg leading-relaxed space-y-6 module-content-custom">
                        {getStaticModuleContent(moduleId, moduleData.title)}
                    </div>
                </div>

                {/* Verification (Quiz) */}
                <div className="pt-24 border-t border-gray-50 bg-[#FBFBFB] rounded-[60px] p-8 md:p-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-12 h-12 bg-black text-white rounded-[20px] flex items-center justify-center rotate-3">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-black uppercase tracking-tight">Verification</h2>
                                <p className="text-black/40 font-bold text-base text-sm">Test core concepts integration.</p>
                            </div>
                        </div>
                        <QuizSection 
                            moduleId={moduleId}
                            courseId={moduleData.course_id}
                            moduleTitle={moduleData.title}
                            onSubmit={handleQuizSubmit}
                        />
                    </div>
                </div>

                {/* Nav */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-24 py-12 border-t border-gray-50">
                    <Link href={`/viewdetails/${moduleData.course_id}`}>
                        <button className="h-[60px] px-8 bg-white border border-gray-100 rounded-full text-black/40 font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:border-black transition-all">
                            <ArrowLeft size={16} /> Directory
                        </button>
                    </Link>
                    
                    {nextModuleId && (
                        <Link href={`/modules/${nextModuleId}?courseId=${moduleData.course_id}`}>
                            <button className="h-[75px] px-12 bg-black text-white rounded-full font-bold uppercase tracking-tight text-lg flex items-center gap-4 hover:bg-gray-900 shadow-xl transition-all">
                                Advance Sequence <ArrowRight size={24} />
                            </button>
                        </Link>
                    )}
                </div>
            </motion.main>
            <Footer />
        </div>
    );
}
