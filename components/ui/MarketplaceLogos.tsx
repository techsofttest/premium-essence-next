"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface MarketplaceLogosProps {
    variant?: "footer" | "compact" | "checkout";
    className?: string;
}

export function AmazonLogo({ className = "h-5" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 30"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Amazon"
        >
            {/* Amazon wordmark */}
            <text x="2" y="19" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="21" letterSpacing="-0.8">
                amazon
            </text>
            {/* Signature smile arrow */}
            <path
                d="M 12 24 C 28 29, 62 29, 78 22"
                fill="none"
                stroke="#FF9900"
                strokeWidth="2.8"
                strokeLinecap="round"
            />
            <path
                d="M 74 20 L 79 22 L 76 25 Z"
                fill="#FF9900"
            />
        </svg>
    );
}

export function NoonLogo({ className = "h-5" }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FEEE00] text-[#1B1315] font-black ${className}`}>
            <span className="font-sans text-xs tracking-tight uppercase font-extrabold">noon</span>
            <span className="text-[10px] font-serif opacity-80">نون</span>
        </div>
    );
}

export function TradelingLogo({ className = "h-5" }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A192F] text-white ${className}`}>
            {/* Geometric hexagon/box mark */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polygon points="12 2, 22 8.5, 22 20.5, 12 27, 2 20.5, 2 8.5" fill="#00C9A7" transform="scale(0.85) translate(2, -1)" />
                <path d="M12 7 L17 10 L12 13 L7 10 Z" fill="#FFFFFF" />
            </svg>
            <span className="font-sans text-[11px] font-black tracking-wider uppercase">tradeling</span>
        </div>
    );
}

export function NowNowLogo({ className = "h-5" }: { className?: string }) {
    return (
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FF3B30] text-white ${className}`}>
            {/* Lightning bolt */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="13 2, 3 14, 12 14, 11 22, 21 10, 12 10" />
            </svg>
            <span className="font-sans text-[11px] font-black tracking-tight lowercase">nownow</span>
            <span className="text-[8px] font-medium opacity-80 tracking-tighter">by noon</span>
        </div>
    );
}

export default function MarketplaceLogos({ variant = "footer", className = "" }: MarketplaceLogosProps) {
    const marketplaces = [
        {
            name: "Amazon UAE",
            href: "https://www.amazon.ae",
            component: <AmazonLogo className="h-5 text-[#1B1315]" />,
            tag: "Prime Delivery",
        },
        {
            name: "Noon",
            href: "https://www.noon.com",
            component: <NoonLogo className="h-7" />,
            tag: "noon Express",
        },
        {
            name: "Tradeling",
            href: "https://www.tradeling.com",
            component: <TradelingLogo className="h-7" />,
            tag: "B2B & Wholesale",
        },
        {
            name: "NowNow",
            href: "https://nownow.noon.com",
            component: <NowNowLogo className="h-7" />,
            tag: "Instant 60-Min",
        },
    ];

    if (variant === "compact" || variant === "checkout") {
        return (
            <div className={`p-4 bg-white border border-[#1B1315]/10 rounded-xl shadow-xs ${className}`}>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1B1315]/70">
                        Also Available On
                    </span>
                    <span className="text-[10px] text-[#1B1315]/50 flex items-center gap-1 font-medium">
                        Verified Partner Stores
                    </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {marketplaces.map((m) => (
                        <a
                            key={m.name}
                            href={m.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-2.5 rounded-lg border border-[#1B1315]/10 bg-[#F7F3F4]/60 hover:bg-white hover:border-[#D4AF37]/50 hover:shadow-xs transition-all group cursor-pointer"
                            title={`Shop Premium Essence on ${m.name}`}
                        >
                            {m.component}
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    // Default: Footer Luxury Bar
    return (
        <div className={`w-full py-8 border-t border-dark/10 flex flex-col md:flex-row items-center justify-between gap-6 ${className}`}>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-dark/70">
                    Also Available On
                </span>
                <span className="hidden sm:inline-block text-dark/30">•</span>
                <span className="text-xs text-dark/60 font-light">
                    Official store availability across leading UAE marketplaces
                </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {marketplaces.map((m) => (
                    <a
                        key={m.name}
                        href={m.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white border border-dark/10 shadow-xs hover:shadow-md hover:border-[#D4AF37]/60 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                        title={`Shop Premium Essence on ${m.name}`}
                    >
                        {m.component}
                        <ExternalLink size={11} className="text-dark/30 group-hover:text-dark transition-colors" />
                    </a>
                ))}
            </div>
        </div>
    );
}

