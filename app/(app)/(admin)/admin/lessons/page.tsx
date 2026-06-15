"use client";

import Link from "next/link";
import { useQuery } from "@sanity/sdk-react";
import {
    PlayCircle,
    Calendar,
    CheckCircle2,
    SlidersHorizontal,
    Link2,
    Layers,
} from "lucide-react";
import { ADMIN_LESSONS_QUERY } from "@/sanity/lib/queries";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lesson = {
    _id: string;
    title: string | null;
    slug: { current: string } | null;
    description: string | null;
    _createdAt: string;
    completionCount: number | null;
    module: { _id: string; title: string } | null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLessonsPage() {
    const { data } = useQuery({ query: ADMIN_LESSONS_QUERY }) as { data: Lesson[] | null };
    const lessons = data ?? [];
    const [search, setSearch] = useState("");

    const filtered = lessons.filter(
        (l) => !search || l.title?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="space-y-6 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Lessons</h1>
                    <p className="mt-0.5 text-sm text-zinc-400">
                        {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Link
                    href="/admin/lessons/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >

                    Add Lesson
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search lessons…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center">
                        <PlayCircle className="mx-auto h-8 w-8 text-zinc-700" />
                        <p className="mt-3 text-sm text-zinc-500">No lessons found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-800 text-left">
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Lesson</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:table-cell">Module</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 md:table-cell">Slug</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">Completions</th>
                                <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 lg:table-cell">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {filtered.map((lesson) => (
                                <tr key={lesson._id} className="group transition-colors hover:bg-zinc-800/30">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                                                <PlayCircle className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-white">
                                                    {lesson.title ?? "Untitled"}
                                                </p>
                                                {lesson.description && (
                                                    <p className="truncate text-xs text-zinc-500 max-w-[200px]">
                                                        {lesson.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden px-4 py-4 sm:table-cell">
                                        {lesson.module ? (
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
                                                <Layers className="h-3 w-3" />
                                                {lesson.module.title}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-zinc-600 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-4 md:table-cell">
                                        {lesson.slug?.current ? (
                                            <span className="flex items-center gap-1.5 font-mono text-xs text-zinc-400">
                                                <Link2 className="h-3 w-3 text-zinc-600" />
                                                {lesson.slug.current}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-zinc-600">—</span>
                                        )}
                                    </td>
                                    <td className="hidden px-4 py-4 lg:table-cell">
                                        <span className="flex items-center gap-1.5 text-xs">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            <span className="font-semibold text-white tabular-nums">
                                                {lesson.completionCount ?? 0}
                                            </span>
                                            <span className="text-zinc-500">completions</span>
                                        </span>
                                    </td>
                                    <td className="hidden px-4 py-4 lg:table-cell">
                                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(lesson._createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
