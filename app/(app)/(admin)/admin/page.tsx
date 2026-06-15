"use client";

import Link from "next/link";
import { useQuery } from "@sanity/sdk-react";
import {
    BookOpen,
    Layers,
    PlayCircle,
    Tag,
    ExternalLink,
    PencilLine,
    FolderOpen,
    FileVideo,
    CheckCircle2,
    PlusCircle,
    Lightbulb,
    Sparkles,
    ArrowRight,
    Hash,
} from "lucide-react";
import { ADMIN_STATS_QUERY } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
    label,
    count,
    icon: Icon,
    gradient,
    accentColor,
    href,
}: {
    label: string;
    count: number | null | undefined;
    icon: React.ElementType;
    gradient: string;
    accentColor: string;
    href: string;
}) {
    return (
        <Link href={href} className="group block">
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/30">
                {/* Top accent bar */}
                <div className={cn("absolute inset-x-0 top-0 h-0.5", accentColor)} />

                <div className="flex items-center gap-4">
                    {/* Icon bubble */}
                    <div
                        className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                            gradient,
                        )}
                    >
                        <Icon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                        <p className="text-3xl font-bold text-white tabular-nums">
                            {count ?? "—"}
                        </p>
                        <p className="text-sm text-zinc-400">{label}</p>
                    </div>
                </div>

                {/* Hover arrow */}
                <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-zinc-600 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
        </Link>
    );
}

// ─── Quick Action Row ─────────────────────────────────────────────────────────

function QuickAction({
    label,
    description,
    icon: Icon,
    iconBg,
    href,
}: {
    label: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-zinc-800/60 group"
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        iconBg,
                    )}
                >
                    <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-zinc-500">{description}</p>
                </div>
            </div>
            <PlusCircle className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-400" />
        </Link>
    );
}

// ─── Content Health Row ───────────────────────────────────────────────────────

function HealthRow({
    label,
    count,
    status,
}: {
    label: string;
    count: number | null | undefined;
    status: "done" | "partial" | "empty";
}) {
    const statusConfig = {
        done: { icon: CheckCircle2, color: "text-emerald-400", bar: "bg-emerald-400" },
        partial: { icon: PlusCircle, color: "text-cyan-400", bar: "bg-cyan-400" },
        empty: { icon: PlusCircle, color: "text-amber-400", bar: "bg-amber-400" },
    } as const;

    const cfg = statusConfig[status];
    const Icon = cfg.icon;
    const pct = status === "done" ? 100 : status === "partial" ? 60 : 20;

    return (
        <div className="flex items-center gap-3">
            <Icon className={cn("h-5 w-5 shrink-0", cfg.color)} />
            <div className="flex flex-1 items-center gap-3">
                <span className="w-40 text-sm text-zinc-300">{label}</span>
                <div className="flex flex-1 items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-zinc-800">
                        <div
                            className={cn("h-full rounded-full transition-all duration-700", cfg.bar)}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className="w-6 text-center text-xs font-semibold text-zinc-400">
                        {count ?? 0}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Recent Item Row ──────────────────────────────────────────────────────────

function RecentRow({
    title,
    meta,
    badge,
    badgeColor,
}: {
    title: string;
    meta: string;
    badge?: string;
    badgeColor?: string;
}) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-zinc-800/60 last:border-0">
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{title}</p>
                <p className="text-xs text-zinc-500">{meta}</p>
            </div>
            {badge && (
                <span
                    className={cn(
                        "ml-4 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                        badgeColor,
                    )}
                >
                    {badge}
                </span>
            )}
        </div>
    );
}

// ─── Tier badge helper ────────────────────────────────────────────────────────

function tierColor(tier?: string | null) {
    switch (tier) {
        case "ultra":
            return "bg-fuchsia-500/20 text-fuchsia-300";
        case "pro":
            return "bg-violet-500/20 text-violet-300";
        default:
            return "bg-zinc-700/60 text-zinc-300";
    }
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

type AdminStats = {
    courseCount: number | null;
    moduleCount: number | null;
    lessonCount: number | null;
    categoryCount: number | null;
    recentCourses: {
        _id: string;
        title: string | null;
        tier: string | null;
        _createdAt: string;
        moduleCount: number | null;
        lessonCount: number | null;
    }[];
    recentLessons: {
        _id: string;
        title: string | null;
        _createdAt: string;
    }[];
};

export default function AdminDashboardPage() {
    const { data: stats } = useQuery({ query: ADMIN_STATS_QUERY }) as { data: AdminStats | null };

    const courseCount = stats?.courseCount ?? null;
    const moduleCount = stats?.moduleCount ?? null;
    const lessonCount = stats?.lessonCount ?? null;
    const categoryCount = stats?.categoryCount ?? null;
    const recentCourses = stats?.recentCourses ?? [];
    const recentLessons = stats?.recentLessons ?? [];

    const healthStatus = (n: number | null): "done" | "partial" | "empty" => {
        if (n === null) return "empty";
        if (n >= 5) return "done";
        if (n > 0) return "partial";
        return "empty";
    };

    return (
        <div className="space-y-8">
            {/* ── Page header ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Manage your courses, modules, lessons, and categories
                    </p>
                </div>

                <Link
                    href="/studio"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105"
                >
                    <ExternalLink className="h-4 w-4" />
                    Open Studio
                </Link>
            </div>

            {/* ── Stat cards ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    label="Courses"
                    count={courseCount}
                    icon={BookOpen}
                    gradient="bg-gradient-to-br from-violet-500 to-violet-700"
                    accentColor="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    href="/admin/courses"
                />
                <StatCard
                    label="Modules"
                    count={moduleCount}
                    icon={Layers}
                    gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
                    accentColor="bg-gradient-to-r from-cyan-400 to-teal-500"
                    href="/admin/modules"
                />
                <StatCard
                    label="Lessons"
                    count={lessonCount}
                    icon={PlayCircle}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
                    accentColor="bg-gradient-to-r from-emerald-400 to-green-500"
                    href="/admin/lessons"
                />
                <StatCard
                    label="Categories"
                    count={categoryCount}
                    icon={Tag}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    accentColor="bg-gradient-to-r from-amber-400 to-orange-500"
                    href="/admin/categories"
                />
            </div>

            {/* ── Middle row: Quick Actions + Content Health ─────────────────── */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Quick Actions */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                    <h2 className="mb-4 text-base font-semibold text-white">Quick Actions</h2>
                    <div className="space-y-1">
                        <QuickAction
                            label="Manage Courses"
                            description="View and edit courses"
                            icon={PencilLine}
                            iconBg="bg-gradient-to-br from-violet-500 to-fuchsia-600"
                            href="/admin/courses"
                        />
                        <QuickAction
                            label="Manage Modules"
                            description="Organise course modules"
                            icon={FolderOpen}
                            iconBg="bg-gradient-to-br from-cyan-500 to-teal-600"
                            href="/admin/modules"
                        />
                        <QuickAction
                            label="Manage Lessons"
                            description="Organise your content"
                            icon={FileVideo}
                            iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
                            href="/admin/lessons"
                        />
                        <QuickAction
                            label="Manage Categories"
                            description="Group courses by topic"
                            icon={Tag}
                            iconBg="bg-gradient-to-br from-emerald-500 to-green-600"
                            href="/admin/categories"
                        />
                    </div>
                </div>

                {/* Content Health */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                    <h2 className="mb-4 text-base font-semibold text-white">Content Health</h2>
                    <div className="space-y-4">
                        <HealthRow
                            label="Courses created"
                            count={courseCount}
                            status={healthStatus(courseCount)}
                        />
                        <HealthRow
                            label="Modules created"
                            count={moduleCount}
                            status={healthStatus(moduleCount)}
                        />
                        <HealthRow
                            label="Lessons created"
                            count={lessonCount}
                            status={healthStatus(lessonCount)}
                        />
                        <HealthRow
                            label="Categories created"
                            count={categoryCount}
                            status={healthStatus(categoryCount)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Bottom row: Recent Courses + Recent Lessons ─────────────────── */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Recent Courses */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">Recent Courses</h2>
                        <Link
                            href="/admin/courses"
                            className="text-xs text-zinc-500 hover:text-violet-400 transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    {recentCourses.length === 0 ? (
                        <p className="py-6 text-center text-sm text-zinc-600">No courses yet</p>
                    ) : (
                        recentCourses.map((c) => (
                            <RecentRow
                                key={c._id}
                                title={c.title ?? "Untitled"}
                                meta={`${c.moduleCount ?? 0} modules · ${c.lessonCount ?? 0} lessons`}
                                badge={c.tier ?? "free"}
                                badgeColor={tierColor(c.tier)}
                            />
                        ))
                    )}
                </div>

                {/* Recent Lessons */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white">Recent Lessons</h2>
                        <Link
                            href="/admin/lessons"
                            className="text-xs text-zinc-500 hover:text-violet-400 transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    {recentLessons.length === 0 ? (
                        <p className="py-6 text-center text-sm text-zinc-600">No lessons yet</p>
                    ) : (
                        recentLessons.map((l) => (
                            <RecentRow
                                key={l._id}
                                title={l.title ?? "Untitled"}
                                meta={new Date(l._createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ── Pro Tips ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/40 p-6">
                {/* Background glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 right-32 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

                <div className="relative flex items-center gap-2 mb-5">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                    <h2 className="text-base font-semibold text-white">
                        Pro Tips for Content Creation
                    </h2>
                </div>

                <div className="relative grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                            <Hash className="h-4 w-4 text-violet-400" />
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Start by creating{" "}
                            <span className="font-semibold text-white">#Categories</span> to
                            organise your courses by topic.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                            <Layers className="h-4 w-4 text-cyan-400" />
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Create{" "}
                            <span className="font-semibold text-white">Modules</span> to group
                            related lessons inside a course.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                            <PlayCircle className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Finally create{" "}
                            <span className="font-semibold text-white">Lessons</span> and upload
                            your video content via Mux.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                            <Lightbulb className="h-4 w-4 text-amber-400" />
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            Set a course <span className="font-semibold text-white">Tier</span>{" "}
                            (Free, Pro, Ultra) to control access for subscribers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}