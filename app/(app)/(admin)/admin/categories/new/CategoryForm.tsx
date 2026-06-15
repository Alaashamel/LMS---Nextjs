"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CategoryForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            icon: formData.get("icon"),
        };

        try {
            const res = await fetch("/api/create-category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create category");
            }

            router.push("/admin/categories");
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                    Create New Category
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                    Fill in the details below to add a new category to your platform.
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
                        Category Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full bg-black h-10 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900"
                        placeholder="e.g. Web Development"
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
                        className="w-full bg-black rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900 resize-none"
                        placeholder="Brief description of what courses fall under this category..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="icon" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Icon Name
                    </label>
                    <input
                        type="text"
                        id="icon"
                        name="icon"
                        className="w-full bg-black h-10 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900"
                        placeholder="e.g. Code, Palette, Database (from lucide-react)"
                    />
                    <p className="text-xs text-zinc-500">
                        Refer to lucide.dev/icons for valid icon names.
                    </p>
                </div>
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
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Category"
                    )}
                </button>
            </div>
        </form>
    );
}
