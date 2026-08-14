"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, X, Loader2, Sparkles, SlidersHorizontal, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

    const selectedCategoryParam = fixedCategory || searchParams.get("category") || "";
    const selectedBrandParam = fixedBrand || searchParams.get("brand") || "";
    const selectedFamilyParam = fixedFamily || searchParams.get("family") || "";
    const selectedGenderParam = fixedGender || searchParams.get("gender") || "";
    const selectedConcentrationParam = fixedConcentration || searchParams.get("concentration") || "";
    const selectedSearch = searchParams.get("search") || searchParams.get("q") || "";
    const selectedSort = searchParams.get("sort") || "latest";

    // Arrays of selected items for multi-selection
    const selectedCategories = selectedCategoryParam ? selectedCategoryParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    const selectedBrands = selectedBrandParam ? selectedBrandParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    const selectedFamilies = selectedFamilyParam ? selectedFamilyParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    const selectedGenders = selectedGenderParam ? selectedGenderParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [];
    const selectedConcentrations = selectedConcentrationParam ? selectedConcentrationParam.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [];

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

    // Pagination State (12 products per page)
    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);

    // Reset pagination when active filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategoryParam, selectedBrandParam, selectedFamilyParam, selectedGenderParam, selectedConcentrationParam, selectedSearch, selectedSort]);

    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE) || 1;
    const validPage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const catalogElem = document.getElementById("catalog-products-top");
        if (catalogElem) {
            catalogElem.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Fetch Taxonomy Metadata
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
                // Fallback silently
            }
        };
        fetchMeta();
    }, []);

    // Fetch Filtered Products from API
    useEffect(() => {
        setLoading(true);
        getStorefrontProductsWithMeta({
            category: selectedCategoryParam,
            brand: selectedBrandParam,
            family: selectedFamilyParam,
            gender: selectedGenderParam,
            concentration: selectedConcentrationParam,
            search: selectedSearch,
            sort: selectedSort,
            per_page: 48,
        })
            .then((res) => setProducts(res.products || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [selectedCategoryParam, selectedBrandParam, selectedFamilyParam, selectedGenderParam, selectedConcentrationParam, selectedSearch, selectedSort]);

    // Multi-select toggle function
    const toggleFilterOption = (key: string, value: string) => {
        const currentParam = searchParams.get(key) || "";
        const currentList = currentParam ? currentParam.split(",").map(s => s.trim()).filter(Boolean) : [];
        const targetValue = value.trim();

        let newList: string[];
        if (currentList.some(item => item.toLowerCase() === targetValue.toLowerCase())) {
            newList = currentList.filter(item => item.toLowerCase() !== targetValue.toLowerCase());
        } else {
            newList = [...currentList, targetValue];
        }

        const params = new URLSearchParams(searchParams.toString());
        if (newList.length > 0) {
            params.set(key, newList.join(","));
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const updateSingleFilter = (key: string, value: string) => {
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
        (selectedCategories.length > 0 && !fixedCategory) ||
        (selectedBrands.length > 0 && !fixedBrand) ||
        (selectedFamilies.length > 0 && !fixedFamily) ||
        (selectedGenders.length > 0 && !fixedGender) ||
        (selectedConcentrations.length > 0 && !fixedConcentration) ||
        selectedSearch
    );

    const renderFilterSection = (
        sectionTitle: string,
        filterKey: string,
        items: (FilterOption | string)[],
        selectedArray: string[],
        isFixed?: boolean
    ) => {
        if (isFixed || items.length === 0) return null;

        return (
            <div className="border-b border-dark/10 pb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark">
                        {sectionTitle}
                    </h3>
                    {selectedArray.length > 0 && (
                        <button
                            onClick={() => updateSingleFilter(filterKey, "")}
                            className="text-[10px] text-red-700 font-bold uppercase hover:underline"
                        >
                            Reset
                        </button>
                    )}
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
                    {items.map((item) => {
                        const name = typeof item === "string" ? item : item.name;
                        const val = typeof item === "string" ? item : item.slug;
                        const isChecked = selectedArray.includes(val.toLowerCase()) || selectedArray.includes(name.toLowerCase());

                        return (
                            <label
                                key={val}
                                onClick={() => toggleFilterOption(filterKey, val)}
                                className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer rounded transition-colors ${
                                    isChecked ? "bg-dark text-white font-bold" : "hover:bg-[#F7F3F4] text-dark/80"
                                }`}
                            >
                                <div
                                    className={`w-4 h-4 border flex items-center justify-center rounded-sm shrink-0 transition-colors ${
                                        isChecked ? "bg-[#C5A059] border-[#C5A059] text-dark" : "border-dark/30 bg-white"
                                    }`}
                                >
                                    {isChecked && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className="flex-1 truncate">{name}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        );
    };

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

                {/* Controls Bar & Active Filter Badges */}
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

                        {/* Individual Multi-Select Badges */}
                        {selectedCategories.map((cat) => (
                            <span key={`cat-${cat}`} className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Category: {cat}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => toggleFilterOption("category", cat)} />
                            </span>
                        ))}

                        {selectedBrands.map((b) => (
                            <span key={`b-${b}`} className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Brand: {b}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => toggleFilterOption("brand", b)} />
                            </span>
                        ))}

                        {selectedFamilies.map((fam) => (
                            <span key={`fam-${fam}`} className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Family: {fam}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => toggleFilterOption("family", fam)} />
                            </span>
                        ))}

                        {selectedGenders.map((g) => (
                            <span key={`g-${g}`} className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Gender: {g}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => toggleFilterOption("gender", g)} />
                            </span>
                        ))}

                        {selectedConcentrations.map((conc) => (
                            <span key={`conc-${conc}`} className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Conc: {conc}
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => toggleFilterOption("concentration", conc)} />
                            </span>
                        ))}

                        {selectedSearch && (
                            <span className="inline-flex items-center gap-1.5 bg-[#F7F3F4] border border-dark/20 text-dark px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                Search: "{selectedSearch}"
                                <X size={12} className="cursor-pointer hover:text-red-600" onClick={() => updateSingleFilter("search", "")} />
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
                            onChange={(e) => updateSingleFilter("sort", e.target.value)}
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
                    <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white border border-dark/10 p-6 h-fit shadow-sm">
                        {renderFilterSection("Categories", "category", meta.categories, selectedCategories, Boolean(fixedCategory))}
                        {renderFilterSection("Brands & Houses", "brand", meta.brands, selectedBrands, Boolean(fixedBrand))}
                        {renderFilterSection("Gender", "gender", meta.genders, selectedGenders, Boolean(fixedGender))}
                        {renderFilterSection("Fragrance Family (Multi-Select)", "family", meta.families, selectedFamilies, Boolean(fixedFamily))}
                        {renderFilterSection("Concentration", "concentration", meta.concentrations, selectedConcentrations, Boolean(fixedConcentration))}
                    </aside>

                    {/* Right Products Grid */}
                    <div id="catalog-products-top" className="lg:col-span-9">
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
                                        <p className="text-xs text-dark/60 mt-2 mb-6">Try selecting additional options or clearing active filters.</p>
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
                                                Showing <span className="font-bold text-dark">{startIndex + 1}</span>–<span className="font-bold text-dark">{Math.min(startIndex + ITEMS_PER_PAGE, totalProducts)}</span> of <span className="font-bold text-dark">{totalProducts}</span> Perfumes
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => handlePageChange(validPage - 1)}
                                                    disabled={validPage === 1}
                                                    className="p-2.5 border border-dark/20 text-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark hover:text-white transition-colors"
                                                    aria-label="Previous page"
                                                >
                                                    <ChevronLeft size={16} />
                                                </button>

                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-9 h-9 text-xs font-bold transition-all ${
                                                            pageNum === validPage
                                                                ? "bg-dark text-white border border-dark shadow-sm"
                                                                : "bg-white text-dark/70 border border-dark/10 hover:border-dark/40 hover:text-dark"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
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
                                        </div>
                                    )}
                                </>
                            );
                        })()}
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
                                <span className="font-serif text-base font-bold tracking-wide">Filter Catalog</span>
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
                            {renderFilterSection("Categories", "category", meta.categories, selectedCategories, Boolean(fixedCategory))}
                            {renderFilterSection("Brands & Houses", "brand", meta.brands, selectedBrands, Boolean(fixedBrand))}
                            {renderFilterSection("Gender", "gender", meta.genders, selectedGenders, Boolean(fixedGender))}
                            {renderFilterSection("Fragrance Family", "family", meta.families, selectedFamilies, Boolean(fixedFamily))}
                            {renderFilterSection("Concentration", "concentration", meta.concentrations, selectedConcentrations, Boolean(fixedConcentration))}
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
