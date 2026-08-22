"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, TrendingUp, Sparkles, Gem, ShoppingCart, Heart } from "lucide-react";
import GlowingButton from "./GlowingButton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export interface ProductVariantItem {
    id: number;
    size?: string;
    unit?: string;
    label?: string;
    price?: number;
    originalPrice?: number;
    stock?: number;
}

export interface Product {
    id: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: "Bestseller" | "New" | "Limited Edition";
    slug?: string;
    variants?: ProductVariantItem[];
    sizes?: string[];
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { setSelectedProduct, setIsModalOpen } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [imgSrc, setImgSrc] = useState(product.image || "/logo/logo-black.png");

    const isWishlisted = isInWishlist(product.id);

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(product);
    };

    return (
        <div className="group flex flex-col gap-2 sm:gap-3 font-sans max-w-[260px] mx-auto w-full relative overflow-hidden rounded-none">

            {/* Image Container */}
            <Link href={`/product/${product.slug || product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#DEDEDE] to-[#F7F3F4] rounded-none block cursor-pointer">

                {/* Wishlist Button Top Right */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-dark/5 flex items-center justify-center text-dark hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        size={14}
                        className={isWishlisted ? "fill-[#4A323A] text-[#4A323A]" : "text-dark/70 hover:text-dark"}
                    />
                </button>

                {/* Elegant Minimalist Badges */}
                {product.badge && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur-sm border border-dark/5 text-dark text-[8px] sm:text-[10px] font-medium tracking-widest uppercase px-2 py-1 sm:px-3 sm:py-1.5 rounded-none flex items-center gap-1">
                            {product.badge === "Bestseller" && <TrendingUp size={10} strokeWidth={1.5} />}
                            {product.badge === "New" && <Sparkles size={10} strokeWidth={1.5} />}
                            {product.badge === "Limited Edition" && <Gem size={10} strokeWidth={1.5} />}
                            {product.badge}
                        </span>
                    </div>
                )}

                <Image
                    src={imgSrc || "/logo/logo-black.png"}
                    alt={product.name}
                    fill
                    unoptimized
                    onError={() => setImgSrc("/logo/logo-black.png")}
                    className="object-contain p-3 sm:p-6 transition-transform duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Offer Tag */}
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10">
                        <span className="bg-[#4A323A] text-cream text-[10px] sm:text-[12px] font-bold tracking-widest uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-none shadow-sm flex items-center gap-1">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                    </div>
                )}

                {/* Hover overlay for deep contrast */}
                <div className="absolute inset-0 bg-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-none" />
            </Link>

            {/* Product Details with solid off-white background */}
            <div className="flex flex-col gap-1 sm:gap-1.5 px-2 pb-2.5 pt-1 bg-[#F7F3F4] md:group-hover:-translate-y-12 transition-transform duration-500 ease-out z-10">
                <div className="flex justify-between items-start mb-0.5 sm:mb-1">
                    <span className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-dark/60 truncate">
                        {product.brand}
                    </span>
                    {Boolean(product.rating && product.reviews) && (
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-dark/80 shrink-0">
                            <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                            <span>{product.rating}</span>
                            <span className="text-dark/40">({product.reviews})</span>
                        </div>
                    )}
                </div>

                <Link href={`/product/${product.slug || product.id}`}>
                    <h3 className="font-serif text-sm sm:text-lg font-medium text-dark group-hover:text-dark transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Size count display */}
                {(() => {
                    const sizeCount = product.variants?.length || (product.sizes?.length ?? 1);
                    return (
                        <p className="text-[10px] sm:text-xs text-dark/60 font-medium">
                            {sizeCount} {sizeCount === 1 ? "Size" : "Sizes"}
                        </p>
                    );
                })()}

                {/* Pricing & Mobile Quick Add */}
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
                        <span className="font-medium text-xs sm:text-base text-dark">
                            {product.price} AED
                        </span>
                        {product.originalPrice && (
                            <span className="text-[10px] sm:text-sm text-dark/40 line-through">
                                {product.originalPrice} AED
                            </span>
                        )}
                    </div>
                    {/* Mobile-only Shopping Cart Quick Button */}
                    <button 
                        onClick={handleQuickAdd}
                        className="md:hidden flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-midnight text-cream hover:bg-[#4A323A] active:scale-95 transition-all duration-300 rounded-none z-10 shrink-0" 
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={13} />
                    </button>
                </div>
            </div>

            {/* Action (Desktop Hover Only) - Flush to bottom */}
            <div className="hidden md:block absolute bottom-0 left-0 right-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto z-20">
                <GlowingButton onClick={handleQuickAdd} fullWidth>
                    Add to Cart
                </GlowingButton>
            </div>

        </div>
    );
}
