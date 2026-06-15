import { sanityFetch } from '@/sanity/lib/live';
import { COURSE_WITH_MODULES_QUERY } from '@/sanity/lib/queries';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import React from 'react';
import { TIER_STYLES, Tier } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
    BookOpen,
    ChevronDown,
    PlayCircle,
    CheckCircle2,
    Lock,
    Trophy,
    Layers,
    Tag,
    Star,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Lesson {
    _id: string;
    title: string;
    slug?: { current: string };
    description?: string;
    completedBy?: string[];
    demoVideoUrl?: string;
    durationSeconds?: number;
    video?: {
        asset?: {
            playbackId?: string;
        };
    };
}

interface Module {
    _id: string;
    title: string;
    description?: string;
    completedBy?: string[];
    lessons?: Lesson[];
}

interface CoursePageProps {
    params: Promise<{ slug: string }>;
}

async function CoursePage({ params }: CoursePageProps) {
    const { userId } = await auth();
    const { slug } = await params;

    const { data: course } = await sanityFetch({
        query: COURSE_WITH_MODULES_QUERY,
        params: { slug, userId: userId ?? '' },
    });

    if (!course) {
        notFound();
    }

    const tier = (course.tier ?? 'free') as Tier;
    const tierStyle = TIER_STYLES[tier] || TIER_STYLES.free;

    const totalLessons = course.lessonCount ?? 0;
    // Compute completed count directly from fetched lesson data (more reliable than GROQ param)
    const completedLessons = userId
        ? (course.modules ?? []).reduce((acc: number, mod: Module) => {
            return acc + (mod.lessons ?? []).filter((l: Lesson) => l.completedBy?.includes(userId)).length;
        }, 0)
        : 0;
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ── Hero Banner ── */}
            <div className="relative overflow-hidden border-b border-border/50">
                {/* Background gradient */}
                <div
                    className={cn(
                        'absolute inset-0 opacity-10 bg-gradient-to-br',
                        tierStyle.gradient
                    )}
                />
                {/* Thumbnail overlay */}
                {course.thumbnail?.asset?.url && (
                    <div className="absolute inset-0">
                        <img
                            src={course.thumbnail.asset.url}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-background/10" />
                    </div>
                )}

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    {/* Back link */}
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back to Dashboard
                    </Link>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        {/* Tier badge */}
                        <span
                            className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm',
                                tier === 'ultra'
                                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                    : tier === 'pro'
                                        ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            )}
                        >
                            <Star className="w-3 h-3" />
                            {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan
                        </span>

                        {/* Category badge */}
                        {course.category?.title && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border/60 bg-card/50 text-muted-foreground backdrop-blur-sm">
                                <Tag className="w-3 h-3" />
                                {course.category.title}
                            </span>
                        )}

                        {/* Featured badge */}
                        {course.featured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-amber-500/30 bg-amber-500/10 text-amber-400 backdrop-blur-sm">
                                <Trophy className="w-3 h-3" />
                                Featured
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        {course.title}
                    </h1>

                    {/* Description */}
                    {course.description && (
                        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
                            {course.description}
                        </p>
                    )}

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-6 mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Layers className="w-4 h-4 text-primary" />
                            <span>
                                <span className="font-semibold text-foreground">{course.moduleCount ?? 0}</span> Modules
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span>
                                <span className="font-semibold text-foreground">{totalLessons}</span> Lessons
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>
                                <span className="font-semibold text-foreground">{completedLessons}</span> Completed
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    {userId && (
                        <div className="max-w-md">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Your Progress</span>
                                <span
                                    className={cn(
                                        'text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r',
                                        tierStyle.gradient
                                    )}
                                >
                                    {progressPercent}%
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-border/60 overflow-hidden">
                                <div
                                    className={cn(
                                        'h-full rounded-full bg-gradient-to-r transition-all duration-700',
                                        tierStyle.gradient
                                    )}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Course Content ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Course Curriculum
                </h2>

                {/* Accordion modules */}
                <div className="space-y-3">
                    {course.modules?.map((module: Module, moduleIndex: number) => {
                        const moduleLessons = module.lessons ?? [];
                        const completedInModule = moduleLessons.filter(
                            (l: Lesson) => l.completedBy?.includes(userId ?? '')
                        ).length;
                        const moduleProgress =
                            moduleLessons.length > 0
                                ? Math.round((completedInModule / moduleLessons.length) * 100)
                                : 0;

                        return (
                            <details
                                key={module._id}
                                className="group rounded-xl border border-border/60 bg-card overflow-hidden hover:border-border transition-colors duration-200"
                                open={moduleIndex === 0}
                            >
                                {/* Module header */}
                                <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                                    {/* Index bubble */}
                                    <div
                                        className={cn(
                                            'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br text-white',
                                            tierStyle.gradient
                                        )}
                                    >
                                        {moduleIndex + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm sm:text-base truncate">
                                            {module.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {moduleLessons.length} lesson{moduleLessons.length !== 1 ? 's' : ''}
                                            {userId && (
                                                <span className="ml-2 text-emerald-400">
                                                    · {completedInModule}/{moduleLessons.length} done
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Mini progress */}
                                    {userId && moduleLessons.length > 0 && (
                                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                                            <div className="w-20 h-1.5 rounded-full bg-border/60 overflow-hidden">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full bg-gradient-to-r',
                                                        tierStyle.gradient
                                                    )}
                                                    style={{ width: `${moduleProgress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground w-8 text-right">
                                                {moduleProgress}%
                                            </span>
                                        </div>
                                    )}

                                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                                </summary>

                                {/* Module description */}
                                {module.description && (
                                    <div className="px-5 pb-2 pt-0">
                                        <p className="text-sm text-muted-foreground border-t border-border/40 pt-3">
                                            {module.description}
                                        </p>
                                    </div>
                                )}

                                {/* Lessons list */}
                                <ul className="px-5 pb-4 space-y-1">
                                    {moduleLessons.map((lesson: Lesson, lessonIndex: number) => {
                                        const isCompleted = lesson.completedBy?.includes(userId ?? '');
                                        const hasVideo = !!lesson.video?.asset?.playbackId || !!lesson.demoVideoUrl || !!lesson.durationSeconds;

                                        return (
                                            <li key={lesson._id}>
                                                <Link
                                                    href={`/lesson/${lesson.slug?.current ?? lesson._id}`}
                                                    className={cn(
                                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group/lesson',
                                                        isCompleted
                                                            ? 'text-emerald-400 hover:bg-emerald-500/5'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                                                    )}
                                                >
                                                    {/* Status icon */}
                                                    <span className="flex-shrink-0 w-5 h-5">
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                        ) : hasVideo ? (
                                                            <PlayCircle className="w-5 h-5 opacity-60 group-hover/lesson:opacity-100 transition-opacity" />
                                                        ) : (
                                                            <PlayCircle className="w-5 h-5 opacity-40" />
                                                        )}
                                                    </span>

                                                    {/* Lesson number */}
                                                    <span className="flex-shrink-0 text-xs text-muted-foreground/60 w-5 text-right">
                                                        {moduleIndex + 1}.{lessonIndex + 1}
                                                    </span>

                                                    {/* Lesson title */}
                                                    <span className="flex-1 truncate font-medium">
                                                        {lesson.title}
                                                    </span>

                                                    {/* Completed chip */}
                                                    {isCompleted && (
                                                        <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            Done
                                                        </span>
                                                    )}
                                                </Link>
                                            </li>
                                        );
                                    })}

                                    {moduleLessons.length === 0 && (
                                        <li className="py-3 text-center text-xs text-muted-foreground/60">
                                            No lessons in this module yet.
                                        </li>
                                    )}
                                </ul>
                            </details>
                        );
                    })}

                    {(!course.modules || course.modules.length === 0) && (
                        <div className="text-center py-16 rounded-xl border border-dashed border-border/60">
                            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-muted-foreground">No modules available yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CoursePage;