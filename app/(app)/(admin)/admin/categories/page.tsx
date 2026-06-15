"use client";

import Link from "next/link";
import { useQuery } from "@sanity/sdk-react";
import { Tag, ExternalLink, BookOpen, SlidersHorizontal } from "lucide-react";
import { ADMIN_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
    _id: string;
    title: string | null;
    description: string | null;
    icon: string | null;
    courseCount: number | null;
};

// ─── Icon colors cycle ────────────────────────────────────────────────────────

const ACCENT_COLORS = [
    { bg: "bg-violet-500/10", text: "text-violet-400", bar: "from-violet-500 to-fuchsia-500" },
    { bg: "bg-cyan-500/10", text: "text-cyan-400", bar: "from-cyan-500 to-teal-500" },
    { bg: "bg-amber-500/10", text: "text-amber-400", bar: "from-amber-500 to-orange-500" },
    { bg: "bg-emerald-500/10", text: "text-emerald-400", bar: "from-emerald-500 to-green-500" },
    { bg: "bg-rose-500/10", text: "text-rose-400", bar: "from-rose-500 to-red-500" },
    { bg: "bg-sky-500/10", text: "text-sky-400", bar: "from-sky-500 to-blue-500" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
    const { data } = useQuery({ query: ADMIN_CATEGORIES_QUERY }) as { data: Category[] | null };
    const categories = data ?? [];
    const [search, setSearch] = useState("");

    const filtered = categories.filter(
        (c) => !search || c.title?.toLowerCase().includes(search.toLowerCase()),
    );

    const totalCourses = categories.reduce((sum, c) => sum + (c.courseCount ?? 0), 0);

    return (
        <div className="space-y-6 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Categories</h1>
                    <p className="mt-0.5 text-sm text-zinc-400">
                        {categories.length} categor{categories.length !== 1 ? "ies" : "y"} · {totalCourses} courses categorised
                    </p>
                </div>
                <Link
                    href="/admin/categories/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >

                    Add Category
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search categories…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
                    <Tag className="mx-auto h-8 w-8 text-zinc-700" />
                    <p className="mt-3 text-sm text-zinc-500">No categories found</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((cat, i) => {
                        const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                        const pct = totalCourses > 0 ? Math.round(((cat.courseCount ?? 0) / totalCourses) * 100) : 0;

                        return (
                            <div
                                key={cat._id}
                                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20"
                            >
                                {/* Top accent bar */}
                                <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent.bar}`} />

                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.bg}`}>
                                        <Tag className={`h-5 w-5 ${accent.text}`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-white">
                                            {cat.title ?? "Untitled"}
                                        </p>
                                        {cat.icon && (
                                            <p className="text-xs text-zinc-500 font-mono">{cat.icon}</p>
                                        )}
                                    </div>
                                </div>

                                {cat.description && (
                                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                                        {cat.description}
                                    </p>
                                )}

                                {/* Course count + bar */}
                                <div className="mt-4 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                                            <BookOpen className="h-3 w-3" />
                                            {cat.courseCount ?? 0} course{cat.courseCount !== 1 ? "s" : ""}
                                        </span>
                                        <span className="text-[10px] tabular-nums text-zinc-600">{pct}%</span>
                                    </div>
                                    <div className="h-1 w-full rounded-full bg-zinc-800">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${accent.bar}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
