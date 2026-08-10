"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GlowingButton from "@/components/ui/GlowingButton";
import AuthContainer from "@/components/auth/AuthContainer";
import { useAuth } from "@/context/AuthContext";

const SIDEBAR_DATA = {
    image: "/products/Oud Wood Private Blend 1.png",
    label: "The Essence of Elegance",
    title: "Welcome to the Inner Circle",
    description: "Sign in to access your curated selection of international fragrances and exclusive member benefits."
};

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(email, password);
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to sign in.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthContainer 
            sidebarData={SIDEBAR_DATA} 
            backLink="/" 
            backLabel="Back to Home"
        >
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                    <h2 className="font-serif text-3xl text-dark">Sign In</h2>
                    <p className="text-sm text-dark/60">Enter your credentials to access your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@example.com" 
                            className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">Password</label>
                            <Link href="/forgot-password" className="text-[10px] tracking-widest uppercase text-dark/40 hover:text-dark transition-colors font-bold">Forgot?</Link>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    {error && <p className="text-xs text-red-700">{error}</p>}
                    <div className="mt-4">
                        <GlowingButton type="submit" disabled={submitting} fullWidth className="h-14 text-[11px] tracking-[0.3em] uppercase">
                            {submitting ? "Signing In..." : "Access Account"}
                        </GlowingButton>
                    </div>
                </form>

                <div className="flex flex-col gap-6 items-center">
                    <div className="w-full flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-dark/10" />
                        <span className="text-[10px] tracking-widest uppercase text-dark/40 font-bold">Or continue with</span>
                        <div className="h-[1px] flex-1 bg-dark/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button className="flex items-center justify-center gap-3 py-3.5 border border-dark/10 bg-white hover:bg-dark/5 transition-colors text-[10px] tracking-widest uppercase font-bold text-dark">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-3.5 border border-dark/10 bg-white hover:bg-dark/5 transition-colors text-[10px] tracking-widest uppercase font-bold text-dark">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M17.073 21.376c-.56.327-1.285.597-1.917.597-1.152 0-2.312-.749-3.342-.749-1.039 0-2.333.737-3.342.737-1.61 0-4.131-2.877-4.131-6.416 0-3.52 2.301-5.388 4.416-5.388 1.131 0 2.02.587 2.852.587.758 0 1.954-.741 3.251-.741 1.053 0 2.115.391 2.844 1.063-2.312 1.181-1.942 4.636.568 5.76-.712 1.993-1.789 4.221-2.585 5.388zm-3.41-16.142c0 1.349-1.114 2.454-2.43 2.454-.04 0-.091-.005-.138-.011.026-1.554 1.258-2.81 2.535-2.81.011 0 .022 0 .033.002.002.12.002.24.002.365z"/>
                            </svg>
                            Apple
                        </button>
                    </div>

                    <p className="text-xs text-dark/60">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-dark font-bold hover:underline">Create One</Link>
                    </p>
                </div>
            </div>
        </AuthContainer>
    );
}
