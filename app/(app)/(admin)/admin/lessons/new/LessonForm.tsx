"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, VideoIcon, CheckCircle, UploadCloud, X, Layers } from "lucide-react";

type Module = {
    _id: string;
    title: string;
};

export default function LessonForm({ modules }: { modules: Module[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [muxUploadId, setMuxUploadId] = useState("");
    const [videoFileName, setVideoFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingVideo(true);
        setUploadProgress(0);
        setVideoFileName(file.name);
        setError("");

        try {
            const res = await fetch("/api/mux-upload", { method: "POST" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to get upload URL");
            }

            const { url, uploadId } = data;

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("PUT", url);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(percent);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error("Upload failed"));
                xhr.send(file);
            });

            setMuxUploadId(uploadId);
        } catch (err: any) {
            console.error("Video upload error:", err);
            setError(err.message || "Failed to upload video");
            setVideoFileName("");
        } finally {
            setUploadingVideo(false);
        }
    };

    const clearVideo = () => {
        setMuxUploadId("");
        setVideoFileName("");
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            moduleId: formData.get("moduleId") || undefined,
            muxUploadId: muxUploadId || undefined,
        };

        try {
            const res = await fetch("/api/create-lesson", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to create lesson");
            }

            router.push("/admin/lessons");
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Create New Lesson
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                    Create a new lesson and assign it to a module.
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
                        Lesson Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full bg-black h-10 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900"
                        placeholder="e.g. Setting up the development environment"
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
                        className="w-full bg-black rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900 resize-none"
                        placeholder="Brief overview of what this lesson covers..."
                    />
                </div>

                {/* Module selector */}
                <div className="space-y-2">
                    <label htmlFor="moduleId" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        <span className="flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-cyan-500" />
                            Assign to Module *
                        </span>
                    </label>
                    <select
                        id="moduleId"
                        name="moduleId"
                        required
                        className="w-full bg-black h-10 rounded-md border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-zinc-800 dark:text-zinc-100 dark:bg-zinc-900 appearance-none"
                    >
                        <option value="" className="dark:bg-zinc-900 dark:text-zinc-400">
                            Select a module
                        </option>
                        {modules.map((mod) => (
                            <option key={mod._id} value={mod._id} className="dark:bg-zinc-900 dark:text-zinc-100">
                                {mod.title}
                            </option>
                        ))}
                    </select>
                    {modules.length === 0 && (
                        <p className="text-xs text-amber-500">
                            No modules found. Create a module first before adding lessons.
                        </p>
                    )}
                </div>

                {/* Video upload */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-4">
                        <VideoIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Lesson Video (Optional)
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        {!muxUploadId && !uploadingVideo && (
                            <label
                                htmlFor="video-upload"
                                className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group"
                            >
                                <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-sm text-zinc-500 group-hover:text-emerald-500 transition-colors">
                                    Click to select a video file
                                </span>
                                <span className="text-xs text-zinc-400">
                                    MP4, MOV, WebM supported
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="video-upload"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {uploadingVideo && (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                    <span>Uploading {videoFileName}...</span>
                                </div>
                                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-zinc-400">{uploadProgress}% complete — please wait...</p>
                            </div>
                        )}

                        {muxUploadId && !uploadingVideo && (
                            <div className="flex items-center justify-between gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{videoFileName} uploaded successfully!</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={clearVideo}
                                    className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                                    title="Remove video"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
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
                    disabled={loading || uploadingVideo}
                    className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        "Create Lesson"
                    )}
                </button>
            </div>
        </form>
    );
}
