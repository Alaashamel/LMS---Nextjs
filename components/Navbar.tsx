"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
    useAuth,
} from "@clerk/nextjs";
import { Menu, X, BarChart3, HeadphonesIcon, ShieldCheck, Users } from "lucide-react";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { has, isLoaded } = useAuth();

    const isPro = isLoaded && (has?.({ plan: "pro" }) || has?.({ plan: "ultra" }));
    const isUltra = isLoaded && has?.({ plan: "ultra" });

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mb mx-auto px-4 md:px-6 h-12 md:h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">E</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">EduNova</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-6">
                    <SignedIn>
                        <Link
                            href="/courses"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Courses
                        </Link>

                        {isPro && (
                            <Link
                                href="/analytics"
                                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-violet-400 transition-colors"
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                Analytics
                            </Link>
                        )}

                        <Link
                            href="/support"
                            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            <HeadphonesIcon className="w-3.5 h-3.5" />
                            Support
                        </Link>

                        {isUltra && (
                            <>
                                <Link
                                    href="/account-manager"
                                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-cyan-400 transition-colors"
                                >
                                    <Users className="w-3.5 h-3.5" />
                                    Account Manager
                                </Link>
                                <Link
                                    href="/sso"
                                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-cyan-400 transition-colors"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    SSO
                                </Link>
                            </>
                        )}
                    </SignedIn>

                    <SignedOut>
                        <Link
                            href="/analytics"
                            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-violet-400 transition-colors"
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            Analytics
                        </Link>
                        <Link
                            href="/#pricing"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Pricing
                        </Link>
                    </SignedOut>
                </div>

                {/* Desktop Auth / User */}
                <div className="hidden md:flex items-center gap-4">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton />
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                </div>

                {/* Mobile: User Button + Hamburger */}
                <div className="flex md:hidden items-center gap-3">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="container mx-auto px-6 pb-4 pt-2 flex flex-col gap-2 border-t border-white/5">
                        <SignedIn>
                            <Link
                                href="/courses"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                            >
                                Courses
                            </Link>

                            {isPro && (
                                <Link
                                    href="/analytics"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-violet-400 hover:bg-white/5 transition-colors"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Analytics
                                </Link>
                            )}

                            <Link
                                href="/support"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                            >
                                <HeadphonesIcon className="w-4 h-4" />
                                Support
                            </Link>

                            {isUltra && (
                                <>
                                    <Link
                                        href="/account-manager"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-cyan-400 hover:bg-white/5 transition-colors"
                                    >
                                        <Users className="w-4 h-4" />
                                        Account Manager
                                    </Link>
                                    <Link
                                        href="/sso"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-cyan-400 hover:bg-white/5 transition-colors"
                                    >
                                        <ShieldCheck className="w-4 h-4" />
                                        SSO Settings
                                    </Link>
                                </>
                            )}
                        </SignedIn>

                        <SignedOut>
                            <Link
                                href="/analytics"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-violet-400 hover:bg-white/5 transition-colors"
                            >
                                <BarChart3 className="w-4 h-4" />
                                Analytics
                            </Link>
                            <Link
                                href="/#pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-white/5 transition-colors"
                            >
                                Pricing
                            </Link>
                            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/5">
                                <SignInButton />
                                <SignUpButton>
                                    <Button size="sm" className="w-full">
                                        Sign Up
                                    </Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            )}
        </nav>
    );
}
