# LMS Next.js Platform
# try from here => 
https://lms-nextjs-peach.vercel.app/

A modern learning management platform with course pages, admin areas, Sanity Studio, Mux upload route structure, Clerk auth, and analytics pages.

## Highlights

- Course and module structure
- Admin dashboard pages
- Analytics and support pages
- Sanity Studio integration
- Mux upload API route
- Clerk-based auth structure
- Export and content-management routes

## Tech Stack

Next.js, React, TypeScript, Tailwind CSS, Clerk, Sanity, Mux.

## Run Locally

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Environment

Fill `.env.local` from `.env.example`. Sanity, Clerk, and Mux are required for full content/video/auth features.

## Portfolio Notes

This project is strong for education/platform work because it shows content modeling, admin flows, video infrastructure, and dashboard UX.
