import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";
import { TIER_STYLES, Tier } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  PlayCircle,
  Clock,
  ChevronDown,
  ArrowLeft,
  Star,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import MarkCompleteButton from "@/components/MarkCompleteButton";

interface LessonRef {
  _id: string;
  title: string;
  slug?: { current: string };
  completedBy?: string[];
  videoUrl?: string;
  demoVideoUrl?: string;
  durationSeconds?: number;
}

interface ModuleRef {
  _id: string;
  title: string;
  lessons?: LessonRef[];
}

interface CourseRef {
  _id: string;
  title: string;
  slug?: { current: string };
  tier: string;
  modules?: ModuleRef[];
}

interface BlockChild {
  _key?: string;
  _type: string;
  text?: string;
  marks?: string[];
}

interface Block {
  _key?: string;
  _type: string;
  style?: string;
  children?: BlockChild[];
  asset?: { url?: string; _ref?: string };
  alt?: string;
  caption?: string;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "8m preview";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getEmbeddableUrl(url?: string | null): string | null {
  if (!url) return null;

  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "").split("?")[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/").filter(Boolean).pop();
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return url;
  } catch {
    return url;
  }
}

function isDirectVideo(url?: string | null): boolean {
  if (!url) return false;
  return url.startsWith("/") || /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

function DemoVideoShell({
  title,
  courseTitle,
  duration,
}: {
  title: string;
  courseTitle?: string;
  duration?: number;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(34,197,94,0.13),transparent_28%),#020617]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute left-10 top-10 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
        Portfolio Demo Video
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl shadow-primary/10 backdrop-blur">
          <PlayCircle className="h-14 w-14 text-primary" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">
          {courseTitle || "EduNova Lesson"}
        </p>

        <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
          Add a YouTube URL in Sanity Studio to show a real lesson video here.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/35 p-5 backdrop-blur">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Demo playback
          </span>
          <span>{formatDuration(duration)}</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: Block, idx: number): React.ReactNode {
  if (block._type === "image") {
    const src = block.asset?.url;
    if (!src) return null;

    return (
      <figure key={idx} className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={block.alt ?? ""}
          className="w-full rounded-xl object-cover"
        />
        {block.caption && (
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block._type !== "block") return null;

  const children = (block.children ?? []).map((child: BlockChild, ci: number) => {
    const marks = child.marks ?? [];
    let node: React.ReactNode = child.text ?? "";

    if (marks.includes("strong")) node = <strong key={ci}>{node}</strong>;
    if (marks.includes("em")) node = <em key={ci}>{node}</em>;
    if (marks.includes("code")) {
      node = (
        <code key={ci} className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          {node}
        </code>
      );
    }

    return <React.Fragment key={ci}>{node}</React.Fragment>;
  });

  const base = "mb-4";

  switch (block.style ?? "normal") {
    case "h1":
      return (
        <h1 key={idx} className={`${base} mt-8 text-3xl font-bold`}>
          {children}
        </h1>
      );

    case "h2":
      return (
        <h2 key={idx} className={`${base} mt-8 text-2xl font-bold`}>
          {children}
        </h2>
      );

    case "h3":
      return (
        <h3 key={idx} className={`${base} mt-6 text-xl font-semibold`}>
          {children}
        </h3>
      );

    case "blockquote":
      return (
        <blockquote
          key={idx}
          className="my-5 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-muted-foreground"
        >
          {children}
        </blockquote>
      );

    default:
      return (
        <p key={idx} className={`${base} leading-8 text-muted-foreground`}>
          {children}
        </p>
      );
  }
}

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { userId } = await auth();
  const { slug } = await params;

  const { data: lesson } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!lesson) notFound();

  const course = lesson.courses?.[0] as CourseRef | undefined;
  const tier = (course?.tier ?? "free") as Tier;
  const tierStyle = TIER_STYLES[tier] || TIER_STYLES.free;

  const allLessons: LessonRef[] = (course?.modules ?? []).flatMap(
    (module: ModuleRef) => module.lessons ?? []
  );

  const currentIdx = allLessons.findIndex((item) => item.slug?.current === slug);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const isCompleted = lesson.completedBy?.includes(userId ?? "") ?? false;

  const playbackId = lesson.video?.asset?.playbackId;

  const preferredVideoUrl = lesson.videoUrl || lesson.demoVideoUrl;
  const embeddedVideoUrl = getEmbeddableUrl(preferredVideoUrl);

  const duration =
    lesson.video?.asset?.data?.duration ?? lesson.durationSeconds ?? 480;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="sticky top-0 z-30 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 sm:px-6">
          <Link
            href={course?.slug?.current ? `/course/${course.slug.current}` : "/courses"}
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">
              {course?.title ?? "Back to Courses"}
            </span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{lesson.title}</p>
          </div>

          {isCompleted && (
            <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 sm:inline-flex">
              Completed
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-2xl flex-1">
        <main className="min-w-0 flex-1">
          <div className="aspect-video w-full bg-black">
            {embeddedVideoUrl && isDirectVideo(embeddedVideoUrl) ? (
              <video
                className="h-full w-full bg-black object-cover"
                controls
                preload="metadata"
                poster="/window.svg"
              >
                <source src={embeddedVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : embeddedVideoUrl ? (
              <iframe
                src={embeddedVideoUrl}
                className="h-full w-full"
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : playbackId ? (
              <iframe
                src={`https://stream.mux.com/${playbackId}`}
                className="h-full w-full"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <DemoVideoShell
                title={lesson.title}
                courseTitle={course?.title}
                duration={duration}
              />
            )}
          </div>

          <div className="max-w-4xl px-4 py-8 sm:px-8 lg:px-12">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Lesson
                </p>

                <h1 className="mb-3 text-2xl font-bold leading-tight sm:text-4xl">
                  {lesson.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatDuration(duration)}
                  </span>

                  {course && (
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4" />
                      <span
                        className={cn(
                          "bg-gradient-to-r bg-clip-text font-medium text-transparent",
                          tierStyle.gradient
                        )}
                      >
                        {course.title}
                      </span>
                    </span>
                  )}

                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Portfolio-ready content
                  </span>
                </div>
              </div>
            </div>

            {lesson.description && (
              <p className="mb-8 border-b border-border/40 pb-8 text-base leading-8 text-muted-foreground">
                {lesson.description}
              </p>
            )}

            <div className="mb-8">
              <MarkCompleteButton
                lessonId={lesson._id}
                isCompleted={isCompleted}
              />
            </div>

            {lesson.content &&
              Array.isArray(lesson.content) &&
              lesson.content.length > 0 && (
                <div className="prose-custom rounded-3xl border border-border/60 bg-card/40 p-6 shadow-sm">
                  {(lesson.content as Block[]).map((block, idx) =>
                    renderBlock(block, idx)
                  )}
                </div>
              )}

            <div className="mt-12 flex items-center justify-between gap-4 border-t border-border/40 pt-8">
              {prevLesson ? (
                <Link
                  href={`/lesson/${prevLesson.slug?.current ?? prevLesson._id}`}
                  className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <div className="text-left">
                    <p className="mb-0.5 text-xs text-muted-foreground/60">
                      Previous
                    </p>
                    <p className="line-clamp-1 font-medium">{prevLesson.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/lesson/${nextLesson.slug?.current ?? nextLesson._id}`}
                  className="group flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <div>
                    <p className="mb-0.5 text-xs text-muted-foreground/60">
                      Next
                    </p>
                    <p className="line-clamp-1 font-medium">{nextLesson.title}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </main>

        {course && (
          <aside className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-80 flex-col overflow-y-auto border-l border-border/50 bg-card/30 lg:flex xl:w-96">
            <div className="flex-shrink-0 border-b border-border/50 px-5 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Course
              </p>

              <h2 className="line-clamp-2 text-sm font-bold leading-snug">
                {course.title}
              </h2>

              {userId &&
                (() => {
                  const total = allLessons.length;
                  const done = allLessons.filter((item) =>
                    item.completedBy?.includes(userId)
                  ).length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                  return (
                    <div className="mt-3">
                      <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                        <span>
                          {done}/{total} lessons
                        </span>
                        <span
                          className={cn(
                            "bg-gradient-to-r bg-clip-text font-semibold text-transparent",
                            tierStyle.gradient
                          )}
                        >
                          {pct}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                            tierStyle.gradient
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {(course.modules ?? []).map((mod: ModuleRef, modIdx: number) => {
                const lessons = mod.lessons ?? [];
                const hasCurrentLesson = lessons.some(
                  (item) => item.slug?.current === slug
                );

                return (
                  <details
                    key={mod._id}
                    open={hasCurrentLesson || modIdx === 0}
                    className="group border-b border-border/40"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/30 [&::-webkit-details-marker]:hidden">
                      <span
                        className={cn(
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                          tierStyle.gradient
                        )}
                      >
                        {modIdx + 1}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                        {mod.title}
                      </span>

                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>

                    <div className="pb-3">
                      {lessons.map((item, lessonIdx) => {
                        const active = item.slug?.current === slug;
                        const done = item.completedBy?.includes(userId ?? "");

                        return (
                          <Link
                            key={item._id}
                            href={`/lesson/${item.slug?.current ?? item._id}`}
                            className={cn(
                              "flex items-start gap-3 border-l-2 px-5 py-3 text-sm transition-colors",
                              active
                                ? "border-primary bg-primary/5 text-foreground"
                                : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            )}
                          >
                            <span className="pt-0.5">
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-primary/80" />
                              )}
                            </span>

                            <span className="w-7 flex-shrink-0 text-xs text-muted-foreground/60">
                              {modIdx + 1}.{lessonIdx + 1}
                            </span>

                            <span className="line-clamp-2 font-medium">
                              {item.title}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}