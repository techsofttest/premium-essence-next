"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface HeroBannerItem {
    id: number;
    name: string;
    image_url: string;
    url?: string;
}

const FALLBACK_HERO_SLIDES: HeroBannerItem[] = [
    {
        id: 1,
        name: "DE QOLLMER - Ishq",
        image_url: "http://127.0.0.1:8000/storage/banners/01M1ZS506FXN48QRDD8YTFRGMB.png",
        url: "/shop",
    },
    {
        id: 2,
        name: "Bleu de Chanel",
        image_url: "http://127.0.0.1:8000/storage/banners/01M1RKWMW2RQC0QP35GNZYAZJH.png",
        url: "/shop",
    },
    {
        id: 3,
        name: "Dior Sauvage",
        image_url: "http://127.0.0.1:8000/storage/banners/01M1ZTH5RCE7NM758JKNQWDVMK.png",
        url: "/shop",
    },
];

interface HeroSliderProps {
    initialBanners?: HeroBannerItem[];
}

export default function HeroSlider({ initialBanners }: HeroSliderProps) {
    const [fetchedBanners, setFetchedBanners] = useState<HeroBannerItem[]>([]);

    useEffect(() => {
        if (!initialBanners || initialBanners.length === 0) {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
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
        : (fetchedBanners.length > 0 ? fetchedBanners : FALLBACK_HERO_SLIDES);

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
        const timer = setInterval(nextSlide, 5500);
        return () => clearInterval(timer);
    }, [nextSlide, slides.length]);

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full aspect-[2172/724] min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-0 overflow-hidden bg-dark group">

            {/* Background Banner Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        priority={index === 0}
                        className="object-cover object-center"
                        sizes="100vw"
                    />
                </div>
            ))}

            {/* Dark Cinematic Scrim for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140F11]/85 via-[#140F11]/45 to-[#140F11]/50 z-10 pointer-events-none" />

            {/* Luxury Typography Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 py-10">
                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F7F3F4] font-light tracking-tight max-w-4xl leading-[1.1] drop-shadow-2xl">
                    Discover the <span className="italic font-normal text-[#E9D7C3]">Essence of Luxury</span>
                </h1>

                {/* Subline */}
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#F7F3F4]/90 max-w-2xl font-light tracking-wide leading-relaxed drop-shadow-md mt-3 sm:mt-4 mb-6 sm:mb-8 px-2">
                    Premium Essence Perfumes – Authentic, long-lasting fragrances for men and women
                </p>

                {/* Linked SHOP NOW Button */}
                <Link
                    href={slides[currentSlide]?.link || "/shop"}
                    className="group/btn inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-[#E9D7C3] hover:bg-[#F7F3F4] text-[#1B1315] text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-all duration-300 shadow-2xl hover:shadow-[0_4px_25px_rgba(233,215,195,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <span>SHOP NOW</span>
                    <ArrowRight size={15} className="transform group-hover/btn:translate-x-1.5 transition-transform" />
                </Link>
            </div>

            {/* Left Control Button */}
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-8 z-30 p-2 sm:p-3 rounded-none bg-white/70 hover:bg-white text-dark backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-lg cursor-pointer"
            >
                <ChevronLeft size={18} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>

            {/* Right Control Button */}
            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-8 z-30 p-2 sm:p-3 rounded-none bg-white/70 hover:bg-white text-dark backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-lg cursor-pointer"
            >
                <ChevronRight size={18} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
            </button>

            {/* Elegant Bottom Indicators */}
            <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`transition-all duration-500 ease-in-out rounded-none cursor-pointer ${index === currentSlide
                            ? "w-6 sm:w-8 h-[3px] bg-[#E9D7C3] opacity-100 shadow-md"
                            : "w-2 h-[3px] bg-[#E9D7C3] opacity-40 hover:opacity-70"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}
