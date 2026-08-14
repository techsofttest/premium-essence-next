"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import GlowingButton from "./GlowingButton";

function CartDrawerItemImage({ src, name }: { src: string; name: string }) {
    const [imgSrc, setImgSrc] = useState(src || "/logo/logo-black.png");
    useEffect(() => {
        setImgSrc(src || "/logo/logo-black.png");
    }, [src]);

    return (
        <Image
            src={imgSrc || "/logo/logo-black.png"}
            alt={name}
            fill
            unoptimized
            onError={() => setImgSrc("/logo/logo-black.png")}
            className="object-contain p-3"
        />
    );
}

export default function CartDrawer() {
    const { isDrawerOpen, setIsDrawerOpen, cartItems, updateQuantity, removeFromCart, validateCartStock } = useCart();
    const [stockError, setStockError] = useState<string | null>(null);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (!isDrawerOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-dark/40 backdrop-blur-sm animate-in fade-in duration-500" 
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-md bg-[#F7F3F4] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out">
                {/* Header */}
                <div className="p-6 bg-white border-b border-dark/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className="text-dark" />
                        <h2 className="font-serif text-xl text-dark">Your Bag ({cartItems.length})</h2>
                    </div>
                    <button 
                        onClick={() => setIsDrawerOpen(false)}
                        className="p-2 hover:bg-dark/5 transition-colors"
                    >
                        <X size={20} className="text-dark/60" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                    <style>
                        {`
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 3px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(27, 19, 21, 0.1);
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgba(27, 19, 21, 0.2);
                        }
                        .custom-scrollbar {
                            scrollbar-width: thin;
                            scrollbar-color: rgba(27, 19, 21, 0.1) transparent;
                        }
                        `}
                    </style>
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40 py-20">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="font-serif text-lg">Your bag is empty</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                <div className="relative w-24 h-28 bg-white border border-dark/5 shrink-0">
                                    <CartDrawerItemImage src={item.image} name={item.name} />
                                </div>
                                <div className="flex flex-1 flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[8px] tracking-widest uppercase text-[#C5A059] font-bold">{item.brand}</span>
                                            <h3 className="text-sm font-bold text-dark leading-tight">{item.name}</h3>
                                            <span className="text-[10px] text-dark/80 font-bold uppercase mt-0.5">{item.size}</span>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.id, item.size)}
                                            className="text-dark/40 hover:text-dark transition-colors p-1"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border border-dark/20 bg-white">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                                className="px-2 py-1.5 hover:bg-dark/5 transition-colors text-dark/70 hover:text-dark"
                                            >
                                                <Minus size={10} strokeWidth={3} />
                                            </button>
                                            <span className="w-8 text-center text-[10px] font-bold text-dark">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                                className="px-2 py-1.5 hover:bg-dark/5 transition-colors text-dark/70 hover:text-dark"
                                            >
                                                <Plus size={10} strokeWidth={3} />
                                            </button>
                                        </div>
                                        <span className="text-sm font-bold text-dark">{(item.price * item.quantity).toLocaleString()} AED</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-white border-t border-dark/10 flex flex-col gap-4">
                    {stockError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold">
                            {stockError}
                        </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Estimated Subtotal</span>
                        <span className="font-serif text-xl text-dark">{subtotal.toLocaleString()} AED</span>
                    </div>
                    
                    <GlowingButton
                        onClick={async (e) => {
                            e.preventDefault();
                            const { valid, errors } = await validateCartStock();
                            if (!valid) {
                                setStockError(errors[0]);
                            } else {
                                setStockError(null);
                                setIsDrawerOpen(false);
                                window.location.href = "/checkout";
                            }
                        }}
                        fullWidth
                        className="h-14 text-[10px] tracking-[0.3em] uppercase"
                    >
                        Secure Checkout
                    </GlowingButton>
                    
                    <Link 
                        href="/cart" 
                        onClick={() => setIsDrawerOpen(false)}
                        className="text-center text-[10px] tracking-widest uppercase font-bold text-dark/60 hover:text-dark transition-colors py-2 flex items-center justify-center gap-2 group"
                    >
                        View Full Shopping Bag
                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
