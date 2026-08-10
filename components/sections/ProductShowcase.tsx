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
        <section className="py-24 px-12 md:px-24 lg:px-32 bg-[#F7F3F4] w-full font-sans">
            <div className="max-w-screen-2xl mx-auto flex flex-col items-center">

                {/* Tabbed Header */}
                <div className="flex items-center gap-6 mb-10 border-b border-dark/10 pb-4">
                    <button
                        onClick={() => setActiveTab("bestsellers")}
                        className={`font-serif text-3xl tracking-wide transition-colors duration-300 ${activeTab === "bestsellers" ? "text-dark" : "text-dark/30 hover:text-dark/60"
                            }`}
                    >
                        BESTSELLERS
                    </button>
                    <span className="text-dark/20 text-3xl font-light">|</span>
                    <button
                        onClick={() => setActiveTab("newArrivals")}
                        className={`font-serif text-3xl tracking-wide transition-colors duration-300 ${activeTab === "newArrivals" ? "text-dark" : "text-dark/30 hover:text-dark/60"
                            }`}
                    >
                        NEW ARRIVALS
                    </button>
                </div>

                {/* Product Grid */}
                <div
                    key={activeTab}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
                >
                    {products[activeTab].map((product, idx) => (
                        <ProductCard key={`showcase-${activeTab}-${product.id}-${idx}`} product={product} />
                    ))}
                </div>

                {/* Bottom CTA to view all products in the selected category */}
                <div className="mt-12">
                    <GlowingButton variant="outline" className="px-12">
                        View All {activeTab === "bestsellers" ? "Bestsellers" : "New Arrivals"}
                    </GlowingButton>
                </div>

            </div>
        </section>
    );
}