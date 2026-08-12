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
        <div className="group flex flex-col gap-3 font-sans max-w-[260px] mx-auto w-full relative overflow-hidden rounded-none">

            {/* Image Container */}
            <Link href={`/product/${product.slug || product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#DEDEDE] to-[#F7F3F4] rounded-none block cursor-pointer">

                {/* Wishlist Button Top Right */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-dark/5 flex items-center justify-center text-dark hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-sm"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart
                        size={15}
                        className={isWishlisted ? "fill-[#4A323A] text-[#4A323A]" : "text-dark/70 hover:text-dark"}
                    />
                </button>

                {/* Elegant Minimalist Badges */}
                {product.badge && (
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <span className="bg-white/90 backdrop-blur-sm border border-dark/5 text-dark text-[10px] font-medium tracking-widest uppercase px-3 py-1.5 rounded-none flex items-center gap-1.5">
                            {product.badge === "Bestseller" && <TrendingUp size={12} strokeWidth={1.5} />}
                            {product.badge === "New" && <Sparkles size={12} strokeWidth={1.5} />}
                            {product.badge === "Limited Edition" && <Gem size={12} strokeWidth={1.5} />}
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
                    className="object-contain p-6 transition-transform duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Offer Tag */}
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-4 left-4 z-10">
                        <span className="bg-[#4A323A] text-cream text-[12px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-none shadow-sm flex items-center gap-1">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                    </div>
                )}

                {/* Hover overlay for deep contrast */}
                <div className="absolute inset-0 bg-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-none" />
            </Link>

            {/* Product Details with solid off-white background */}
            <div className="flex flex-col gap-1.5 px-2 pb-3 pt-1 bg-[#F7F3F4] md:group-hover:-translate-y-12 transition-transform duration-500 ease-out z-10">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-dark/60">
                        {product.brand}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-dark/80">
                        <Star size={12} className="fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{product.rating}</span>
                        <span className="text-dark/40">({product.reviews})</span>
                    </div>
                </div>

                <Link href={`/product/${product.slug || product.id}`}>
                    <h3 className="font-serif text-lg font-medium text-dark group-hover:text-dark transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                {/* Pricing & Mobile Quick Add */}
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-dark">
                            {product.price} AED
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-dark/40 line-through">
                                {product.originalPrice} AED
                            </span>
                        )}
                    </div>
                    {/* Mobile-only Shopping Cart Quick Button */}
                    <button 
                        onClick={handleQuickAdd}
                        className="md:hidden flex items-center justify-center w-9 h-9 bg-midnight text-cream hover:bg-[#4A323A] active:scale-95 transition-all duration-300 rounded-none z-10" 
                        aria-label="Add to cart"
                    >
                        <ShoppingCart size={15} />
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
