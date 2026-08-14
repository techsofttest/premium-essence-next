"use client";

import ProductCard, { Product } from "@/components/ui/ProductCard";

interface BestChoicesGridProps {
    products: Record<"bestsellers" | "newArrivals", Product[]>;
}

export default function BestChoicesGrid({ products }: BestChoicesGridProps) {
    // Combine bestsellers and new arrivals uniquely to showcase luxury items in grid
    const allProducts = Array.from(
        new Map([...(products.bestsellers || []), ...(products.newArrivals || [])].map((p) => [p.id, p])).values()
    );

    return (
        <section className="py-24 px-8 bg-[#F7F3F4] border-t border-dark/5">
            <div className="max-w-screen-2xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center mb-16 flex flex-col gap-3">
                    <span className="text-[11px] tracking-[0.3em] uppercase text-dark/50 font-medium">
                        Bespoke Selections
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide text-dark">
                        Our Best Choices
                    </h2>
                    <div className="w-12 h-[1px] bg-[#4A323A] mx-auto mt-2"></div>
                    <p className="text-sm text-dark/60 max-w-lg mx-auto leading-relaxed mt-1">
                        Handpicked masterpieces of absolute fragrance excellence, curated by our master perfumers.
                    </p>
                </div>

                {/* 2-Row Editorial Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-16">
                    {allProducts.map((product, idx) => (
                        <ProductCard key={`best-choice-${product.id}-${idx}`} product={product} />
                    ))}
                </div>

            </div>
        </section>
    );
}
