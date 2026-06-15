import { hasAccessToTier } from "@/lib/user-plan";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { cn } from "@/lib/utils";
import {
    ShieldCheck,
    Zap,
    CheckCircle2,
    ExternalLink,
    Info,
    Key,
} from "lucide-react";

export default async function SSOPage() {
    const canAccess = await hasAccessToTier("ultra");
    if (!canAccess) {
        return (
            <UpgradePrompt
                requiredPlan="ultra"
                featureName="SAML/SSO Integration"
                description="Connect your identity provider (Okta, Azure AD, Google Workspace) to enable single sign-on for your entire team."
            />
        );
    }

    const providers = [
        { name: "Okta", logo: "OK", color: "from-blue-500 to-blue-700" },
        { name: "Azure AD", logo: "AZ", color: "from-sky-500 to-sky-700" },
        { name: "Google Workspace", logo: "GW", color: "from-red-500 to-orange-500" },
        { name: "OneLogin", logo: "OL", color: "from-violet-500 to-violet-700" },
        { name: "Auth0", logo: "A0", color: "from-orange-500 to-orange-700" },
        { name: "Custom SAML 2.0", logo: "SA", color: "from-zinc-500 to-zinc-700" },
    ];

    const steps = [
        "Fill in your Identity Provider details below and submit.",
        "Our team will configure the SAML integration within 1–2 business days.",
        "You will receive a Service Provider metadata URL and ACS URL by email.",
        "Configure your IdP with those values and your team can start signing in via SSO.",
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
                    <h1 className="text-3xl font-extrabold">SAML / SSO Integration</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Connect your Identity Provider to enable single sign-on for your organisation.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* Supported providers */}
                <div className="rounded-xl border border-border/60 bg-card p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        Supported Identity Providers
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {providers.map((p) => (
                            <div
                                key={p.name}
                                className="flex flex-col items-center gap-2"
                                title={p.name}
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br",
                                        p.color
                                    )}
                                >
                                    {p.logo}
                                </div>
                                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                                    {p.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How it works */}
                <div className="rounded-xl border border-border/60 bg-card p-6">
                    <h2 className="font-semibold mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-muted-foreground" />
                        How It Works
                    </h2>
                    <ol className="space-y-3">
                        {steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-muted-foreground">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Setup form */}
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-6">
                    <h2 className="font-semibold mb-1 flex items-center gap-2">
                        <Key className="w-4 h-4 text-cyan-400" />
                        Request SSO Setup
                    </h2>
                    <p className="text-xs text-muted-foreground mb-5">
                        Submit your IdP details and our team will complete the integration.
                    </p>
                    <form action="/api/support/sso" method="POST" className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                    Identity Provider
                                </label>
                                <select
                                    name="provider"
                                    className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    required
                                >
                                    <option value="">Select provider...</option>
                                    {providers.map((p) => (
                                        <option key={p.name} value={p.name}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                    Organisation Domain
                                </label>
                                <input
                                    name="domain"
                                    type="text"
                                    placeholder="e.g. yourcompany.com"
                                    className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                IdP Metadata URL
                            </label>
                            <input
                                name="metadataUrl"
                                type="url"
                                placeholder="https://your-idp.com/metadata"
                                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Contact Email for Setup
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="it-admin@yourcompany.com"
                                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Additional Notes
                            </label>
                            <textarea
                                name="notes"
                                rows={3}
                                placeholder="Any special requirements or notes for the setup..."
                                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Submit SSO Request
                            </button>
                            <a
                                href="https://docs.edunova.com/sso"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                SSO Documentation <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </form>
                </div>

                {/* Status callout */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">No SSO active yet.</span>{" "}
                        Submit the form above and our team will reach out within 1 business day.
                    </p>
                </div>
            </div>
        </div>
    );
}
