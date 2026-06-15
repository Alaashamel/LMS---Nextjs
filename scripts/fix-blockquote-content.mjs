import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

function loadEnv(file = ".env.local") {
  const full = path.resolve(process.cwd(), file);

  if (!fs.existsSync(full)) {
    throw new Error("Missing .env.local file");
  }

  const lines = fs.readFileSync(full, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function normalizePortableText(blocks = []) {
  return blocks.map((block) => {
    if (block?._type === "block" && block.style === "blockquote") {
      return {
        ...block,
        style: "normal",
      };
    }

    return block;
  });
}

async function main() {
  const lessons = await client.fetch(`
    *[_type == "lesson" && defined(content)] {
      _id,
      content
    }
  `);

  console.log(`Found ${lessons.length} lessons with content.`);

  let updated = 0;

  for (const lesson of lessons) {
    const normalized = normalizePortableText(lesson.content);

    const changed =
      JSON.stringify(normalized) !== JSON.stringify(lesson.content);

    if (!changed) continue;

    await client
      .patch(lesson._id)
      .set({ content: normalized })
      .commit();

    updated++;
    console.log(`Fixed: ${lesson._id}`);
  }

  console.log(`Done ✅ Updated ${updated} lessons.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});