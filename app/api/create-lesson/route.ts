import { writeClient } from "@/sanity/lib/write-client";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, moduleId, muxUploadId } = body;

        if (!title) {
            return NextResponse.json(
                { error: "Title is required" },
                { status: 400 }
            );
        }

        const slug = {
            _type: "slug",
            current: title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, ""),
        };

        // Build the lesson document
        const lessonDoc: any = {
            _type: "lesson",
            title,
            slug,
            description,
        };

        // If a video was uploaded, poll Mux to get the asset ID and create a Sanity mux.videoAsset
        if (muxUploadId) {
            let assetId: string | undefined;
            for (let i = 0; i < 15; i++) {
                const upload = await mux.video.uploads.retrieve(muxUploadId);
                if (upload.asset_id) {
                    assetId = upload.asset_id;
                    break;
                }
                await new Promise((r) => setTimeout(r, 2000));
            }

            if (assetId) {
                const asset = await mux.video.assets.retrieve(assetId);
                const playbackId = asset.playback_ids?.[0]?.id;

                const sanityAsset = await writeClient.create({
                    _type: "mux.videoAsset",
                    status: asset.status,
                    assetId: assetId,
                    playbackId: playbackId || "",
                    data: {
                        aspect_ratio: asset.aspect_ratio || "",
                        duration: asset.duration || 0,
                        playback_ids: asset.playback_ids || [],
                        status: asset.status,
                        id: assetId,
                    },
                });

                lessonDoc.video = {
                    _type: "mux.video",
                    asset: {
                        _type: "reference",
                        _ref: sanityAsset._id,
                    },
                };
            }
        }

        // Create the lesson
        const newLesson = await writeClient.create(lessonDoc);

        // If a module was selected, append this lesson to the module's lessons array
        if (moduleId) {
            await writeClient
                .patch(moduleId)
                .setIfMissing({ lessons: [] })
                .append("lessons", [
                    {
                        _type: "reference",
                        _ref: newLesson._id,
                        _key: newLesson._id,
                    },
                ])
                .commit();
        }

        return NextResponse.json(newLesson);
    } catch (error: any) {
        console.error("Error creating lesson:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create lesson" },
            { status: 500 }
        );
    }
}
