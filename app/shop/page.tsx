"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ProductCatalogView from "@/components/shop/ProductCatalogView";

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <ProductCatalogView
                title="All Perfumes & Fragrances"
                subtitle="Browse our complete collection of luxury fragrances, Eau de Parfum, Extrait de Parfum, and Niche perfume houses."
                bannerImage="/product-banner/Montblanc-B.png"
            />
        </Suspense>
    );
}
