"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ShoppingBag, X, Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { FragranceReelItem } from "@/lib/storefront";
import { useCart } from "@/context/CartContext";

interface FragranceReelsSectionProps {
    reels: FragranceReelItem[];
}

export default function FragranceReelsSection({ reels }: FragranceReelsSectionProps) {
    const [selectedReel, setSelectedReel] = useState<FragranceReelItem | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const { addToCart } = useCart();

    if (!reels || reels.length === 0) return null;

    return (
        <section className="w-full py-14 px-4 sm:px-8 md:px-12 bg-[#140F11] text-cream relative overflow-hidden border-y border-gold/15">
            {/* Ambient Lighting Accents */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-mauve/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-screen-2xl mx-auto relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-2">
                            <Sparkles size={14} className="text-gold" />
                            <span>Immersion & Storytelling</span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream font-medium tracking-tight">
                            Feel the Scent in Motion
                        </h2>
                        <p className="text-xs sm:text-sm text-cream/70 mt-2 max-w-xl leading-relaxed">
                            Watch our master perfumers, bottle craftsmanship, and sensory fragrance reels to experience luxury before you buy.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-end">
                        <span className="text-[11px] uppercase tracking-widest text-gold/80 font-bold">
                            {reels.length} Sensory Stories
                        </span>
                    </div>
                </div>

                {/* Reels Grid / Horizontal Scroll */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {reels.map((reel) => {
                        const isVideo = Boolean(reel.video_url);
                        const coverImg = reel.thumbnail || reel.product?.image || "/products/Baccarat Rouge 540 1.png";
                        const targetHref = reel.button_link || (reel.product ? `/product/${reel.product.slug}` : "/shop");

                        return (
                            <div
                                key={reel.id}
                                className="group relative rounded-2xl overflow-hidden bg-[#1D1719] border border-cream/10 shadow-2xl transition-all duration-500 hover:border-gold/50 hover:shadow-gold/10 hover:-translate-y-1.5 flex flex-col aspect-[9/14] cursor-pointer"
                                onClick={() => isVideo ? setSelectedReel(reel) : undefined}
                            >
                                {/* Media Cover Background */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={coverImg}
                                        alt={reel.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        unoptimized={coverImg.startsWith("http")}
                                    />
                                    {/* Vignette Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#140F11] via-[#140F11]/30 to-transparent z-10" />
                                </div>

                                {/* Top Badge & Controls */}
                                <div className="relative z-20 p-3 sm:p-4 flex items-start justify-between">
                                    {reel.badge ? (
                                        <span className="bg-dark/80 backdrop-blur-md text-gold border border-gold/30 text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                                            {reel.badge}
                                        </span>
                                    ) : <span />}

                                    {reel.product && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (reel.product) {
                                                    addToCart({
                                                        id: reel.product.id,
                                                        brand: reel.product.brand,
                                                        name: reel.product.name,
                                                        price: reel.product.price,
                                                        size: reel.product.variants?.[0]?.size || "100ml",
                                                        image: reel.product.image,
                                                        quantity: 1,
                                                        productId: Number(reel.product.id),
                                                        variantId: reel.product.variants?.[0]?.id,
                                                    });
                                                }
                                            }}
                                            className="w-8 h-8 rounded-full bg-white/20 hover:bg-gold text-white hover:text-dark backdrop-blur-md flex items-center justify-center transition-colors shadow-lg shrink-0"
                                            title="Quick Add to Cart"
                                        >
                                            <ShoppingBag size={14} />
                                        </button>
                                    )}
                                </div>

                                {/* Center Play Button Overlay */}
                                {isVideo && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold/90 text-dark flex items-center justify-center pl-1 shadow-2xl group-hover:scale-110 group-hover:bg-gold transition-all duration-300">
                                            <Play size={20} className="fill-dark" />
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Info Bar */}
                                <div className="relative z-20 mt-auto p-3 sm:p-4 flex flex-col justify-end">
                                    <h3 className="font-serif text-xs sm:text-sm font-bold text-cream group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                                        {reel.title}
                                    </h3>
                                    {reel.subtitle && (
                                        <p className="text-[10px] sm:text-xs text-cream/70 mt-1 line-clamp-1">
                                            {reel.subtitle}
                                        </p>
                                    )}

                                    {/* Action Button */}
                                    <div className="mt-3 flex items-center justify-between">
                                        <Link
                                            href={targetHref}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-[#2B82F6] hover:bg-[#1D6FE5] text-white text-[10px] sm:text-xs font-bold px-4 py-1.5 rounded-md uppercase tracking-wider transition-colors shadow-md flex items-center gap-1"
                                        >
                                            {reel.button_text || "View"}
                                        </Link>

                                        {reel.product && (
                                            <span className="text-xs font-serif font-bold text-gold">
                                                AED {reel.product.price}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Video Modal Overlay */}
            {selectedReel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div
                        className="fixed inset-0"
                        onClick={() => setSelectedReel(null)}
                    />

                    <div className="relative z-10 w-full max-w-lg bg-[#1B1315] border border-gold/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-cream/10 bg-[#140F11]">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-gold" />
                                <span className="font-serif text-sm sm:text-base font-bold text-cream">
                                    {selectedReel.title}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedReel(null)}
                                className="p-1 rounded-full text-cream/70 hover:text-cream hover:bg-cream/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Video Player Frame */}
                        <div className="relative aspect-[9/14] max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                            <video
                                src={selectedReel.video_url}
                                poster={selectedReel.thumbnail}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                className="w-full h-full object-cover"
                            />

                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
                            >
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        </div>

                        {/* Modal Footer / Product Actions */}
                        <div className="p-5 bg-[#1B1315] border-t border-cream/10 flex flex-col gap-3">
                            {selectedReel.subtitle && (
                                <p className="text-xs text-cream/80 leading-relaxed">
                                    {selectedReel.subtitle}
                                </p>
                            )}

                            <div className="flex items-center justify-between gap-3 pt-2">
                                {selectedReel.product ? (
                                    <>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-gold block">Product</span>
                                            <span className="text-xs font-serif font-bold text-cream line-clamp-1">{selectedReel.product.name}</span>
                                            <span className="text-xs font-bold text-gold">AED {selectedReel.product.price}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    if (selectedReel.product) {
                                                        addToCart({
                                                            id: selectedReel.product.id,
                                                            brand: selectedReel.product.brand,
                                                            name: selectedReel.product.name,
                                                            price: selectedReel.product.price,
                                                            size: selectedReel.product.variants?.[0]?.size || "100ml",
                                                            image: selectedReel.product.image,
                                                            quantity: 1,
                                                            productId: Number(selectedReel.product.id),
                                                            variantId: selectedReel.product.variants?.[0]?.id,
                                                        });
                                                    }
                                                }}
                                                className="bg-gold hover:bg-amber-400 text-dark px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-lg"
                                            >
                                                <ShoppingBag size={14} /> Add to Cart
                                            </button>
                                            <Link
                                                href={`/product/${selectedReel.product.slug}`}
                                                onClick={() => setSelectedReel(null)}
                                                className="bg-cream/10 hover:bg-cream/20 text-cream px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={selectedReel.button_link || "/shop"}
                                        onClick={() => setSelectedReel(null)}
                                        className="w-full text-center bg-gold hover:bg-amber-400 text-dark py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                                    >
                                        Explore Collection
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
