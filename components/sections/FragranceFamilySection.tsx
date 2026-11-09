"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { FragranceFamilyItem } from "@/lib/storefront";

interface FragranceFamilySectionProps {
    families: FragranceFamilyItem[];
}

export default function FragranceFamilySection({ families }: FragranceFamilySectionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!families || families.length === 0) return null;

    const hasMoreNotes = families.length > 12;

    return (
            <section id="shop-by-notes" className="w-full py-12 px-4 sm:px-8 md:px-12 bg-white text-dark border-b border-dark/10">
                <div className="max-w-screen-2xl mx-auto">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark/10">
                        <div>
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-dark font-medium tracking-tight">
                                Shop by Notes
                            </h2>
                            <p className="text-xs sm:text-sm text-dark/70 mt-1">
                                Discover masterfully crafted perfumes categorized by signature olfactive notes and accords.
                            </p>
                        </div>

                        <Link
                            href="/fragrances"
                            className="text-xs font-bold uppercase tracking-widest text-dark hover:text-gold flex items-center gap-1 transition-colors shrink-0"
                        >
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>

                            {/* Fragrance Notes Grid - Arranged in 3 rows initially, expandable on click */ }
                            <div className="relative">
                                <div
                                    className={`grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-8 transition-[max-height] duration-700 ease-in-out overflow-hidden ${isExpanded
                                            ? "max-h-[3000px]"
                                            : "max-h-[325px] sm:max-h-[385px] md:max-h-[460px]"
                                        }`}
                                >
                                    {families.map((family) => {
                                        const fallbackImg = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=300&auto=format&fit=crop";
                                        const imgUrl = family.image || fallbackImg;
                                        const displayName = (family.name || "").trim();

                                                return (
                                                <Link
                                                    key={family.id}
                                                    href={family.href || `/fragrances?family=${encodeURIComponent(family.slug)}`}
                                                    className="group flex flex-col items-center text-center space-y-2.5 transition-transform duration-300 hover:-translate-y-1"
                                                >
                                                    {/* Rounded Squircle Thumbnail Container */}
                                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-md border border-dark/10 group-hover:border-dark transition-all duration-300 bg-[#F7F3F4]">
                                                        <Image
                                                            src={imgUrl}
                                                            alt={displayName}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                                            sizes="96px"
                                                        />
                                                        <div className="absolute inset-0 bg-dark/5 group-hover:bg-transparent transition-colors" />
                                                    </div>

                                                {/* Label */}
                                                <span className="text-[11px] sm:text-xs font-semibold text-dark group-hover:text-gold tracking-wide transition-colors line-clamp-1 max-w-full">
                                                    {displayName}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Subtle bottom fade when collapsed */}
                                {!isExpanded && hasMoreNotes && (
                                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                                )}
                            </div>

                            {/* Text Button to Expand / Collapse */ }
                            {
                                hasMoreNotes && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-dark hover:text-gold border-b border-dark/30 hover:border-gold pb-0.5 transition-all group cursor-pointer"
                                        >
                                            <span>{isExpanded ? "View Less Notes" : "View More Notes"}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-300 text-dark/60 group-hover:text-gold ${isExpanded ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                )
                            }
            </div>
            </section>
            );
}
