"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import GlowingButton from "../ui/GlowingButton";
import { Product } from "../ui/ProductCard";
import { useCart } from "@/context/CartContext";

const DEFAULT_PRODUCTS: Product[] = [
    {
        id: "1",
        brand: "Tom Ford",
        name: "Oud Wood",
        price: 1250,
        rating: 4.8,
        reviews: 890,
        image: "/products/Oud%20Wood%20Private%20Blend%201.png",
    },
    {
        id: "2",
        brand: "Creed",
        name: "Aventus",
        price: 1450,
        rating: 5.0,
        reviews: 2100,
        image: "/products/Aventus%201.png",
    },
    {
        id: "3",
        brand: "Dior",
        name: "Sauvage Elixir",
        price: 685,
        rating: 4.9,
        reviews: 1240,
        image: "/products/Sauvage%20Elixir%201.png",
    },
    {
        id: "4",
        brand: "Maison Francis Kurkdjian",
        name: "Baccarat Rouge 540",
        price: 1350,
        rating: 4.9,
        reviews: 420,
        image: "/products/Baccarat%20Rouge%20540%201.png",
    },
    {
        id: "5",
        brand: "Yves Saint Laurent",
        name: "Y Le Parfum",
        price: 590,
        rating: 4.7,
        reviews: 310,
        image: "/products/Y%20Le%20Parfum%201.png",
    }
];

interface InteractiveShowcaseProps {
    products?: Product[];
}

export default function InteractiveShowcase({ products }: InteractiveShowcaseProps) {
    const { addToCart, setSelectedProduct, setIsModalOpen } = useCart();
    const showcaseProducts = products && products.length > 0 ? products : DEFAULT_PRODUCTS;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [imgSrc, setImgSrc] = useState(showcaseProducts[0]?.image || "/logo/logo-black.png");
    const [translateXStep, setTranslateXStep] = useState(180);

    const activeProduct = showcaseProducts[activeIndex] || showcaseProducts[0];

    useEffect(() => {
        const updateStep = () => {
            if (window.innerWidth < 480) {
                setTranslateXStep(70);
            } else if (window.innerWidth < 640) {
                setTranslateXStep(90);
            } else if (window.innerWidth < 1024) {
                setTranslateXStep(130);
            } else {
                setTranslateXStep(180);
            }
        };
        updateStep();
        window.addEventListener("resize", updateStep);
        return () => window.removeEventListener("resize", updateStep);
    }, []);

    useEffect(() => {
        if (activeProduct) {
            setImgSrc(activeProduct.image || "/logo/logo-black.png");
        }
    }, [activeProduct]);

    const handleNext = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, [showcaseProducts.length]);

    const handlePrev = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + showcaseProducts.length) % showcaseProducts.length);
    }, [showcaseProducts.length]);

    useEffect(() => {
        if (isPaused || showcaseProducts.length <= 1) return;

        const interval = setInterval(() => {
            handleNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex, isPaused, handleNext, showcaseProducts.length]);

    const handleAddToCart = () => {
        if (!activeProduct) return;
        if (activeProduct.variants?.length) {
            setSelectedProduct(activeProduct);
            setIsModalOpen(true);
        } else {
            addToCart({
                id: activeProduct.id,
                brand: activeProduct.brand,
                name: activeProduct.name,
                price: activeProduct.price,
                size: "100ml",
                image: activeProduct.image,
                quantity: 1,
                productId: Number(activeProduct.id),
            });
        }
    };

    if (!activeProduct) return null;

    return (
        <section
            className="w-full py-16 sm:py-20 md:py-24 lg:py-28 bg-[#FFFFFF] font-sans overflow-hidden border-t border-dark/10 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-screen-2xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">

                {/* TOP (Mobile) / LEFT (Desktop): 3D Circular Path Carousel */}
                <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] lg:col-span-7 flex items-center justify-center [perspective:1000px]">
                    {showcaseProducts.map((product, index) => {
                        let diff = index - activeIndex;
                        const total = showcaseProducts.length;

                        if (diff > Math.floor(total / 2)) diff -= total;
                        if (diff < -Math.floor(total / 2)) diff += total;

                        const isCenter = diff === 0;
                        const translateX = diff * translateXStep;
                        const translateZ = Math.abs(diff) * -90;
                        const rotateY = diff * -20;
                        const scale = 1 - Math.abs(diff) * 0.15;
                        const opacity = 1 - Math.abs(diff) * 0.25;
                        const zIndex = 10 - Math.abs(diff);

                        return (
                            <div
                                key={product.id || index}
                                onClick={() => setActiveIndex(index)}
                                className={`absolute top-1/2 left-1/2 w-[180px] h-[270px] sm:w-[240px] sm:h-[360px] md:w-[300px] md:h-[450px] cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isCenter ? 'drop-shadow-2xl' : 'drop-shadow-md hover:opacity-100'}`}
                                style={{
                                    transform: `translate(calc(-50% + ${translateX}px), -50%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                                    opacity: opacity,
                                    zIndex: zIndex,
                                }}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={product.image || "/logo/logo-black.png"}
                                        alt={product.name}
                                        fill
                                        unoptimized
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            if (target) target.src = "/logo/logo-black.png";
                                        }}
                                        className="object-contain drop-shadow-2xl p-2 sm:p-4"
                                        sizes="(max-width: 768px) 180px, 300px"
                                        priority={isCenter}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* BOTTOM (Mobile) / RIGHT (Desktop): Dynamic Details & CTA */}
                <div className="w-full lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-20 min-w-0 lg:pl-12 mt-6 lg:mt-0">
                    <div className="animate-in slide-in-from-right-8 fade-in duration-700 ease-out w-full" key={activeProduct.id}>
                        <span className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#C5A059] font-bold mb-2 sm:mb-3 block">
                            Featured Collection &mdash; {activeProduct.brand}
                        </span>

                        {/* Title */}
                        <Link href={activeProduct.slug ? `/product/${activeProduct.slug}` : `/product/${activeProduct.id}`}>
                            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight leading-[1.15] mb-3 hover:text-dark/70 transition-colors">
                                {activeProduct.name}
                            </h2>
                        </Link>

                        <p className="text-xs sm:text-sm md:text-base text-dark/60 font-light tracking-wide mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0">
                            Prestige Collection Selection <br className="hidden md:block" />
                            <span className="font-medium text-dark">
                                Crafted for Fine Connoisseurs
                            </span>
                        </p>

                        {/* Price & Rating */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 mb-8 sm:mb-10">
                            <div className="flex items-baseline gap-2 sm:gap-3">
                                <span className="font-serif text-2xl sm:text-3xl text-dark">
                                    {activeProduct.price} <span className="text-lg sm:text-xl font-sans">AED</span>
                                </span>
                                {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                                    <span className="text-sm sm:text-base text-dark/40 line-through font-light">
                                        {activeProduct.originalPrice} AED
                                    </span>
                                )}
                            </div>

                            <div className="h-7 sm:h-8 w-px bg-dark/10" />

                            <div className="flex items-center gap-1.5 sm:gap-2 text-dark/80">
                                <Star size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                                <span className="font-medium text-base sm:text-lg">{activeProduct.rating || 5.0}</span>
                                <span className="text-xs sm:text-sm text-dark/50">({activeProduct.reviews || 0} Reviews)</span>
                            </div>
                        </div>

                        {/* CTA Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                            <GlowingButton 
                                onClick={handleAddToCart}
                                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={16} /> Add to Cart
                            </GlowingButton>

                            {/* Slider Controls */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handlePrev}
                                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-none border border-dark/10 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-colors duration-300"
                                    aria-label="Previous product"
                                >
                                    <ChevronLeft size={20} strokeWidth={1.5} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-none border border-dark/10 flex items-center justify-center text-dark hover:bg-dark hover:text-white transition-colors duration-300"
                                    aria-label="Next product"
                                >
                                    <ChevronRight size={20} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}