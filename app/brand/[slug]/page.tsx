"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductCatalogView from "@/components/shop/ProductCatalogView";

function BrandCatalogContent() {
    const params = useParams();
    const slug = params.slug as string;

    const brandTitle = slug
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : "Brand Products";

    return (
        <ProductCatalogView
            title={`${brandTitle} Collection`}
            subtitle={`Explore exclusive fragrances and signature creations from ${brandTitle}.`}
            fixedBrand={slug}
            bannerImage="/product-banner/Montblanc-B.png"
        />
    );
}

export default function BrandProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <BrandCatalogContent />
        </Suspense>
    );
}
