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

                <div className="flex flex-col gap-4 items-center pt-2">
                    <p className="text-xs text-dark/60">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-dark font-bold hover:underline">Create One</Link>
                    </p>
                </div>
            </div>
        </AuthContainer>
    );
}
