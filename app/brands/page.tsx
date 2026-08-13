"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BrandItem {
    id: number;
    name: string;
    slug: string;
    classification: string | null;
    logo_url: string | null;
    product_image_url: string | null;
    link: string;
}

export default function BrandsPage() {
    const [classifiedBrands, setClassifiedBrands] = useState<Record<string, BrandItem[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        fetch(`${baseUrl}/storefront/brands`)
            .then((res) => res.json())
            .then((data) => {
                if (data.by_classification) {
                    setClassifiedBrands(data.by_classification);
                }
            })
            .catch((err) => console.error("Error fetching brands:", err))
            .finally(() => setIsLoading(false));
    }, []);

    const FALLBACK_BRANDS: Record<string, { name: string; logo: string }[]> = {
        "Designer Houses": [
            { name: "Dior", logo: "/product-logo-mockup/doir-mockup.jpg" },
            { name: "Chanel", logo: "/product-logo-mockup/Chanel-mockup.png" },
            { name: "Gucci", logo: "/product-logo-mockup/Gucci-mockup.jpg" },
            { name: "Yves Saint Laurent", logo: "/product-logo-mockup/Yves Saint Laurent-mockup.png" },
            { name: "Versace", logo: "/product-logo-mockup/versace-mockup.png" },
        ],
        "Prestige & Niche": [
            { name: "Creed", logo: "/product-logo-mockup/Creed-mockup2.jpg" },
            { name: "Tom Ford", logo: "/product-logo-mockup/tom-ford-mockup.png" },
            { name: "Maison Francis Kurkdjian", logo: "/product-logo-mockup/Creed-mockup2.jpg" },
            { name: "Jo Malone London", logo: "/product-logo-mockup/tom-ford-mockup.png" },
        ],
        "Classic Elegance": [
            { name: "Hermès", logo: "/product-logo-mockup/Bvlgari-mockup.png" },
            { name: "Givenchy", logo: "/product-logo-mockup/Montblanc-mockup.png" },
            { name: "Prada", logo: "/product-logo-mockup/Bvlgari-mockup.png" },
            { name: "Bvlgari", logo: "/product-logo-mockup/Bvlgari-mockup.png" },
            { name: "Montblanc", logo: "/product-logo-mockup/Montblanc-mockup.png" },
        ],
    };

    const classifications = ["Designer Houses", "Prestige & Niche", "Classic Elegance"];

    return (
        <main className="relative w-full min-h-screen pt-8 pb-24 overflow-hidden font-sans bg-[#1B1315]">

            {/* 1. Base Sky Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2000&auto=format&fit=crop"
                    alt="Warm Luxury Sky"
                    fill
                    className="object-cover opacity-30 sepia-[40%] contrast-[110%] brightness-[0.8]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B1315]/90 via-[#4A323A]/40 to-[#1B1315]/95" />
            </div>

            {/* 2. Floating Gold Dust Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 opacity-60">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-[#D4AF37]/40 rounded-full blur-[1.5px] animate-pulse"
                            style={{
                                width: Math.random() * 4 + 1 + 'px',
                                height: Math.random() * 4 + 1 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDuration: Math.random() * 5 + 3 + 's',
                                animationDelay: Math.random() * 2 + 's',
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 3. Liquid Amber Diffusion */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-50">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[80%] bg-[#4A323A]/40 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#D4AF37]/20 rounded-full mix-blend-overlay filter blur-[150px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '2s' }} />
            </div>

            <div className="relative z-10 max-w-screen-2xl mx-auto flex flex-col items-center px-6 md:px-12 lg:px-20">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <span className="text-xs tracking-[0.3em] uppercase text-cream/50 block mb-4 font-medium">
                        The Prestige Portfolio
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.1]">
                        Discover the World's <br className="hidden sm:block" />
                        <span className="italic">Finest Houses</span>
                    </h1>
                </div>

                {/* Classified Brand Sections */}
                {classifications.map((classification) => {
                    const brandsInClass = classifiedBrands[classification] && classifiedBrands[classification].length > 0
                        ? classifiedBrands[classification]
                        : FALLBACK_BRANDS[classification]?.map((fb, idx) => ({
                            id: idx,
                            name: fb.name,
                            slug: fb.name.toLowerCase().replace(/ /g, '-'),
                            classification,
                            logo_url: fb.logo,
                            product_image_url: null,
                            link: `/brand/${fb.name.toLowerCase().replace(/ /g, '-')}`,
                        })) || [];

                    return (
                        <section key={classification} className="w-full mb-20">
                            <div className="flex items-center gap-4 mb-8 border-b border-cream/10 pb-4">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                <h2 className="font-serif text-2xl md:text-3xl text-[#D4AF37] tracking-wide">
                                    {classification}
                                </h2>
                                <span className="text-xs text-cream/40 uppercase tracking-widest ml-auto">
                                    {brandsInClass.length} Houses
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 w-full">
                                {brandsInClass.map((brand, index) => (
                                    <BrandPageCard key={brand.slug || index} brand={brand} index={index} />
                                ))}
                            </div>
                        </section>
                    );
                })}

            </div>
        </main>
    );
}

function BrandPageCard({ brand, index }: { brand: any; index: number }) {
    const primaryImage = brand.product_image_url || brand.logo_url || "/logo/logo-black.png";
    const fallbackLogo = brand.logo_url || "/logo/logo-black.png";
    const [imgSrc, setImgSrc] = useState(primaryImage);

    useEffect(() => {
        setImgSrc(primaryImage);
    }, [primaryImage]);

    return (
        <Link
            href={`/brand/${brand.slug}`}
            className="flex flex-col items-center gap-4 w-full group animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"
        >
            <div className="relative w-full aspect-[4/5] rounded-t-[8rem] flex items-center justify-center transition-all duration-1000 ease-out group-hover:rounded-none overflow-hidden bg-white/10 border border-white/20 backdrop-blur-md shadow-lg group-hover:shadow-2xl">
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-4 border border-white/30 z-10 pointer-events-none group-hover:border-[#D4AF37]/60 transition-all duration-1000 ease-out rounded-t-[8rem] group-hover:rounded-none" />
                <svg className="absolute top-6 right-6 w-4 h-4 text-[#D4AF37] opacity-60 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-1000 ease-out z-20 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>
                <span className="absolute bottom-6 left-6 text-[10px] font-sans tracking-[0.2em] text-white/70 font-medium z-20 pointer-events-none group-hover:text-white transition-all duration-1000 whitespace-nowrap drop-shadow-md bg-black/40 px-2 py-0.5 backdrop-blur-xs">
                    N° {String(index + 1).padStart(2, '0')}
                </span>
                <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-10" />
            </div>

            <span className="font-serif text-xl text-cream/90 group-hover:text-[#D4AF37] transition-colors tracking-wide text-center">
                {brand.name}
            </span>
        </Link>
    );
}