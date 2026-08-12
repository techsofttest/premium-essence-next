"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(images[0]);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    return (
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 h-fit">
            {/* Thumbnails (Left) */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto product-gallery-scroll md:max-h-[600px] order-2 md:order-1 shrink-0 pb-4 md:pb-0">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-20 md:w-28 aspect-[4/5] bg-white border transition-all duration-300 shrink-0 ${activeImage === img ? "border-dark border-2 shadow-md opacity-100" : "border-dark/10 opacity-60 hover:opacity-100"}`}
                    >
                        <Image src={img} alt={`${name} ${i}`} fill className="object-contain p-2" />
                    </button>
                ))}
            </div>

            {/* Main Image (Right) with Hover to Zoom */}
            <div
                className="flex-1 relative bg-white border border-dark/10 overflow-hidden group shadow-sm max-h-[600px] aspect-[4/5] order-1 md:order-2 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
            >
                <div
                    className="w-full h-full transition-transform duration-200 ease-out"
                    style={{
                        transform: isZoomed ? `scale(2)` : `scale(1)`,
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                    }}
                >
                    <Image
                        src={activeImage || "/logo/logo-black.png"}
                        alt={name}
                        fill
                        priority
                        unoptimized
                        onError={() => setActiveImage("/logo/logo-black.png")}
                        className="object-contain p-12"
                    />
                </div>
            </div>
        </div>
    );
}
