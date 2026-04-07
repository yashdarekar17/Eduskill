'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Brain, Target, Lightbulb, Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface QuizQuestion {
    id: number;
    question_text: string;
    options: string[] | any;
    topic: string;
}

interface QuizSectionProps {
    moduleId: number;
    moduleTitle: string;
    courseId?: number;
    onSubmit: (data: { module_id: number; score: number; total: number; }) => Promise<any>;
}

export default function QuizSection({ moduleId, moduleTitle, courseId, onSubmit }: QuizSectionProps) {
    const [started, setStarted] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [quizError, setQuizError] = useState<string | null>(null);

    const [quizId, setQuizId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<{
        score: number;
        total: number;
        weaknesses: { topic: string; accuracy: number; status: string }[];
        detailedResults?: { question_id: number; selected_option: string; correct_option: string; is_correct: boolean }[];
    } | null>(null);

    const handleStartQuiz = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        if (!courseId) {
            setQuizError('Course context missing.');
            return;
        }

        setLoadingQuiz(true);
        setQuizError(null);

        try {
            const quizzesRes = await api.getQuizzesByCourse(courseId, token);
            const targetQuiz = quizzesRes.quizzes.find((q: any) => q.module_id === moduleId);

            if (!targetQuiz) {
                setQuizError('No quizzes generated for this sequence.');
                setLoadingQuiz(false);
                return;
            }

            setQuizId(targetQuiz.id);
            const qRes = await api.getQuizQuestions(targetQuiz.id, token);
            if (qRes.success && qRes.questions?.length > 0) {
                setQuestions(qRes.questions);
                setAnswers({});
                setStarted(true);
            } else {
                setQuizError('This sequence has no verified queries.');
            }
        } catch (err: any) {
            setQuizError('Connection to neural bank failed.');
        } finally {
            setLoadingQuiz(false);
        }
    };

    const handleOptionSelect = (questionId: number, option: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token || !quizId) return;

        if (Object.keys(answers).length < questions.length) {
            alert('Complete all queries before submission.');
            return;
        }

        setSubmitting(true);
        const formattedAnswers = Object.entries(answers).map(([qId, selected_option]) => ({
            question_id: parseInt(qId, 10),
            selected_option,
            time_taken: 0
        }));

        try {
            const attemptRes = await api.submitQuizAttempt(quizId, formattedAnswers, token);
            setResult({
                score: attemptRes.data.score,
                total: questions.length,
                weaknesses: attemptRes.data.weaknesses,
                detailedResults: attemptRes.data.detailedResults
            });

            await onSubmit({
                module_id: moduleId,
                score: attemptRes.data.score,
                total: questions.length
            });

            setSubmitted(true);
        } catch (error) {
            alert('Submission synchronization failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!started) {
        return (
            <motion.div initial="hidden" animate="visible" variants={itemVariants} className="text-center">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center shadow-lg -rotate-3">
                        <Brain size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-black uppercase tracking-tight">Knowledge Audit</h3>
                    <p className="text-black/40 font-bold text-base max-w-md mx-auto">
                        Validate your sequence integration for <span className="text-black">{moduleTitle}</span>.
                    </p>
                </div>

                {quizError && (
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-black/40 text-[10px] font-bold tracking-widest flex items-center gap-3 justify-center">
                        <AlertTriangle size={14} className="text-black" />
                        {quizError}
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartQuiz}
                    disabled={loadingQuiz}
                    className="h-[70px] px-12 bg-black text-white font-bold uppercase tracking-tight rounded-full hover:bg-gray-900 shadow-xl transition-all disabled:opacity-30 flex items-center gap-3 mx-auto"
                >
                    {loadingQuiz ? <Loader2 size={24} className="animate-spin" /> : <Zap size={20} />}
                    {loadingQuiz ? 'Syncing...' : 'Initiate Audit'}
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-12">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                <Brain size={28} className="text-black" />
                <h3 className="text-3xl font-bold text-black uppercase tracking-tight">Audit: {moduleTitle}</h3>
            </div>

            <div className="space-y-12">
                {questions.map((q, idx) => {
                    let optionsObj: any = q.options;
                    if (typeof q.options === 'string') {
                        try { optionsObj = JSON.parse(q.options); } catch (e) { optionsObj = {}; }
                    }

                    return (
                        <motion.div variants={itemVariants} key={q.id} className="space-y-6">
                            <div className="flex items-start gap-4">
                                <span className="text-black/20 font-bold text-2xl tracking-tighter shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                                <h4 className="font-bold text-black text-xl tracking-tight leading-tight pt-1">
                                    {q.question_text}
                                </h4>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3 pl-12">
                                {Object.entries(optionsObj).map(([key, val]) => {
                                    const isSelected = answers[q.id] === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleOptionSelect(q.id, key)}
                                            className={`group w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4
                                                ${isSelected
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-50 bg-[#FBFBFB] hover:border-black/10 text-black/60 hover:text-black'
                                                }
                                                ${submitted ? 'cursor-default opacity-80' : 'cursor-pointer'}
                                            `}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                                                ${isSelected ? 'border-white bg-white text-black' : 'border-gray-100 group-hover:border-black/10'}
                                            `}>
                                                {isSelected ? <div className="w-2 h-2 bg-black rounded-full" /> : <span className="text-[10px] font-bold">{key}</span>}
                                            </div>
                                            <span className="font-bold text-sm tracking-tight">{val as string}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {!submitted ? (
                <div className="pt-12 border-t border-gray-100">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || Object.keys(answers).length < questions.length}
                        className="w-full h-[80px] bg-black text-white font-bold uppercase tracking-tight rounded-full hover:bg-gray-900 shadow-2xl transition-all disabled:opacity-30 text-xl flex items-center justify-center gap-4"
                    >
                        {submitting ? <Loader2 size={28} className="animate-spin" /> : <CheckCircle size={28} />}
                        {submitting ? 'Confirming...' : 'Sync Results'}
                    </button>
                    <p className="text-center text-black/20 font-bold uppercase tracking-widest text-[8px] mt-6">Ensure all queries are resolved before final sync.</p>
                </div>
            ) : result && (
                <div className="pt-12 border-t border-gray-100 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-black text-white p-12 rounded-[40px] text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-20 -mt-20" />
                        <h4 className="text-lg font-bold uppercase tracking-widest text-white/30 mb-4">Audit Finalized</h4>
                        <div className="text-7xl font-bold tracking-tighter mb-4">
                            {result.score}/{result.total}
                        </div>
                        <div className="px-6 py-2 bg-white/10 rounded-full inline-block text-xs font-bold uppercase tracking-widest">
                            {Math.round((result.score / result.total) * 100)}% Accuracy
                        </div>
                    </div>

                    {result.weaknesses.length > 0 && (
                        <div className="space-y-6">
                            <h4 className="font-bold text-black text-xl uppercase tracking-tight flex items-center gap-3">
                                <Lightbulb size={24} /> Neural Analysis
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {result.weaknesses.map((w, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 border border-gray-100">
                                        <div className="font-bold text-black tracking-tight text-sm">{w.topic}</div>
                                        <span className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-widest
                                            ${w.status === 'Strong' ? 'bg-black text-white' : 'border border-black/10 text-black/40'}
                                        `}>
                                            {w.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setStarted(false);
                            setSubmitted(false);
                            setAnswers({});
                            setResult(null);
                        }}
                        className="w-full h-[70px] border-2 border-black text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={18} /> Re-Initialize Audit
                    </button>
                </div>
            )}
        </motion.div>
    );
}
