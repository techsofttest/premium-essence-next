"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, Sparkles, Tag } from "lucide-react";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import { getStorefrontCuratedDeals, CuratedDeal } from "@/lib/deals";
import SeoHead from "@/components/seo/SeoHead";

function CombosContent() {
    const [deals, setDeals] = useState<CuratedDeal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getStorefrontCuratedDeals()
            .then((res) => {
                setDeals(res || []);
            })
            .catch(() => {
                setDeals([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const products: Product[] = deals.map((deal) => ({
        id: `deal-${deal.slug}`,
        slug: `deals/${deal.slug}`,
        brand: "Exclusive Combo",
        name: deal.name,
        price: deal.price,
        originalPrice: deal.originalPrice,
        rating: 5.0,
        reviews: 120,
        image: deal.image,
        badge: deal.badge || `${deal.discountPercent}% OFF`,
    }));

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            <SeoHead pageSlug="combos" />
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 pt-10">
                
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-dark font-bold mb-8">
                    <Link href="/" className="hover:text-dark/60 transition-colors">Home</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <span className="text-dark/50">Combo Offers</span>
                </nav>

                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 border-b border-dark/10 pb-10">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                        <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-bold flex items-center gap-2">
                            <Sparkles size={14} className="text-[#C5A059]" />
                            Special Curations
                        </span>
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark tracking-tight">
                            Combo Offers & Bundles
                        </h1>
                        <div className="w-12 h-[1px] bg-[#4A323A] my-2 md:mx-0"></div>
                        <p className="text-sm text-dark/70 max-w-xl leading-relaxed">
                            Discover our handpicked luxury combo sets, gift boxes, and fragrance bundles crafted for connoisseurs with incredible savings.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-end">
                        <span className="bg-[#1B1315] text-[#C5A059] text-xs font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-2 shadow-sm">
                            <Tag size={14} /> {deals.length} Active Offers
                        </span>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="p-24 text-center text-dark/60 flex items-center justify-center gap-3 bg-white border border-dark/10">
                        <Loader2 className="animate-spin text-dark" size={24} /> Loading combo offers...
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-16 text-center shadow-sm">
                        <p className="font-serif text-2xl text-dark">No combo offers found</p>
                        <p className="text-xs text-dark/60 mt-2 mb-6">Check back soon for updated bundle deals.</p>
                        <Link
                            href="/shop"
                            className="bg-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors inline-block"
                        >
                            Explore Shop All
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function CombosPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <CombosContent />
        </Suspense>
    );
}
