"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, Info, Minus, Plus, Truck, ShieldCheck, RotateCcw, Heart, AlertCircle, ShoppingCart } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Product, ProductVariantItem } from "@/components/ui/ProductCard";

interface ProductInfoProps {
    product: {
        id: string;
        brand: string;
        name: string;
        price: number;
        originalPrice?: number;
        rating: number;
        reviews: number;
        sizes: string[];
        variants?: ProductVariantItem[];
        images?: string[];
        slug?: string;
    };
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const variants = product.variants || [];
    const [selectedSize, setSelectedSize] = useState<string>(
        variants[0]?.label || variants[0]?.size || product.sizes[0] || "100ml"
    );
    const [quantity, setQuantity] = useState(1);

    // Find currently selected variant object
    const selectedVariant = useMemo(() => {
        if (!variants.length) return null;
        return (
            variants.find(
                (v) => (v.label || v.size || "").toLowerCase() === selectedSize.toLowerCase()
            ) || variants[0]
        );
    }, [variants, selectedSize]);

    // Calculate dynamic pricing & stock status for selected variant
    const currentPrice = selectedVariant?.price ?? product.price;
    const currentOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
    const isOutOfStock = selectedVariant ? (selectedVariant.stock ?? 0) <= 0 : false;

    const isWishlisted = isInWishlist(product.id);

    const productForWishlist: Product = {
        id: product.id,
        brand: product.brand,
        name: product.name,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        rating: product.rating,
        reviews: product.reviews,
        image: product.images?.[0] || "/logo/logo-black.png",
        slug: product.slug,
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: currentPrice,
            size: selectedSize,
            image: product.images?.[0] || "/logo/logo-black.png",
            quantity: quantity,
            productId: Number(product.id),
            variantId: selectedVariant?.id,
        });
    };

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    return (
        <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32 h-fit font-sans">
            {/* Brand, Title & Reviews */}
            <div className="flex flex-col gap-2">
                <span className="text-xs tracking-[0.4em] uppercase text-dark font-bold opacity-90">
                    {product.brand}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-dark leading-tight">
                    {product.name}
                </h1>
                <div className="flex items-center gap-4 mt-2">
                    {product.rating && product.reviews ? (
                        <>
                            <div className="flex items-center gap-1 text-[#C5A059]">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] tracking-widest text-dark font-bold uppercase underline underline-offset-4 cursor-pointer hover:text-dark/70">
                                {product.reviews} Reviews
                            </span>
                        </>
                    ) : (
                        <span className="text-[11px] tracking-widest text-dark/60 font-medium uppercase">
                            Not yet rated
                        </span>
                    )}
                </div>
            </div>

            {/* Dynamic Price & Strikeoff Price based on selected variant */}
            <div className="flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-serif text-dark">{currentPrice} AED</span>

                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-lg text-dark/40 line-through font-light">
                        {currentOriginalPrice} AED
                    </span>
                )}

                {/* Offer percentage badge */}
                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="bg-[#4A323A] text-cream text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 shadow-sm">
                        {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                    </span>
                )}
            </div>

            {/* Size Selector with Stock & Price Indicator */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end border-b border-dark/10 pb-2">
                    <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-dark">
                        Select Size
                    </span>
                    <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-[10px] tracking-widest text-dark font-bold uppercase flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                    >
                        <Info size={12} /> Size Guide
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {(variants.length
                        ? variants.map((v) => ({
                              label: v.label || v.size || `${v.id}`,
                              price: v.price,
                              outOfStock: (v.stock ?? 0) <= 0,
                          }))
                        : product.sizes.map((s) => ({ label: s, price: product.price, outOfStock: false }))
                    ).map((variantItem) => {
                        const isSelected = selectedSize.toLowerCase() === variantItem.label.toLowerCase();
                        return (
                            <button
                                key={variantItem.label}
                                onClick={() => setSelectedSize(variantItem.label)}
                                className={`px-5 py-2.5 text-xs font-semibold tracking-wider transition-all relative ${
                                    isSelected
                                        ? "bg-dark text-cream shadow-md"
                                        : "bg-[#F7F3F4] text-dark/80 border border-dark/20 hover:border-dark"
                                } ${variantItem.outOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                            >
                                {variantItem.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex flex-col gap-4">
                {/* Stock status indicator */}
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}
                    />
                    <span className="text-xs text-dark/70 font-medium">
                        {isOutOfStock ? "Out of Stock" : "In Stock — Ready to Ship"}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-dark/20 bg-white h-[56px]">
                        <button
                            disabled={quantity <= 1 || isOutOfStock}
                            onClick={() => setQuantity(quantity - 1)}
                            className="px-4 py-2 hover:bg-dark/5 transition-colors text-dark disabled:opacity-30"
                        >
                            <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-dark">{quantity}</span>
                        <button
                            disabled={isOutOfStock}
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-4 py-2 hover:bg-dark/5 transition-colors text-dark disabled:opacity-30"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Add to Shopping Bag Button / Out of Stock Button */}
                    {isOutOfStock ? (
                        <button
                            disabled
                            className="flex-1 h-[56px] text-[11px] tracking-[0.2em] uppercase font-bold bg-dark/20 text-dark/50 border border-dark/10 cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <AlertCircle size={16} /> Out of Stock
                        </button>
                    ) : (
                        <GlowingButton
                            className="flex-1 h-[56px] text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart size={16} />
                            Add to Shopping Bag
                        </GlowingButton>
                    )}

                    {/* Wishlist Button */}
                    <button
                        onClick={() => toggleWishlist(productForWishlist)}
                        className="h-[56px] w-[56px] border border-dark/30 bg-white flex items-center justify-center text-dark hover:border-dark hover:bg-dark/5 transition-all shrink-0"
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <Heart size={20} className={isWishlisted ? "fill-[#4A323A] text-[#4A323A]" : "text-dark/80"} />
                    </button>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-dark/10 mt-4">
                <div className="flex flex-col items-center gap-3 text-center">
                    <Truck size={22} className="text-dark" />
                    <span className="text-[10px] tracking-widest uppercase text-dark font-bold opacity-80">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                    <ShieldCheck size={22} className="text-dark" />
                    <span className="text-[10px] tracking-widest uppercase text-dark font-bold opacity-80">Authentic</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                    <RotateCcw size={22} className="text-dark" />
                    <span className="text-[10px] tracking-widest uppercase text-dark font-bold opacity-80">Easy Returns</span>
                </div>
            </div>

            {/* Size Guide Modal - Rendered via Portal to document.body with z-[100] above sticky header */}
            {isMounted && isSizeGuideOpen && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setIsSizeGuideOpen(false)}
                >
                    <div
                        className="bg-white border border-dark/10 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative flex flex-col gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] tracking-[0.25em] uppercase text-dark/50 font-semibold">
                                    Fragrance Volume
                                </span>
                                <h3 className="font-serif text-2xl text-dark font-medium">
                                    Size Guide
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsSizeGuideOpen(false)}
                                className="w-8 h-8 rounded-full border border-dark/10 flex items-center justify-center text-dark/60 hover:text-dark hover:bg-dark/5 transition-all text-sm"
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Size Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-dark/20 bg-[#F7F3F4] text-dark font-serif">
                                        <th className="py-3 px-3 sm:px-4 font-semibold tracking-wider text-[11px] uppercase">Size</th>
                                        <th className="py-3 px-3 sm:px-4 font-semibold tracking-wider text-[11px] uppercase">Approx. fl oz</th>
                                        <th className="py-3 px-3 sm:px-4 font-semibold tracking-wider text-[11px] uppercase">Typical use</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark/5 text-dark/80">
                                    <tr className="hover:bg-[#F7F3F4]/50 transition-colors">
                                        <td className="py-3 px-3 sm:px-4 font-medium text-dark">5–10 ml</td>
                                        <td className="py-3 px-3 sm:px-4">0.17–0.34 oz</td>
                                        <td className="py-3 px-3 sm:px-4">Sample / travel</td>
                                    </tr>
                                    <tr className="hover:bg-[#F7F3F4]/50 transition-colors">
                                        <td className="py-3 px-3 sm:px-4 font-medium text-dark">30 ml</td>
                                        <td className="py-3 px-3 sm:px-4">1.0 oz</td>
                                        <td className="py-3 px-3 sm:px-4">Small / occasional use</td>
                                    </tr>
                                    <tr className="hover:bg-[#F7F3F4]/50 transition-colors">
                                        <td className="py-3 px-3 sm:px-4 font-medium text-dark">50 ml</td>
                                        <td className="py-3 px-3 sm:px-4">1.7 oz</td>
                                        <td className="py-3 px-3 sm:px-4">Standard everyday size</td>
                                    </tr>
                                    <tr className="hover:bg-[#F7F3F4]/50 transition-colors">
                                        <td className="py-3 px-3 sm:px-4 font-medium text-dark">75 ml</td>
                                        <td className="py-3 px-3 sm:px-4">2.5 oz</td>
                                        <td className="py-3 px-3 sm:px-4">Mid-size</td>
                                    </tr>
                                    <tr className="hover:bg-[#F7F3F4]/50 transition-colors">
                                        <td className="py-3 px-3 sm:px-4 font-medium text-dark">100 ml</td>
                                        <td className="py-3 px-3 sm:px-4">3.4 oz</td>
                                        <td className="py-3 px-3 sm:px-4">Large / best value for regular use</td>
                                    </tr>
                                    <tr className="hover:bg-[#F7F3F4]/50 transition-colors">
                                        <td className="py-3 px-3 sm:px-4 font-medium text-dark">150–200 ml</td>
                                        <td className="py-3 px-3 sm:px-4">5–6.7 oz</td>
                                        <td className="py-3 px-3 sm:px-4">Large/collector size</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-2 border-t border-dark/10 flex justify-end">
                            <button
                                onClick={() => setIsSizeGuideOpen(false)}
                                className="px-6 py-2.5 bg-dark text-cream text-xs font-semibold tracking-widest uppercase hover:bg-dark/90 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
