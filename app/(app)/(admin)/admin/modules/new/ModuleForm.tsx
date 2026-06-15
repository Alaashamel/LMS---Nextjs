"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PlayCircle, Check, Search } from "lucide-react";

type Lesson = {
    _id: string;
    title: string;
    currentModule: { _id: string; title: string } | null;
};

export default function ModuleForm({ availableLessons }: { availableLessons: Lesson[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
    const [lessonSearch, setLessonSearch] = useState("");

    const filteredLessons = availableLessons.filter(
        (l) => !lessonSearch || l.title?.toLowerCase().includes(lessonSearch.toLowerCase())
    );

    const toggleLesson = (lessonId: string) => {
        setSelectedLessons((prev) =>
            prev.includes(lessonId)
                ? prev.filter((id) => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            lessonIds: selectedLessons,
        };

        try {
            const res = await fetch("/api/create-module", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create module");
            }

            router.push("/admin/modules");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                    Create New Module
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                    Fill in the details and optionally assign existing lessons.
                </p>
            </div>

            {error && (
                <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Module Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full bg-black h-10 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900"
                        placeholder="e.g. Introduction to React"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="w-full bg-black rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900 resize-none"
                        placeholder="Brief overview of what this module covers..."
                    />
                </div>

                {/* Lesson picker */}
                {availableLessons.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Assign Lessons
                            </label>
                            {selectedLessons.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-cyan-100 dark:bg-cyan-500/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                                    {selectedLessons.length} selected
                                </span>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search lessons…"
                                value={lessonSearch}
                                onChange={(e) => setLessonSearch(e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                            />
                        </div>

                        {/* Lesson list */}
                        <div className="max-h-52 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredLessons.length === 0 ? (
                                <p className="py-4 text-center text-xs text-zinc-500">No lessons match your search</p>
                            ) : (
                                filteredLessons.map((lesson) => {
                                    const isSelected = selectedLessons.includes(lesson._id);
                                    return (
                                        <button
                                            key={lesson._id}
                                            type="button"
                                            onClick={() => toggleLesson(lesson._id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${isSelected
                                                    ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                                                }`}
                                        >
                                            <div
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${isSelected
                                                        ? "bg-cyan-600 border-cyan-600 text-white"
                                                        : "border-zinc-300 dark:border-zinc-600"
                                                    }`}
                                            >
                                                {isSelected && <Check className="h-3 w-3" />}
                                            </div>
                                            <PlayCircle className="h-4 w-4 shrink-0 text-zinc-400" />
                                            <div className="min-w-0 flex-1">
                                                <span className="truncate block">{lesson.title}</span>
                                                {lesson.currentModule && (
                                                    <span className="text-xs text-zinc-500">
                                                        Currently in: {lesson.currentModule.title}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 mt-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Module"
                    )}
                </button>
            </div>
        </form>
    );
}
