"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import { getStorefrontProductsWithMeta } from "@/lib/storefront";
import SeoHead from "@/components/seo/SeoHead";

export default function BestsellersPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        setLoading(true);
        getStorefrontProductsWithMeta({
            filter: "bestsellers",
            page: page,
            per_page: ITEMS_PER_PAGE,
        })
            .then((res) => {
                setProducts(res.products || []);
                if (res.meta) {
                    setTotalPages(res.meta.last_page || 1);
                    setTotalProducts(res.meta.total || res.products.length);
                } else {
                    setTotalPages(Math.ceil((res.products.length || 1) / ITEMS_PER_PAGE));
                    setTotalProducts(res.products.length);
                }
            })
            .catch(() => {
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            <SeoHead pageSlug="bestsellers" />
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 pt-10">
                
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-dark font-bold mb-8">
                    <Link href="/" className="hover:text-dark/60 transition-colors">Home</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <span className="text-dark/50">Bestsellers</span>
                </nav>

                {/* Page Heading (No Banner) */}
                <div className="flex flex-col items-center text-center gap-3 mb-16 border-b border-dark/10 pb-10">
                    <span className="text-[11px] tracking-[0.3em] uppercase text-[#C5A059] font-bold">
                        Most Coveted
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark tracking-tight">
                        Bestsellers Collection
                    </h1>
                    <div className="w-12 h-[1px] bg-[#4A323A] my-2"></div>
                    <p className="text-sm text-dark/70 max-w-xl leading-relaxed">
                        Discover our most popular and highly-rated luxury perfumes, handpicked by fragrance connoisseurs around the world.
                    </p>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="p-24 text-center text-dark/60 flex items-center justify-center gap-3 bg-white border border-dark/10">
                        <Loader2 className="animate-spin text-dark" size={24} /> Loading bestsellers...
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-16 text-center shadow-sm">
                        <p className="font-serif text-2xl text-dark">No bestsellers found</p>
                        <p className="text-xs text-dark/60 mt-2 mb-6">Check back soon for updated selections.</p>
                        <Link
                            href="/shop"
                            className="bg-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors inline-block"
                        >
                            Explore Shop All
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pure Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-dark/10 p-4 sm:p-6 shadow-sm">
                                <span className="text-xs uppercase tracking-wider text-dark/60 font-medium">
                                    Showing <span className="font-bold text-dark">{startIndex + 1}</span>–<span className="font-bold text-dark">{Math.min(startIndex + products.length, totalProducts)}</span> of <span className="font-bold text-dark">{totalProducts}</span> Bestsellers
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
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
                                                pageNum === page
                                                    ? "bg-dark text-white border border-dark shadow-sm"
                                                    : "bg-white text-dark/70 border border-dark/10 hover:border-dark/40 hover:text-dark"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="p-2.5 border border-dark/20 text-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark hover:text-white transition-colors"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
