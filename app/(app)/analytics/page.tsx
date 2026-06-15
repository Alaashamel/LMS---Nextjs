import { sanityFetch } from "@/sanity/lib/live";
import { USER_COURSES_QUERY } from "@/sanity/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { getUserTier, hasAccessToTier } from "@/lib/user-plan";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { TIER_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
    BarChart3,
    BookOpen,
    CheckCircle2,
    Trophy,
    TrendingUp,
    Download,
    Layers,
} from "lucide-react";
import Link from "next/link";

interface Lesson {
    completedBy?: string[];
}

interface Module {
    lessons?: Lesson[];
}

interface Course {
    _id: string;
    title: string;
    tier: string;
    slug?: { current: string };
    modules?: Module[];
    moduleCount?: number;
    lessonCount?: number;
}

export default async function AnalyticsPage() {
    const user = await currentUser();
    if (!user) return null;

    const canAccess = await hasAccessToTier("pro");
    if (!canAccess) {
        return (
            <UpgradePrompt
                requiredPlan="pro"
                featureName="Advanced Analytics"
                description="Unlock detailed insights into your learning journey — progress charts, completion rates, and course-by-course breakdowns."
            />
        );
    }

    const userTier = await getUserTier();
    const isUltra = userTier === "ultra";

    const [{ data: allCourses }] = await Promise.all([
        sanityFetch({ query: USER_COURSES_QUERY, params: { userId: user.id } }),
    ]);

    // Filter to courses user can access
    const accessChecks = await Promise.all(
        (allCourses as Course[]).map(async (course) => ({
            course,
            hasAccess: await hasAccessToTier(course.tier as any),
        }))
    );
    const courses = accessChecks.filter((x) => x.hasAccess).map((x) => x.course);

    // Compute stats
    const userId = user.id;

    const allLessons = courses.flatMap((c) => c.modules?.flatMap((m) => m.lessons ?? []) ?? []);
    const completedLessons = allLessons.filter((l) => l.completedBy?.includes(userId));

    const enrolledCourses = courses.filter((c) => {
        const lessons = c.modules?.flatMap((m) => m.lessons ?? []) ?? [];
        return lessons.some((l) => l.completedBy?.includes(userId));
    });

    const completedCourses = courses.filter((c) => {
        const lessons = c.modules?.flatMap((m) => m.lessons ?? []) ?? [];
        return lessons.length > 0 && lessons.every((l) => l.completedBy?.includes(userId));
    });

    const overallProgress =
        allLessons.length > 0
            ? Math.round((completedLessons.length / allLessons.length) * 100)
            : 0;

    const stats = [
        {
            label: "Courses Enrolled",
            value: enrolledCourses.length,
            icon: BookOpen,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            label: "Courses Completed",
            value: completedCourses.length,
            icon: Trophy,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
        {
            label: "Lessons Completed",
            value: completedLessons.length,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Overall Progress",
            value: `${overallProgress}%`,
            icon: TrendingUp,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-5 h-5 text-violet-400" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                                    Advanced Analytics
                                </span>
                            </div>
                            <h1 className="text-3xl font-extrabold">Your Learning Analytics</h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Detailed insights into your learning journey, {user.firstName ?? "learner"}.
                            </p>
                        </div>

                        {isUltra && (
                            <Link
                                href="/api/export"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/10"
                            >
                                <Download className="w-4 h-4" />
                                Export Data (CSV)
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.label}
                                className="rounded-xl border border-border/60 bg-card p-5 flex flex-col gap-3"
                            >
                                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", s.bg)}>
                                    <Icon className={cn("w-5 h-5", s.color)} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Overall progress bar */}
                <div className="rounded-xl border border-border/60 bg-card p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-violet-400" />
                            Overall Completion Rate
                        </h2>
                        <span className="text-sm font-bold text-violet-400">{overallProgress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-border/60 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-600 transition-all duration-700"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {completedLessons.length} of {allLessons.length} lessons completed across{" "}
                        {courses.length} available courses
                    </p>
                </div>

                {/* Per-course breakdown */}
                <div>
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Course Breakdown
                    </h2>

                    {courses.length === 0 ? (
                        <div className="text-center py-16 rounded-xl border border-dashed border-border/60">
                            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                            <p className="text-muted-foreground">No courses available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {courses.map((course) => {
                                const lessons = course.modules?.flatMap((m) => m.lessons ?? []) ?? [];
                                const done = lessons.filter((l) => l.completedBy?.includes(userId)).length;
                                const total = lessons.length;
                                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                                const tier = (course.tier ?? "free") as keyof typeof TIER_STYLES;
                                const style = TIER_STYLES[tier] ?? TIER_STYLES.free;

                                return (
                                    <div
                                        key={course._id}
                                        className="rounded-xl border border-border/60 bg-card p-4 hover:border-border transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-4 mb-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span
                                                    className={cn(
                                                        "flex-shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                        style.badge
                                                    )}
                                                >
                                                    {tier}
                                                </span>
                                                <Link
                                                    href={`/course/${course.slug?.current ?? course._id}`}
                                                    className="font-medium text-sm truncate hover:text-primary transition-colors"
                                                >
                                                    {course.title}
                                                </Link>
                                            </div>
                                            <span className="flex-shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                                                {done}/{total}
                                            </span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                                                    style.gradient
                                                )}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-1.5">{pct}% complete</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Ultra upsell if on pro */}
                {!isUltra && (
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Download className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">Export Your Data</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Download a full CSV export of your learning history with the Ultra plan.
                            </p>
                        </div>
                        <Link
                            href="/#pricing"
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                            Upgrade to Ultra
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
