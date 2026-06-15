import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST() {
    try {
        const upload = await mux.video.uploads.create({
            cors_origin: "*",
            new_asset_settings: {
                playback_policy: ["public"],
                video_quality: "basic",
            },
        });

        return NextResponse.json({
            url: upload.url,
            uploadId: upload.id,
        });
    } catch (error: any) {
        console.error("Error creating Mux upload:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create Mux upload URL" },
            { status: 500 }
        );
    }
}
