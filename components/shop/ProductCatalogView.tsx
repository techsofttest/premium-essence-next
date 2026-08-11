"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, X, Loader2, Sparkles, SlidersHorizontal, Check, ArrowRight } from "lucide-react";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import ProductBanner from "@/components/sections/ProductBanner";
import { api } from "@/lib/api";
import { getStorefrontProductsWithMeta } from "@/lib/storefront";

interface FilterOption {
    id: number;
    name: string;
    slug: string;
}

interface CatalogMeta {
    categories: FilterOption[];
    brands: FilterOption[];
    families: FilterOption[];
    concentrations: FilterOption[];
    genders: string[];
}

interface ProductCatalogViewProps {
    title?: string;
    subtitle?: string;
    bannerImage?: string;
    fixedCategory?: string;
    fixedBrand?: string;
    fixedFamily?: string;
    fixedGender?: string;
    fixedConcentration?: string;
}

export default function ProductCatalogView({
    title = "The Full Perfume Collection",
    subtitle = "Explore our portfolio of authentic French, Italian & Niche fragrance houses.",
    bannerImage = "/product-banner/Montblanc-B.png",
    fixedCategory,
    fixedBrand,
    fixedFamily,
    fixedGender,
    fixedConcentration,
}: ProductCatalogViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedCategory = fixedCategory || searchParams.get("category") || "";
    const selectedBrand = fixedBrand || searchParams.get("brand") || "";
    const selectedFamily = fixedFamily || searchParams.get("family") || "";
    const selectedGender = fixedGender || searchParams.get("gender") || "";
    const selectedConcentration = fixedConcentration || searchParams.get("concentration") || "";
    const selectedSearch = searchParams.get("search") || searchParams.get("q") || "";
    const selectedSort = searchParams.get("sort") || "latest";

    const [products, setProducts] = useState<Product[]>([]);
    const [meta, setMeta] = useState<CatalogMeta>({
        categories: [],
        brands: [],
        families: [],
        concentrations: [],
        genders: ["Men", "Women", "Unisex"],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

    // Fetch Taxonomy Metadata (Categories, Brands, Families, Concentrations)
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [cats, brs, filters] = await Promise.all([
                    api<FilterOption[]>("/storefront/categories").catch(() => []),
                    api<any>("/storefront/brands").catch(() => ({ all: [] })),
                    api<any>("/storefront/fragrance-filters").catch(() => ({ families: [], concentrations: [] })),
                ]);

                setMeta({
                    categories: Array.isArray(cats) ? cats : [],
                    brands: (brs?.all || brs?.data || []) as FilterOption[],
                    families: filters?.families || [],
                    concentrations: filters?.concentrations || [],
                    genders: ["Men", "Women", "Unisex"],
                });
            } catch {
                // Silently fallback
            }
        };
        fetchMeta();
    }, []);

    // Fetch Filtered Products from API
    useEffect(() => {
        setLoading(true);
        getStorefrontProductsWithMeta({
            category: selectedCategory,
            brand: selectedBrand,
            family: selectedFamily,
            gender: selectedGender,
            concentration: selectedConcentration,
            search: selectedSearch,
            sort: selectedSort,
            per_page: 48,
        })
            .then((res) => setProducts(res.products || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [selectedCategory, selectedBrand, selectedFamily, selectedGender, selectedConcentration, selectedSearch, selectedSort]);

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push(window.location.pathname);
    };

    const hasActiveFilters = Boolean(
        (selectedCategory && !fixedCategory) ||
        (selectedBrand && !fixedBrand) ||
        (selectedFamily && !fixedFamily) ||
        (selectedGender && !fixedGender) ||
        (selectedConcentration && !fixedConcentration) ||
        selectedSearch
    );

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-20">
            {/* Banner Header */}
            {bannerImage && (
                <ProductBanner imageUrl={bannerImage} altText={title} priority={true} />
            )}

            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 mt-10">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-dark font-bold mb-6">
                    <Link href="/" className="hover:text-dark/60 transition-colors">Home</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <Link href="/shop" className="hover:text-dark/60 transition-colors">Shop All</Link>
                    {fixedBrand && (
                        <>
                            <ArrowRight size={10} strokeWidth={2.5} />
                            <span className="text-dark/50">{title}</span>
                        </>
                    )}
                    {fixedCategory && (
                        <>
                            <ArrowRight size={10} strokeWidth={2.5} />
                            <span className="text-dark/50">{title}</span>
                        </>
                    )}
                </nav>

                {/* Page Title & Subtitle */}
                <div className="flex flex-col gap-2 mb-8 border-b border-dark/10 pb-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059]">
                        Luxury Perfumery Catalog
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl text-dark tracking-tight">
                        {title}
                    </h1>
                    <p className="text-xs md:text-sm text-dark/70 max-w-2xl mt-1 leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Controls Bar & Filter Pills */}
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
                            <span className="text-xs text-dark/50 italic">Showing all items ({products.length})</span>
                        )}

                        {selectedCategory && !fixedCategory && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Category: {selectedCategory}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("category", "")} />
                            </span>
                        )}

                        {selectedBrand && !fixedBrand && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Brand: {selectedBrand}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("brand", "")} />
                            </span>
                        )}

                        {selectedFamily && !fixedFamily && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Family: {selectedFamily}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("family", "")} />
                            </span>
                        )}

                        {selectedGender && !fixedGender && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Gender: {selectedGender}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("gender", "")} />
                            </span>
                        )}

                        {selectedConcentration && !fixedConcentration && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Concentration: {selectedConcentration}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("concentration", "")} />
                            </span>
                        )}

                        {selectedSearch && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Search: "{selectedSearch}"
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateFilter("search", "")} />
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
                            <option value="name_desc">Name: Z to A</option>
                            <option value="featured">Featured First</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Grid & Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar Filter (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-white border border-dark/10 p-6 h-fit shadow-sm">
                        {/* 1. Category Filter */}
                        {!fixedCategory && meta.categories.length > 0 && (
                            <div className="border-b border-dark/10 pb-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Categories
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                                    <button
                                        onClick={() => updateFilter("category", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                            !selectedCategory ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                    >
                                        All Categories
                                        {!selectedCategory && <Check size={14} />}
                                    </button>
                                    {meta.categories.map((cat) => {
                                        const isSel = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => updateFilter("category", cat.slug)}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                                    isSel ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                            >
                                                {cat.name}
                                                {isSel && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 2. Brand Filter */}
                        {!fixedBrand && meta.brands.length > 0 && (
                            <div className="border-b border-dark/10 pb-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Brands & Houses
                                </h3>
                                <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                                    <button
                                        onClick={() => updateFilter("brand", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                            !selectedBrand ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                    >
                                        All Brands
                                        {!selectedBrand && <Check size={14} />}
                                    </button>
                                    {meta.brands.map((b) => {
                                        const isSel = selectedBrand.toLowerCase() === b.slug.toLowerCase();
                                        return (
                                            <button
                                                key={b.id}
                                                onClick={() => updateFilter("brand", b.slug)}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                                    isSel ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                            >
                                                {b.name}
                                                {isSel && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 3. Gender Filter */}
                        {!fixedGender && (
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
                                    {meta.genders.map((g) => (
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
                        )}

                        {/* 4. Fragrance Family Filter (Multiple Allowed) */}
                        {!fixedFamily && meta.families.length > 0 && (
                            <div className="border-b border-dark/10 pb-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Fragrance Family
                                </h3>
                                <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                                    <button
                                        onClick={() => updateFilter("family", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                            !selectedFamily ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                    >
                                        All Olfactive Families
                                        {!selectedFamily && <Check size={14} />}
                                    </button>
                                    {meta.families.map((fam) => {
                                        const isSel = selectedFamily.toLowerCase() === fam.slug.toLowerCase() || selectedFamily.toLowerCase() === fam.name.toLowerCase();
                                        return (
                                            <button
                                                key={fam.id}
                                                onClick={() => updateFilter("family", fam.slug)}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                                    isSel ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                            >
                                                {fam.name}
                                                {isSel && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 5. Concentration Filter */}
                        {!fixedConcentration && meta.concentrations.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark mb-4">
                                    Concentration
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                                    <button
                                        onClick={() => updateFilter("concentration", "")}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                            !selectedConcentration ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                        }`}
                                    >
                                        All Concentrations
                                        {!selectedConcentration && <Check size={14} />}
                                    </button>
                                    {meta.concentrations.map((conc) => {
                                        const isSel = selectedConcentration.toLowerCase() === conc.slug.toLowerCase() || selectedConcentration.toLowerCase() === conc.name.toLowerCase();
                                        return (
                                            <button
                                                key={conc.id}
                                                onClick={() => updateFilter("concentration", conc.slug)}
                                                className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                                                    isSel ? "bg-dark text-white" : "hover:bg-[#F7F3F4] text-dark/80"
                                                }`}
                                            >
                                                {conc.name}
                                                {isSel && <Check size={14} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Right Products Grid */}
                    <div className="lg:col-span-9">
                        {(() => {
                            const productList = Array.isArray(products) ? products : [];
                            if (loading) {
                                return (
                                    <div className="p-20 text-center text-dark/60 flex items-center justify-center gap-3 bg-white border border-dark/10">
                                        <Loader2 className="animate-spin text-dark" size={24} /> Loading luxury fragrances...
                                    </div>
                                );
                            }
                            if (productList.length === 0) {
                                return (
                                    <div className="bg-white border border-dark/10 p-16 text-center shadow-sm">
                                        <Sparkles size={36} className="mx-auto text-dark/30 mb-4" />
                                        <p className="font-serif text-2xl text-dark">No perfumes match your selected criteria</p>
                                        <p className="text-xs text-dark/60 mt-2 mb-6">Try clearing filters or choosing a different category.</p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="bg-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors cursor-pointer"
                                        >
                                            Reset All Filters
                                        </button>
                                    </div>
                                );
                            }
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {productList.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </main>
    );
}
