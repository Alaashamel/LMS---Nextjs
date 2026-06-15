import { getUserTier } from "@/lib/user-plan";
import { cn } from "@/lib/utils";
import {
    MessageCircle,
    Mail,
    Clock,
    Star,
    Zap,
    Users,
    CheckCircle2,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default async function SupportPage() {
    const userTier = await getUserTier();

    const isPro = userTier === "pro" || userTier === "ultra";
    const isUltra = userTier === "ultra";

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/30">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Support Center
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold">How can we help?</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Your support level is based on your current plan.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* Current plan badge */}
                <div
                    className={cn(
                        "rounded-xl border p-5 flex items-center gap-4",
                        isUltra
                            ? "border-cyan-500/30 bg-cyan-500/5"
                            : isPro
                            ? "border-violet-500/30 bg-violet-500/5"
                            : "border-emerald-500/30 bg-emerald-500/5"
                    )}
                >
                    <div
                        className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            isUltra
                                ? "bg-gradient-to-br from-cyan-400 to-blue-600"
                                : isPro
                                ? "bg-gradient-to-br from-violet-500 to-fuchsia-600"
                                : "bg-gradient-to-br from-emerald-500 to-teal-600"
                        )}
                    >
                        {isUltra ? (
                            <Zap className="w-5 h-5 text-white" />
                        ) : isPro ? (
                            <Star className="w-5 h-5 text-white" />
                        ) : (
                            <Users className="w-5 h-5 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-sm">
                            You are on the{" "}
                            <span
                                className={cn(
                                    "font-bold",
                                    isUltra
                                        ? "text-cyan-400"
                                        : isPro
                                        ? "text-violet-400"
                                        : "text-emerald-400"
                                )}
                            >
                                {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {isUltra
                                ? "You have access to dedicated account management and priority support."
                                : isPro
                                ? "You have priority support with faster response times."
                                : "You have community and standard email support."}
                        </p>
                    </div>
                </div>

                {/* Support channels */}
                <div className="grid gap-4 sm:grid-cols-2">

                    {/* Community Discord — all plans */}
                    <div className="rounded-xl border border-border/60 bg-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Community Discord</p>
                                <p className="text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Available on all plans
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            Get help from fellow learners and community mentors. Active 24/7.
                        </p>
                        <a
                            href="https://discord.gg/edunova"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            Join Discord <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Email support */}
                    <div className="rounded-xl border border-border/60 bg-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Email Support</p>
                                <p
                                    className={cn(
                                        "text-xs flex items-center gap-1",
                                        isPro ? "text-violet-400" : "text-muted-foreground"
                                    )}
                                >
                                    <Clock className="w-3 h-3" />
                                    {isPro ? "Priority — response within 24h" : "Standard — response within 48h"}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            {isPro
                                ? "Your queries are flagged as priority and handled by our dedicated support team first."
                                : "Send us an email and our team will get back to you within 2 business days."}
                        </p>
                        <a
                            href="mailto:support@edunova.com"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            support@edunova.com <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Priority support — pro+ */}
                    {isPro && (
                        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Priority Support</p>
                                    <p className="text-xs text-violet-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Active on your plan
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                                Your support tickets are automatically escalated to our senior support team.
                                Expect faster resolutions and dedicated attention.
                            </p>
                            <a
                                href="mailto:priority@edunova.com"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                            >
                                priority@edunova.com <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    )}

                    {/* Dedicated account manager — ultra */}
                    {isUltra && (
                        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Dedicated Account Manager</p>
                                    <p className="text-xs text-cyan-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Active on your plan
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                                Your personal account manager is available for onboarding, strategy sessions,
                                and any escalated issues. Reach them directly.
                            </p>
                            <Link
                                href="/account-manager"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Contact your manager <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Upgrade CTA for free users */}
                {!isPro && (
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Star className="w-8 h-8 text-violet-400 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">Get Priority Support</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Upgrade to Pro for 24h priority responses and a dedicated support channel.
                            </p>
                        </div>
                        <Link
                            href="/#pricing"
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                            Upgrade to Pro
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
