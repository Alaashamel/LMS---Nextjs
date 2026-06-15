import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            New: AI-Powered Career Paths
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                            Upgrade Your Skills. <br />
                            <span className="text-primary">Unlock Your Future.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Master the tech stack of tomorrow with immersive, AI-driven courses. Join over 50,000 professionals leveling up today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/sign-up">
                                <Button size="lg" className="h-12 px-8 text-lg">
                                    Start Learning Now <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                    View All Courses
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 border-t border-border flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                <span className="font-semibold">12k+</span>
                                <span className="text-muted-foreground text-sm">students enrolled this month</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span className="font-semibold">4.9/5</span>
                                <span className="text-muted-foreground text-sm">student rating</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative">
                        <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 shadow-2xl">
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 rounded-full blur-xl" />

                            {/* Code Snippet Abstract Representation */}
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <div className="space-y-2 text-muted-foreground">
                                    <p><span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = <span className="text-yellow-400">await</span> <span className="text-blue-400">EduNova</span>.<span className="text-yellow-400">levelUp</span>({`{`}</p>
                                    <p className="pl-4"><span className="text-blue-300">skills</span>: [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Node.js"</span>, <span className="text-green-400">"AI"</span>],</p>
                                    <p className="pl-4"><span className="text-blue-300">mentorship</span>: <span className="text-purple-400">true</span>,</p>
                                    <p className="pl-4"><span className="text-blue-300">certified</span>: <span className="text-purple-400">true</span></p>
                                    <p>{`}`});</p>
                                    <p className="text-green-500">// Career unlocked successfully!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
