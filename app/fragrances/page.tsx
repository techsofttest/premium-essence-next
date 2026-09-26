"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, Loader2, Sparkles, SlidersHorizontal, Check, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import { api } from "@/lib/api";

interface FilterOption {
    id: number;
    name: string;
    slug: string;
}

interface FilterMetadata {
    families: FilterOption[];
    concentrations: FilterOption[];
    genders: string[];
}

interface ActiveFragranceFilters {
    family: string;
    gender: string;
    concentration: string;
    collection: string;
    sort: string;
}

const getInitialFragranceFilters = (pathname: string, searchParams: URLSearchParams): ActiveFragranceFilters => {
    const defaults: ActiveFragranceFilters = {
        family: searchParams.get("family") || "",
        gender: searchParams.get("gender") || "",
        concentration: searchParams.get("concentration") || "",
        collection: searchParams.get("collection") || searchParams.get("collection_slug") || "",
        sort: searchParams.get("sort") || "sort_order",
    };

    if (typeof window !== "undefined") {
        const hasUrlParams = searchParams.toString().length > 0;
        if (!hasUrlParams) {
            try {
                const savedRaw = sessionStorage.getItem(`catalog_state_${pathname}`);
                if (savedRaw) {
                    const saved = JSON.parse(savedRaw);
                    if (saved && saved.activeFilters) {
                        return {
                            ...defaults,
                            ...saved.activeFilters,
                        };
                    }
                }
            } catch {}
        }
    }
    return defaults;
};

const getInitialFragrancePage = (pathname: string, searchParams: URLSearchParams): number => {
    if (typeof window !== "undefined") {
        const hasUrlParams = searchParams.toString().length > 0;
        if (!hasUrlParams) {
            try {
                const savedRaw = sessionStorage.getItem(`catalog_state_${pathname}`);
                if (savedRaw) {
                    const saved = JSON.parse(savedRaw);
                    if (saved && typeof saved.currentPage === "number") {
                        return saved.currentPage;
                    }
                }
            } catch {}
        }
    }
    return 1;
};

function FragranceCatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const storageKey = `catalog_state_${pathname}`;

    // React State initialized synchronously with restored session state
    const [activeFilters, setActiveFilters] = useState<ActiveFragranceFilters>(() =>
        getInitialFragranceFilters(pathname, searchParams)
    );

    // Pagination State (12 products per page)
    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState<number>(() =>
        getInitialFragrancePage(pathname, searchParams)
    );

    const isInternalCleanRef = useRef(false);
    const prevQueryRef = useRef(searchParams.toString());

    // Clean URL bar on user filter actions to prevent URL parameter clutter
    const cleanUrl = () => {
        if (typeof window !== "undefined") {
            isInternalCleanRef.current = true;
            router.replace(pathname, { scroll: false });
        }
    };

    // Synchronize activeFilters when external navigation links (e.g. footer/nav links) change searchParams
    useEffect(() => {
        const currentQuery = searchParams.toString();
        if (currentQuery !== prevQueryRef.current) {
            prevQueryRef.current = currentQuery;
            if (isInternalCleanRef.current) {
                isInternalCleanRef.current = false;
                return;
            }
            const urlFilters: ActiveFragranceFilters = {
                family: searchParams.get("family") || "",
                gender: searchParams.get("gender") || "",
                concentration: searchParams.get("concentration") || "",
                collection: searchParams.get("collection") || searchParams.get("collection_slug") || "",
                sort: searchParams.get("sort") || "sort_order",
            };
            setActiveFilters(urlFilters);
            setCurrentPage(1);
        }
    }, [searchParams, pathname]);

    // Save state to sessionStorage on any filter or pagination change
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            sessionStorage.setItem(
                storageKey,
                JSON.stringify({ activeFilters, currentPage })
            );
        } catch {
            // Ignore quota errors
        }
    }, [activeFilters, currentPage, storageKey]);

    const selectedFamily = activeFilters.family;
    const selectedGender = activeFilters.gender;
    const selectedConcentration = activeFilters.concentration;
    const selectedCollection = activeFilters.collection;
    const selectedSort = activeFilters.sort;

    const [products, setProducts] = useState<Product[]>([]);
    const [filterMeta, setFilterMeta] = useState<FilterMetadata>({ families: [], concentrations: [], genders: ["Men", "Women", "Unisex"] });
    const [loading, setLoading] = useState<boolean>(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1;
    const validPage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const catalogElem = document.getElementById("fragrance-products-top");
        if (catalogElem) {
            catalogElem.scrollIntoView({ behavior: "smooth" });
        }
    };

    const renderPaginationNumbers = () => {
        if (totalPages <= 1) return null;

        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (validPage > 3) pages.push("...");

            const start = Math.max(2, validPage - 1);
            const end = Math.min(totalPages - 1, validPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (validPage < totalPages - 2) pages.push("...");
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }

        return (
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={() => handlePageChange(validPage - 1)}
                    disabled={validPage === 1}
                    className="p-2.5 border border-dark/20 text-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark hover:text-white transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {pages.map((item, idx) => (
                    typeof item === "number" ? (
                        <button
                            key={item}
                            onClick={() => handlePageChange(item)}
                            className={`w-9 h-9 text-xs font-bold transition-all ${item === validPage
                                    ? "bg-dark text-white border border-dark shadow-sm"
                                    : "bg-white text-dark/70 border border-dark/10 hover:border-dark/40 hover:text-dark"
                                }`}
                        >
                            {item}
                        </button>
                    ) : (
                        <span key={`ellipsis-${idx}`} className="w-8 text-center text-dark/40 font-bold text-xs select-none">
                            ...
                        </span>
                    )
                ))}

                <button
                    onClick={() => handlePageChange(validPage + 1)}
                    disabled={validPage === totalPages}
                    className="p-2.5 border border-dark/20 text-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark hover:text-white transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    };

    // Fetch Taxonomy Filters (Families & Concentrations)
    useEffect(() => {
        api<FilterMetadata>("/storefront/fragrance-filters")
            .then((data) => {
                if (data) {
                    setFilterMeta({
                        families: data.families || [],
                        concentrations: data.concentrations || [],
                        genders: data.genders || ["Men", "Women", "Unisex"],
                    });
                }
            })
            .catch(() => undefined);
    }, []);

    // Fetch Products matching active filters (with cancellation cleanup)
    useEffect(() => {
        let isCancelled = false;
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedFamily) queryParams.set("family", selectedFamily);
        if (selectedGender) queryParams.set("gender", selectedGender);
        if (selectedConcentration) queryParams.set("concentration", selectedConcentration);
        if (selectedCollection) queryParams.set("collection", selectedCollection);
        if (selectedSort) queryParams.set("sort", selectedSort);
        queryParams.set("per_page", "1000");

        api<any>(`/storefront/products?${queryParams.toString()}`)
            .then((res) => {
                if (isCancelled) return;
                const rawList = Array.isArray(res) ? res : res?.data || [];
                if (Array.isArray(rawList)) {
                    const mappedList: Product[] = rawList.map((prod: any) => ({
                        id: String(prod.id),
                        brand: prod.brand?.name || prod.brand || "Premium Essence",
                        name: prod.name || prod.title,
                        price: Number(prod.price || 0),
                        originalPrice: prod.original_price ? Number(prod.original_price) : undefined,
                        rating: Number(prod.rating || 5.0),
                        reviews: Number(prod.reviews_count || prod.reviews || 0),
                        image: prod.featured_image || prod.image || "/logo/logo-black.png",
                        slug: prod.slug,
                        badge: prod.is_bestseller ? "Bestseller" : prod.is_new ? "New" : undefined,
                        variants: prod.variants,
                    }));
                    setProducts(mappedList);
                } else {
                    setProducts([]);
                }
            })
            .catch(() => {
                if (!isCancelled) setProducts([]);
            })
            .finally(() => {
                if (!isCancelled) setLoading(false);
            });

        return () => {
            isCancelled = true;
        };
    }, [selectedFamily, selectedGender, selectedConcentration, selectedCollection, selectedSort]);

    const updateFilter = (key: keyof ActiveFragranceFilters, value: string) => {
        setActiveFilters((prev) => {
            const currentVal = prev[key] || "";
            if (value && currentVal.toLowerCase() === value.toLowerCase()) {
                return { ...prev, [key]: "" };
            }
            return { ...prev, [key]: value };
        });
        setCurrentPage(1);
        cleanUrl();
    };

    const clearAllFilters = () => {
        setActiveFilters({
            family: "",
            gender: "",
            concentration: "",
            collection: "",
            sort: "sort_order",
        });
        setCurrentPage(1);
        if (typeof window !== "undefined") {
            try {
                sessionStorage.removeItem(storageKey);
            } catch {}
        }
        cleanUrl();
    };

    const hasActiveFilters = Boolean(selectedFamily || selectedGender || selectedConcentration || selectedCollection);

    let displayTitle = "The Fragrance Collection";
    let displaySubtitle = "Explore masterfully crafted perfumes curated by fragrance family, olfactive concentration, and bespoke notes.";

    const famLower = selectedFamily.toLowerCase().trim();
    if (famLower === "niche" || famLower === "niche-fragrances") {
        displayTitle = "Niche Fragrances Collection";
        displaySubtitle = "Explore rare, artisanal perfumes from world-renowned Prestige & Niche fragrance houses.";
    } else if (famLower === "oud") {
        displayTitle = "Signature Oud Collection";
        displaySubtitle = "Discover dark, opulent, and majestic Oud perfumes crafted with precious agarwood resin.";
    } else if (selectedFamily) {
        displayTitle = `${selectedFamily.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Collection`;
        displaySubtitle = `Handcrafted perfumes categorized under the ${selectedFamily.replace(/-/g, ' ')} olfactive family.`;
    }

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans py-12 px-6 md:px-12">
            <div className="max-w-screen-2xl mx-auto">
                {/* Hero Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left py-10 mb-10 border-b border-dark/10">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block mb-2">
                            Olfactive Excellence
                        </span>
                        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-dark">
                            {displayTitle}
                        </h1>
                        <p className="text-xs md:text-sm text-dark/70 mt-3 max-w-xl mx-auto md:mx-0 leading-relaxed">
                            {displaySubtitle}
                        </p>
                    </div>
                    {renderPaginationNumbers()}
                </div>

                {/* Filter & Controls Bar */}
                <div className="bg-white border border-dark/10 p-4 md:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    {/* Active Filter Badges */}
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                        <button
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="lg:hidden flex items-center gap-2 bg-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
                        >
                            <SlidersHorizontal size={14} /> Filters ({products.length})
                        </button>

                        <span className="text-xs font-bold text-dark/60 uppercase tracking-widest mr-2 hidden lg:inline">
                            Active Filters:
                        </span>

                        {!hasActiveFilters && (
                            <span className="text-xs text-dark/50 italic">Showing all fragrances</span>
                        )}

                        {selectedFamily && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                {famLower === "niche" || famLower === "niche-fragrances" ? "Collection: Niche Fragrances" : famLower === "oud" ? "Collection: Signature Oud" : `Family: ${selectedFamily}`}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("family", "")} />
                            </span>
                        )}

                        {selectedGender && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Gender: {selectedGender}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("gender", "")} />
                            </span>
                        )}

                        {selectedConcentration && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Concentration: {selectedConcentration}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("concentration", "")} />
                            </span>
                        )}

                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-700 underline font-bold uppercase tracking-wider hover:text-red-900 ml-2"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-dark/60">Sort By:</span>
                        <select
                            value={selectedSort}
                            onChange={(e) => updateFilter("sort", e.target.value)}
                            className="bg-[#F7F3F4] border border-dark/20 text-dark p-2.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-dark"
                        >
                            <option value="sort_order">Default Order</option>
                            <option value="latest">Newest Arrivals</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="name_asc">Name: A to Z</option>
                            <option value="featured">Featured First</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar Filter (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-white border border-dark/10 p-6 h-fit shadow-sm">
                        {/* 1. Gender Filter */}
                        <div className="border-b border-dark/10 pb-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                Gender / Classification
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilter("gender", "")}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${!selectedGender ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                >
                                    All Genders
                                    {!selectedGender && <Check size={14} />}
                                </button>
                                {filterMeta.genders.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => updateFilter("gender", g)}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${selectedGender.toLowerCase() === g.toLowerCase() ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                            }`}
                                    >
                                        {g}
                                        {selectedGender.toLowerCase() === g.toLowerCase() && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Fragrance Family Filter */}
                        <div className="border-b border-dark/10 pb-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                Fragrance Family
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                                <button
                                    onClick={() => updateFilter("family", "")}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${!selectedFamily ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                >
                                    All Olfactive Families
                                    {!selectedFamily && <Check size={14} />}
                                </button>
                                {filterMeta.families.map((fam) => {
                                    const isSelected = selectedFamily.toLowerCase() === fam.slug.toLowerCase() || selectedFamily.toLowerCase() === fam.name.toLowerCase();
                                    return (
                                        <button
                                            key={fam.id}
                                            onClick={() => updateFilter("family", fam.slug)}
                                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${isSelected ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                        >
                                            {fam.name}
                                            {isSelected && <Check size={14} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. Fragrance Concentration Filter */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                Concentration
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                                <button
                                    onClick={() => updateFilter("concentration", "")}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${!selectedConcentration ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                >
                                    All Concentrations
                                    {!selectedConcentration && <Check size={14} />}
                                </button>
                                {filterMeta.concentrations.map((conc) => {
                                    const isSelected = selectedConcentration.toLowerCase() === conc.slug.toLowerCase() || selectedConcentration.toLowerCase() === conc.name.toLowerCase();
                                    return (
                                        <button
                                            key={conc.id}
                                            onClick={() => updateFilter("concentration", conc.slug)}
                                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${isSelected ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                        >
                                            {conc.name}
                                            {isSelected && <Check size={14} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Right Product Grid */}
                    <div id="fragrance-products-top" className="lg:col-span-9">
                        {loading ? (
                            <div className="p-20 text-center text-dark/60 flex items-center justify-center gap-3 bg-white border border-dark/10">
                                <Loader2 className="animate-spin text-dark" size={24} /> Loading luxury fragrances...
                            </div>
                        ) : !Array.isArray(products) || products.length === 0 ? (
                            <div className="bg-[#1B1315] text-white border border-dark/10 p-16 text-center shadow-sm">
                                <Sparkles size={36} className="mx-auto text-dark/30 mb-4" />
                                <p className="font-serif text-2xl text-dark">No perfumes match your selected filters</p>
                                <p className="text-xs text-dark/60 mt-2 mb-6">Try clearing some filters to explore our full luxury collection.</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                                    {paginatedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-dark/10 p-4 sm:p-6 shadow-sm">
                                        <span className="text-xs uppercase tracking-wider text-dark/60 font-medium">
                                            Showing <span className="font-bold text-dark">{startIndex + 1}</span>–<span className="font-bold text-dark">{Math.min(startIndex + ITEMS_PER_PAGE, totalProducts)}</span> of <span className="font-bold text-dark">{totalProducts}</span> Fragrances
                                        </span>

                                        {renderPaginationNumbers()}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Slide-Over Filter Drawer Overlay */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    {/* Dark Overlay Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                        onClick={() => setMobileFilterOpen(false)}
                    />

                    {/* Slide-over Panel */}
                    <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/10 bg-[#1B1315] text-white">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal size={16} className="text-[#C5A059]" />
                                <span className="font-serif text-base font-bold tracking-wide">Filter Fragrances</span>
                            </div>
                            <button
                                onClick={() => setMobileFilterOpen(false)}
                                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Close filters"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                            {/* 1. Gender Filter */}
                            <div className="border-b border-dark/10 pb-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Gender / Classification
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => updateFilter("gender", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${!selectedGender ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                            }`}
                                    >
                                        All Genders
                                        {!selectedGender && <Check size={14} />}
                                    </button>
                                    {filterMeta.genders.map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => updateFilter("gender", g)}
                                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${selectedGender.toLowerCase() === g.toLowerCase() ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                        >
                                            {g}
                                            {selectedGender.toLowerCase() === g.toLowerCase() && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Fragrance Family Filter */}
                            <div className="border-b border-dark/10 pb-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Fragrance Family
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                                    <button
                                        onClick={() => updateFilter("family", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${!selectedFamily ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                            }`}
                                    >
                                        All Olfactive Families
                                        {!selectedFamily && <Check size={14} />}
                                </button>
                                    {filterMeta.families.map((fam) => {
                                        const isSelected = selectedFamily.toLowerCase() === fam.slug.toLowerCase() || selectedFamily.toLowerCase() === fam.name.toLowerCase();
                                        return (
                                            <button
                                                key={fam.id}
                                                onClick={() => updateFilter("family", fam.slug)}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${isSelected ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                    }`}
                                            >
                                                {fam.name}
                                                {isSelected && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Fragrance Concentration Filter */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Concentration
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                                    <button
                                        onClick={() => updateFilter("concentration", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${!selectedConcentration ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                            }`}
                                    >
                                        All Concentrations
                                        {!selectedConcentration && <Check size={14} />}
                                    </button>
                                    {filterMeta.concentrations.map((conc) => {
                                        const isSelected = selectedConcentration.toLowerCase() === conc.slug.toLowerCase() || selectedConcentration.toLowerCase() === conc.name.toLowerCase();
                                        return (
                                            <button
                                                key={conc.id}
                                                onClick={() => updateFilter("concentration", conc.slug)}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${isSelected ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                    }`}
                                            >
                                                {conc.name}
                                                {isSelected && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-dark/10 bg-[#F7F3F4] flex items-center gap-3">
                            {hasActiveFilters && (
                                <button
                                    onClick={() => {
                                        clearAllFilters();
                                        setMobileFilterOpen(false);
                                    }}
                                    className="w-1/2 py-3 text-xs font-bold uppercase tracking-wider border border-dark/20 text-dark hover:bg-dark/5 transition-colors"
                                >
                                    Reset All
                                </button>
                            )}
                            <button
                                onClick={() => setMobileFilterOpen(false)}
                                className="flex-1 bg-dark text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors"
                            >
                                Apply ({products.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function FragranceCatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <FragranceCatalogContent />
        </Suspense>
    );
}
