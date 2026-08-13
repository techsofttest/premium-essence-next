"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BrandItem {
    id?: number;
    name: string;
    slug?: string;
    logo?: string;
    classification?: string;
}

const FALLBACK_LOGOS: Record<string, string> = {
    "dior": "/product-logo-mockup/doir-mockup.jpg",
    "chanel": "/product-logo-mockup/Chanel-mockup.png",
    "tom ford": "/product-logo-mockup/tom-ford-mockup.png",
    "creed": "/product-logo-mockup/Creed-mockup2.jpg",
    "gucci": "/product-logo-mockup/Gucci-mockup.jpg",
    "yves saint laurent": "/product-logo-mockup/Yves Saint Laurent-mockup.png",
    "versace": "/product-logo-mockup/Gucci-mockup.jpg",
    "hermès": "/product-logo-mockup/Chanel-mockup.png",
    "prada": "/product-logo-mockup/tom-ford-mockup.png",
    "bvlgari": "/product-logo-mockup/Creed-mockup2.jpg",
    "montblanc": "/product-logo-mockup/doir-mockup.jpg",
};

const DEFAULT_BRANDS: BrandItem[] = [
    { name: "Dior", slug: "dior", logo: "/product-logo-mockup/doir-mockup.jpg", classification: "Designer Houses" },
    { name: "Chanel", slug: "chanel", logo: "/product-logo-mockup/Chanel-mockup.png", classification: "Designer Houses" },
    { name: "Tom Ford", slug: "tom-ford", logo: "/product-logo-mockup/tom-ford-mockup.png", classification: "Prestige & Niche" },
    { name: "Creed", slug: "creed", logo: "/product-logo-mockup/Creed-mockup2.jpg", classification: "Prestige & Niche" },
    { name: "Gucci", slug: "gucci", logo: "/product-logo-mockup/Gucci-mockup.jpg", classification: "Designer Houses" },
    { name: "Yves Saint Laurent", slug: "yves-saint-laurent", logo: "/product-logo-mockup/Yves Saint Laurent-mockup.png", classification: "Designer Houses" },
];

interface BrandCarouselProps {
    initialBrands?: BrandItem[];
}

export default function BrandCarousel({ initialBrands }: BrandCarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [brands, setBrands] = useState<BrandItem[]>(
        initialBrands && initialBrands.length ? initialBrands : DEFAULT_BRANDS
    );

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        fetch(`${baseUrl}/storefront/brands`)
            .then((res) => res.json())
            .then((data) => {
                const list = data.all || [];
                if (list.length > 0) {
                    const mapped = list.map((b: any) => ({
                        id: b.id,
                        name: b.name,
                        slug: b.slug || b.name.toLowerCase().replace(/ /g, '-'),
                        product_image_url: b.product_image_url || null,
                        logo: b.logo_url || b.logo || FALLBACK_LOGOS[b.name.toLowerCase()] || "/product-logo-mockup/doir-mockup.jpg",
                        classification: b.classification,
                    }));
                    setBrands(mapped);
                }
            })
            .catch(() => undefined);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const scrollAmount = window.innerWidth >= 1024 ? 480 : 300;
            carouselRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="relative w-full pt-20 pb-12 overflow-hidden bg-gradient-to-br from-[#DEDEDE] to-[#F7F3F4] font-sans border-t border-dark/5">

            {/* Perfume in Water Background Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-[#4A323A]/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#D4AF37]/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '2s' }} />
                <div className="absolute top-[20%] left-[40%] w-[40%] h-[60%] bg-[#F7F3F4]/40 rounded-full mix-blend-overlay filter blur-[80px]" />
                <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-12 px-8">
                    <span className="text-xs tracking-[0.3em] uppercase text-dark/50 block mb-3 font-medium">
                        The Prestige Portfolio
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight">
                        Discover the World's <br className="hidden sm:block" />
                        <span className="italic text-[#4A323A]">Finest Houses</span>
                    </h2>
                </div>

                {/* Carousel Container Wrapper */}
                <div className="relative w-full group/carousel flex items-center">

                    {/* Left Scroll Chevron Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-2 md:left-6 lg:left-8 z-20 w-12 h-12 rounded-none bg-[#F7F3F4]/90 backdrop-blur-sm border border-dark/5 flex items-center justify-center text-dark transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-[#1B1315] hover:text-[#F7F3F4] hover:scale-105 shadow-sm active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>

                    {/* Right Scroll Chevron Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-2 md:right-6 lg:right-8 z-20 w-12 h-12 rounded-none bg-[#F7F3F4]/90 backdrop-blur-sm border border-dark/5 flex items-center justify-center text-dark transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:bg-[#1B1315] hover:text-[#F7F3F4] hover:scale-105 shadow-sm active:scale-95"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} strokeWidth={1.5} />
                    </button>

                    {/* Horizontal Scrolling Track */}
                    <div
                        ref={carouselRef}
                        className="w-full px-6 md:px-12 lg:px-20 flex gap-6 md:gap-8 lg:gap-12 overflow-x-auto snap-x snap-mandatory py-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
                    >
                        {brands.map((brand, index) => (
                            <BrandCarouselCard key={brand.id || brand.slug || index} brand={brand} index={index} />
                        ))}

                        <div className="min-w-[1px] md:min-w-[40px]" aria-hidden="true" />
                    </div>

                </div>

            </div>
        </section>
    );
}

function BrandCarouselCard({ brand, index }: { brand: any; index: number }) {
    const primaryImage = brand.product_image_url || brand.logo || FALLBACK_LOGOS[brand.name?.toLowerCase() || ''] || "/product-logo-mockup/doir-mockup.jpg";
    const fallbackLogo = brand.logo || FALLBACK_LOGOS[brand.name?.toLowerCase() || ''] || "/product-logo-mockup/doir-mockup.jpg";
    const [imgSrc, setImgSrc] = useState(primaryImage);

    useEffect(() => {
        setImgSrc(primaryImage);
    }, [primaryImage]);

    return (
        <Link
            href={`/brand/${brand.slug || brand.name?.toLowerCase().replace(/ /g, '-')}`}
            className="flex flex-col items-center gap-4 w-[26%] md:w-[25%] lg:w-[24%] min-w-[160px] md:min-w-[220px] max-w-[280px] shrink-0 snap-center group"
        >
            <div className="relative w-full aspect-[4/5] rounded-t-[8rem] flex items-center justify-center transition-all duration-1000 ease-out group-hover:rounded-none overflow-hidden bg-white/40 shadow-md">
                <Image
                    src={imgSrc}
                    alt={`${brand.name}`}
                    fill
                    unoptimized
                    onError={() => {
                        if (imgSrc !== fallbackLogo) {
                            setImgSrc(fallbackLogo);
                        }
                    }}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 160px, 220px"
                />

                <div className="absolute inset-4 border border-white/20 z-10 pointer-events-none group-hover:border-white/40 transition-all duration-1000 ease-out rounded-t-[8rem] group-hover:rounded-none" />

                <svg className="absolute top-6 right-6 w-3 h-3 text-[#D4AF37] opacity-40 group-hover:opacity-90 group-hover:rotate-90 transition-all duration-1000 ease-out z-20 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>

                <span className="absolute bottom-6 left-6 text-[9px] font-sans tracking-[0.15em] text-white/80 font-medium z-20 pointer-events-none group-hover:text-white transition-all duration-1000 whitespace-nowrap bg-dark/40 px-2 py-0.5 backdrop-blur-xs">
                    N° 0{index + 1}
                </span>

                <div className="absolute inset-0 bg-dark/15 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-10" />
            </div>

            <div className="flex flex-col items-center gap-0.5">
                <span className="font-serif text-lg text-dark/80 group-hover:text-dark transition-colors tracking-wide text-center">
                    {brand.name}
                </span>
                {brand.classification && (
                    <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">
                        {brand.classification}
                    </span>
                )}
            </div>
        </Link>
    );
}