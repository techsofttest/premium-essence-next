"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ShoppingBag, Sparkles, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { getCuratedDealBySlug, getStorefrontCuratedDeal, CuratedDeal } from "@/lib/deals";
import { useCart } from "@/context/CartContext";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function DealDetailPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const router = useRouter();
    const { addToCart, setIsDrawerOpen } = useCart();

    const initialDeal = getCuratedDealBySlug(slug);
    const [deal, setDeal] = useState<CuratedDeal | undefined>(initialDeal);

    useEffect(() => {
        getStorefrontCuratedDeal(slug).then((fetched) => {
            if (fetched) setDeal(fetched);
        });
    }, [slug]);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [added, setAdded] = useState<boolean>(false);

    if (!deal) {
        return (
            <div className="min-h-screen bg-[#F7F3F4] text-dark flex flex-col items-center justify-center p-8">
                <Sparkles size={48} className="text-dark/30 mb-4" />
                <h1 className="font-serif text-3xl font-bold mb-2">Curated Deal Not Found</h1>
                <p className="text-sm text-dark/60 mb-6">The special deal or curation you are looking for is no longer active.</p>
                <Link href="/shop" className="bg-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors">
                    Explore Shop Catalog
                </Link>
            </div>
        );
    }

    const currentImage = selectedImage || deal.image;

    const handleAddToCart = () => {
        addToCart({
            id: `deal-${deal.slug}`,
            dealSlug: deal.slug,
            dealId: (deal as any).id,
            isDeal: true,
            brand: "Exclusive Curation",
            name: deal.name,
            price: deal.price,
            size: deal.subtitle,
            variant: deal.subtitle,
            image: deal.image,
            quantity: quantity,
        } as any);

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        setIsDrawerOpen(true);
    };

    const handleBuyNow = () => {
        addToCart({
            id: `deal-${deal.slug}`,
            dealSlug: deal.slug,
            dealId: (deal as any).id,
            isDeal: true,
            brand: "Exclusive Curation",
            name: deal.name,
            price: deal.price,
            size: deal.subtitle,
            variant: deal.subtitle,
            image: deal.image,
            quantity: quantity,
        } as any);
        router.push("/checkout");
    };

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 pt-10">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-dark font-bold mb-8">
                    <Link href="/" className="hover:text-dark/60 transition-colors">Home</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <Link href="/shop" className="hover:text-dark/60 transition-colors">Shop</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <span className="text-dark/50">{deal.name}</span>
                </nav>

                {/* Main Product / Curation Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* Left Column: Image Showcase */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        <div className="relative w-full aspect-square bg-white border border-dark/10 shadow-sm overflow-hidden group">
                            <Image
                                src={currentImage}
                                alt={deal.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute top-4 left-4 bg-dark text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-md">
                                {deal.badge}
                            </div>
                        </div>

                        {/* Image Gallery Thumbnails */}
                        {deal.gallery && deal.gallery.length > 1 && (
                            <div className="flex items-center gap-3">
                                {deal.gallery.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative w-20 h-20 bg-white border transition-all ${
                                            currentImage === img ? "border-dark ring-1 ring-dark" : "border-dark/10 opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Deal Details & Direct Purchase */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        
                        <div>
                            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block mb-2">
                                Special Curation Bundle
                            </span>
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight leading-tight mb-2">
                                {deal.name}
                            </h1>
                            <p className="text-sm font-medium text-dark/60 tracking-wider uppercase">
                                {deal.subtitle}
                            </p>
                        </div>

                        {/* Price & Savings Tag */}
                        <div className="flex items-center gap-4 bg-white border border-dark/10 p-5 shadow-sm">
                            <span className="font-serif text-3xl font-bold text-dark">
                                {deal.price.toLocaleString()} AED
                            </span>
                            <span className="text-lg text-dark/40 line-through">
                                {deal.originalPrice.toLocaleString()} AED
                            </span>
                            <span className="bg-[#1B1315] text-[#C5A059] text-xs font-bold uppercase tracking-widest px-3 py-1 ml-auto">
                                Save {deal.discountPercent}%
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-dark/80 leading-relaxed">
                            {deal.description}
                        </p>

                        {/* Package Contents */}
                        <div className="bg-white border border-dark/10 p-6 space-y-3 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-dark border-b border-dark/10 pb-2">
                                What's Inside This Curation Box
                            </h3>
                            <ul className="space-y-2 pt-1">
                                {deal.contents.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs text-dark/80 font-medium">
                                        <div className="w-4 h-4 rounded-full bg-[#4A323A]/10 text-[#4A323A] flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={10} strokeWidth={3} />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Key Highlights */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-dark/60">
                                Curation Highlights
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {deal.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-dark/70 bg-white/60 p-2.5 border border-dark/5">
                                        <Sparkles size={14} className="text-[#C5A059] shrink-0" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart Controls */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4 border-t border-dark/10">
                            
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-dark/20 bg-white h-12 w-32 shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-full flex items-center justify-center text-dark hover:bg-dark/5 font-bold"
                                >
                                    -
                                </button>
                                <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-full flex items-center justify-center text-dark hover:bg-dark/5 font-bold"
                                >
                                    +
                                </button>
                            </div>

                            {/* Add Bundle to Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 h-12 bg-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                            >
                                <ShoppingBag size={16} />
                                {added ? "Added To Cart!" : "Add Bundle to Cart"}
                            </button>
                        </div>

                        {/* Buy Bundle Now (Direct Checkout) */}
                        <button
                            onClick={handleBuyNow}
                            className="w-full h-12 bg-[#1B1315] text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold uppercase tracking-widest hover:bg-dark transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                            Buy Bundle Now
                        </button>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dark/10 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                                <Truck size={18} className="text-dark/50" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-dark/70">Free Express Delivery</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <ShieldCheck size={18} className="text-dark/50" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-dark/70">100% Authentic Guarantee</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <RefreshCw size={18} className="text-dark/50" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-dark/70">30-Day Free Returns</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </main>
    );
}
