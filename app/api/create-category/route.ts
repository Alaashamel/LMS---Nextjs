import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, icon } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const newCategory = await writeClient.create({
            _type: "category",
            title,
            description,
            icon,
        });

        return NextResponse.json(newCategory);
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create category" },
            { status: 500 }
        );
    }
}
