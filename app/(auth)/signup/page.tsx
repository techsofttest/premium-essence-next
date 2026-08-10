"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";
import AuthContainer from "@/components/auth/AuthContainer";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SIDEBAR_DATA = {
    image: "/products/Baccarat Rouge 540 1.png",
    label: "A New Journey Awaits",
    title: "Create Your Fragrance Profile",
    description: "Join our exclusive community to enjoy personalized recommendations, faster checkout, and early access to limited editions."
};

function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refreshCustomer } = useAuth();
    
    const [step, setStep] = useState(1);
    const [contact, setContact] = useState("");
    const [code, setCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const stepParam = searchParams.get("step");
        const contactParam = searchParams.get("contact");
        if (stepParam === "2") {
            setStep(2);
        }
        if (contactParam) {
            setContact(contactParam);
        }
    }, [searchParams]);

    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api("/customer/registration/request-otp", { method: "POST", body: JSON.stringify({ email: contact }) });
            setStep(2);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to send the verification code.");
        } finally {
            setSubmitting(false);
        }
    };

    const completeRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api("/customer/registration/verify-otp", { method: "POST", body: JSON.stringify({ email: contact, code }) });
            await api("/customer/register", {
                method: "POST",
                body: JSON.stringify({ name: `${firstName} ${lastName}`.trim(), email: contact, password }),
            });
            await refreshCustomer();
            router.push("/");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to complete registration.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthContainer 
            sidebarData={SIDEBAR_DATA} 
            backLink={step === 1 ? "/" : "#"}
            backLabel={step === 1 ? "Back to Home" : "Back to Verification"}
            onBackClick={(e) => {
                if (step === 2) {
                    e.preventDefault();
                    setStep(1);
                }
            }}
        >
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 mb-2">
                        <div className={`w-8 h-[1px] ${step >= 1 ? "bg-gold" : "bg-dark/10"}`} />
                        <div className={`w-8 h-[1px] ${step === 2 ? "bg-gold" : "bg-dark/10"}`} />
                    </div>
                    <h2 className="font-serif text-3xl text-dark">
                        {step === 1 ? "Begin Your Experience" : "Complete Your Profile"}
                    </h2>
                    <p className="text-sm text-dark/60">
                        {step === 1 
                            ? "Enter your email or phone number to receive a verification code." 
                            : `A verification code has been sent to ${contact}.`}
                    </p>
                </div>

                {step === 1 ? (
                    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <form onSubmit={handleNextStep} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">Email or Phone Number</label>
                                <input 
                                    type="email" 
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    placeholder="name@example.com or +971..." 
                                    className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                    required
                                />
                            </div>

                            <div className="mt-2">
                                <GlowingButton fullWidth className="h-14 text-[11px] tracking-[0.3em] uppercase">
                                    {submitting ? "Sending..." : "Send Verification Code"}
                                </GlowingButton>
                            </div>
                        </form>

                        <div className="flex flex-col gap-6 items-center">
                            <div className="w-full flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-dark/10" />
                                <span className="text-[10px] tracking-widest uppercase text-dark/40 font-bold">Or sign up with</span>
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
                                Already have an account?{" "}
                                <Link href="/login" className="text-dark font-bold hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={completeRegistration} className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">Verification Code</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={code}
                                    onChange={(event) => setCode(event.target.value)}
                                    placeholder="6-digit code" 
                                    className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors tracking-[0.5em] font-bold"
                                    maxLength={6}
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <button type="button" className="text-[9px] tracking-widest uppercase text-dark/40 hover:text-dark transition-colors font-bold text-left mt-1">Resend Code</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">First Name</label>
                                <input 
                                    type="text" 
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    placeholder="First Name" 
                                    className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    placeholder="Last Name" 
                                    className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/80">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Create a secure password" 
                                className="w-full bg-white border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="flex items-start gap-3 mt-2">
                            <input type="checkbox" className="mt-1 w-4 h-4 accent-dark border-dark/10" id="newsletter" />
                            <label htmlFor="newsletter" className="text-[10px] text-dark/60 leading-normal tracking-wide uppercase font-bold">
                                I wish to receive exclusive offers and fragrance updates from Premium Essence.
                            </label>
                        </div>

                        {error && <p className="text-xs text-red-700">{error}</p>}
                        <div className="mt-4">
                            <GlowingButton type="submit" disabled={submitting} fullWidth className="h-14 text-[11px] tracking-[0.3em] uppercase">
                                {submitting ? "Creating Account..." : "Complete Registration"}
                            </GlowingButton>
                        </div>
                    </form>
                )}
            </div>
        </AuthContainer>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <SignupContent />
        </Suspense>
    );
}
