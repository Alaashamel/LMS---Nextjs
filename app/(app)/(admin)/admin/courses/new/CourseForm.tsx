"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Layers, Check, Search, X } from "lucide-react";

type Category = {
    _id: string;
    title: string;
};

type Module = {
    _id: string;
    title: string;
};

export default function CourseForm({ categories, modules }: { categories: Category[]; modules: Module[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [moduleSearch, setModuleSearch] = useState("");

    const filteredModules = modules.filter(
        (m) => !moduleSearch || m.title?.toLowerCase().includes(moduleSearch.toLowerCase())
    );

    const toggleModule = (moduleId: string) => {
        setSelectedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        // Append module IDs as JSON since FormData can't handle arrays natively
        formData.set("moduleIds", JSON.stringify(selectedModules));

        try {
            const res = await fetch("/api/create-course", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create course");
            }

            router.push("/admin/courses");
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Create New Course
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                    Fill in the details below to add a new course to your platform.
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
                        Course Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full h-10 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:text-zinc-100"
                        placeholder="e.g. Advanced Next.js Patterns"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="thumbnail" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Course Thumbnail
                    </label>
                    <input
                        type="file"
                        id="thumbnail"
                        name="thumbnail"
                        accept="image/*"
                        className="w-full flex h-10 rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-violet-900/30 dark:file:text-violet-400 cursor-pointer"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:text-zinc-100 resize-none"
                        placeholder="A compelling description of what students will learn..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Category *
                        </label>
                        <select
                            id="category"
                            name="category"
                            required
                            className="w-full bg-black h-10 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900 appearance-none"
                        >
                            <option value="" disabled className="text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                                Select a category
                            </option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id} className="dark:bg-zinc-900 dark:text-zinc-100">
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tier" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Access Tier *
                        </label>
                        <select
                            id="tier"
                            name="tier"
                            required
                            defaultValue="free"
                            className="w-full h-10 rounded-md border border-zinc-200 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900 appearance-none"
                        >
                            <option value="free" className="dark:bg-zinc-900 dark:text-zinc-100">Free</option>
                            <option value="pro" className="dark:bg-zinc-900 dark:text-zinc-100">Pro</option>
                            <option value="ultra" className="dark:bg-zinc-900 dark:text-zinc-100">Ultra</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        className="h-4 w-4 rounded border-zinc-200 text-violet-600 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900 accent-violet-600"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Feature this course on the homepage
                    </label>
                </div>

                {/* Module picker */}
                {modules.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                <span className="flex items-center gap-1.5">
                                    <Layers className="w-4 h-4 text-violet-500" />
                                    Assign Modules
                                </span>
                            </label>
                            {selectedModules.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-500/15 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
                                    {selectedModules.length} selected
                                </span>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search modules…"
                                value={moduleSearch}
                                onChange={(e) => setModuleSearch(e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                            />
                        </div>

                        {/* Grid list */}
                        <div className="max-h-52 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700 p-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {filteredModules.length === 0 ? (
                                    <p className="col-span-2 py-4 text-center text-xs text-zinc-500">No modules match your search</p>
                                ) : (
                                    filteredModules.map((mod) => {
                                        const isSelected = selectedModules.includes(mod._id);
                                        return (
                                            <button
                                                key={mod._id}
                                                type="button"
                                                onClick={() => toggleModule(mod._id)}
                                                className={`flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-all ${isSelected
                                                    ? "bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-500/30"
                                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                                                    }`}
                                            >
                                                <div
                                                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors ${isSelected
                                                        ? "bg-violet-600 text-white"
                                                        : "border border-zinc-300 dark:border-zinc-600"
                                                        }`}
                                                >
                                                    {isSelected && <Check className="h-2.5 w-2.5" />}
                                                </div>
                                                <span className="truncate text-xs font-medium">{mod.title}</span>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Selected summary pills */}
                        {selectedModules.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {selectedModules.map((id) => {
                                    const mod = modules.find((m) => m._id === id);
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => toggleModule(id)}
                                            className="inline-flex items-center gap-1 rounded-full bg-violet-100 dark:bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-500/25 transition-colors"
                                        >
                                            {mod?.title}
                                            <X className="h-3 w-3 ml-0.5" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
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
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Course"
                    )}
                </button>
            </div>
        </form>
    );
}
