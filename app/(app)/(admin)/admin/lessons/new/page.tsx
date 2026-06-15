import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LessonForm from "./LessonForm";
import { client } from "@/sanity/lib/client";
import { ALL_MODULES_SIMPLE_QUERY } from "@/sanity/lib/queries";

export default async function CreateLessonPage() {
    const modules = await client.fetch(ALL_MODULES_SIMPLE_QUERY);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Link
                    href="/admin/lessons"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Lessons
                </Link>
            </div>

            <LessonForm modules={modules} />
        </div>
    );
}
