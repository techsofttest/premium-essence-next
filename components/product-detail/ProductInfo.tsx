"use client";

import { useState, useMemo } from "react";
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

                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                    <span className="text-[10px] tracking-widest text-dark font-bold uppercase bg-[#E9D7C3] px-3 py-1.5 border border-dark/10">
                        Save {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}%
                    </span>
                )}

                {/* Stock Badge */}
                {isOutOfStock ? (
                    <span className="ml-auto text-[10px] tracking-widest font-bold uppercase text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 flex items-center gap-1.5">
                        <AlertCircle size={13} /> Out of Stock
                    </span>
                ) : (
                    <span className="ml-auto text-[10px] tracking-widest font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                        In Stock ({selectedVariant?.stock ?? "Available"})
                    </span>
                )}
            </div>

            {/* Size Selector with Stock & Price Indicator */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end border-b border-dark/10 pb-2">
                    <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-dark">
                        Select Size
                    </span>
                    <button className="text-[10px] tracking-widest text-dark font-bold uppercase flex items-center gap-1.5 hover:opacity-70 transition-opacity">
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
                                className={`relative px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase border transition-all duration-300 font-bold flex flex-col items-center gap-0.5 ${
                                    isSelected
                                        ? "bg-dark text-white border-dark shadow-lg"
                                        : variantItem.outOfStock
                                        ? "bg-gray-100 text-dark/40 border-dark/10 hover:border-dark/30 line-through"
                                        : "bg-white text-dark border-dark/20 hover:border-dark"
                                }`}
                            >
                                <span>{variantItem.label}</span>
                                {variantItem.price && (
                                    <span className={`text-[9px] font-normal ${isSelected ? "text-white/80" : "text-dark/50"}`}>
                                        {variantItem.price} AED
                                    </span>
                                )}
                                {variantItem.outOfStock && (
                                    <span className="text-[8px] uppercase tracking-tighter text-rose-600 font-bold">
                                        Sold Out
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Quantity, Add to Cart & Wishlist */}
            <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center gap-4">
                    {/* Quantity Counter */}
                    <div className="flex items-center border border-dark/30 h-[56px] bg-white opacity-100 disabled:opacity-50">
                        <button
                            disabled={isOutOfStock}
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
        </div>
    );
}
