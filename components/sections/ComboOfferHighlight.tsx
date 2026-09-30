"use client";

import Link from "next/link";
import { Sparkles, Gift, ArrowRight, Tag } from "lucide-react";

export default function ComboOfferHighlight() {
    return (
        <section className="w-full font-sans relative overflow-hidden bg-gradient-to-r from-[#1B1315] via-[#2A1820] to-[#1B1315] text-[#F7F3F4] border-y border-[#C5A059]/30 shadow-lg group">
            {/* Subtle Animated Gold Glow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(197,160,89,0.15),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(197,160,89,0.1),transparent_50%)] pointer-events-none" />

            <Link href="/combo-offer" className="block w-full cursor-pointer py-6 sm:py-8 px-6 sm:px-12 md:px-16 relative z-10">
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    
                    {/* Left Side: Tag Badge & Headline */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 sm:gap-2.5">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                <Sparkles size={12} className="text-[#C5A059] animate-pulse" />
                                Exclusive Curations
                            </span>
                            <span className="bg-[#4A323A] text-cream text-[10px] sm:text-xs font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-none shadow-sm flex items-center gap-1">
                                <Tag size={11} /> Save Big
                            </span>
                        </div>

                        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-bold tracking-wide leading-tight group-hover:text-[#C5A059] transition-colors duration-300">
                            Explore Luxury Combo Offers & Gift Sets
                        </h2>

                        <p className="text-xs sm:text-sm text-cream/70 font-light tracking-wide max-w-2xl">
                            Elevate your fragrance collection with our handpicked duo bundles and travel sets with special discounts.
                        </p>
                    </div>

                    {/* Right Side: Interactive Glowing CTA Button */}
                    <div className="shrink-0 flex items-center">
                        <div className="bg-[#C5A059] text-[#1B1315] hover:bg-white border border-[#C5A059] px-7 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 shadow-[0_4px_20px_rgba(197,160,89,0.35)] group-hover:scale-105 group-hover:shadow-[0_4px_30px_rgba(197,160,89,0.6)]">
                            <Gift size={16} />
                            <span>View All Combo Offers</span>
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </div>
                    </div>

                </div>
            </Link>
        </section>
    );
}
