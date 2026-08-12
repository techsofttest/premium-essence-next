"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface OrderItemsPreviewProps {
    items: {
        id: string;
        brand: string;
        name: string;
        price: number;
        size: string;
        image: string;
        quantity: number;
    }[];
}

function OrderItemImage({ src, name }: { src: string; name: string }) {
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
            className="object-contain p-2"
        />
    );
}

export default function OrderItemsPreview({ items }: OrderItemsPreviewProps) {
    return (
        <div className="bg-white p-8 border border-dark/10">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[11px] tracking-[0.2em] uppercase font-bold text-dark">Order Items ({items.length})</h2>
                <Link href="/cart" className="text-[10px] text-dark/70 underline uppercase font-bold hover:text-dark transition-colors">Edit Bag</Link>
            </div>
            <div className="flex flex-col gap-4">
                {items.map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-4 items-center">
                        <div className="relative w-16 h-20 bg-[#F7F3F4] shrink-0 border border-dark/5">
                            <OrderItemImage src={item.image} name={item.name} />
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-dark text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                            <span className="text-[9px] tracking-widest uppercase text-[#C5A059] font-bold">{item.brand}</span>
                            <span className="text-xs font-bold text-dark truncate">{item.name}</span>
                            <span className="text-[10px] text-dark/80 font-bold">{item.price} AED ({item.size})</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
