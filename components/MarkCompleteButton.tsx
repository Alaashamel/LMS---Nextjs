'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkCompleteButtonProps {
    lessonId: string;
    isCompleted: boolean;
}

export default function MarkCompleteButton({ lessonId, isCompleted }: MarkCompleteButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(isCompleted);

    async function handleClick() {
        if (done || loading) return;
        setLoading(true);
        try {
            const res = await fetch('/api/lesson/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId }),
            });
            if (res.ok) {
                setDone(true);
                router.refresh(); // re-fetch server component data → updates progress bar
            } else {
                console.error('Failed to mark lesson complete');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={done || loading}
            className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                done
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : loading
                        ? 'bg-muted text-muted-foreground border border-border cursor-wait'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95'
            )}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : done ? (
                <CheckCircle2 className="w-4 h-4" />
            ) : (
                <Circle className="w-4 h-4" />
            )}
            {done ? 'Completed' : loading ? 'Saving…' : 'Mark as Complete'}
        </button>
    );
}
