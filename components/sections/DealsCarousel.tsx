"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEALS = [
    {
        id: 1,
        name: "The Signature Discovery Set",
        image: "/deals/The%20Signature%20Discovery%20Set.png",
        link: "/deals/discovery-set",
    },
    {
        id: 2,
        name: "Ultimate His & Hers Box",
        image: "/deals/Ultimate%20His%20%26%20Hers%20Box.png",
        link: "/deals/ultimate-box",
    },
    {
        id: 3,
        name: "Top Collection Trio",
        image: "/deals/Top Collection Trio.png",
        link: "/deals/oud-trio",
    },
    {
        id: 4,
        name: "Travel Miniatures Vault",
        image: "/deals/travel_vault.png",
        link: "/deals/travel-vault",
    },
    {
        id: 5,
        name: "Midnight Exclusives",
        image: "/deals/midnight_exclusive.png",
        link: "/deals/midnight-exclusive",
    }
];

export default function DealsCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [itemsVisible, setItemsVisible] = useState(3);
    const [isMounted, setIsMounted] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Track screen size to adjust the number of visible items and disable logic
    useEffect(() => {
        setIsMounted(true);
        const handleResize = () => {
            setItemsVisible(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sync dots with manual swiping
    const handleScroll = () => {
        if (!carouselRef.current) return;
        const scrollLeft = carouselRef.current.scrollLeft;
        const itemWidth = carouselRef.current.children[0].clientWidth;
        const gap = 24; // gap-6 is 24px in Tailwind

        // Calculate index based on scroll position + gap
        const newIndex = Math.round(scrollLeft / (itemWidth + gap));
        setActiveIndex(newIndex);
    };

    // Deterministic scroll calculation to prevent vertical jumping
    const scrollToIndex = (index: number) => {
        if (!carouselRef.current) return;
        const targetNode = carouselRef.current.children[index] as HTMLElement;
        if (targetNode) {
            const gap = 24; // gap-6
            const scrollAmount = index * (targetNode.clientWidth + gap);
            carouselRef.current.scrollTo({
                left: scrollAmount,
                behavior: "smooth"
            });
            setActiveIndex(index);
        }
    };

    const handleNext = () => {
        if (activeIndex < DEALS.length - itemsVisible) scrollToIndex(activeIndex + 1);
    };

    const handlePrev = () => {
        if (activeIndex > 0) scrollToIndex(activeIndex - 1);
    };

    return (
        <section className="py-24 w-full bg-[#F7F3F4] font-sans overflow-hidden relative group">
            <div className="max-w-screen-2xl mx-auto flex flex-col items-center relative w-full">

                {/* Section Header */}
                <div className="text-center mb-12 px-8">
                    <span className="text-xs tracking-[0.3em] uppercase text-dark/50 block mb-3 font-medium">
                        Special Deals
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight">
                        Exclusive Curations
                    </h2>
                </div>

                {/* Left Control Button */}
                <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className={`absolute left-2 md:left-6 lg:left-12 top-[60%] -translate-y-1/2 z-20 w-12 h-12 rounded-none bg-[#F7F3F4]/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-dark/5 flex items-center justify-center text-dark transition-all duration-300 ${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-dark hover:text-cream hover:scale-110"
                        }`}
                >
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </button>

                {/* Right Control Button */}
                <button
                    onClick={handleNext}
                    disabled={activeIndex >= DEALS.length - itemsVisible}
                    className={`absolute right-2 md:right-6 lg:right-12 top-[60%] -translate-y-1/2 z-20 w-12 h-12 rounded-none bg-[#F7F3F4]/90 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-dark/5 flex items-center justify-center text-dark transition-all duration-300 ${!isMounted || activeIndex >= DEALS.length - itemsVisible ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-dark hover:text-cream hover:scale-110"
                        }`}
                >
                    <ChevronRight size={24} strokeWidth={1.5} />
                </button>

                {/* Carousel Container */}
                <div
                    ref={carouselRef}
                    onScroll={handleScroll}
                    // Fixed Padding & scroll-padding to ensure the first item NEVER touches the edge
                    className="w-full px-6 md:px-16 lg:px-24 scroll-pl-6 md:scroll-pl-16 lg:scroll-pl-24 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                >
                    {DEALS.map((deal) => (
                        <Link
                            href={deal.link}
                            key={deal.id}
                            /* Guaranteed exactly 3 items fit on large screens minus the gaps */
                            className="shrink-0 flex flex-col items-center group snap-start cursor-pointer w-[85%] md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                        >
                            {/* Inner wrapper reduces the image size while keeping the flex-item width intact */}
                            <div className="relative w-full max-w-[320px] aspect-square bg-zinc-50 rounded-none overflow-hidden border border-dark/5 mb-6 transition-all duration-500 group-hover:shadow-xl group-hover:border-dark/10">
                                <Image
                                    src={deal.image}
                                    alt={deal.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/5 transition-colors duration-500 pointer-events-none" />
                            </div>

                            <span className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-dark/70 hover:text-dark transition-colors text-center font-medium">
                                {deal.name}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Bottom Indicators (Dots) */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    {isMounted && DEALS.map((_, index) => {
                        const isVisibleDot = index <= DEALS.length - itemsVisible;

                        if (!isVisibleDot) return null;

                        return (
                            <button
                                key={index}
                                onClick={() => scrollToIndex(index)}
                                aria-label={`Go to deal slide ${index + 1}`}
                                className={`transition-all duration-500 ease-in-out rounded-none ${index === activeIndex
                                    ? "w-8 h-[3px] bg-dark opacity-100"
                                    : "w-2 h-[3px] bg-dark opacity-20 hover:opacity-50"
                                    }`}
                            />
                        );
                    })}
                </div>

            </div>
        </section>
    );
}