"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import GlowingButton from "./GlowingButton";
import { ProductVariantItem } from "./ProductCard";

export default function AddToCartModal() {
    const { isModalOpen, setIsModalOpen, selectedProduct, addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("100ml");
    const [quantity, setQuantity] = useState(1);
    const [imgSrc, setImgSrc] = useState(selectedProduct?.image || "/logo/logo-black.png");

    useEffect(() => {
        if (isModalOpen && selectedProduct) {
            setQuantity(1);
            const firstVariant = selectedProduct.variants?.[0];
            setSelectedSize(firstVariant?.label || firstVariant?.size || "100ml");
            setImgSrc(selectedProduct.image || "/logo/logo-black.png");
        }
    }, [isModalOpen, selectedProduct]);

    const variants: ProductVariantItem[] = selectedProduct?.variants || [];

    const selectedVariant = useMemo(() => {
        if (!variants.length) return null;
        return (
            variants.find(
                (v) => (v.label || v.size || "").toLowerCase() === selectedSize.toLowerCase()
            ) || variants[0]
        );
    }, [variants, selectedSize]);

    if (!isModalOpen || !selectedProduct) return null;

    const currentPrice = selectedVariant?.price ?? selectedProduct.price;
    const currentOriginalPrice = selectedVariant?.originalPrice ?? selectedProduct.originalPrice;
    const isOutOfStock = selectedVariant ? (selectedVariant.stock ?? 0) <= 0 : false;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addToCart({
            id: selectedProduct.id,
            brand: selectedProduct.brand,
            name: selectedProduct.name,
            price: currentPrice,
            size: selectedSize,
            image: imgSrc || selectedProduct.image || "/logo/logo-black.png",
            quantity: quantity,
            productId: Number(selectedProduct.id),
            variantId: selectedVariant?.id,
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans">
            <div className="bg-white w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex flex-col md:flex-row h-full">
                    {/* Left: Product Image */}
                    <div className="w-full md:w-5/12 bg-[#F7F3F4] relative aspect-[4/5] md:aspect-auto">
                        <Image 
                            src={imgSrc || "/logo/logo-black.png"} 
                            alt={selectedProduct.name} 
                            fill 
                            unoptimized
                            onError={() => setImgSrc("/logo/logo-black.png")}
                            className="object-contain p-8"
                        />
                    </div>

                    {/* Right: Selection Details */}
                    <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-dark/5 transition-colors"
                        >
                            <X size={20} className="text-dark/60" />
                        </button>

                        <div className="flex flex-col gap-2 mb-6">
                            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C5A059] font-bold">{selectedProduct.brand}</span>
                            <h2 className="font-serif text-2xl md:text-3xl text-dark leading-tight">{selectedProduct.name}</h2>
                            <div className="flex items-baseline gap-3 mt-1">
                                <span className="font-serif text-2xl text-dark font-medium">{currentPrice} AED</span>
                                {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                                    <span className="text-sm text-dark/40 line-through font-light">{currentOriginalPrice} AED</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 flex-1">
                            {/* Size Selection */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark">Select Size</span>
                                    {isOutOfStock && (
                                        <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                            <AlertCircle size={12} /> Out of Stock
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {(variants.length
                                        ? variants.map((v) => ({
                                              label: v.label || v.size || `${v.id}`,
                                              price: v.price,
                                              outOfStock: (v.stock ?? 0) <= 0,
                                          }))
                                        : ["50ml", "100ml", "150ml"].map((s) => ({ label: s, price: selectedProduct.price, outOfStock: false }))
                                    ).map((vItem) => {
                                        const isSelected = selectedSize.toLowerCase() === vItem.label.toLowerCase();
                                        return (
                                            <button
                                                key={vItem.label}
                                                onClick={() => setSelectedSize(vItem.label)}
                                                className={`px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 border flex flex-col items-center ${
                                                    isSelected 
                                                        ? "bg-dark text-white border-dark" 
                                                        : vItem.outOfStock
                                                        ? "bg-gray-100 text-dark/40 border-dark/10 line-through"
                                                        : "bg-white text-dark/70 border-dark/15 hover:border-dark/40"
                                                }`}
                                            >
                                                <span>{vItem.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quantity Selection */}
                            <div className="flex flex-col gap-3">
                                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark">Quantity</span>
                                <div className="flex items-center border border-dark/20 w-fit bg-white">
                                    <button 
                                        disabled={isOutOfStock}
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="px-5 py-3 hover:bg-dark/5 transition-colors text-dark disabled:opacity-30"
                                    >
                                        <Minus size={14} strokeWidth={2.5} />
                                    </button>
                                    <span className="w-12 text-center text-sm font-bold text-dark">{quantity}</span>
                                    <button 
                                        disabled={isOutOfStock}
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="px-5 py-3 hover:bg-dark/5 transition-colors text-dark disabled:opacity-30"
                                    >
                                        <Plus size={14} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            {isOutOfStock ? (
                                <button
                                    disabled
                                    className="w-full h-14 bg-dark/20 text-dark/50 border border-dark/10 font-bold text-[11px] tracking-[0.3em] uppercase flex items-center justify-center gap-2 cursor-not-allowed"
                                >
                                    <AlertCircle size={16} /> Out of Stock
                                </button>
                            ) : (
                                <GlowingButton 
                                    onClick={handleAddToCart}
                                    fullWidth 
                                    className="h-14 text-[11px] tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                                >
                                    <ShoppingCart size={16} />
                                    Add to Bag — {(currentPrice * quantity).toLocaleString()} AED
                                </GlowingButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
