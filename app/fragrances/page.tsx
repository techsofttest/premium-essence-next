"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Filter, X, Loader2, Sparkles, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
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

function FragranceCatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedFamily = searchParams.get("family") || "";
    const selectedGender = searchParams.get("gender") || "";
    const selectedConcentration = searchParams.get("concentration") || "";
    const selectedSort = searchParams.get("sort") || "latest";

    const [products, setProducts] = useState<Product[]>([]);
    const [filterMeta, setFilterMeta] = useState<FilterMetadata>({ families: [], concentrations: [], genders: ["Men", "Women", "Unisex"] });
    const [loading, setLoading] = useState<boolean>(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

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

    // Fetch Products matching active filters
    useEffect(() => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedFamily) queryParams.set("family", selectedFamily);
        if (selectedGender) queryParams.set("gender", selectedGender);
        if (selectedConcentration) queryParams.set("concentration", selectedConcentration);
        if (selectedSort) queryParams.set("sort", selectedSort);
        queryParams.set("per_page", "48");

        api<Product[]>(`/storefront/products?${queryParams.toString()}`)
            .then((data) => setProducts(data || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [selectedFamily, selectedGender, selectedConcentration, selectedSort]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/fragrances?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push("/fragrances");
    };

    const hasActiveFilters = Boolean(selectedFamily || selectedGender || selectedConcentration);

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans py-12 px-6 md:px-12">
            <div className="max-w-screen-2xl mx-auto">
                {/* Hero Header */}
                <div className="text-center py-10 mb-10 border-b border-dark/10">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block mb-2">
                        Olfactive Excellence
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-dark">
                        The Fragrance Collection
                    </h1>
                    <p className="text-xs md:text-sm text-dark/70 mt-3 max-w-xl mx-auto leading-relaxed">
                        Explore masterfully crafted perfumes curated by fragrance family, olfactive concentration, and bespoke notes.
                    </p>
                </div>

                {/* Filter & Controls Bar */}
                <div className="bg-white border border-dark/10 p-4 md:p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    {/* Active Filter Badges */}
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                        <button
                            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                            className="md:hidden flex items-center gap-2 bg-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
                        >
                            <SlidersHorizontal size={14} /> Filters
                        </button>

                        <span className="text-xs font-bold text-dark/60 uppercase tracking-widest mr-2 hidden md:inline">
                            Active Filters:
                        </span>

                        {!hasActiveFilters && (
                            <span className="text-xs text-dark/50 italic">Showing all fragrances</span>
                        )}

                        {selectedFamily && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Family: {selectedFamily}
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
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                        !selectedGender ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                    }`}
                                >
                                    All Genders
                                    {!selectedGender && <Check size={14} />}
                                </button>
                                {filterMeta.genders.map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => updateFilter("gender", g)}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                            selectedGender.toLowerCase() === g.toLowerCase() ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
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
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                        !selectedFamily ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
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
                                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                                isSelected ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
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
                                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                        !selectedConcentration ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
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
                                            className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                                isSelected ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
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
                    <div className="lg:col-span-9">
                        {loading ? (
                            <div className="p-20 text-center text-dark/60 flex items-center justify-center gap-3">
                                <Loader2 className="animate-spin" size={24} /> Loading luxury fragrances...
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white border border-dark/10 p-16 text-center">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
