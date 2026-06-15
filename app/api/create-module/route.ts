import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, lessonIds } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        // Build lesson references array
        const lessons = (lessonIds || []).map((id: string) => ({
            _type: "reference",
            _ref: id,
            _key: id,
        }));

        const newModule = await writeClient.create({
            _type: "module",
            title,
            description,
            ...(lessons.length > 0 && { lessons }),
        });

        return NextResponse.json(newModule);
    } catch (error: any) {
        console.error("Error creating module:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create module" },
            { status: 500 }
        );
    }
}
