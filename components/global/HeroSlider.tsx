"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
    {
        id: 1,
        image: "/product-banner/Doir-Sauvage-B.png",
        link: "/shop/dior",
        alt: "Dior Sauvage",
    },
    {
        id: 2,
        image: "/product-banner/Gucci Flora-B.png",
        link: "/shop/creed",
        alt: "Gucci Flora",
    },
    {
        id: 3,
        image: "/product-banner/Acqua Di Giò-B.png",
        link: "/shop/acqua-di-giò",
        alt: "Acqua Di Giò",
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Navigation Functions
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    }, []);

    // Auto-play functionality that resets when a user manually interacts
    useEffect(() => {
        const timer = setInterval(nextSlide, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, [nextSlide, currentSlide]); // Added currentSlide to dependencies to reset timer on manual click

    return (
        <div className="relative w-full h-[400px] overflow-hidden bg-dark group">

            {/* Slides */}
            {SLIDES.map((slide, index) => (
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
                            className="object-cover"
                            sizes="100vw"
                        />
                        {/* Subtle dark gradient at the bottom for indicator visibility */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-dark/40 to-transparent pointer-events-none" />
                    </Link>
                </div>
            ))}

            {/* Left Control Button */}
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute top-1/2 -translate-y-1/2 left-8 z-20 p-3 rounded-none bg-white/70 hover:bg-white text-dark backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
                <ChevronLeft size={24} strokeWidth={1.5} />
            </button>

            {/* Right Control Button */}
            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute top-1/2 -translate-y-1/2 right-8 z-20 p-3 rounded-none bg-white/70 hover:bg-white text-dark backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
                <ChevronRight size={24} strokeWidth={1.5} />
            </button>

            {/* Elegant Bottom Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`transition-all duration-500 ease-in-out rounded-none ${index === currentSlide
                            ? "w-8 h-[3px] bg-cream opacity-100"
                            : "w-2 h-[3px] bg-cream opacity-40 hover:opacity-70"
                            }`}
                    />
                ))}
            </div>

        </div>
    );
}
