import { client } from "@/sanity/lib/client";
import { ADMIN_CATEGORIES_QUERY, ALL_MODULES_SIMPLE_QUERY } from "@/sanity/lib/queries";
import CourseForm from "./CourseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CreateCoursePage() {
    const [categories, modules] = await Promise.all([
        client.fetch(ADMIN_CATEGORIES_QUERY),
        client.fetch(ALL_MODULES_SIMPLE_QUERY),
    ]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Link
                    href="/admin/courses"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Courses
                </Link>
            </div>

            <CourseForm categories={categories} modules={modules} />
        </div>
    );
}