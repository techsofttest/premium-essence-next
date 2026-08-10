"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, RefreshCw } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";
import AuthContainer from "@/components/auth/AuthContainer";

const SIDEBAR_DATA = {
    image: "/products/Y Le Parfum 1.png",
    label: "Secure Verification",
    title: "One Step Closer to Perfection",
    description: "For your security, we have sent a 6-digit verification code. Please enter it to continue your journey with Premium Essence."
};

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get("type") || "signup";
    const contact = searchParams.get("contact") || "your email/phone";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(59);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length === 6) {
            if (type === "signup") {
                router.push("/signup?step=2&contact=" + encodeURIComponent(contact));
            } else {
                router.push("/reset-password");
            }
        }
    };

    return (
        <AuthContainer
            sidebarData={SIDEBAR_DATA}
            backLink="#"
            backLabel="Back"
            onBackClick={() => router.back()}
        >
            <div className="flex flex-col gap-10 text-center md:text-left">
                <div className="flex flex-col gap-3">
                    <div className="w-16 h-16 bg-dark text-white rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                        <ShieldCheck size={28} />
                    </div>
                    <h2 className="font-serif text-3xl text-dark">Verify Identity</h2>
                    <p className="text-sm text-dark/60 leading-relaxed">
                        We've sent a 6-digit code to <br />
                        <span className="text-dark font-bold">{contact}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="flex flex-col gap-8">
                    <div className="flex justify-between gap-2 sm:gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-full aspect-square bg-white border border-dark/10 text-center text-xl font-bold text-dark outline-none focus:border-dark transition-all focus:shadow-lg rounded-none"
                                maxLength={1}
                                required
                            />
                        ))}
                    </div>

                    <div className="mt-4">
                        <GlowingButton fullWidth className="h-14 text-[11px] tracking-[0.3em] uppercase">
                            Verify & Continue
                        </GlowingButton>
                    </div>
                </form>

                <div className="flex flex-col gap-4 items-center md:items-start">
                    <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-dark/40">
                        {timer > 0 ? (
                            <span>Resend code in <span className="text-dark">{timer}s</span></span>
                        ) : (
                            <button className="text-dark hover:text-gold transition-colors flex items-center gap-2 group">
                                <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                                Resend Verification Code
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AuthContainer>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <VerifyContent />
        </Suspense>
    );
}
