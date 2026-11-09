"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface BudgetTier {
    price: number;
    sublabel: string;
    concentration: string;
    badge: string;
    liquidColor: string;
}

const BUDGET_TIERS: BudgetTier[] = [
    {
        price: 49,
        sublabel: "Pocket & Minis",
        concentration: "Travel Flacon",
        badge: "Pocket Friendly",
        liquidColor: "from-[#E6B87D]/30 via-[#D49E59]/15 to-transparent",
    },
    {
        price: 99,
        sublabel: "Everyday Signatures",
        concentration: "Eau de Toilette",
        badge: "Most Popular",
        liquidColor: "from-[#E5A952]/35 via-[#C98B35]/20 to-transparent",
    },
    {
        price: 149,
        sublabel: "Signature Scents",
        concentration: "Eau de Parfum",
        badge: "Great Value",
        liquidColor: "from-[#D48955]/35 via-[#B86E3C]/20 to-transparent",
    },
    {
        price: 199,
        sublabel: "Intense Sillage",
        concentration: "Intense EDP",
        badge: "Bestsellers",
        liquidColor: "from-[#C57A44]/40 via-[#A85B28]/20 to-transparent",
    },
    {
        price: 249,
        sublabel: "Private Blends",
        concentration: "Prestige Oud",
        badge: "Private Reserve",
        liquidColor: "from-[#B85D36]/40 via-[#8F3E1E]/25 to-transparent",
    },
    {
        price: 299,
        sublabel: "Pure Luxury",
        concentration: "Extrait de Parfum",
        badge: "Grand Reserve",
        liquidColor: "from-[#A44525]/45 via-[#6E2914]/25 to-transparent",
    },
];

export default function BudgetPicksSection() {
    return (
            <section className="w-full py-10 sm:py-14 bg-gradient-to-b from-[#F7F3F4] via-[#F3ECE7] to-[#F7F3F4] font-sans border-y border-dark/5 overflow-hidden relative">
                {/* Ambient luxury lighting */}
                <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-[#4A323A]/8 rounded-full blur-3xl pointer-events-none" />

                        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 relative z-10">
                            {/* Section Header */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-3">
                                <div className="space-y-1.5">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1B1315]/5 border border-[#1B1315]/10 rounded-full text-dark text-[9px] font-bold tracking-[0.25em] uppercase">
                                        <Sparkles size={11} className="text-[#C5A059]" />
                                        <span>SMART LUXURY SELECTIONS</span>
                                    </div>
                                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-dark tracking-tight font-light">
                                        Explore <span className="italic font-normal text-[#4A323A]">Budget Picks</span>
                                    </h2>
                                    <p className="text-xs sm:text-sm text-dark/70 max-w-xl font-light leading-relaxed">
                                        Shop within your budget without missing out on a luxurious shopping experience in UAE.
                                    </p>
                                </div>

                                            <Link
                                                href="/shop"
                                                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-dark/80 hover:text-dark transition-colors border-b border-dark/20 hover:border-dark pb-0.5 self-start md:self-end group"
                                            >
                                                <span>View All Fragrances</span>
                                                <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>

                                {/* 6 Compact Luxury Perfume Bottle Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-3.5 items-end">
                                    {BUDGET_TIERS.map((tier) => (
                                        <Link
                                            key={tier.price}
                                            href={`/shop?max_price=${tier.price}`}
                                            className="group flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-2"
                                        >
                                            {/* Top Badge Pill */}
                                            <span className="text-[8px] font-bold uppercase tracking-wider text-dark/70 bg-white/95 border border-dark/10 px-2 py-0.5 rounded-full mb-2 shadow-xs group-hover:bg-[#1B1315] group-hover:text-[#E9D7C3] transition-colors">
                                                {tier.badge}
                                            </span>

                                            {/* 1. Perfume Bottle Cap (Bouchon) - Scaled Down */}
                                            <div className="relative w-7 sm:w-8 h-4 sm:h-5 rounded-t-xs bg-gradient-to-r from-[#A67C2E] via-[#FCE9B8] to-[#91671F] shadow-sm group-hover:brightness-110 transition-all duration-300">
                                                <div className="absolute inset-x-0.5 top-0.5 h-[1px] bg-white/80 rounded-full" />
                                                <div className="absolute inset-y-0 left-1 w-[1px] bg-white/40" />
                                                <div className="absolute inset-y-0 right-1 w-[1px] bg-black/20" />
                                            </div>

                                                {/* 2. Atomizer Collar / Neck Ring */}
                                                <div className="w-4 sm:w-5 h-1.5 bg-gradient-to-r from-[#8C6218] via-[#E8C86A] to-[#6E4B0C] border-y border-[#573906]" />

                                                {/* 3. The Crystal Glass Flacon Body - Compact Size */}
                                                <div className="relative w-full aspect-[1/1.42] max-w-[135px] sm:max-w-[145px] rounded-t-xl rounded-b-xl bg-gradient-to-b from-[#251A1D]/95 via-[#2E1E23]/90 to-[#160D0F] border-[1.5px] border-[#E9D7C3]/30 shadow-lg group-hover:shadow-[0_12px_30px_rgba(212,175,55,0.22)] group-hover:border-[#D4AF37] transition-all duration-300 overflow-hidden flex flex-col justify-between p-2.5 backdrop-blur-md">

                                                    {/* Diagonal Glass Glare & Light Refraction */}
                                                    <div className="absolute -top-12 -left-12 w-16 h-48 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-25 pointer-events-none group-hover:translate-x-40 transition-transform duration-700 ease-out" />
                                                    <div className="absolute top-0 right-1.5 w-[1px] h-full bg-white/15 pointer-events-none" />

                                                    {/* Internal Fragrance Liquid Glow Level */}
                                                    <div className={`absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t ${tier.liquidColor} pointer-events-none transition-all duration-300 group-hover:h-[72%]`} />

                                                        {/* Subtle Spritz Droplet Icon */}
                                                        <div className="relative z-10 flex justify-center pt-0.5">
                                                            <div className="w-1 h-1 rounded-full bg-[#E9D7C3]/60 group-hover:bg-[#D4AF37] transition-colors" />
                                                        </div>

                                                        {/* Luxury Recessed Bottle Label */}
                                                        <div className="relative z-10 m-auto w-full py-2.5 px-1.5 rounded-lg bg-[#130B0D]/85 border border-[#E9D7C3]/35 shadow-inner flex flex-col items-center text-center backdrop-blur-xs group-hover:border-[#D4AF37] transition-colors">
                                                            <span className="text-[8px] font-bold tracking-[0.25em] uppercase text-[#E9D7C3]/80 block">
                                                                UNDER
                                                            </span>

                                                        {/* Price Figure */}
                                                        <div className="flex items-baseline justify-center gap-0.5 my-0.5">
                                                            <span className="text-[9px] font-bold text-[#D4AF37] tracking-wider uppercase">
                                                                AED
                                                            </span>
                                                            <span className="font-serif text-2xl sm:text-3xl font-light text-[#F7F3F4] group-hover:text-[#E9D7C3] transition-colors leading-none tracking-tight">
                                                                {tier.price}
                                                            </span>
                                                        </div>

                                                    <span className="text-[8px] text-[#E9D7C3]/70 uppercase tracking-wider font-medium border-t border-[#E9D7C3]/20 pt-1 mt-0.5 block w-full truncate">
                                                        {tier.concentration}
                                                    </span>
                                                </div>

                                {/* Thick Heavy Crystal Glass Base (Culot) */}
                                <div className="relative z-10 w-full h-2 rounded-b-lg border-t border-white/20 bg-gradient-to-b from-white/15 to-white/5 flex items-center justify-center">
                                    <div className="w-8 h-0.5 bg-white/40 rounded-full" />
                                </div>
                            </div>

                            {/* Subtitle & Shop Link below bottle */}
                            <div className="mt-2 text-center flex flex-col items-center">
                                <span className="text-[11px] sm:text-xs font-bold text-dark group-hover:text-[#4A323A] transition-colors">
                                    {tier.sublabel}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#C5A059] mt-0.5 group-hover:translate-x-0.5 transition-transform">
                                    Shop Now <ArrowRight size={9} />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
