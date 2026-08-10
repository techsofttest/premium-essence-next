"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductBanner from "@/components/sections/ProductBanner";
import { Product } from "@/components/ui/ProductCard";
import CategoryHeader from "@/components/sections/CategoryHeader";
import FilterDrawer from "@/components/sections/FilterDrawer";
import ProductInfiniteGrid from "@/components/sections/ProductInfiniteGrid";
import { getStorefrontProductsWithMeta } from "@/lib/storefront";

export default function BrandProductsPage() {
    const params = useParams();
    const slug = params.slug as string;
    const brandTitle = slug
        ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : "Brand Products";

    const config = {
        title: `${brandTitle} Collection`,
        banner: "/product-banner/Montblanc-B.png",
        filters: []
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState(5000);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setIsLoadingMore(true);
        getStorefrontProductsWithMeta({
            brand: slug,
            sort: sortBy,
            page: 1,
            per_page: 24,
        }).then((res) => {
            if (!isMounted) return;
            setProducts(res.products);
            setPage(1);
            setHasMore(res.meta ? res.meta.current_page < res.meta.last_page : false);
            setIsLoadingMore(false);
        }).catch(() => {
            if (isMounted) setIsLoadingMore(false);
        });

        return () => { isMounted = false; };
    }, [slug, sortBy]);

    const handleLoadMore = () => {
        if (!hasMore || isLoadingMore) return;
        setIsLoadingMore(true);
        const nextPage = page + 1;
        getStorefrontProductsWithMeta({
            brand: slug,
            sort: sortBy,
            page: nextPage,
            per_page: 24,
        }).then((res) => {
            setProducts((prev) => [...prev, ...res.products]);
            setPage(nextPage);
            setHasMore(res.meta ? res.meta.current_page < res.meta.last_page : false);
            setIsLoadingMore(false);
        }).catch(() => setIsLoadingMore(false));
    };

    return (
        <main className="w-full bg-[#F7F3F4] min-h-screen font-sans pb-20">
            <style jsx global>{`
                .filter-drawer-scroll::-webkit-scrollbar {
                    width: 3px;
                }
                .filter-drawer-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .filter-drawer-scroll::-webkit-scrollbar-thumb {
                    background: #1B1315;
                    border-radius: 10px;
                }
            `}</style>

            <ProductBanner
                imageUrl={config.banner}
                altText={config.title}
                priority={true}
            />

            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 mt-12">
                <CategoryHeader 
                    title={config.title}
                    onOpenFilter={() => setIsFilterOpen(true)}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                <ProductInfiniteGrid 
                    products={products}
                    hasMore={hasMore}
                    isLoading={isLoadingMore}
                    onLoadMore={handleLoadMore}
                />
            </div>

            <FilterDrawer 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                config={config}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
            />
        </main>
    );
}
