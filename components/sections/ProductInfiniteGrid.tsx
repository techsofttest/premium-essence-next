"use client";

import { useEffect } from "react";
import ProductCard, { Product } from "@/components/ui/ProductCard";

interface ProductInfiniteGridProps {
    products: Product[];
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
}

export default function ProductInfiniteGrid({
    products,
    hasMore,
    isLoading,
    onLoadMore
}: ProductInfiniteGridProps) {
    // Infinite Scroll Implementation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        const sentinel = document.getElementById("scroll-sentinel");
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-16">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Infinite Scroll Sentinel & Loading Indicator */}
            <div id="scroll-sentinel" className="mt-20 py-10 flex flex-col items-center justify-center gap-4">
                {isLoading && (
                    <>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-dark/40 font-bold">
                            Discovering More Essence
                        </span>
                    </>
                )}
                {!isLoading && !hasMore && (
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-px w-24 bg-dark/10"></div>
                        <span className="text-[10px] tracking-[0.3em] uppercase text-dark/30 font-bold">
                            End of Collection
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
