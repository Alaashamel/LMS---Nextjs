import { CheckCircle2, UserPlus, Zap } from "lucide-react";

export function Steps() {
    return (
        <section className="py-24 bg-background/50 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                        Start Your <span className="text-primary">Journey</span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Three simple steps to transform your career.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-0" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">1. Create Account</h3>
                        <p className="text-muted-foreground">
                            Join for free and customize your tech interests profile.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <Zap className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">2. Choose Track</h3>
                        <p className="text-muted-foreground">
                            Select a specialized path or mix and match courses.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">3. Level Up</h3>
                        <p className="text-muted-foreground">
                            Complete projects, earn certs, and land your dream job.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
