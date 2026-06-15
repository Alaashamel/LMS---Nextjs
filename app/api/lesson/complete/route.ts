import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let lessonId: string;
    try {
        const body = await req.json();
        lessonId = body.lessonId;
        if (!lessonId) throw new Error('Missing lessonId');
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    try {
        await writeClient
            .patch(lessonId)
            .setIfMissing({ completedBy: [] })
            .insert('after', 'completedBy[-1]', [userId])
            .commit({ autoGenerateArrayKeys: true });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[lesson/complete] Sanity patch error:', err);
        return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
    }
}
