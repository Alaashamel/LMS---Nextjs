import { Code2, Brain, Map, Award, Users, BarChart } from "lucide-react";

const features = [
    {
        icon: Code2,
        title: "Interactive Sandboxes",
        description: "Code directly in the browser with our cloud-based IDE environments. No setup required.",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10 hover:bg-blue-500/20"
    },
    {
        icon: Brain,
        title: "AI-Powered Mentors",
        description: "Get 24/7 assistance on your code with our fine-tuned AI models that understand context.",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10 hover:bg-purple-500/20"
    },
    {
        icon: Map,
        title: "Career Pathing",
        description: "Visual roadmaps that guide you from Junior to Senior Developer in record time.",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20"
    },
    {
        icon: Award,
        title: "Verified Certificates",
        description: "Blockchain-verified certificates that you can instantly share on LinkedIn.",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10 hover:bg-amber-500/20"
    },
    {
        icon: Users,
        title: "Community Hubs",
        description: "Join squads of learners. Pair program, review code, and grow together.",
        color: "text-pink-500",
        bgColor: "bg-pink-500/10 hover:bg-pink-500/20"
    },
    {
        icon: BarChart,
        title: "Deep Analytics",
        description: "Track your velocity, accuracy, and study streaks with detailed dashboards.",
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10 hover:bg-cyan-500/20"
    }
];

export function Features() {
    return (
        <section className="py-24 bg-background/50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-center mb-16">
                    Why Top Tech Talent Chooses <span className="text-primary">EduNova</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl border border-border bg-card/50 hover:bg-card/80 transition-all hover:border-primary/50 group">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${feature.bgColor}`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
