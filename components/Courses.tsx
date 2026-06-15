import { ArrowRight, Star, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { FEATURED_COURSES_QUERY } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/live";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
}

const coverStyles = [
  "from-blue-600/45 via-cyan-500/20 to-slate-950",
  "from-emerald-500/45 via-teal-400/20 to-slate-950",
  "from-violet-500/45 via-fuchsia-400/20 to-slate-950",
  "from-amber-500/45 via-orange-400/20 to-slate-950",
  "from-rose-500/45 via-red-400/20 to-slate-950",
];

function getCoverGradient(title: string) {
  const sum = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return coverStyles[sum % coverStyles.length];
}

function TrackCover({ track }: { track: Course }) {
  if (track.thumbnail?.asset?.url) {
    return (
      <img
        src={track.thumbnail.asset.url}
        alt={track.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-gradient-to-br", getCoverGradient(track.title))}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_24%)]" />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/15 bg-white/5" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <span className="mb-4 w-fit rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          EduNova Track
        </span>
        <h4 className="max-w-[16rem] text-2xl font-black leading-tight text-white drop-shadow">
          {track.title}
        </h4>
      </div>
    </div>
  );
}

export async function Courses() {
  const { data: courses } = await sanityFetch({ query: FEATURED_COURSES_QUERY });

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Featured Learning Tracks
            </p>
            <h2 className="text-3xl font-bold lg:text-5xl">
              Most Popular <span className="text-primary">Tracks</span>
            </h2>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="hidden text-primary hover:text-primary/80 md:flex">
              View All Tracks <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {courses?.map((track: Course, index: number) => (
            <Link
              key={track._id || index}
              href={`/course/${track.slug?.current}`}
              className="group relative block overflow-hidden rounded-3xl border border-border bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="h-52 overflow-hidden">
                <TrackCover track={track} />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {track.tier || "Free"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">4.8</span>
                  </div>
                </div>

                <h3 className="mb-3 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary">
                  {track.title}
                </h3>

                <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {track.description}
                </p>

                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {track.moduleCount || 0} modules • {track.lessonCount || 0} lessons
                  </span>
                  <span className="text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                    Enroll Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/courses">
            <Button variant="outline" className="w-full">
              View All Tracks
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
