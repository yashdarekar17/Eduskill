'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarModule {
    id: number;
    title: string;
    module_order: number;
}

interface SidebarPhase {
    id: number;
    title: string;
    phase_order: number;
    modules: SidebarModule[];
}

interface SidebarProps {
    phases: SidebarPhase[];
    completedModuleIds: Set<number>;
    activeModuleId?: number;
}

export default function Sidebar({ phases, completedModuleIds, activeModuleId }: SidebarProps) {
    const [expandedPhases, setExpandedPhases] = useState<Set<number>>(
        new Set(phases.map((p) => p.id))
    );

    const togglePhase = (phaseId: number) => {
        setExpandedPhases((prev) => {
            const next = new Set(prev);
            if (next.has(phaseId)) next.delete(phaseId);
            else next.add(phaseId);
            return next;
        });
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">Course Phases</h3>
            </div>
            <div className="p-3 space-y-1">
                {phases.map((phase) => {
                    const phaseCompleted = phase.modules.length > 0 && phase.modules.every((m) => completedModuleIds.has(m.id));
                    const phasePartial = phase.modules.some((m) => completedModuleIds.has(m.id));
                    const isExpanded = expandedPhases.has(phase.id);

                    return (
                        <div key={phase.id}>
                            <button
                                onClick={() => togglePhase(phase.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors text-left"
                            >
                                <span
                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${phaseCompleted
                                            ? 'bg-green-500 text-white'
                                            : phasePartial
                                                ? 'bg-orange-400 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {phaseCompleted ? '✓' : phase.phase_order}
                                </span>
                                <span className="flex-1 font-semibold text-sm text-gray-700">{phase.title}</span>
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isExpanded && (
                                <div className="ml-6 pl-4 border-l-2 border-gray-100 space-y-0.5 pb-2">
                                    {phase.modules.map((mod) => {
                                        const isCompleted = completedModuleIds.has(mod.id);
                                        const isActive = activeModuleId === mod.id;
                                        return (
                                            <Link
                                                key={mod.id}
                                                href={`/modules/${mod.id}`}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive
                                                        ? 'bg-[#FF6643] text-white font-semibold'
                                                        : isCompleted
                                                            ? 'text-green-700 hover:bg-green-50'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {isCompleted && !isActive ? (
                                                    <span className="text-green-500 text-base">✓</span>
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                                                )}
                                                <span>{mod.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}
