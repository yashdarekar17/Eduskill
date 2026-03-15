'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Brain, Target, Lightbulb, Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizQuestion {
    id: number;
    question_text: string;
    options: string[] | any;
    topic: string;
}

interface QuizSectionProps {
    moduleId: number;
    moduleTitle: string;
    courseId?: number; // Should be passed to find quizzes
    onSubmit: (data: { module_id: number; score: number; total: number; }) => Promise<any>;
}

export default function QuizSection({ moduleId, moduleTitle, courseId, onSubmit }: QuizSectionProps) {
    const [started, setStarted] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [quizError, setQuizError] = useState<string | null>(null);

    // Quiz Data
    const [quizId, setQuizId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);

    // User Answers mapping question_id -> selected_option
    const [answers, setAnswers] = useState<Record<number, string>>({});

    // Submission tracking
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
        if (!token) {
            alert('Please login to take the quiz.');
            return;
        }

        if (!courseId) {
            setQuizError('Course context missing. Cannot load quizzes.');
            return;
        }

        setLoadingQuiz(true);
        setQuizError(null);

        try {
            // First, find the quiz for this course
            const quizzesRes = await api.getQuizzesByCourse(courseId, token);
            const courseQuizzes = quizzesRes.quizzes;

            // Try to find the quiz matching this module specifically
            // Or fallback to the first quiz available
            const targetQuiz = courseQuizzes.find((q: any) => q.module_id === moduleId);

            if (!targetQuiz) {
                setQuizError('No quizzes found for this module yet. Instructors need to create one first.');
                setLoadingQuiz(false);
                return;
            }

            setQuizId(targetQuiz.id);

            // Fetch the questions for this quiz
            const qRes = await api.getQuizQuestions(targetQuiz.id, token);
            if (qRes.success && qRes.questions && qRes.questions.length > 0) {
                setQuestions(qRes.questions);
                setAnswers({}); // reset answers
                setStarted(true);
            } else {
                setQuizError('This quiz does not have any questions yet.');
            }
        } catch (err: any) {
            console.error('Quiz fetch error:', err);
            setQuizError('Failed to fetch the quiz. Please try again.');
        } finally {
            setLoadingQuiz(false);
        }
    };

    const handleOptionSelect = (questionId: number, option: string) => {
        if (submitted) return; // Prevent changing answers after submission
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token || !quizId) return;

        // Ensure all questions are answered
        if (Object.keys(answers).length < questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        setSubmitting(true);

        const formattedAnswers = Object.entries(answers).map(([qId, selected_option]) => ({
            question_id: parseInt(qId, 10),
            selected_option,
            time_taken: 0 // Optional: can be enhanced with a timer later
        }));

        try {
            const attemptRes = await api.submitQuizAttempt(quizId, formattedAnswers, token);
            setResult({
                score: attemptRes.data.score,
                total: questions.length,
                weaknesses: attemptRes.data.weaknesses,
                detailedResults: attemptRes.data.detailedResults
            });

            // Re-call the generic onSubmit if parent expects it
            await onSubmit({
                module_id: moduleId,
                score: attemptRes.data.score,
                total: questions.length
            });

            setSubmitted(true);
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to submit quiz. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // UI when quiz is not started yet
    if (!started) {
        return (
            <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-orange-100 p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Brain size={28} className="text-[#FF6643]" />
                    <h3 className="text-2xl font-bold text-gray-800">Knowledge Check</h3>
                </div>
                <p className="text-gray-600 mb-6">
                    Test your understanding of <span className="font-semibold">{moduleTitle}</span>
                </p>

                {quizError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2 justify-center">
                        <AlertTriangle size={16} />
                        {quizError}
                    </div>
                )}

                <button
                    onClick={handleStartQuiz}
                    disabled={loadingQuiz}
                    className="flex items-center gap-2 mx-auto px-8 py-3 bg-[#FF6643] text-white font-bold rounded-xl hover:bg-[#e65c00] transition-colors disabled:opacity-60"
                >
                    {loadingQuiz ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Loading Quiz...
                        </>
                    ) : (
                        <>
                            <Target size={18} />
                            Start Quiz
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-[24px] border border-orange-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
                <Brain size={24} className="text-[#FF6643]" />
                <h3 className="text-2xl font-bold text-gray-800">Quiz for {moduleTitle}</h3>
            </div>

            {/* Questions List */}
            <div className="space-y-8">
                {questions.map((q, idx) => {
                    // Try parsing options if stringified JSON
                    let optionsObj: any = q.options;
                    if (typeof q.options === 'string') {
                        try {
                            optionsObj = JSON.parse(q.options);
                        } catch (e) {
                            optionsObj = {};
                        }
                    }

                    return (
                        <div key={q.id} className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
                            <h4 className="font-bold text-gray-800 mb-4 text-base md:text-lg">
                                {idx + 1}. {q.question_text}
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(optionsObj).map(([key, val]) => {
                                    const isSelected = answers[q.id] === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleOptionSelect(q.id, key)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3
                                                ${isSelected
                                                    ? 'border-[#FF6643] bg-orange-50 text-orange-900 font-medium'
                                                    : 'border-gray-200 hover:border-orange-200 text-gray-700'
                                                }
                                                ${submitted ? 'cursor-default opacity-80' : 'cursor-pointer'}
                                            `}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                                ${isSelected ? 'border-[#FF6643] bg-[#FF6643]' : 'border-gray-300'}
                                            `}>
                                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <span><span className="font-bold mr-2 uppercase">{key})</span> {val as string}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions & Results */}
            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length < questions.length}
                    className="mt-8 w-full py-4 bg-[#FF6643] text-white font-bold rounded-xl hover:bg-[#e65c00] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit Quiz'}
                </button>
            ) : result && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-6 rounded-2xl text-center border-2
                        ${result.score / result.total >= 0.7
                            ? 'bg-green-50 border-green-200'
                            : 'bg-orange-50 border-orange-200'
                        }`}
                    >
                        <h4 className="text-xl font-bold mb-2 text-gray-800">Quiz Completed!</h4>
                        <div className={`text-4xl font-extrabold ${result.score / result.total >= 0.7 ? 'text-green-600' : 'text-orange-600'}`}>
                            {result.score}/{result.total}
                        </div>
                        <p className="mt-2 text-gray-600 font-medium">({Math.round((result.score / result.total) * 100)}%)</p>
                    </div>

                    {/* Topic Weakness Analysis */}
                    {result.weaknesses.length > 0 && (
                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                            <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <Lightbulb size={20} className="text-[#FF6643]" />
                                Your Weakness Analysis
                            </h4>
                            <div className="space-y-4">
                                {result.weaknesses.map((w, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <div className="font-semibold text-gray-700">{w.topic}</div>
                                        <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                            <span className="text-sm font-medium text-gray-500">{w.accuracy}% Accuracy</span>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full
                                                ${w.status === 'Strong' ? 'bg-green-100 text-green-700' :
                                                    w.status === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}
                                            `}>
                                                {w.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Answer Breakdown */}
                    {result.detailedResults && result.detailedResults.length > 0 && (
                        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                            <h4 className="font-bold text-gray-800 text-lg mb-6 border-b pb-4">Detailed Review</h4>
                            <div className="space-y-8">
                                {questions.map((q, idx) => {
                                    const detail = result.detailedResults?.find((d: any) => d.question_id === q.id);
                                    if (!detail) return null;

                                    let optionsObj: any = q.options;
                                    if (typeof q.options === 'string') {
                                        try { optionsObj = JSON.parse(q.options); } catch (e) { optionsObj = {}; }
                                    }

                                    return (
                                        <div key={q.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50 relative">
                                            <div className="absolute top-4 right-4">
                                                {detail.is_correct ? (
                                                    <CheckCircle className="text-green-500" size={24} />
                                                ) : (
                                                    <XCircle className="text-red-500" size={24} />
                                                )}
                                            </div>
                                            <h5 className="font-bold text-gray-800 mb-4 pr-8 text-base md:text-lg">
                                                {idx + 1}. {q.question_text}
                                            </h5>
                                            <div className="space-y-2">
                                                {Object.entries(optionsObj).map(([key, val]) => {
                                                    const isUserSelected = detail.selected_option.toLowerCase() === key.toLowerCase();
                                                    const isActuallyCorrect = detail.correct_option.toLowerCase() === key.toLowerCase();

                                                    let optionClass = "border-gray-200 text-gray-600 bg-white";
                                                    if (isActuallyCorrect) {
                                                        // Always highlight the correct answer in green
                                                        optionClass = "border-green-300 bg-green-50 text-green-800 font-medium";
                                                    } else if (isUserSelected && !isActuallyCorrect) {
                                                        // If user selected this and it's wrong, highlight in red
                                                        optionClass = "border-red-300 bg-red-50 text-red-800 font-medium";
                                                    }

                                                    return (
                                                        <div key={key} className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 ${optionClass}`}>
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                                                                ${isActuallyCorrect ? 'border-green-500 bg-green-500 text-white' :
                                                                    isUserSelected && !isActuallyCorrect ? 'border-red-500 bg-red-500 text-white' : 'border-gray-300'}
                                                            `}>
                                                                {isActuallyCorrect && <CheckCircle size={14} className="text-white" />}
                                                                {isUserSelected && !isActuallyCorrect && <XCircle size={14} className="text-white" />}
                                                            </div>
                                                            <span><span className="font-bold mr-2 uppercase">{key})</span> {val as string}</span>

                                                            {/* Label for user context */}
                                                            {isUserSelected && isActuallyCorrect && <span className="ml-auto text-xs font-bold text-green-600">Your Answer</span>}
                                                            {isUserSelected && !isActuallyCorrect && <span className="ml-auto text-xs font-bold text-red-600">Your Answer</span>}
                                                            {!isUserSelected && isActuallyCorrect && <span className="ml-auto text-xs font-bold text-green-600">Correct Answer</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
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
                        className="w-full py-4 border-2 border-[#FF6643] text-[#FF6643] font-bold rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Retake Quiz
                    </button>
                </div>
            )}
        </div>
    );
}
