"use client";

import Link from "next/link";
import { useQuery } from "@sanity/sdk-react";
import {
    BookOpen,
    ExternalLink,
    Star,
    Layers,
    PlayCircle,
    Calendar,
    Tag,
    SlidersHorizontal,
} from "lucide-react";
import { ADMIN_COURSES_QUERY } from "@/sanity/lib/queries";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Course = {
    _id: string;
    title: string | null;
    slug: { current: string } | null;
    tier: string | null;
    featured: boolean | null;
    _createdAt: string;
    _updatedAt: string;
    category: { _id: string; title: string } | null;
    moduleCount: number | null;
    lessonCount: number | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tierBadge(tier?: string | null) {
    switch (tier) {
        case "ultra":
            return { label: "Ultra", cls: "bg-fuchsia-500/15 text-fuchsia-300 ring-1 ring-fuchsia-500/30" };
        case "pro":
            return { label: "Pro", cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30" };
        default:
            return { label: "Free", cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30" };
    }
}

function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TIERS = ["all", "free", "pro", "ultra"] as const;
type TierFilter = (typeof TIERS)[number];

export default function AdminCoursesPage() {
    const { data } = useQuery({ query: ADMIN_COURSES_QUERY }) as { data: Course[] | null };
    const courses = data ?? [];

    const [filter, setFilter] = useState<TierFilter>("all");
    const [search, setSearch] = useState("");

    const filtered = courses.filter((c) => {
        const matchesTier = filter === "all" || c.tier === filter;
        const matchesSearch =
            !search || c.title?.toLowerCase().includes(search.toLowerCase());
        return matchesTier && matchesSearch;
    });

    const counts = {
        all: courses.length,
        free: courses.filter((c) => c.tier === "free" || !c.tier).length,
        pro: courses.filter((c) => c.tier === "pro").length,
        ultra: courses.filter((c) => c.tier === "ultra").length,
    };

    return (
        <div className="space-y-8 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Courses</h1>
                    <p className="mt-0.5 text-sm text-zinc-400">
                        {courses.length} course{courses.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-105 hover:shadow-violet-500/30"
                >
                    Add Course
                </Link>
            </div>

            {/* Filter + Search bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Tier tabs */}
                <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
                    {TIERS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                                filter === t
                                    ? "bg-violet-600 text-white shadow"
                                    : "text-zinc-400 hover:text-white",
                            )}
                        >
                            {t}
                            <span className={cn("ml-1.5 tabular-nums", filter === t ? "text-violet-200" : "text-zinc-600")}>
                                {counts[t]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1 sm:max-w-xs">
                    <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search courses…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <BookOpen className="mx-auto h-8 w-8 text-zinc-700" />
                        <p className="mt-3 text-sm text-zinc-500">No courses found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-left">
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Course</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:table-cell">Category</th>
                                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Tier</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:table-cell">Content</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filtered.map((course) => {
                                const badge = tierBadge(course.tier);
                                return (
                                    <tr key={course._id} className="group transition-colors hover:bg-zinc-800/30">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                                                    <BookOpen className="h-4 w-4 text-violet-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-white">
                                                        {course.title ?? "Untitled"}
                                                    </p>
                                                    {course.featured && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400">
                                                            <Star className="h-2.5 w-2.5 fill-amber-400" />
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-4 sm:table-cell">
                                            {course.category ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                                                    <Tag className="h-3 w-3 text-zinc-500" />
                                                    {course.category.title}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-zinc-600">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", badge.cls)}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="hidden px-4 py-4 md:table-cell">
                                            <div className="flex items-center gap-3 text-xs text-zinc-400">
                                                <span className="flex items-center gap-1">
                                                    <Layers className="h-3.5 w-3.5 text-zinc-600" />
                                                    {course.moduleCount ?? 0} mod
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <PlayCircle className="h-3.5 w-3.5 text-zinc-600" />
                                                    {course.lessonCount ?? 0} les
                                                </span>
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-4 lg:table-cell">
                                            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                <Calendar className="h-3 w-3" />
                                                {fmt(course._createdAt)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
