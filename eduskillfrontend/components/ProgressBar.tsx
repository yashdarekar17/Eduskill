'use client';

interface ProgressBarProps {
    completed: number;
    total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Course Progress</span>
                <span className="text-sm font-bold text-[#111010ff]">
                    {completed}/{total} modules
                </span>
            </div>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #111010ff, #32302fff)',
                    }}
                />
            </div>
        </div>
    );
}
