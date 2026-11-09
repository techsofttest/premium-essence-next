"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Crown, Sparkles } from "lucide-react";
import { Product } from "@/components/ui/ProductCard";
import DeQollmerProductCard from "@/components/ui/DeQollmerProductCard";

interface DeQollmerCollectionSectionProps {
    products?: Product[];
}

const FALLBACK_DEQOLLMER_PRODUCTS: Product[] = [
    {
        id: "39",
        brand: "DE QOLLMER",
        name: "Ishq",
        slug: "ishq",
        price: 284.25,
        rating: 5.0,
        reviews: 48,
        image: "http://127.0.0.1:8000/storage/products/exec-b6460ed9-b1a9-4df0-a0b3-3ded186bff91.png",
        badge: "Private Reserve",
        concentration: "Extrait de Parfum",
    },
    {
        id: "40",
        brand: "DE QOLLMER",
        name: "Mi'raj",
        slug: "miraj",
        price: 284.25,
        rating: 5.0,
        reviews: 52,
        image: "http://127.0.0.1:8000/storage/products/exec-17a63b6f-eff7-42e4-b6e3-456e3580e3ce.png",
        badge: "Bestseller",
        concentration: "Extrait de Parfum",
    },
    {
        id: "41",
        brand: "DE QOLLMER",
        name: "Signature",
        slug: "signature",
        price: 186.75,
        rating: 5.0,
        reviews: 36,
        image: "http://127.0.0.1:8000/storage/products/exec-6432523b-e3ed-4296-84f8-818ecb4ffc0a.png",
        badge: "Signature Edition",
        concentration: "Eau de Parfum",
    },
    {
        id: "42",
        brand: "DE QOLLMER",
        name: "Harmony",
        slug: "harmony",
        price: 186.75,
        rating: 4.9,
        reviews: 29,
        image: "http://127.0.0.1:8000/storage/products/9A471F2E-90F2-46DD-8FED-829D804E33BA.png",
        concentration: "Eau de Parfum",
    },
    {
        id: "43",
        brand: "DE QOLLMER",
        name: "Beyond",
        slug: "beyond",
        price: 186.75,
        rating: 4.9,
        reviews: 24,
        image: "http://127.0.0.1:8000/storage/products/7EF4DBC9-8732-4ECA-8D15-C03EE9BB8F68.png",
        concentration: "Eau de Parfum",
    },
    {
        id: "45",
        brand: "DE QOLLMER",
        name: "Devotion",
        slug: "devotion",
        price: 89,
        rating: 4.8,
        reviews: 41,
        image: "http://127.0.0.1:8000/storage/products/exec-e1d5300e-bd30-49cc-9d5b-6407d2e83911.png",
        badge: "Popular Pick",
        concentration: "Eau de Parfum",
    },
    {
        id: "46",
        brand: "DE QOLLMER",
        name: "Passion",
        slug: "passion",
        price: 89,
        rating: 4.8,
        reviews: 33,
        image: "http://127.0.0.1:8000/storage/products/exec-ad63c254-2ef0-4f03-a35b-940bfba7d6f2%20-%20Copy%20-%20Copy.png",
        concentration: "Eau de Parfum",
    },
];

export default function DeQollmerCollectionSection({ products }: DeQollmerCollectionSectionProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const animFrameRef = useRef<number | null>(null);
    const isAnimatingRef = useRef(false);

    // Strictly filter to DE QOLLMER brand only
    const deqollmerOnly = (products && products.length > 0)
        ? products.filter((p) => {
            const b = String(p.brand || "").toLowerCase().replace(/[-_]/g, " ");
            return b.includes("de qollmer") || b.includes("deqollmer");
        })
        : [];

    const activeList = deqollmerOnly.length > 0 ? deqollmerOnly : FALLBACK_DEQOLLMER_PRODUCTS;

    // Create 3 identical sets for a true infinite loop without backwards rewind
    const loopedList = [...activeList, ...activeList, ...activeList];

    // Initialize scroll position to the middle set once mounted
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const initTimer = setTimeout(() => {
            const singleSetWidth = el.scrollWidth / 3;
            if (singleSetWidth > 100 && el.scrollLeft < 50) {
                el.scrollLeft = singleSetWidth;
            }
        }, 150);

        return () => clearTimeout(initTimer);
    }, [activeList.length]);

    const cancelAnimation = () => {
        if (animFrameRef.current !== null) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        isAnimatingRef.current = false;
    };

    // Check wrap position for infinite looping
    const checkWrap = useCallback(() => {
        const el = carouselRef.current;
        if (!el) return;
        const singleSetWidth = el.scrollWidth / 3;
        if (singleSetWidth <= 100) return;

        if (el.scrollLeft >= singleSetWidth * 2) {
            el.scrollLeft -= singleSetWidth;
        } else if (el.scrollLeft <= 50) {
            el.scrollLeft += singleSetWidth;
        }
    }, []);

    // Custom slow, ultra-luxurious glide transition (1200ms easeInOutCubic)
    const smoothScroll = useCallback((distance: number, duration: number = 1200) => {
        const el = carouselRef.current;
        if (!el) return;

        cancelAnimation();
        isAnimatingRef.current = true;

        const startLeft = el.scrollLeft;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Gentle luxury easeInOutCubic curve: soft acceleration, long smooth glide, soft decrescendo
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            el.scrollLeft = startLeft + distance * ease;

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                isAnimatingRef.current = false;
                animFrameRef.current = null;
                checkWrap();
            }
        };

        animFrameRef.current = requestAnimationFrame(animate);
    }, [checkWrap]);

    const getStepSize = () => {
        if (typeof window === "undefined") return 324;
        if (window.innerWidth >= 1024) return 324; // 300px card + 24px gap
        if (window.innerWidth >= 768) return 304;  // 280px card + 24px gap
        if (window.innerWidth >= 640) return 276;  // 260px card + 16px gap
        return 256;                                // 240px card + 16px gap
    };

    const scroll = useCallback((direction: "left" | "right") => {
        const step = getStepSize();
        smoothScroll(direction === "right" ? step : -step, 1200);
    }, [smoothScroll]);

    // Auto-scroll effect: slow, elegant forward glide every 4.5 seconds
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (!isAnimatingRef.current) {
                scroll("right");
            }
        }, 4500);

        return () => {
            clearInterval(interval);
            cancelAnimation();
        };
    }, [isPaused, scroll]);

    // Handle manual scroll wrapping (touch swipe or trackpad)
    const handleNativeScroll = () => {
        if (!isAnimatingRef.current) {
            checkWrap();
        }
    };

    return (
        <section
            id="de-qollmer-collection"
            className="w-full py-16 sm:py-20 bg-gradient-to-b from-[#1A1214] via-[#24171B] to-[#1A1214] text-[#F7F3F4] border-b border-[#E9D7C3]/15 overflow-hidden"
        >
            <div className="max-w-screen-2xl mx-auto flex flex-col relative w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-4 sm:px-8 md:px-12">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-[#4A323A]/70 border border-[#E9D7C3]/35 text-[#E9D7C3] text-[10px] font-semibold tracking-[0.25em] uppercase">
                            <Crown size={12} className="text-[#E9D7C3]" />
                            <span>OUR SIGNATURE MAISON</span>
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F7F3F4] font-light tracking-tight">
                            DE QOLLMER <span className="italic font-normal text-[#E9D7C3]">Collection</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-[#E9D7C3]/75 max-w-xl font-light">
                            Our exclusive in-house luxury creations. Handcrafted with precious botanical extracts and pure royal ouds.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        {/* Navigation Arrows */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => scroll("left")}
                                aria-label="Scroll left"
                                className="w-10 h-10 border border-[#E9D7C3]/30 bg-[#180F12]/80 hover:bg-[#E9D7C3] text-[#E9D7C3] hover:text-[#1B1315] flex items-center justify-center transition-all duration-300 cursor-pointer"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                aria-label="Scroll right"
                                className="w-10 h-10 border border-[#E9D7C3]/30 bg-[#180F12]/80 hover:bg-[#E9D7C3] text-[#E9D7C3] hover:text-[#1B1315] flex items-center justify-center transition-all duration-300 cursor-pointer"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <Link
                            href="/shop?brand=de-qollmer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#E9D7C3] hover:text-[#F7F3F4] transition-colors border-b border-[#E9D7C3]/30 hover:border-[#F7F3F4] pb-0.5"
                        >
                            <span>View All ({activeList.length})</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Single Row Horizontal Carousel */}
                <div
                    className="relative w-full group/carousel flex items-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    {/* Mobile Floating Scroll Arrows */}
                    <button
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                        className="sm:hidden absolute left-2 z-20 w-9 h-9 rounded-full bg-[#180F12]/90 border border-[#E9D7C3]/30 flex items-center justify-center text-[#E9D7C3] shadow-lg cursor-pointer"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                        className="sm:hidden absolute right-2 z-20 w-9 h-9 rounded-full bg-[#180F12]/90 border border-[#E9D7C3]/30 flex items-center justify-center text-[#E9D7C3] shadow-lg cursor-pointer"
                    >
                        <ChevronRight size={16} />
                    </button>

                    <div
                        ref={carouselRef}
                        onScroll={handleNativeScroll}
                        className="w-full px-4 sm:px-8 md:px-12 flex gap-4 sm:gap-6 overflow-x-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {loopedList.map((product, idx) => (
                            <div
                                key={`${product.id}-${idx}`}
                                className="min-w-[245px] sm:min-w-[265px] md:min-w-[285px] lg:min-w-[295px] max-w-[305px] flex-shrink-0 transition-transform duration-300 hover:-translate-y-1.5"
                            >
                                <DeQollmerProductCard product={product} />
                            </div>
                        ))}

                        {/* End spacing buffer */}
                        <div className="min-w-[12px] sm:min-w-[24px] flex-shrink-0" aria-hidden="true" />
                    </div>
                </div>

                {/* Bottom CTA to Combo Offers */}
                <div className="mt-10 sm:mt-12 flex justify-center px-4">
                    <Link
                        href="/combo-offer"
                        className="group inline-flex items-center gap-3 px-8 py-3.5 border border-[#E9D7C3]/40 bg-[#180F12]/80 hover:bg-[#E9D7C3] text-[#E9D7C3] hover:text-[#1B1315] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-[0_4px_20px_rgba(233,215,195,0.25)] hover:scale-105 active:scale-95"
                    >
                        <Sparkles size={14} className="text-[#E9D7C3] group-hover:text-[#1B1315] transition-colors" />
                        <span>Explore Combo Offers</span>
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section >
    );
}
