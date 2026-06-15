import Link from "next/link";
import { Lock, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradePromptProps {
    requiredPlan: "pro" | "ultra";
    featureName: string;
    description?: string;
}

const PLAN_CONFIG = {
    pro: {
        icon: Sparkles,
        gradient: "from-violet-500 to-fuchsia-600",
        border: "border-violet-500/30",
        glow: "shadow-violet-500/10",
        badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        label: "Pro Plan",
    },
    ultra: {
        icon: Zap,
        gradient: "from-cyan-400 to-blue-600",
        border: "border-cyan-500/30",
        glow: "shadow-cyan-500/10",
        badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        label: "Ultra Plan",
    },
};

export function UpgradePrompt({ requiredPlan, featureName, description }: UpgradePromptProps) {
    const cfg = PLAN_CONFIG[requiredPlan];
    const Icon = cfg.icon;

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div
                className={cn(
                    "relative max-w-md w-full rounded-2xl border bg-card p-8 text-center shadow-xl",
                    cfg.border,
                    cfg.glow
                )}
            >
                {/* Glow blob */}
                <div
                    className={cn(
                        "absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
                        cfg.gradient
                    )}
                />

                {/* Icon */}
                <div
                    className={cn(
                        "relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br",
                        cfg.gradient
                    )}
                >
                    <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Badge */}
                <span
                    className={cn(
                        "relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4",
                        cfg.badge
                    )}
                >
                    <Lock className="h-3 w-3" />
                    {cfg.label} Feature
                </span>

                <h2 className="relative text-xl font-bold text-foreground mb-2">
                    {featureName}
                </h2>
                <p className="relative text-sm text-muted-foreground mb-8 leading-relaxed">
                    {description ?? `Upgrade to ${cfg.label} to unlock ${featureName} and more powerful features.`}
                </p>

                <div className="relative flex flex-col gap-3">
                    <Link
                        href="/#pricing"
                        className={cn(
                            "inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r transition-all duration-200 hover:opacity-90 hover:shadow-lg",
                            cfg.gradient
                        )}
                    >
                        <Sparkles className="h-4 w-4" />
                        Upgrade to {cfg.label}
                    </Link>
                    <Link
                        href="/courses"
                        className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl font-medium text-muted-foreground text-sm border border-border hover:bg-muted/40 transition-colors"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}
