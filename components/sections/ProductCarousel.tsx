"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCard, { Product } from "../ui/ProductCard";

interface ProductCarouselProps {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllLink?: string;
    bgColor?: string;
}

export default function ProductCarousel({
    title,
    subtitle,
    products,
    viewAllLink,
    bgColor = "bg-[#F7F3F4]"
}: ProductCarouselProps) {

    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            // Adjusted scroll amount to match the new, tighter card widths
            const scrollAmount = window.innerWidth >= 1024 ? 320 : 260;
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className={`py-24 w-full font-sans overflow-hidden ${bgColor}`}>
            <div className="max-w-screen-2xl mx-auto flex flex-col relative w-full">

                {/* Header Area - Padding aligned perfectly with the carousel track */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-4 md:px-12 lg:px-20">
                    <div>
                        {subtitle && (
                            <span className="text-xs tracking-[0.2em] uppercase text-dark/50 block mb-3 font-medium">
                                {subtitle}
                            </span>
                        )}
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight">
                            {title}
                        </h2>
                    </div>

                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="group hidden md:flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-dark/70 hover:text-dark transition-colors font-medium pb-2"
                        >
                            Explore Collection
                            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Carousel Wrapper */}
                <div className="relative group/carousel">

                    {/* Left Control Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 md:left-6 lg:left-8 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-none bg-[#F7F3F4]/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-dark/5 hidden md:flex items-center justify-center text-dark transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:bg-dark hover:text-cream hover:scale-110"
                    >
                        <ChevronLeft size={24} strokeWidth={1.5} />
                    </button>

                    {/* Right Control Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-2 md:right-6 lg:right-8 top-[40%] -translate-y-1/2 z-20 w-12 h-12 rounded-none bg-[#F7F3F4]/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-dark/5 hidden md:flex items-center justify-center text-dark transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:bg-dark hover:text-cream hover:scale-110"
                    >
                        <ChevronRight size={24} strokeWidth={1.5} />
                    </button>

                    {/* 
            Product Track
            - gap-4 lg:gap-5: Drastically reduced gap between cards.
            - px/scroll-pl: Perfectly aligns the first card with the heading above it.
          */}
                    <div
                        ref={carouselRef}
                        className="w-full px-4 md:px-12 lg:px-20 scroll-pl-4 md:scroll-pl-12 lg:scroll-pl-20 flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                    >
                        {products.map((product, idx) => (
                            <div
                                key={`carousel-${product.id}-${idx}`}
                                // Tighter fixed widths to allow the free-flowing "peek" effect on the right side
                                className="snap-start shrink-0 w-[240px] md:w-[260px] lg:w-[300px]"
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}

                        {/* Spacer to allow the last card to scroll into view fully without clipping the shadow */}
                        <div className="min-w-[1px] md:min-w-[40px]" aria-hidden="true" />
                    </div>

                </div>

                {/* Mobile "View All" Button */}
                {viewAllLink && (
                    <div className="mt-2 px-4 md:hidden">
                        <Link
                            href={viewAllLink}
                            className="flex items-center justify-center w-full py-4 border border-dark text-dark text-xs tracking-[0.2em] uppercase font-medium hover:bg-dark hover:text-cream transition-colors rounded-none"
                        >
                            Explore Collection
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}