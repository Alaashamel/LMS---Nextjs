import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { writeClient } from "@/sanity/lib/write-client";

type ClerkUserData = {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    image_url: string;
    public_metadata: Record<string, unknown>;
};

type ClerkSubscriptionData = {
    id: string;
    user_id?: string;
    userId?: string;
    status: string;
    plan?: {
        id?: string;
        key?: string;
        slug?: string;
        name?: string;
    };
    plan_key?: string;
    plan_id?: string;
};

type WebhookEvent = {
    type: string;
    data: ClerkUserData | ClerkSubscriptionData;
};

function getPrimaryEmail(userData: ClerkUserData): string {
    const primary = userData.email_addresses?.find(
        (e) => e.id === userData.primary_email_address_id
    );
    return primary?.email_address ?? userData.email_addresses?.[0]?.email_address ?? "";
}

function getFullName(userData: ClerkUserData): string {
    const parts = [userData.first_name, userData.last_name].filter(Boolean);
    return parts.join(" ");
}

// Map Clerk plan key/slug to our tier values
function resolvePlan(planKey: string | null | undefined): "free" | "pro" | "ultra" {
    if (!planKey) return "free";
    const lower = planKey.toLowerCase();
    if (lower.includes("ultra")) return "ultra";
    if (lower.includes("pro")) return "pro";
    return "free";
}

async function upsertUser(
    clerkId: string,
    fields: Partial<{
        email: string;
        name: string;
        imageUrl: string;
        plan: "free" | "pro" | "ultra";
        subscriptionStatus: string;
        subscriptionId: string;
        planUpdatedAt: string;
    }>
) {
    const docId = `clerk_${clerkId}`;

    await writeClient
        .transaction()
        .createIfNotExists({
            _id: docId,
            _type: "user",
            clerkId,
            plan: "free",
            subscriptionStatus: "none",
        })
        .patch(docId, (p) => p.set(fields))
        .commit();
}

export async function POST(req: Request) {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("CLERK_WEBHOOK_SECRET is not set");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
    }

    const payload = await req.text();

    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;

    try {
        event = wh.verify(payload, {
            "svix-id": svixId,
            "svix-timestamp": svixTimestamp,
            "svix-signature": svixSignature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const { type, data } = event;
    console.log(`[Clerk Webhook] Event received: ${type}`);

    try {
        // ── User created ──────────────────────────────────────────────────────────
        if (type === "user.created") {
            const user = data as ClerkUserData;
            await upsertUser(user.id, {
                email: getPrimaryEmail(user),
                name: getFullName(user),
                imageUrl: user.image_url,
                plan: "free",
                subscriptionStatus: "none",
            });
            console.log(`[Clerk Webhook] Created user ${user.id} in Sanity`);
        }

        // ── User updated (name/email change, or plan metadata change) ─────────────
        if (type === "user.updated") {
            const user = data as ClerkUserData;
            await upsertUser(user.id, {
                email: getPrimaryEmail(user),
                name: getFullName(user),
                imageUrl: user.image_url,
            });
            console.log(`[Clerk Webhook] Updated user ${user.id} in Sanity`);
        }

        // ── Subscription created ──────────────────────────────────────────────────
        if (type === "subscription.created") {
            const sub = data as ClerkSubscriptionData;
            const userId = sub.user_id ?? sub.userId ?? "";
            const planKey = sub.plan?.key ?? sub.plan?.slug ?? sub.plan_key ?? "";
            const plan = resolvePlan(planKey);

            await upsertUser(userId, {
                plan,
                subscriptionStatus: sub.status ?? "active",
                subscriptionId: sub.id,
                planUpdatedAt: new Date().toISOString(),
            });
            console.log(`[Clerk Webhook] Subscription created for ${userId} → plan: ${plan}`);
        }

        // ── Subscription updated (upgrade / downgrade) ────────────────────────────
        if (type === "subscription.updated") {
            const sub = data as ClerkSubscriptionData;
            const userId = sub.user_id ?? sub.userId ?? "";
            const planKey = sub.plan?.key ?? sub.plan?.slug ?? sub.plan_key ?? "";
            const plan = resolvePlan(planKey);

            await upsertUser(userId, {
                plan,
                subscriptionStatus: sub.status ?? "active",
                subscriptionId: sub.id,
                planUpdatedAt: new Date().toISOString(),
            });
            console.log(`[Clerk Webhook] Subscription updated for ${userId} → plan: ${plan}`);
        }

        // ── Subscription past due ─────────────────────────────────────────────────
        if (type === "subscription.pastDue") {
            const sub = data as ClerkSubscriptionData;
            const userId = sub.user_id ?? sub.userId ?? "";
            await upsertUser(userId, {
                subscriptionStatus: "past_due",
                planUpdatedAt: new Date().toISOString(),
            });
            console.log(`[Clerk Webhook] Subscription past due for ${userId}`);
        }

        // ── Subscription item canceled / ended → downgrade to free ────────────────
        if (type === "subscriptionItem.canceled" || type === "subscriptionItem.ended") {
            const sub = data as ClerkSubscriptionData;
            const userId = sub.user_id ?? sub.userId ?? "";
            await upsertUser(userId, {
                plan: "free",
                subscriptionStatus: "canceled",
                subscriptionId: sub.id,
                planUpdatedAt: new Date().toISOString(),
            });
            console.log(`[Clerk Webhook] ${type} for ${userId} → downgraded to free`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("[Clerk Webhook] Error processing event:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
