import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { hasAccessToTier, getUserTier } from "@/lib/user-plan";
import { sanityFetch } from "@/sanity/lib/live";
import { USER_COURSES_QUERY } from "@/sanity/lib/queries";

interface Lesson {
    _id?: string;
    title?: string;
    completedBy?: string[];
    slug?: { current: string };
}
interface Module {
    _id?: string;
    title?: string;
    lessons?: Lesson[];
}
interface Course {
    _id: string;
    title: string;
    tier: string;
    slug?: { current: string };
    modules?: Module[];
}

export async function GET() {
    const canExport = await hasAccessToTier("ultra");
    if (!canExport) {
        return NextResponse.json({ error: "Ultra plan required for data exports" }, { status: 403 });
    }

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = user.id;
    const userTier = await getUserTier();

    const { data: allCourses } = await sanityFetch({
        query: USER_COURSES_QUERY,
        params: { userId },
    });

    const accessChecks = await Promise.all(
        (allCourses as Course[]).map(async (course) => ({
            course,
            hasAccess: await hasAccessToTier(course.tier as any),
        }))
    );
    const courses = accessChecks.filter((x) => x.hasAccess).map((x) => x.course);

    // Build CSV rows
    const rows: string[][] = [];
    rows.push(["Course", "Course Tier", "Module", "Lesson", "Completed"]);

    for (const course of courses) {
        for (const mod of course.modules ?? []) {
            for (const lesson of mod.lessons ?? []) {
                const completed = lesson.completedBy?.includes(userId) ? "Yes" : "No";
                rows.push([
                    course.title ?? "",
                    course.tier ?? "free",
                    mod.title ?? "",
                    lesson.title ?? "",
                    completed,
                ]);
            }
        }
    }

    const csv = rows
        .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
        .join("\r\n");

    const filename = `edunova-export-${user.firstName ?? "user"}-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
