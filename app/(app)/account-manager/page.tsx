import { hasAccessToTier } from "@/lib/user-plan";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { currentUser } from "@clerk/nextjs/server";
import { cn } from "@/lib/utils";
import {
    Zap,
    Mail,
    Calendar,
    Phone,
    CheckCircle2,
    Clock,
    MessageCircle,
} from "lucide-react";

export default async function AccountManagerPage() {
    const canAccess = await hasAccessToTier("ultra");
    if (!canAccess) {
        return (
            <UpgradePrompt
                requiredPlan="ultra"
                featureName="Dedicated Account Management"
                description="Get a personal account manager for onboarding, strategy sessions, and direct escalation support."
            />
        );
    }

    const user = await currentUser();

    const benefits = [
        { icon: Clock, text: "Response within 4 business hours" },
        { icon: Calendar, text: "Monthly strategy & check-in calls" },
        { icon: CheckCircle2, text: "Onboarding & setup assistance" },
        { icon: MessageCircle, text: "Direct Slack / WhatsApp channel" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                            Ultra Plan
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold">Dedicated Account Manager</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Your personal point of contact for everything EduNova.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* Manager card */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 p-8 flex flex-col sm:flex-row gap-6 items-start">
                    {/* Avatar placeholder */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
                        AM
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
                            Your Account Manager
                        </p>
                        <h2 className="text-xl font-bold mb-1">Account Manager</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            EduNova Customer Success Team
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="mailto:manager@edunova.com"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                Email Manager
                            </a>
                            <a
                                href="tel:+1234567890"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/5 transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                Schedule a Call
                            </a>
                        </div>
                    </div>
                </div>

                {/* What's included */}
                <div className="rounded-xl border border-border/60 bg-card p-6">
                    <h2 className="font-semibold mb-4">What&apos;s included</h2>
                    <ul className="space-y-3">
                        {benefits.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-cyan-400" />
                                </div>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Request form */}
                <div className="rounded-xl border border-border/60 bg-card p-6">
                    <h2 className="font-semibold mb-1">Send a Request</h2>
                    <p className="text-xs text-muted-foreground mb-5">
                        Your manager will respond within 4 business hours.
                    </p>
                    <form
                        action="/api/support/account-manager"
                        method="POST"
                        className="space-y-4"
                    >
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                    Your Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
                                    className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={user?.primaryEmailAddress?.emailAddress ?? ""}
                                    className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Subject
                            </label>
                            <input
                                name="subject"
                                type="text"
                                placeholder="e.g. Onboarding help, Technical issue..."
                                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Message
                            </label>
                            <textarea
                                name="message"
                                rows={4}
                                placeholder="Describe how we can help you..."
                                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            <Mail className="w-4 h-4" />
                            Send Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
