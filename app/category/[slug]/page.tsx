"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductBanner from "@/components/sections/ProductBanner";
import { Product } from "@/components/ui/ProductCard";
import CategoryHeader from "@/components/sections/CategoryHeader";
import FilterDrawer from "@/components/sections/FilterDrawer";
import ProductInfiniteGrid from "@/components/sections/ProductInfiniteGrid";
import { getStorefrontProductsWithMeta } from "@/lib/storefront";

const CATEGORIES_CONFIG: Record<string, any> = {
    "men": {
        title: "Men's Fragrances",
        banner: "/product-banner/Montblanc-B.png",
        filters: [
            { id: "brand", label: "Brand", options: ["Creed", "Dior", "Tom Ford", "Chanel", "Gucci", "YSL"] },
            { id: "fragrance_type", label: "Fragrance Type", options: ["Oud", "Woody", "Fresh", "Spicy", "Oriental"] },
            { id: "collection", label: "Collection", options: ["Private Blend", "Signature", "Iconic", "Discovery"] },
            { id: "availability", label: "Availability", options: ["In Stock", "Out of Stock"] },
        ]
    },
    "women": {
        title: "Women's Fragrances",
        banner: "/product-banner/Montblanc-B.png",
        filters: [
            { id: "brand", label: "Brand", options: ["Dior", "Chanel", "Tom Ford", "Givenchy", "Lancôme"] },
            { id: "fragrance_type", label: "Fragrance Type", options: ["Floral", "Fruity", "Sweet", "Fresh"] },
            { id: "collection", label: "Collection", options: ["Privée", "Les Exclusifs", "Heritage"] },
            { id: "availability", label: "Availability", options: ["In Stock", "Limited Edition"] },
        ]
    }
};

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const config = CATEGORIES_CONFIG[slug] || {
        title: slug ? `${slug.charAt(0).toUpperCase() + slug.slice(1)} Collection` : "Fragrance Collection",
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
            category: slug,
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
            category: slug,
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
