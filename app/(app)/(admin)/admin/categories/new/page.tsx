import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "./CategoryForm";

export default function CreateCategoryPage() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <Link
                    href="/admin/categories"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                </Link>
            </div>

            <CategoryForm />
        </div>
    );
}
