"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FragranceFamilyItem } from "@/lib/storefront";

interface FragranceFamilySectionProps {
    families: FragranceFamilyItem[];
}

export default function FragranceFamilySection({ families }: FragranceFamilySectionProps) {
    if (!families || families.length === 0) return null;

    return (
        <section className="w-full py-12 px-4 sm:px-8 md:px-12 bg-white text-dark border-b border-dark/10">
            <div className="max-w-screen-2xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark/10">
                    <div>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-dark font-medium tracking-tight">
                            Explore Perfumes by Fragrance Family
                        </h2>
                        <p className="text-xs sm:text-sm text-dark/70 mt-1">
                            Discover masterfully crafted scents categorized by olfactive notes and accords.
                        </p>
                    </div>

                    <Link
                        href="/fragrances"
                        className="text-xs font-bold uppercase tracking-widest text-dark hover:text-mauve flex items-center gap-1 transition-colors shrink-0"
                    >
                        View All <ArrowUpRight size={14} />
                    </Link>
                </div>

                {/* Fragrance Family Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6">
                    {families.map((family) => {
                        const fallbackImg = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=300&auto=format&fit=crop";
                        const imgUrl = family.image || fallbackImg;

                        return (
                            <Link
                                key={family.id}
                                href={family.href || `/fragrances?family=${family.slug}`}
                                className="group flex flex-col items-center text-center space-y-2.5 transition-transform duration-300 hover:-translate-y-1"
                            >
                                {/* Rounded Squircle Thumbnail Container */}
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-md border border-dark/10 group-hover:border-dark transition-all duration-300 bg-[#F7F3F4]">
                                    <Image
                                        src={imgUrl}
                                        alt={family.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                        unoptimized={imgUrl.startsWith("http")}
                                    />
                                    <div className="absolute inset-0 bg-dark/5 group-hover:bg-transparent transition-colors" />
                                </div>

                                {/* Label */}
                                <span className="text-xs font-bold text-dark group-hover:text-mauve tracking-wide transition-colors">
                                    {family.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
