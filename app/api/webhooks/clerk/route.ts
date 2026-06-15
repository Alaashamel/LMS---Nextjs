import { createClient } from "@sanity/client";
import { Webhook } from "svix";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ClerkEmailAddress = {
  id?: string;
  email_address?: string;
};

type ClerkWebhookUser = {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  primary_email_address_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
  profile_image_url?: string | null;
};

type ClerkWebhookEvent = {
  type: string;
  data: ClerkWebhookUser;
};

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_API_TOKEN || "",
  useCdn: false,
});

function getPrimaryEmail(data: ClerkWebhookUser): string {
  const emails = Array.isArray(data.email_addresses)
    ? data.email_addresses
    : [];

  const primaryEmail = emails.find(
    (email) => email.id === data.primary_email_address_id
  );

  return (
    primaryEmail?.email_address ||
    emails[0]?.email_address ||
    `${data.id}@placeholder.local`
  );
}

function getFullName(data: ClerkWebhookUser): string {
  const firstName = data.first_name || "";
  const lastName = data.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || data.username || "New Learner";
}

export async function POST(req: Request) {
  const secret =
    process.env.CLERK_WEBHOOK_SECRET ||
    process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Missing Clerk webhook secret" },
      { status: 500 }
    );
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing Sanity API token" },
      { status: 500 }
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.text();

  let event: ClerkWebhookEvent;

  try {
    const webhook = new Webhook(secret);

    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error("Webhook verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  const eventType = event.type;
  const data = event.data;

  try {
    if (eventType === "user.created" || eventType === "user.updated") {
      const email = getPrimaryEmail(data);
      const name = getFullName(data);

      await sanityClient.createOrReplace({
        _id: `user-${data.id}`,
        _type: "user",
        clerkId: data.id,
        email,
        name,
        imageUrl: data.image_url || data.profile_image_url || "",
        plan: "free",
        subscriptionStatus: "inactive",
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        type: eventType,
        userId: data.id,
      });
    }

    if (eventType === "user.deleted") {
      await sanityClient.delete(`user-${data.id}`).catch(() => null);

      return NextResponse.json({
        success: true,
        type: eventType,
        userId: data.id,
      });
    }

    return NextResponse.json({
      success: true,
      ignored: true,
      type: eventType,
    });
  } catch (error) {
    console.error("Webhook handler failed:", error);

    return NextResponse.json(
      {
        error: "Webhook handler failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}