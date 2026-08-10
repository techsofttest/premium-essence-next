"use client";

import { SlidersHorizontal, ArrowUpDown, ChevronDown, Sparkles, ArrowUpNarrowWide, ArrowDownWideNarrow, Clock } from "lucide-react";

interface CategoryHeaderProps {
    title: string;
    onOpenFilter: () => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

export default function CategoryHeader({
    title,
    onOpenFilter,
    sortBy,
    setSortBy
}: CategoryHeaderProps) {
    const sortOptions = [
        { label: "Featured", value: "featured", icon: <Sparkles size={12} /> },
        { label: "Price: Low to High", value: "price_low_high", icon: <ArrowUpNarrowWide size={12} /> },
        { label: "Price: High to Low", value: "price_high_low", icon: <ArrowDownWideNarrow size={12} /> },
        { label: "Newest", value: "newest", icon: <Clock size={12} /> }
    ];

    const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || "Featured";

    return (
        <div className="relative flex justify-between items-center mb-10 border-b border-dark/10 pb-6 min-h-[60px]">
            {/* Filter Button (Left) */}
            <button
                onClick={onOpenFilter}
                className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-dark hover:text-dark/60 transition-colors z-20"
            >
                <SlidersHorizontal size={14} strokeWidth={2.5} />
                Filter
            </button>

            {/* Centered Category Title */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="font-serif text-3xl md:text-4xl text-dark hidden md:block">
                    {title}
                </h1>
            </div>

            {/* Sort Button (Right) */}
            <div className="relative group z-20">
                <button className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-bold text-dark hover:text-dark/60 transition-colors">
                    <ArrowUpDown size={14} strokeWidth={2.5} />
                    Sort By: {currentSortLabel}
                    <ChevronDown size={14} />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute top-full right-0 mt-2 w-56 bg-white shadow-2xl border border-dark/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-30">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className="w-full text-left px-5 py-3.5 text-[12px] tracking-widest uppercase hover:bg-[#F7F3F4] transition-colors text-dark/80 hover:text-dark flex items-center gap-3"
                        >
                            <span className="opacity-80 group-hover:opacity-100">{option.icon}</span>
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
