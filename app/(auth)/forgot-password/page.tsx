"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";
import AuthContainer from "@/components/auth/AuthContainer";

const SIDEBAR_DATA = {
    image: "/products/Bleu de Chanel Parfum 1.png",
    label: "Secure Access",
    title: "Reset Your Secure Password",
    description: "Enter your registered email address and we will send you instructions to reset your password safely."
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const handleSendLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            router.push(`/verify?type=reset&contact=${encodeURIComponent(email)}`);
        }
    };

    return (
        <AuthContainer 
            sidebarData={SIDEBAR_DATA} 
            backLink="/login" 
            backLabel="Back to Login"
        >
            <div className="flex flex-col gap-10 text-center md:text-left">
                <div className="flex flex-col gap-3">
                    <div className="w-16 h-16 bg-dark text-white rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                        <Mail size={24} />
                    </div>
                    <h2 className="font-serif text-3xl text-dark">Recover Password</h2>
                    <p className="text-sm text-dark/60">We'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSendLink} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80 text-left">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com" 
                            className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <GlowingButton fullWidth className="h-14 text-[11px] tracking-[0.3em] uppercase">
                            Send Reset Link
                        </GlowingButton>
                    </div>
                </form>

                <p className="text-xs text-dark/60">
                    Remembered your password?{" "}
                    <Link href="/login" className="text-dark font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </AuthContainer>
    );
}
