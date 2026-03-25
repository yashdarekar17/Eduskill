'use client';

import Header2 from '@/components/Header2';
import Footer from '@/components/Footer';
import QuizSection from '@/components/QuizSection';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getStaticModuleContent } from '@/lib/moduleContent';
import { Award, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
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

                    // Fetch course to get all modules for navigation
                    const courseRes = await api.getCourse(currentModule.course_id);
                    if (courseRes.success) {
                        const flattenedModules: any[] = [];
                        courseRes.course.phases.forEach((phase: any) => {
                            phase.modules.forEach((mod: any) => {
                                flattenedModules.push({
                                    ...mod,
                                    course_id: currentModule.course_id
                                });
                            });
                        });
                        setAllModules(flattenedModules);

                        // Find next module
                        const currentIndex = flattenedModules.findIndex(m => m.id === moduleId);
                        if (currentIndex !== -1 && currentIndex < flattenedModules.length - 1) {
                            setNextModuleId(flattenedModules[currentIndex + 1].id);
                        } else if (currentIndex === flattenedModules.length - 1) {
                            // Last module - point to certificate
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

        if (!token) {
            alert('Please login to download your certificate.');
            return;
        }

        if (!moduleData?.course_id || !moduleData?.course_title) {
            alert('Course information is missing. Please refresh the page.');
            return;
        }

        console.log('🚀 Sending Certificate Request:', {
            userId,
            courseId: moduleData.course_id,
            name: userName,
            course: moduleData.course_title
        });

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
            alert('Failed to generate certificate. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const handleMarkComplete = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to track your progress.');
            return;
        }
        setMarking(true);
        try {
            await api.markModuleComplete(moduleId, token);
            setCompleted(true);
        } catch {
            alert('Failed to mark as complete. Please try again.');
        } finally {
            setMarking(false);
        }
    };

    const handleQuizSubmit = async (data: { module_id: number; score: number; total: number }) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to submit quiz.');
            return;
        }
        await api.submitQuiz(data, token);
    };

    if (loading) {
        return (
            <div>
                <Header2 />
                <div className="max-w-[95vw] mx-auto py-20 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-10 bg-gray-200 rounded-xl w-1/2 mx-auto" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!moduleData) {
        return (
            <div>
                <Header2 />
                <div className="max-w-[85vw] mx-auto py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">Module Not Found</h1>
                    <Link href="/">
                        <button className="bg-[#FF6643] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#e65c00] transition-colors">
                            Back to Home
                        </button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    if (isCertificateModule) {
        return (
            <>
                <Header2 />
                <div className="min-h-screen bg-white flex flex-col">

                    <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="flex-grow max-w-[85vw] mx-auto w-full">
                        <div className="flex flex-col items-center text-center p-10 md:p-14 relative">
                            {/* <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" /> */}
                            <div className="absolute top-10 right-10 opacity-5">
                                <Award size={220} className="text-orange-900" />
                            </div>

                            <div className="mb-6 p-5 bg-orange-100 rounded-full text-orange-600 animate-bounce">
                                <Award size={52} />
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                                Congratulations!
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8 leading-relaxed">
                                You have successfully completed every phase of <span className="font-bold text-orange-600">{moduleData.course_title}</span>. Your dedication and hard work have paid off!
                            </p>

                            <div className="flex flex-col items-center gap-5 w-full max-w-sm">
                                <button
                                    onClick={handleDownloadCertificate}
                                    disabled={generating}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#FF6643] text-white text-lg font-bold rounded-xl hover:bg-[#e65c00] transition-all shadow-xl shadow-orange-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                                            Download Certificate
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-5 py-2.5 rounded-full border border-green-100">
                                    <CheckCircle2 size={18} />
                                    Course 100% Completed
                                </div>
                            </div>

                            <div className="mt-12 pt-2 w-full flex flex-col items-center">
                                <p className="text-gray-400 text-sm mb-4">Want to learn more? Check out our other courses.</p>
                                <Link href="/#courses">
                                    <button className="px-8 py-3 border-2 border-[#FF6643] text-[#FF6643] text-base font-bold rounded-xl hover:bg-[#FF6643] hover:text-white transition-all transform hover:scale-105 active:scale-95">
                                        Browse All Courses
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.main>
                    <Footer />
                </div>
            </>

        );
    }

    return (
        <div>
            <Header2 />
            <motion.main initial="hidden" animate="visible" variants={fadeInUp} className="max-w-[85vw] mx-auto py-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                    <Link href="/" className="hover:text-[#FF6643] transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/viewdetails/${moduleData.course_id}`} className="hover:text-[#FF6643] transition-colors">
                        {moduleData.course_title}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600 font-lg">{moduleData.title}</span>
                </div>

                {/* Module Header & Actions */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-orange-100 text-[#FF6643] text-xs font-bold rounded-full uppercase tracking-wider">
                                {moduleData.phase_title}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-2 leading-tight">
                            {moduleData.title}
                        </h1>
                        <p className="text-gray-500 font-lg tracking-wide">EDUSKILL MASTERCLASS SERIES</p>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        {completed ? (
                            <div className="w-full px-6 py-3 bg-green-50 text-green-600 text-sm font-bold rounded-xl border border-green-100 flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> Module Completed
                            </div>
                        ) : (
                            <button
                                onClick={handleMarkComplete}
                                disabled={marking}
                                className="w-full px-6 py-4 bg-[#FF6643] text-white text-sm font-bold rounded-xl hover:bg-[#e65c00] transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
                            >
                                {marking ? 'Marking...' : 'Mark as Complete ✓'}
                            </button>
                        )}


                    </div>
                </div>

                {/* Module Content */}
                <div className="mb-16">
                    <div className="module-blog-content text-gray-800 text-lg">
                        {getStaticModuleContent(moduleId, moduleData.title)}
                    </div>
                </div>

                {/* Quiz Section */}
                <div className="my-16 border-t border-gray-100 pt-16">
                    <QuizSection 
                        moduleId={moduleId}
                        courseId={moduleData.course_id}
                        moduleTitle={moduleData.title}
                        onSubmit={handleQuizSubmit}
                    />
                </div>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center mt-20 pt-10 border-t border-gray-100">
                    <Link href={`/viewdetails/${moduleData.course_id}`}>
                        <button className="text-gray-500 font-semibold hover:text-[#FF6643] transition-colors flex items-center gap-2">
                            ← Back to Course Directory
                        </button>
                    </Link>
                    {nextModuleId && (
                        <Link href={`/modules/${nextModuleId}?courseId=${moduleData.course_id}`}>
                            <button className="text-gray-500 font-semibold hover:text-[#FF6643] transition-colors flex items-center gap-2">
                                Next Module →
                            </button>
                        </Link>
                    )}
                </div>
            </motion.main>

            <Footer />
        </div>
    );
}
