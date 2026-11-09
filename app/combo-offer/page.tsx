"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, Sparkles, Tag } from "lucide-react";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import { getStorefrontCuratedDeals, CuratedDeal } from "@/lib/deals";
import SeoHead from "@/components/seo/SeoHead";
import PageBanner from "@/components/global/PageBanner";

function ComboOfferContent() {
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

            {/* Dynamic Inner Page Banner */}
            <PageBanner
                pageKey="combo_offer"
                fallbackImage="/banners/banner2.jpg"
                title="Combo Offers & Luxury Bundles"
                subtitle="Discover our handpicked luxury combo sets, gift boxes, and curated fragrance pairings with exclusive connoisseur savings."
                kicker="Special Curations"
                breadcrumbs={[{ label: "Combo Offer" }]}
                badge={`${deals.length} Active Offers`}
            />

            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 pt-8">
                {/* Active Offers Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-dark/10">
                    <p className="text-xs uppercase tracking-widest text-dark/70 font-bold">
                        Featuring {deals.length} Handcrafted Bundle{deals.length === 1 ? "" : "s"} & Gift Sets
                    </p>
                    <span className="bg-[#1B1315] text-[#C5A059] text-xs font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-2 shadow-sm w-fit">
                        <Tag size={14} /> Limited Stock Bundles
                    </span>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="p-24 text-center text-dark/60 flex items-center justify-center gap-3 bg-white border border-dark/10">
                        <Loader2 className="animate-spin text-dark" size={24} /> Loading combo offers...
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-16 text-center shadow-sm">
                        <p className="font-serif text-2xl text-dark">No combo offers available</p>
                        <p className="text-xs text-dark/60 mt-2 mb-6">Check back soon for updated bundle deals.</p>
                        <Link
                            href="/shop"
                            className="bg-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors inline-block"
                        >
                            Explore Shop Catalog
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

export default function ComboOfferPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <ComboOfferContent />
        </Suspense>
    );
}
