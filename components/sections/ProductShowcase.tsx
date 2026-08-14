"use client";

import { useState } from "react";
import ProductCard, { Product } from "../ui/ProductCard";
import GlowingButton from "../ui/GlowingButton";

interface ProductShowcaseProps {
    products: Record<"bestsellers" | "newArrivals", Product[]>;
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
    const [activeTab, setActiveTab] = useState<"bestsellers" | "newArrivals">("bestsellers");

    return (
        <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-8 md:px-16 lg:px-24 bg-[#F7F3F4] w-full font-sans">
            <div className="max-w-screen-2xl mx-auto flex flex-col items-center">

                {/* Tabbed Header */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 mb-8 sm:mb-10 border-b border-dark/10 pb-4 text-center w-full">
                    <button
                        onClick={() => setActiveTab("bestsellers")}
                        className={`font-serif text-base sm:text-2xl md:text-3xl tracking-wide transition-colors duration-300 uppercase ${activeTab === "bestsellers" ? "text-dark font-bold" : "text-dark/40 hover:text-dark/70"
                            }`}
                    >
                        BESTSELLERS
                    </button>
                    <span className="text-dark/20 text-base sm:text-2xl md:text-3xl font-light select-none">|</span>
                    <button
                        onClick={() => setActiveTab("newArrivals")}
                        className={`font-serif text-base sm:text-2xl md:text-3xl tracking-wide transition-colors duration-300 uppercase ${activeTab === "newArrivals" ? "text-dark font-bold" : "text-dark/40 hover:text-dark/70"
                            }`}
                    >
                        NEW ARRIVALS
                    </button>
                </div>

                {/* Product Grid */}
                <div
                    key={activeTab}
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
                >
                    {products[activeTab].map((product, idx) => (
                        <ProductCard key={`showcase-${activeTab}-${product.id}-${idx}`} product={product} />
                    ))}
                </div>

                {/* Bottom CTA to view all products in the selected category */}
                <div className="mt-8 sm:mt-12">
                    <GlowingButton variant="outline" className="px-8 sm:px-12 text-xs sm:text-sm">
                        View All {activeTab === "bestsellers" ? "Bestsellers" : "New Arrivals"}
                    </GlowingButton>
                </div>

            </div>
        </section>
    );
}