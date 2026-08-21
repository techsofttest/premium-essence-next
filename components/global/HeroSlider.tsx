"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroBannerItem {
    id: number;
    name: string;
    image_url: string;
    url?: string;
}

interface HeroSliderProps {
    initialBanners?: HeroBannerItem[];
}

export default function HeroSlider({ initialBanners }: HeroSliderProps) {
    const [fetchedBanners, setFetchedBanners] = useState<HeroBannerItem[]>([]);

    useEffect(() => {
        if (!initialBanners || initialBanners.length === 0) {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
            fetch(`${baseUrl}/storefront/banners`)
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data) && data.length > 0) {
                        setFetchedBanners(data);
                    }
                })
                .catch(() => { });
        }
    }, [initialBanners]);

    const activeList = (initialBanners && initialBanners.length > 0)
        ? initialBanners
        : fetchedBanners;

    const slides = activeList.map((b) => ({
        id: b.id,
        image: b.image_url,
        link: b.url ? b.url.replace(/^https?:\/\/[^\/]+/, "") || "/shop" : "/shop",
        alt: b.name,
    }));

    const [currentSlide, setCurrentSlide] = useState(0);

    // Navigation Functions
    const nextSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    // Auto-play functionality
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide, currentSlide, slides.length]);

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full aspect-[2172/724] overflow-hidden bg-dark group">

            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                >
                    {/* Entire slide is clickable */}
                    <Link href={slide.link} className="block w-full h-full relative cursor-pointer">
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            priority={index === 0}
                            unoptimized
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                        {/* Subtle dark gradient at the bottom for indicator visibility */}
                        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-32 bg-gradient-to-t from-dark/40 to-transparent pointer-events-none" />
                    </Link>
                </div>
            ))}

            {/* Left Control Button */}
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-8 z-20 p-2 sm:p-3 rounded-none bg-white/70 hover:bg-white text-dark backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
                <ChevronLeft size={18} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>

            {/* Right Control Button */}
            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-8 z-20 p-2 sm:p-3 rounded-none bg-white/70 hover:bg-white text-dark backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
                <ChevronRight size={18} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>

            {/* Elegant Bottom Indicators */}
            <div className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`transition-all duration-500 ease-in-out rounded-none ${index === currentSlide
                            ? "w-6 sm:w-8 h-[3px] bg-cream opacity-100"
                            : "w-2 h-[3px] bg-cream opacity-40 hover:opacity-70"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}
