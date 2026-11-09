"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { InnerPageBannerItem } from "@/lib/storefront";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface PageBannerProps {
    pageKey: string;
    fallbackImage?: string;
    title: string;
    subtitle?: string;
    kicker?: string;
    breadcrumbs?: BreadcrumbItem[];
    badge?: string;
    className?: string;
}

export default function PageBanner({
    pageKey,
    fallbackImage = "/banners/banner1.jpg",
    title,
    subtitle,
    kicker,
    breadcrumbs,
    badge,
    className = "",
}: PageBannerProps) {
    const [banner, setBanner] = useState<InnerPageBannerItem | null>(null);

    useEffect(() => {
        if (!pageKey) return;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        
        fetch(`${baseUrl}/storefront/banners?position=${encodeURIComponent(pageKey)}`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setBanner(data[0]);
                }
            })
            .catch(() => {
                // Silently fallback to prop fallbackImage
            });
    }, [pageKey]);

    const activeImageUrl = banner?.image_url || fallbackImage;
    const targetLink = banner?.url;

    const content = (
        <div className={`relative w-full overflow-hidden bg-[#1B1315] text-[#FAFAF8] select-none ${className}`}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={activeImageUrl}
                    alt={banner?.name || title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center transform scale-100 transition-transform duration-1000 ease-out hover:scale-105"
                />
                {/* Luxury Vignette & Dark Contrast Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315] via-[#1B1315]/55 to-black/35" />
                <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#1B1315]/30 to-[#1B1315]/80" />
            </div>

            {/* Scent Wave Accent Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <svg width="100%" height="100%" className="w-full h-full">
                    <defs>
                        <pattern id={`wave-${pageKey}`} x="0" y="0" width="120" height="40" patternUnits="userSpaceOnUse">
                            <path
                                d="M0 20 Q 30 10 60 20 T 120 20"
                                fill="none"
                                stroke="#C5A059"
                                strokeOpacity="0.4"
                                strokeWidth="0.6"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#wave-${pageKey})`} />
                </svg>
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24 lg:py-28 flex flex-col justify-center">
                
                {/* Breadcrumbs Trail */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-2.5 text-[10px] tracking-widest uppercase font-bold text-cream/70 mb-5 flex-wrap">
                        <Link href="/" className="hover:text-gold transition-colors">
                            Home
                        </Link>
                        {breadcrumbs.map((crumb, idx) => {
                            const isLast = idx === breadcrumbs.length - 1;
                            return (
                                <span key={idx} className="flex items-center gap-2.5">
                                    <ArrowRight size={10} strokeWidth={2.5} className="text-gold/60" />
                                    {crumb.href && !isLast ? (
                                        <Link href={crumb.href} className="hover:text-gold transition-colors">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className={isLast ? "text-gold" : ""}>
                                            {crumb.label}
                                        </span>
                                    )}
                                </span>
                            );
                        })}
                    </nav>
                )}

                {/* Eyebrow / Kicker */}
                {(kicker || badge) && (
                    <div className="flex items-center gap-2 mb-3">
                        {kicker && (
                            <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase font-bold text-[#C5A059] flex items-center gap-1.5 drop-shadow-sm">
                                <Sparkles size={12} className="text-[#C5A059]" />
                                {kicker}
                            </span>
                        )}
                        {badge && (
                            <span className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                                {badge}
                            </span>
                        )}
                    </div>
                )}

                {/* Main Heading */}
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-medium tracking-tight max-w-4xl drop-shadow-md leading-tight">
                    {title}
                </h1>

                {/* Subtitle / Description */}
                {subtitle && (
                    <p className="text-xs sm:text-sm text-cream/80 max-w-2xl mt-3 sm:mt-4 leading-relaxed font-light drop-shadow-sm">
                        {subtitle}
                    </p>
                )}

                {/* Gold Accent Divider */}
                <div className="w-16 h-[2px] bg-gradient-to-r from-[#C5A059] to-transparent mt-6" />
            </div>
        </div>
    );

    if (targetLink && targetLink !== "#") {
        return (
            <Link href={targetLink} className="block cursor-pointer">
                {content}
            </Link>
        );
    }

    return content;
}

