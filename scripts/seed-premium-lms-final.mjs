import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';

function loadEnv(file = '.env.local') {
  const full = path.resolve(process.cwd(), file);
  if (!fs.existsSync(full)) throw new Error(`Missing ${file}. Add Sanity env values first.`);
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const slugify = (value) => value.toLowerCase().replace(/ai\/ml/g, 'ai-ml').replace(/c#/g, 'csharp').replace(/\.net/g, 'dotnet').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const keyify = (value) => slugify(String(value)).slice(0, 45) || Math.random().toString(36).slice(2);
const ref = (id, key = id) => ({ _type: 'reference', _ref: id, _key: keyify(key) });
const slug = (title) => ({ _type: 'slug', current: slugify(title) });
const span = (text, marks = []) => ({ _type: 'span', _key: keyify(text + Math.random()), text, marks });
const block = (text, style = 'normal') => ({ _type: 'block', _key: keyify(text + style + Math.random()), style, markDefs: [], children: [span(text)] });
const bullet = (text) => ({ _type: 'block', _key: keyify(text + Math.random()), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span(text)] });

const categories = [
  { _id: 'category-full-stack', _type: 'category', title: 'Full-Stack', description: 'Modern frontend, backend, APIs, auth, and deployment.', icon: 'code' },
  { _id: 'category-ai-ml', _type: 'category', title: 'AI / ML', description: 'Applied AI, model thinking, data preparation, and AI product UX.', icon: 'brain' },
  { _id: 'category-data', _type: 'category', title: 'Data Analytics', description: 'KPIs, charts, dashboards, insights, and data storytelling.', icon: 'bar-chart-3' },
  { _id: 'category-security', _type: 'category', title: 'Cyber Security', description: 'Secure auth, webhooks, input validation, and deployment safety.', icon: 'shield-check' },
];

const courseVideo = {
  'nextjs-full-stack-saas-mastery': '/videos/nextjs-saas.mp4',
  'react-frontend-architecture': '/videos/react-architecture.mp4',
  'ai-ml-product-engineering': '/videos/ai-ml-product.mp4',
  'nodejs-backend-api-engineering': '/videos/node-api.mp4',
  'data-analytics-dashboarding': '/videos/analytics-dashboard.mp4',
  'secure-web-apps-foundations': '/videos/secure-web.mp4',
};

const courses = [
  {
    id: 'course-nextjs-full-stack-saas-mastery',
    key: 'nextjs-full-stack-saas-mastery',
    title: 'Next.js Full-Stack SaaS Mastery',
    category: 'category-full-stack',
    description: 'Build a production-style SaaS platform with App Router, layouts, server/client boundaries, Clerk auth, Sanity content, and Vercel deployment workflow.',
    modules: [
      ['App Router Foundations', 'Understand the architecture behind modern Next.js apps.', ['Project Setup & Architecture', 'Routing, Layouts & Metadata', 'Server vs Client Components', 'Data Fetching Strategy']],
      ['Authentication & Dashboard UX', 'Build a polished learner journey around auth and dashboard state.', ['Clerk Authentication Flow', 'Protected Routes & Middleware', 'Dashboard Personalization', 'Webhook User Sync']],
      ['Production Delivery', 'Prepare the project for GitHub, portfolio, and Vercel.', ['Environment Variables', 'Performance Checklist', 'Deployment Workflow', 'README Case Study']],
    ],
  },
  {
    id: 'course-react-frontend-architecture',
    key: 'react-frontend-architecture',
    title: 'React Frontend Architecture',
    category: 'category-full-stack',
    description: 'Learn how to structure reusable React UI, handle state clearly, design component systems, and make frontend code easier to maintain in real products.',
    modules: [
      ['Component Systems', 'Build UI as a clear system instead of scattered components.', ['Reusable Component Design', 'Smart vs Presentational Components', 'Form UI Patterns', 'Loading, Empty & Error States']],
      ['State & Interaction', 'Manage complex UI interaction without messy logic.', ['Local State Strategy', 'Filtering & Search UX', 'Modal & Drawer Patterns', 'Optimistic UI Thinking']],
      ['Polish & Responsive UI', 'Make the frontend feel premium on every device.', ['Responsive Layout Systems', 'Microinteractions', 'Typography & Hierarchy', 'Frontend Code Review']],
    ],
  },
  {
    id: 'course-ai-ml-product-engineering',
    key: 'ai-ml-product-engineering',
    title: 'AI/ML Product Engineering',
    category: 'category-ai-ml',
    description: 'Move beyond notebooks by understanding how AI/ML features become real user-facing products with evaluation, inference UX, and deployment constraints.',
    modules: [
      ['ML Workflow Basics', 'Build the practical mental model of ML projects.', ['Problem Framing', 'Dataset Design', 'Training & Evaluation', 'Model Limitations']],
      ['AI Features in Web Apps', 'Connect AI output with reliable frontend experiences.', ['AI Assistant UX', 'Prediction Dashboards', 'Human-in-the-Loop Review', 'API Integration Pattern']],
      ['Portfolio AI Case Study', 'Present AI projects like a product engineer.', ['Choosing a Strong AI Project', 'Explaining Technical Decisions', 'Deployment Constraints', 'Final AI Demo Checklist']],
    ],
  },
  {
    id: 'course-nodejs-backend-api-engineering',
    key: 'nodejs-backend-api-engineering',
    title: 'Node.js Backend API Engineering',
    category: 'category-full-stack',
    description: 'Design backend APIs with clean routing, validation, database thinking, auth boundaries, error handling, and production-ready structure.',
    modules: [
      ['API Foundations', 'Create APIs that are easy to consume and maintain.', ['REST Resource Design', 'Controllers & Services', 'Validation Strategy', 'Consistent API Responses']],
      ['Auth & Database Logic', 'Connect authenticated users with persisted data safely.', ['Auth Boundary', 'Database Relationships', 'Progress Tracking', 'Admin Operations']],
      ['Production API Quality', 'Improve API reliability and maintainability.', ['Error Handling', 'Logging & Debugging', 'Performance Basics', 'Backend README']],
    ],
  },
  {
    id: 'course-data-analytics-dashboarding',
    key: 'data-analytics-dashboarding',
    title: 'Data Analytics Dashboarding',
    category: 'category-data',
    description: 'Turn raw metrics into business dashboards with clean KPIs, filters, trend interpretation, visual hierarchy, and insight-focused storytelling.',
    modules: [
      ['Dashboard Thinking', 'Understand what makes dashboards useful.', ['Choosing KPIs', 'Data Cleaning Basics', 'Aggregation Logic', 'Insight Writing']],
      ['Visual Design', 'Build dashboards that users can scan quickly.', ['KPI Cards', 'Charts Without Noise', 'Filters & Time Ranges', 'Dashboard Empty States']],
      ['Portfolio Analytics Project', 'Turn a dashboard into a strong portfolio story.', ['Data Model for Dashboards', 'Performance Rendering', 'Dashboard Case Study', 'Final Dashboard Review']],
    ],
  },
  {
    id: 'course-secure-web-apps-foundations',
    key: 'secure-web-apps-foundations',
    title: 'Secure Web Apps Foundations',
    category: 'category-security',
    description: 'Learn practical security thinking for full-stack developers: authentication risks, input validation, secrets, access control, and deployment habits.',
    modules: [
      ['Security Mindset', 'Think like an engineer who builds resilient apps.', ['Threat Modeling Basics', 'Authentication Risks', 'Authorization Rules', 'Secrets Handling']],
      ['Secure Input & Data', 'Protect apps from unsafe input and bad data flows.', ['Validation & Sanitization', 'Webhooks Security', 'File Upload Risks', 'Error Message Safety']],
      ['Deployment Security', 'Ship safely with a practical launch checklist.', ['CORS & Allowed Origins', 'Production Keys', 'Monitoring & Audit Logs', 'Security Checklist']],
    ],
  },
];

function lessonContent({ title, course, module, index }) {
  return [
    block(title, 'h2'),
    block(`In this lesson, you will learn how ${title.toLowerCase()} fits inside ${course}. The focus is practical implementation, clear architecture, and portfolio-ready explanation.`),
    block('Learning outcomes', 'h3'),
    bullet(`Understand the main concept behind ${title}.`),
    bullet(`Connect the concept to the ${module} module.`),
    bullet('Apply the idea in a small real-world implementation step.'),
    bullet('Document the challenge and solution clearly for GitHub and portfolio review.'),
    block('Engineering note', 'h3'),
    block(`A strong portfolio project is not only about UI. It should show why decisions were made, how edge cases are handled, and how the feature would scale in a production team.`),
    block(`Mini task: create a small commit that applies this lesson, then write two lines in the README explaining the problem, the solution, and what you learned.`, 'blockquote'),
    block(`Lesson ${index} is designed as a practical video-backed step, so recruiters can quickly understand the depth behind the project.`),
  ];
}

async function deleteOldContent() {
  const ids = await client.fetch(`*[_type in ["course", "module", "lesson", "category"]]._id`);
  if (!ids.length) return;
  console.log(`Deleting ${ids.length} old content documents...`);
  for (let i = 0; i < ids.length; i += 100) {
    const tx = client.transaction();
    ids.slice(i, i + 100).forEach((id) => tx.delete(id));
    await tx.commit();
  }
}

async function seed() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local');
  }

  console.log('Seeding final portfolio LMS content...');
  await deleteOldContent();

  const docs = [...categories];

  for (const course of courses) {
    const moduleRefs = [];
    let absoluteLessonIndex = 1;

    course.modules.forEach(([moduleTitle, moduleDescription, lessonTitles], moduleIndex) => {
      const moduleId = `${course.id}-module-${moduleIndex + 1}`;
      const lessonRefs = [];

      lessonTitles.forEach((lessonTitle, lessonIndex) => {
        const lessonId = `${moduleId}-lesson-${lessonIndex + 1}`;
        lessonRefs.push(ref(lessonId, `${moduleId}-lesson-ref-${lessonIndex + 1}`));

        docs.push({
          _id: lessonId,
          _type: 'lesson',
          title: lessonTitle,
          slug: slug(`${course.title} ${moduleTitle} ${lessonTitle}`),
          description: `A practical lesson about ${lessonTitle.toLowerCase()} with a portfolio-ready explanation and implementation mindset.`,
          demoVideoUrl: courseVideo[course.key],
          durationSeconds: 420 + absoluteLessonIndex * 22,
          content: lessonContent({ title: lessonTitle, course: course.title, module: moduleTitle, index: absoluteLessonIndex }),
          completedBy: [],
        });

        absoluteLessonIndex += 1;
      });

      moduleRefs.push(ref(moduleId, `${course.id}-module-ref-${moduleIndex + 1}`));
      docs.push({
        _id: moduleId,
        _type: 'module',
        title: moduleTitle,
        description: moduleDescription,
        lessons: lessonRefs,
        completedBy: [],
      });
    });

    docs.push({
      _id: course.id,
      _type: 'course',
      title: course.title,
      slug: slug(course.title),
      description: course.description,
      category: ref(course.category, `${course.id}-category-ref`),
      tier: 'free',
      featured: true,
      modules: moduleRefs,
      completedBy: [],
    });
  }

  console.log(`Creating ${docs.length} documents...`);
  for (let i = 0; i < docs.length; i += 100) {
    const tx = client.transaction();
    docs.slice(i, i + 100).forEach((doc) => tx.createOrReplace(doc));
    await tx.commit();
  }

  const stats = await client.fetch(`{
    "courses": count(*[_type == "course"]),
    "modules": count(*[_type == "module"]),
    "lessons": count(*[_type == "lesson"]),
    "categories": count(*[_type == "category"])
  }`);

  console.log('Done ✅');
  console.log(stats);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
