"use client";

import Link from "next/link";
import { useQuery } from "@sanity/sdk-react";
import { Layers, PlayCircle, Calendar, SlidersHorizontal } from "lucide-react";
import { ADMIN_MODULES_QUERY } from "@/sanity/lib/queries";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModuleLesson = {
    _id: string;
    title: string | null;
};

type Module = {
    _id: string;
    title: string | null;
    description: string | null;
    _createdAt: string;
    lessonCount: number | null;
    lessons: ModuleLesson[] | null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminModulesPage() {
    const { data } = useQuery({ query: ADMIN_MODULES_QUERY }) as { data: Module[] | null };
    const modules = data ?? [];
    const [search, setSearch] = useState("");

    const filtered = modules.filter(
        (m) => !search || m.title?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="space-y-6 pt-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Modules</h1>
                    <p className="mt-0.5 text-sm text-zinc-400">
                        {modules.length} module{modules.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Link
                    href="/admin/modules/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                >

                    Add Module
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search modules…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />
            </div>

            {/* Cards grid */}
            {filtered.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
                    <Layers className="mx-auto h-8 w-8 text-zinc-700" />
                    <p className="mt-3 text-sm text-zinc-500">No modules found</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {filtered.map((mod) => (
                        <AccordionItem
                            key={mod._id}
                            value={mod._id}
                            className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 px-1 transition-all hover:border-zinc-700"
                        >
                            <AccordionTrigger className="flex w-full items-center justify-between p-4 hover:no-underline [&[data-state=open]>div>div>svg]:text-cyan-400">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 transition-colors">
                                        <Layers className="h-5 w-5 text-cyan-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-white text-base">
                                            {mod.title ?? "Untitled"}
                                        </p>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500 font-normal">
                                            <span className="flex items-center gap-1.5">
                                                <PlayCircle className="h-3.5 w-3.5 text-zinc-600" />
                                                {mod.lessonCount ?? 0} lesson{mod.lessonCount !== 1 ? "s" : ""}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(mod._createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="border-t border-zinc-800/50 p-4 text-zinc-400">
                                {mod.description && (
                                    <p className="leading-relaxed whitespace-pre-wrap mb-4">{mod.description}</p>
                                )}

                                {/* Lesson list */}
                                {mod.lessons && mod.lessons.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                            Lessons in this module
                                        </p>
                                        <div className="rounded-lg border border-zinc-800 divide-y divide-zinc-800">
                                            {mod.lessons.filter(Boolean).map((lesson) => (
                                                <div key={lesson._id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                                                    <PlayCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                                                    <span className="text-zinc-300">{lesson.title ?? "Untitled"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="italic text-zinc-600 text-sm">No lessons assigned to this module yet.</p>
                                )}

                                <div className="mt-6 flex gap-3">
                                    <Link
                                        href={`/studio/structure/module/intent/edit/id=${mod._id}`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
                                    >
                                        Edit Module in Studio
                                    </Link>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
}
