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
        <nav className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
                <h3 className="font-black text-black text-sm uppercase tracking-widest">Course Directory</h3>
            </div>
            <div className="p-4 space-y-2">
                {phases.map((phase) => {
                    const phaseCompleted = phase.modules.length > 0 && phase.modules.every((m) => completedModuleIds.has(m.id));
                    const phasePartial = phase.modules.some((m) => completedModuleIds.has(m.id));
                    const isExpanded = expandedPhases.has(phase.id);

                    return (
                        <div key={phase.id} className="mb-2">
                            <button
                                onClick={() => togglePhase(phase.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all text-left group"
                            >
                                <span
                                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter transition-colors ${phaseCompleted
                                        ? 'bg-black text-white'
                                        : phasePartial
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {phaseCompleted ? '✓' : phase.phase_order}
                                </span>
                                <span className="flex-1 font-bold text-sm text-black/70 group-hover:text-black transition-colors">{phase.title}</span>
                                <svg
                                    className={`w-4 h-4 text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isExpanded && (
                                <div className="mt-1 space-y-1">
                                    {phase.modules.map((mod) => {
                                        const isCompleted = completedModuleIds.has(mod.id);
                                        const isActive = activeModuleId === mod.id;
                                        return (
                                            <Link
                                                key={mod.id}
                                                href={`/modules/${mod.id}`}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition-all ${isActive
                                                    ? 'bg-black text-white font-black'
                                                    : isCompleted
                                                        ? 'text-black/40 hover:text-black hover:bg-gray-50'
                                                        : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <span className="text-black font-black">✓</span>
                                                ) : (
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-300'}`} />
                                                )}
                                                <span className="font-bold tracking-tight">{mod.title}</span>
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
