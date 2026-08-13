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

                        <div className="flex flex-col gap-4 items-center pt-2">
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
