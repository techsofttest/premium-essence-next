"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, Copy, Check, Sparkles, ArrowRight } from "lucide-react";

const POPUP_STORAGE_KEY = "pe_welcome_popup_seen";
const COUPON_CODE = "WELCOME10";

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const hasSeen = sessionStorage.getItem(POPUP_STORAGE_KEY) || localStorage.getItem(POPUP_STORAGE_KEY);
            if (!hasSeen) {
                // Natural 1.5s delay so customer sees the storefront first
                const timer = setTimeout(() => {
                    setIsOpen(true);
        }, 1500);
    return () => clearTimeout(timer);
}
        } catch {
            // Fallback if storage access is restricted
        }
    }, []);

const handleClose = useCallback(() => {
    setIsOpen(false);
    try {
        sessionStorage.setItem(POPUP_STORAGE_KEY, "true");
    } catch { }
}, []);

const handleCopy = useCallback(() => {
    try {
        navigator.clipboard.writeText(COUPON_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    } catch {
        const input = document.createElement("input");
        input.value = COUPON_CODE;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }
}, []);

// Listen for Escape key
useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
}, [isOpen, handleClose]);

// Prevent background scrolling when modal is open
useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
    return () => {
        document.body.style.overflow = "";
    };
}, [isOpen]);

if (!isOpen) return null;

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop with warm brown-tinted blur */}
            <div
                onClick={handleClose}
                className="fixed inset-0 bg-[#1B1315]/85 backdrop-blur-md transition-opacity duration-300"
                aria-hidden="true"
            />

                    {/* Modal Dialog */}
            <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="welcome-title"
                    className="relative w-full max-w-lg my-auto bg-gradient-to-b from-[#2B1D22] via-[#1B1315] to-[#120B0D] text-[#F7F3F4] rounded-none border border-[#E9D7C3]/30 shadow-[0_25px_60px_-15px_rgba(27,19,21,0.95)] p-6 sm:p-9 z-10 transition-all duration-300 overflow-hidden"
                >
                {/* Subtle Luxury Gradient Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4A323A]/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#E9D7C3]/70 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        aria-label="Close welcome message"
                        className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 flex items-center justify-center text-[#E9D7C3]/60 hover:text-[#F7F3F4] transition-colors border border-[#E9D7C3]/20 hover:border-[#E9D7C3]/50 rounded-none bg-[#1B1315]/60 cursor-pointer"
                    >
                        <X size={16} />
                    </button>

                    {/* Content Container */}
                    <div className="relative text-center space-y-4 sm:space-y-5">
                        {/* Welcome Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4A323A]/60 border border-[#E9D7C3]/35 text-[#E9D7C3] text-[10px] sm:text-xs font-medium tracking-[0.25em] uppercase mx-auto">
                            <Sparkles size={12} className="text-[#E9D7C3]" />
                            <span>WELCOME TO PREMIUM ESSENCE</span>
                        </div>

                        {/* Headline */}
                        <h2
                            id="welcome-title"
                            className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#F7F3F4] font-light tracking-tight leading-snug"
                        >
                            Discover the Essence of <span className="italic font-normal text-[#E9D7C3]">True Luxury</span>
                        </h2>

                        {/* Subline - Location removed */}
                        <p className="text-xs sm:text-sm text-[#E9D7C3]/80 max-w-md mx-auto font-light leading-relaxed">
                            Step into our luxury fragrance boutique for authentic designer perfumes, rare accords, and prestige collections.
                        </p>

                                {/* Coupon Ticket Box */}
                                <div className="pt-1">
                                    <div className="bg-[#170F11]/90 border border-dashed border-[#E9D7C3]/40 p-4 sm:p-5 text-center space-y-2 relative shadow-inner">
                                        <span className="text-[10px] sm:text-xs text-[#E9D7C3] uppercase tracking-[0.22em] font-medium block">
                                            EXCLUSIVE FIRST VISIT PRIVILEGE
                                        </span>
                                        <div className="text-lg sm:text-xl font-bold text-[#F7F3F4] tracking-wider">
                                            10% OFF ENTIRE ORDER
                                        </div>
                                        <p className="text-[11px] text-[#E9D7C3]/75">
                                            Apply code at checkout for an instant 10% discount on your order.
                                        </p>

                                            {/* Unified Code & Copy Bar with Perfect Alignment */}
                                            <div className="pt-2 flex items-stretch justify-center max-w-xs mx-auto border border-[#E9D7C3]/40 bg-[#0E080A] shadow-sm">
                                                <div className="flex-1 px-3 py-2 text-center font-mono font-bold text-[#E9D7C3] text-sm sm:text-base tracking-[0.2em] select-all flex items-center justify-center">
                                                    {COUPON_CODE}
                                                </div>
                                                <button
                                                    onClick={handleCopy}
                                                    type="button"
                                                    className={`px-4 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer ${copied
                                                            ? "bg-emerald-700 text-white"
                                                            : "bg-[#E9D7C3] hover:bg-[#F7F3F4] text-[#1B1315]"
                                                        }`}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check size={13} />
                                                            <span>COPIED</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={13} />
                                                            <span>COPY</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2 space-y-2.5">
                                        <Link
                                            href="/shop"
                                            onClick={handleClose}
                                            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#E9D7C3] hover:bg-[#F7F3F4] text-[#1B1315] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer"
                                        >
                                            <span>SHOP LUXURY PERFUMES</span>
                                            <ArrowRight size={15} />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="block w-full text-[11px] sm:text-xs text-[#E9D7C3]/60 hover:text-[#F7F3F4] transition-colors tracking-widest uppercase py-1 cursor-pointer"
                                        >
                                            Continue Browsing
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
}
