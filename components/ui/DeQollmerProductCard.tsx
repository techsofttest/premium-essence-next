"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Crown, Sparkles, Gem, TrendingUp } from "lucide-react";
import { Product, getGenderBadgeInfo } from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface DeQollmerProductCardProps {
    product: Product;
}

export default function DeQollmerProductCard({ product }: DeQollmerProductCardProps) {
    const { setSelectedProduct, setIsModalOpen } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [imgSrc, setImgSrc] = useState(product.image || "/logo/logo-black.png");

    const isWishlisted = isInWishlist(product.id);
    const genderInfo = getGenderBadgeInfo(product.gender);

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

    const productHref = product.slug?.startsWith("deals/") || product.slug?.startsWith("/deals/")
        ? (product.slug.startsWith("/") ? product.slug : `/${product.slug}`)
        : `/product/${product.slug || product.id}`;

    const sizeCount = product.variants?.length || (product.sizes?.length ?? 1);
    const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    return (
        <div className="group relative w-full h-full rounded-2xl bg-white border border-dark/10 hover:border-[#D4AF37] p-3.5 sm:p-4 flex flex-col justify-between shadow-md hover:shadow-[0_16px_35px_rgba(212,175,55,0.22)] transition-all duration-500 overflow-hidden font-sans select-none">
            
            {/* Subtle luxury ambient glow on hover */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/15 transition-all duration-700" />

            {/* Top Showcase Header (Badges & Wishlist) */}
            <div className="relative z-20 flex items-center justify-between gap-2 mb-2.5">
                {/* Left: Badge Pill */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {product.badge ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] text-[#1B1315] font-extrabold text-[9px] tracking-wider uppercase shadow-xs">
                            {product.badge === "Bestseller" && <TrendingUp size={10} />}
                            {product.badge === "Signature Edition" && <Crown size={10} />}
                            {product.badge === "Private Reserve" && <Sparkles size={10} />}
                            {product.badge === "Limited Edition" && <Gem size={10} />}
                            <span>{product.badge}</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1B1315]/5 border border-[#1B1315]/10 text-[#1B1315] text-[9px] font-bold tracking-widest uppercase">
                            <Crown size={9} className="text-[#A67C2E]" />
                            <span>Maison</span>
                        </span>
                    )}

                    {hasDiscount && (
                        <span className="px-2 py-0.5 rounded-full bg-[#8E2838] text-white font-extrabold text-[9px] tracking-wider uppercase shadow-xs">
                            {discountPercent}% OFF
                        </span>
                    )}
                </div>

                {/* Right: Frosted Floating Wishlist Heart */}
                <button
                    onClick={handleWishlistToggle}
                    type="button"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-dark/10 text-dark/70 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1B1315] active:scale-90 transition-all flex items-center justify-center shadow-xs cursor-pointer shrink-0"
                >
                    <Heart
                        size={14}
                        className={isWishlisted ? "fill-[#8E2838] text-[#8E2838]" : "transition-colors"}
                    />
                </button>
            </div>

            {/* Perfume Flacon Image Showcase */}
            <Link
                href={productHref}
                className="relative z-10 w-full aspect-[4/4.5] flex items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] border border-dark/5 group-hover:border-[#D4AF37]/40 transition-all duration-500 cursor-pointer overflow-hidden"
            >
                {/* Diagonal glass light sheen on hover */}
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-35 pointer-events-none group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                {/* Soft flacon floor shadow reflection */}
                <div className="absolute bottom-2 inset-x-12 h-3 bg-dark/10 rounded-full blur-md pointer-events-none group-hover:scale-95 transition-transform duration-500" />

                <Image
                    src={imgSrc || "/logo/logo-black.png"}
                    alt={product.name}
                    fill
                    onError={() => setImgSrc("/logo/logo-black.png")}
                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 280px"
                    className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-108 drop-shadow-[0_12px_20px_rgba(0,0,0,0.12)]"
                />
            </Link>

            {/* Product Meta & Typography */}
            <div className="relative z-10 pt-3 flex flex-col gap-1.5">
                {/* Brand Eyebrow & Star Rating */}
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#A67C2E] flex items-center gap-1 truncate">
                        <Crown size={11} className="text-[#A67C2E] shrink-0" />
                        <span>{product.brand}</span>
                    </span>

                    {Boolean(product.rating && product.reviews) && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-dark shrink-0">
                            <Star size={11} className="fill-[#D4AF37] text-[#D4AF37]" />
                            <span>{product.rating}</span>
                            <span className="text-dark/45 font-normal">({product.reviews})</span>
                        </div>
                    )}
                </div>

                {/* Fragrance Title */}
                <Link href={productHref} className="block group/title">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-[#1B1315] group-hover/title:text-[#A67C2E] transition-colors leading-tight truncate tracking-wide">
                        {product.name}
                    </h3>
                </Link>

                {/* Concentration, Gender, & Size Tags */}
                <div className="flex items-center gap-2 flex-wrap text-[10px] text-dark/70 uppercase tracking-wider font-medium">
                    <span className="text-[#4A323A] font-bold">
                        {product.concentration || "Eau de Parfum"}
                    </span>
                    {genderInfo && (
                        <>
                            <span className="text-dark/20">•</span>
                            <span>{genderInfo.label}</span>
                        </>
                    )}
                    <span className="text-dark/20">•</span>
                    <span className="text-dark/50">
                        {sizeCount} {sizeCount === 1 ? "Size" : "Sizes"}
                    </span>
                </div>

                {/* Subtle Luxury Divider */}
                <div className="w-full h-[1px] bg-gradient-to-r from-dark/10 via-[#D4AF37]/30 to-transparent my-1" />

                {/* Pricing & Add to Cart Button */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                    {/* Price Block */}
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-bold text-[#A67C2E] tracking-wider uppercase">
                                AED
                            </span>
                            <span className="font-serif text-xl sm:text-2xl font-light text-[#1B1315] leading-none">
                                {product.price}
                            </span>
                        </div>
                        {hasDiscount && (
                            <span className="text-[10px] text-dark/40 line-through">
                                AED {product.originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Royal Gold Pill Add-to-Cart Button */}
                    <button
                        onClick={handleQuickAdd}
                        type="button"
                        aria-label={`Add ${product.name} to cart`}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] text-[#1B1315] font-bold text-[10px] tracking-[0.15em] uppercase hover:brightness-105 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
                    >
                        <ShoppingBag size={13} className="text-[#1B1315]" />
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
