import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-background/50 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">E</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">EduNova</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm">
                            Empowering the next generation of tech leaders with AI-driven learning and real-world projects.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</Link></li>
                            <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">Mentorship</Link></li>
                            <li><Link href="/#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/sso" className="text-muted-foreground hover:text-primary transition-colors">For Enterprise</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                            <li><a href="mailto:careers@edunova.com" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/support" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2024 EduNova Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
