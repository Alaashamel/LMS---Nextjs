import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ModuleForm from "./ModuleForm";
import { client } from "@/sanity/lib/client";
import { ALL_LESSONS_WITH_MODULE_QUERY } from "@/sanity/lib/queries";

export default async function CreateModulePage() {
    const availableLessons = await client.fetch(ALL_LESSONS_WITH_MODULE_QUERY);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Link
                    href="/admin/modules"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Modules
                </Link>
            </div>

            <ModuleForm availableLessons={availableLessons} />
        </div>
    );
}
