"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus } from "lucide-react";

interface CartItemProps {
    item: {
        id: string;
        brand: string;
        name: string;
        price: number;
        size: string;
        image: string;
        quantity: number;
        stock?: number;
    };
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const [imgSrc, setImgSrc] = useState(item.image || "/products/Aventus 1.png");

    useEffect(() => {
        setImgSrc(item.image || "/products/Aventus 1.png");
    }, [item.image]);

    const isOutOfStock = item.stock !== undefined && item.stock !== null && item.stock <= 0;
    const isInsufficientStock = item.stock !== undefined && item.stock !== null && item.stock > 0 && item.quantity > item.stock;

    return (
        <div className={`group flex flex-col sm:flex-row gap-6 p-6 border shadow-sm hover:shadow-md transition-all duration-500 ${
            isOutOfStock ? "bg-red-50/50 border-red-200" : isInsufficientStock ? "bg-amber-50/50 border-amber-200" : "bg-white border-dark/5"
        }`}>
            {/* Product Image */}
            <Link href={`/product/${item.id}`} className="relative w-full sm:w-32 aspect-[4/5] bg-[#F7F3F4] overflow-hidden shrink-0 group-hover:scale-[1.02] transition-transform duration-700">
                <Image 
                    src={imgSrc} 
                    alt={item.name} 
                    fill 
                    unoptimized
                    onError={() => setImgSrc("/products/Aventus 1.png")}
                    className="object-contain p-4" 
                />
            </Link>

            {/* Product Details */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] tracking-[0.4em] uppercase text-[#C5A059] font-bold">{item.brand}</span>
                        <Link href={`/product/${item.id}`} className="font-serif text-lg md:text-xl text-dark hover:text-dark/70 transition-colors">
                            {item.name}
                        </Link>
                        <span className="text-[10px] tracking-widest text-dark/80 font-bold uppercase mt-1">Size: {item.size}</span>

                        {isOutOfStock && (
                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 w-fit">
                                Out of Stock (0 available)
                            </span>
                        )}

                        {isInsufficientStock && (
                            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 w-fit">
                                Only {item.stock} left in stock (Requested: {item.quantity})
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-2 hover:bg-dark/5 transition-colors text-dark/50 hover:text-dark"
                    >
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-6 sm:mt-0">
                    <div className="flex items-center border border-dark/20 bg-white h-10">
                        <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-4 py-2 hover:bg-dark/5 transition-colors text-dark"
                        >
                            <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-dark">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-4 py-2 hover:bg-dark/5 transition-colors text-dark"
                        >
                            <Plus size={12} strokeWidth={2.5} />
                        </button>
                    </div>
                    <span className="font-serif text-lg md:text-xl text-dark">{item.price * item.quantity} AED</span>
                </div>
            </div>
        </div>
    );
}
