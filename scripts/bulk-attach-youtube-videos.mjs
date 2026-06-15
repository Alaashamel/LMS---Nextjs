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

const videoMap = {
  // COURSE 1: Next.js Full-Stack SaaS Mastery
  "Project Setup & Architecture": "https://www.youtube.com/watch?v=tI_Nt32_4wM",
  "Routing, Layouts & Metadata": "https://www.youtube.com/watch?v=_EgI9WH8q1A",
  "Server vs Client Components": "https://www.youtube.com/watch?v=_EgI9WH8q1A",
  "Data Fetching Strategy": "https://www.youtube.com/watch?v=k7o9R6eaSes",
  "Clerk Authentication Flow": "https://www.youtube.com/watch?v=pjFbcXi8eCM",
  "Dashboard Personalization": "https://www.youtube.com/watch?v=6sfiAyKy8Jo",
  "Webhook User Sync": "https://www.youtube.com/watch?v=PhciU8SQ8hs",
  "Error Handling & Empty States": "https://www.youtube.com/watch?v=k7o9R6eaSes",
  "Environment Variables": "https://www.youtube.com/watch?v=tI_Nt32_4wM",
  "Performance Checklist": "https://www.youtube.com/watch?v=tI_Nt32_4wM",
  "Deployment Workflow": "https://www.youtube.com/watch?v=XvevPyM90K0",
  "README & Portfolio Presentation": "https://www.youtube.com/watch?v=k7o9R6eaSes",

  // COURSE 2: React Frontend Architecture
  "Designing Reusable Components": "https://www.youtube.com/watch?v=1_Cu-yMQru8",
  "Smart vs Presentational Components": "https://www.youtube.com/watch?v=1_Cu-yMQru8",
  "Form UI Patterns": "https://www.youtube.com/watch?v=iALhYjjT528",
  "Loading, Empty & Error States": "https://www.youtube.com/watch?v=WbV3zRgpw_E",
  "Local State Strategy": "https://www.youtube.com/watch?v=1_Cu-yMQru8",
  "Filtering & Search UX": "https://www.youtube.com/watch?v=uGnh1NnlEbQ",
  "Modal & Drawer Patterns": "https://www.youtube.com/watch?v=5cvg2qZwYrI",
  "Optimistic UI Thinking": "https://www.youtube.com/watch?v=WbV3zRgpw_E",
  "Responsive Layout Systems": "https://www.youtube.com/watch?v=WbV3zRgpw_E",
  "Microinteractions": "https://www.youtube.com/watch?v=fNNsuIL6WdU",
  "Typography & Visual Hierarchy": "https://www.youtube.com/watch?v=LMagNcngvcU",
  "Frontend Code Review": "https://www.youtube.com/watch?v=LMagNcngvcU",

  // COURSE 3: AI/ML Product Engineering
  "Problem Framing": "https://www.youtube.com/watch?v=IfW1FMDkw4k",
  "Dataset Design": "https://www.youtube.com/watch?v=qMklyZxv3EM",
  "Training & Evaluation": "https://www.youtube.com/watch?v=rysdr4khB5k",
  "Model Limitations": "https://www.youtube.com/watch?v=rysdr4khB5k",
  "AI Assistant UX": "https://www.youtube.com/watch?v=nJ25yl34Uqw",
  "Prediction Dashboards": "https://www.youtube.com/watch?v=qMklyZxv3EM",
  "Human-in-the-Loop": "https://www.youtube.com/watch?v=w7vqXL4PWEE",
  "API Integration Pattern": "https://www.youtube.com/watch?v=nJ25yl34Uqw",
  "Choosing a Strong AI Project": "https://www.youtube.com/watch?v=IfW1FMDkw4k",
  "Explaining Technical Decisions": "https://www.youtube.com/watch?v=9iN-cPnp7xg",
  "Deployment Constraints": "https://www.youtube.com/watch?v=o6vbe5G7xNo",
  "Final AI Demo Checklist": "https://www.youtube.com/watch?v=o6vbe5G7xNo",

  // COURSE 4: Node.js Backend API Engineering
  "REST Resource Design": "https://www.youtube.com/watch?v=yD7X1qJA5nA",
  "Controllers & Services": "https://www.youtube.com/watch?v=yD7X1qJA5nA",
  "Validation Strategy": "https://www.youtube.com/watch?v=OezCC-BMZLw",
  "Consistent API Responses": "https://www.youtube.com/watch?v=yD7X1qJA5nA",
  "Auth Boundary": "https://www.youtube.com/watch?v=qylGaki0JhY",
  "Database Relationships": "https://www.youtube.com/watch?v=J_8JwC06LTo",
  "Progress Tracking": "https://www.youtube.com/watch?v=TYB-Lz8YGFk",
  "Admin Operations": "https://www.youtube.com/watch?v=TYB-Lz8YGFk",
  "Error Handling": "https://www.youtube.com/watch?v=mGPj-pCGS2c",
  "Logging & Debugging": "https://www.youtube.com/watch?v=yD7X1qJA5nA",
  "Performance Basics": "https://www.youtube.com/watch?v=yD7X1qJA5nA",
  "Backend README": "https://www.youtube.com/watch?v=yD7X1qJA5nA",

  // COURSE 5: Data Analytics Dashboarding
  "Choosing KPIs": "https://www.youtube.com/watch?v=MTlQvyNQ3PM",
  "Data Cleaning Basics": "https://www.youtube.com/watch?v=qrbf9DtR3_c",
  "Aggregation Logic": "https://www.youtube.com/watch?v=664IeNZ3TXk",
  "Insight Writing": "https://www.youtube.com/watch?v=hm4Iq2Mm2pQ",
  "KPI Cards": "https://www.youtube.com/watch?v=MTlQvyNQ3PM",
  "Charts Without Noise": "https://www.youtube.com/watch?v=hm4Iq2Mm2pQ",
  "Filters & Time Ranges": "https://www.youtube.com/watch?v=MTcPR0lfPNM",
  "Dashboard Empty States": "https://www.youtube.com/watch?v=8owuRQcSHH8",
  "Data Model for Dashboards": "https://www.youtube.com/watch?v=TK0CJBaqvnY",
  "Performance Rendering": "https://www.youtube.com/watch?v=8owuRQcSHH8",
  "Dashboard Case Study": "https://www.youtube.com/watch?v=hm4Iq2Mm2pQ",
  "Final Dashboard Review": "https://www.youtube.com/watch?v=MTlQvyNQ3PM",

  // COURSE 6: Secure Web Apps Foundations
  "Threat Modeling Basics": "https://www.youtube.com/watch?v=m1gKcr4RCF4",
  "Authentication Risks": "https://www.youtube.com/watch?v=27X_pBMZZ5g",
  "Authorization Rules": "https://www.youtube.com/watch?v=kCRYqHPZVzQ",
  "Secrets Handling": "https://www.youtube.com/watch?v=-GfSbk_VqSk",
  "Validation & Sanitization": "https://www.youtube.com/watch?v=YYe0FdfdgDU",
  "Webhooks Security": "https://www.youtube.com/watch?v=pjFbcXi8eCM",
  "File Upload Risks": "https://www.youtube.com/watch?v=Jzr0Jdnq_EI",
  "Error Message Safety": "https://www.youtube.com/watch?v=mGPj-pCGS2c",
  "CORS & Allowed Origins": "https://www.youtube.com/watch?v=yJNZ0h8uB2k",
  "Production Keys": "https://www.youtube.com/watch?v=XvevPyM90K0",
  "Monitoring & Audit Logs": "https://www.youtube.com/watch?v=yD7X1qJA5nA",
  "Security Checklist": "https://www.youtube.com/watch?v=Jzr0Jdnq_EI",
};

async function main() {
  const titles = Object.keys(videoMap);

  const lessons = await client.fetch(
    `*[_type == "lesson" && title in $titles]{
      _id,
      title,
      videoUrl
    }`,
    { titles }
  );

  console.log(`Found ${lessons.length} matching lessons in Sanity.`);
  console.log(`Video map contains ${titles.length} lesson titles.`);

  const foundTitles = new Set(lessons.map((lesson) => lesson.title));
  const missingTitles = titles.filter((title) => !foundTitles.has(title));

  if (missingTitles.length > 0) {
    console.log("\nMissing titles in Sanity:");
    for (const title of missingTitles) {
      console.log(`- ${title}`);
    }
  }

  if (lessons.length === 0) {
    console.log("No lessons matched. Check lesson titles in Sanity.");
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const lesson of lessons) {
    const url = videoMap[lesson.title];

    if (!url) {
      skipped++;
      continue;
    }

    if (lesson.videoUrl === url) {
      skipped++;
      continue;
    }

    await client
      .patch(lesson._id)
      .set({ videoUrl: url })
      .commit();

    updated++;
    console.log(`Updated: ${lesson.title}`);
  }

  console.log("\nDone ✅");
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});