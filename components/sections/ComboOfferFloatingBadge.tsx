"use client";

import Link from "next/link";
import { Gift, Sparkles, ArrowRight } from "lucide-react";

export default function ComboOfferFloatingBadge() {
    return (
        <div className="w-full lg:w-auto flex justify-center lg:block lg:absolute lg:top-6 lg:left-8 xl:left-14 lg:z-30 mb-6 lg:mb-0 animate-[float_4s_ease-in-out_infinite]">
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(0.5deg); }
                }
            `}</style>
            <Link
                href="/combo-offer"
                aria-label="Explore Luxury Combo Offers"
                className="flex items-center gap-3 sm:gap-4 bg-[#1B1315]/95 text-white border-2 border-[#C5A059] px-4 sm:px-6 py-3 sm:py-4 shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all duration-500 hover:scale-105 hover:bg-[#1B1315] hover:border-white hover:shadow-[0_0_35px_rgba(197,160,89,0.8)] group cursor-pointer max-w-fit"
            >
                {/* Glowing Gift Icon Badge Container */}
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C5A059] text-[#1B1315] shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                    <Gift size={20} className="sm:w-6 sm:h-6 animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                </div>

                {/* Larger Badge Content */}
                <div className="flex flex-col text-left pr-1 sm:pr-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em] text-[#C5A059] flex items-center gap-1.5">
                            <Sparkles size={12} className="text-[#C5A059]" />
                            Combo Offer
                        </span>
                        <span className="bg-[#4A323A] text-cream text-[10px] sm:text-xs font-black tracking-widest px-2 py-0.5 uppercase shadow-sm">
                            Save upto 45%
                        </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1.5 mt-0.5 group-hover:text-[#C5A059] transition-colors">
                        Explore Exclusive Bundles <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                </div>
            </Link>
        </div>
    );
}
