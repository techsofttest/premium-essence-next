"use client";

import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ProductBanner from "@/components/sections/ProductBanner";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SeoHead from "@/components/seo/SeoHead";

export default function WishlistPage() {
    const { customer, loading: authLoading } = useAuth();
    const { wishlistProducts, loading: wishlistLoading } = useWishlist();

    if (authLoading || wishlistLoading) {
        return (
            <main className="w-full bg-[#F7F3F4] min-h-screen font-sans py-32 flex items-center justify-center">
                <SeoHead pageSlug="wishlist" />
                <div className="text-center flex flex-col items-center gap-4">
                    <span className="w-8 h-8 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs uppercase tracking-widest text-dark font-bold">Loading Your Wishlist...</span>
                </div>
            </main>
        );
    }

    if (!customer) {
        return (
            <main className="w-full bg-[#F7F3F4] min-h-screen font-sans pb-32">
                <ProductBanner
                    imageUrl="/product-banner/Montblanc-B.png"
                    altText="Your Curated Wishlist"
                    priority={true}
                />
                <div className="max-w-md mx-auto px-6 text-center mt-20 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-white border border-dark/10 flex items-center justify-center text-[#4A323A] shadow-sm">
                        <Heart size={28} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="font-serif text-3xl text-dark">Sign In for Your Wishlist</h1>
                        <p className="text-sm text-dark/70 leading-relaxed">
                            Sign in to save your bespoke fragrance selections and access your curated wishlist across all devices.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="w-full py-4 bg-dark text-white text-xs tracking-[0.25em] uppercase font-bold hover:bg-dark/90 transition-all flex items-center justify-center gap-2"
                    >
                        Sign In Now <ArrowRight size={14} />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full bg-[#F7F3F4] min-h-screen font-sans pb-32">
            <ProductBanner
                imageUrl="/product-banner/Montblanc-B.png"
                altText="Your Curated Wishlist"
                priority={true}
            />

            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 mt-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-dark/10 pb-6 mb-12 gap-4">
                    <div>
                        <span className="text-xs tracking-[0.3em] uppercase text-[#C5A059] font-bold block mb-2">
                            Personal Collection
                        </span>
                        <h1 className="font-serif text-4xl text-dark">Your Curated Wishlist</h1>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-dark/60 font-bold">
                        {wishlistProducts.length} Saved Item{wishlistProducts.length === 1 ? "" : "s"}
                    </span>
                </div>

                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-16">
                        {wishlistProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="p-16 bg-white border border-dark/10 text-center flex flex-col items-center gap-6 max-w-xl mx-auto mt-12 shadow-sm">
                        <div className="w-16 h-16 rounded-full bg-[#F7F3F4] flex items-center justify-center text-dark/30">
                            <Heart size={28} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="font-serif text-2xl text-dark">Your Wishlist is Empty</h2>
                            <p className="text-sm text-dark/60 leading-relaxed">
                                You haven't added any fragrances to your wishlist yet. Explore our luxury portfolio to save your favorite scents.
                            </p>
                        </div>
                        <Link
                            href="/brands"
                            className="px-8 py-4 bg-dark text-white text-xs tracking-[0.2em] uppercase font-bold hover:bg-dark/90 transition-all flex items-center gap-2"
                        >
                            <ShoppingBag size={14} /> Explore Collection
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
