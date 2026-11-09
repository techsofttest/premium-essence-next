"use client";

import { useState } from "react";
import { Tag, Copy, Check, X } from "lucide-react";

const COUPON_CODE = "WELCOME10";

export default function FloatingCouponWidget() {
    const [isDismissed, setIsDismissed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    if (isDismissed) return null;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
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
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 left-4 sm:left-6 z-40">
                <button
                    onClick={() => setIsMinimized(false)}
                    aria-label="Open welcome discount coupon"
                    className="flex items-center gap-2 bg-[#23171A] text-[#E9D7C3] border border-[#E9D7C3]/40 px-3.5 py-2.5 shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                >
                    <Tag size={15} className="text-[#E9D7C3] animate-bounce" />
                    <span className="text-xs font-bold tracking-widest uppercase">10% OFF</span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-[280px] sm:max-w-[320px] animate-fadeIn">
                <div className="relative bg-gradient-to-b from-[#2B1D22] to-[#1B1315] text-[#F7F3F4] border border-[#E9D7C3]/35 shadow-[0_15px_35px_-5px_rgba(27,19,21,0.85)] p-3.5 sm:p-4 backdrop-blur-md">
                    {/* Gold/Cream Accent Top Line */}
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#E9D7C3] via-[#E9D7C3]/80 to-transparent" />

                    {/* Dismiss Button */}
                    <button
                        onClick={() => setIsDismissed(true)}
                        aria-label="Close coupon notification"
                        className="absolute top-2 right-2 text-[#E9D7C3]/50 hover:text-[#F7F3F4] transition-colors p-1 cursor-pointer"
                    >
                        <X size={14} />
                    </button>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#4A323A]/60 border border-[#E9D7C3]/30 text-[#E9D7C3] shrink-0 mt-0.5">
                                <Tag size={15} />
                            </div>

                                <div className="space-y-1.5 flex-1 pr-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#E9D7C3]">
                                            Welcome Gift
                                        </span>
                                        <span className="text-[9px] px-1.5 py-0.5 bg-[#4A323A]/70 text-[#E9D7C3] font-semibold border border-[#E9D7C3]/20">
                                            10% OFF
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-[#E9D7C3]/85 leading-snug">
                                        Use code on your first luxury fragrance order:
                                    </p>

                                        <div className="flex items-stretch gap-1.5 pt-0.5">
                                            <div className="bg-[#0E080A] border border-[#E9D7C3]/40 px-2 py-1 font-mono font-bold text-[#E9D7C3] text-xs tracking-wider select-all flex items-center justify-center">
                                                {COUPON_CODE}
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                type="button"
                                                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shrink-0 cursor-pointer ${copied
                                                        ? "bg-emerald-700 text-white"
                                                        : "bg-[#E9D7C3] hover:bg-[#F7F3F4] text-[#1B1315] shadow-sm hover:scale-105 active:scale-95"
                                                    }`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check size={11} />
                                                        <span>COPIED</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy size={11} />
                                                        <span>COPY</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
}
