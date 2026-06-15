import { ArrowRight, Clock, BookOpen, Sparkles } from "lucide-react";
import { TIER_STYLES, Tier } from "@/lib/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  tier: string;
  featured: boolean;
  thumbnail?: {
    asset?: {
      _id: string;
      url: string;
    };
  };
  moduleCount: number;
  lessonCount: number;
  category?: {
    title: string;
  };
}

interface CourseListProps {
  courses: Course[];
  userTier: Tier;
}

const coverStyles = [
  {
    gradient: "from-blue-600/45 via-cyan-500/20 to-slate-950",
    accent: "bg-blue-400",
    label: "Full-Stack",
  },
  {
    gradient: "from-emerald-500/45 via-teal-400/20 to-slate-950",
    accent: "bg-emerald-400",
    label: "React",
  },
  {
    gradient: "from-violet-500/45 via-fuchsia-400/20 to-slate-950",
    accent: "bg-violet-400",
    label: "AI/ML",
  },
  {
    gradient: "from-amber-500/45 via-orange-400/20 to-slate-950",
    accent: "bg-amber-300",
    label: "Backend",
  },
  {
    gradient: "from-sky-500/45 via-indigo-400/20 to-slate-950",
    accent: "bg-sky-300",
    label: "Data",
  },
  {
    gradient: "from-rose-500/45 via-red-400/20 to-slate-950",
    accent: "bg-rose-300",
    label: "Security",
  },
];

function getCoverStyle(course: Course) {
  const value = `${course.title}-${course.category?.title ?? ""}`;
  const sum = value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return coverStyles[sum % coverStyles.length];
}

function CourseCover({ course }: { course: Course }) {
  if (course.thumbnail?.asset?.url) {
    return (
      <img
        src={course.thumbnail.asset.url}
        alt={course.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  const style = getCoverStyle(course);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br", style.gradient)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.14),transparent_24%)]" />
      <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full border border-white/20 bg-white/5 blur-sm" />
      <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full border border-white/10 bg-white/5 blur-sm" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            {course.category?.title ?? style.label}
          </span>
          <Sparkles className="h-5 w-5 text-white/70" />
        </div>

        <div>
          <div className={cn("mb-4 h-1.5 w-16 rounded-full", style.accent)} />
          <h4 className="max-w-[16rem] text-2xl font-black leading-tight text-white drop-shadow">
            {course.title}
          </h4>
          <p className="mt-2 text-sm text-white/65">
            {course.moduleCount || 0} modules • {course.lessonCount || 0} lessons
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserCourse({ courses, userTier }: CourseListProps) {
  const tierStyle = TIER_STYLES[userTier] || TIER_STYLES.free;

  return (
    <div className="mt-20">
      <div className="flex flex-col gap-6 border-b border-border/50 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Learning Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">My Courses</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Continue your full-stack and AI learning tracks with structured modules, practical lessons, and progress-focused content.
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-3 rounded-full border bg-card/60 px-4 py-2 backdrop-blur-sm",
            tierStyle.border
          )}
        >
          <span className="text-sm font-medium text-muted-foreground">Current Plan:</span>
          <span className={cn("bg-gradient-to-r bg-clip-text text-sm font-bold text-transparent", tierStyle.gradient)}>
            {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
          </span>
          {userTier === "free" && (
            <Button variant="outline" size="sm" className="ml-2 h-8 rounded-full text-xs" asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses?.map((course) => (
          <div
            key={course._id}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
          >
            <div className="relative h-56 overflow-hidden">
              <CourseCover course={course} />
              <div className="absolute left-4 top-4">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md",
                    course.tier === "ultra"
                      ? "border-cyan-500/25 bg-cyan-500/10 text-cyan-300"
                      : course.tier === "pro"
                        ? "border-violet-500/25 bg-violet-500/10 text-violet-300"
                        : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                  )}
                >
                  {course.tier.charAt(0).toUpperCase() + course.tier.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              {course.category && (
                <span className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                  {course.category.title}
                </span>
              )}

              <h3 className="mb-3 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                {course.title}
              </h3>

              <p className="mb-6 line-clamp-3 flex-grow text-sm leading-6 text-muted-foreground">
                {course.description}
              </p>

              <div className="mt-auto space-y-5 border-t border-border/50 pt-5">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.moduleCount || 0} Modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.lessonCount || 0} Lessons</span>
                  </div>
                </div>

                <Button className="w-full rounded-2xl group/btn" asChild>
                  <Link href={`/course/${course.slug.current}`}>
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses?.length === 0 && (
        <div className="py-16 text-center">
          <h3 className="text-xl font-medium text-muted-foreground">No courses found</h3>
          <p className="mt-2 text-muted-foreground/60">Check back later for new content.</p>
        </div>
      )}
    </div>
  );
}
