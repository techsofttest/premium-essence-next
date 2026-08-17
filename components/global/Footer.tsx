"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

// Inline SVGs for brand icons removed from lucide-react
const Facebook = ({ size = 24, strokeWidth = 2, className = "" }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const Twitter = ({ size = 24, strokeWidth = 2, className = "" }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
);

const Instagram = ({ size = 24, strokeWidth = 2, className = "" }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const Youtube = ({ size = 24, strokeWidth = 2, className = "" }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
);

interface MarqueeItem {
    name: string;
    slug: string;
    label?: string;
}

const DEFAULT_MARQUEE_ITEMS: MarqueeItem[] = [
    { name: "Dior Sauvage Elixir", slug: "dior-sauvage-elixir", label: "BEST SELLER" },
    { name: "Creed Aventus Eau de Parfum", slug: "creed-aventus-eau-de-parfum", label: "HAUTE PARFUM" },
    { name: "Baccarat Rouge 540 Extrait", slug: "baccarat-rouge-540-extrait", label: "SIGNATURE SCENT" },
    { name: "Tom Ford Tobacco Vanille", slug: "tom-ford-tobacco-vanille", label: "BEST SELLER" },
    { name: "Chanel Coco Mademoiselle", slug: "chanel-coco-mademoiselle", label: "BEST SELLER" },
    { name: "YSL Libre Intense", slug: "ysl-libre-intense", label: "NEW ARRIVAL" },
    { name: "Roja Parfums Elysium", slug: "roja-parfums-elysium", label: "NICHE SELECTION" },
    { name: "Hermès Terre d'Hermès", slug: "hermes-terre-dhermes", label: "CLASSIC ACCORD" }
];

export default function Footer() {
    const [items, setItems] = useState<MarqueeItem[]>(DEFAULT_MARQUEE_ITEMS);

    useEffect(() => {
        api<any>("/storefront/products?per_page=12")
            .then((res) => {
                const list = Array.isArray(res) ? res : res?.data || [];
                if (Array.isArray(list) && list.length > 0) {
                    const mapped: MarqueeItem[] = list.map((prod: any, idx: number) => ({
                        name: prod.name || prod.title,
                        slug: prod.slug,
                        label: prod.brand?.name ? prod.brand.name.toUpperCase() : idx % 2 === 0 ? "BEST SELLER" : "EXCLUSIVE"
                    }));
                    setItems(mapped);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <>
            {/* Continuous Scrolling Best-Sellers Marquee Strip */}
            <div className="relative w-full bg-[#1B1315] text-[#FAFAF8] py-3.5 overflow-hidden z-20 font-sans border-b border-white/10 select-none">
                <style>{`
                    @keyframes footerMarquee {
                        0% { transform: translate3d(0, 0, 0); }
                        100% { transform: translate3d(-50%, 0, 0); }
                    }
                    .animate-footer-marquee {
                        display: inline-flex;
                        white-space: nowrap;
                        animation: footerMarquee 35s linear infinite;
                    }
                    .animate-footer-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="flex w-full overflow-hidden">
                    <div className="animate-footer-marquee flex items-center gap-16 pr-16 text-[10px] tracking-[0.25em] uppercase font-semibold">
                        {/* First Set */}
                        {items.map((prod, i) => (
                            <Link
                                href={`/product/${prod.slug}`}
                                key={`set1-${i}`}
                                className="flex items-center gap-6 cursor-pointer group/link hover:opacity-80 transition-opacity"
                            >
                                <span className="text-[#F7F3F4]/60">{prod.label || "BEST SELLER"}</span>
                                <span className="text-[#F7F3F4] font-medium underline underline-offset-4 decoration-[#F7F3F4]/20 group-hover/link:decoration-[#F7F3F4] transition-colors">{prod.name}</span>
                                <span className="text-[#F7F3F4]/30 text-[10px]">✦</span>
                            </Link>
                        ))}
                        {/* Duplicate Set for Seamless Loop */}
                        {items.map((prod, i) => (
                            <Link
                                href={`/product/${prod.slug}`}
                                key={`set2-${i}`}
                                className="flex items-center gap-6 cursor-pointer group/link hover:opacity-80 transition-opacity"
                            >
                                <span className="text-[#F7F3F4]/60">{prod.label || "BEST SELLER"}</span>
                                <span className="text-[#F7F3F4] font-medium underline underline-offset-4 decoration-[#F7F3F4]/20 group-hover/link:decoration-[#F7F3F4] transition-colors">{prod.name}</span>
                                <span className="text-[#F7F3F4]/30 text-[10px]">✦</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="relative bg-[#F7F3F4] text-dark pt-24 pb-12 px-8 border-t border-dark/10 font-sans overflow-hidden">

                {/* Subtle, Sophisticated Watermark Logo */}
                <div className="absolute -right-20 -bottom-20 md:right-[-100px] md:bottom-[-100px] lg:right-[-50px] lg:bottom-[-50px] pointer-events-none opacity-[0.04] select-none z-0">
                    <Image
                        src="/logo/logo.png"
                        alt="Premium Essence Watermark"
                        width={550}
                        height={550}
                        className="object-contain filter grayscale"
                    />
                </div>

                {/* Subtle Scent Wave SVG Pattern (Same as Header) */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-15">
                    <svg width="100%" height="100%" className="w-full h-full">
                        <defs>
                            <pattern id="footer-scent-pattern" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
                                <path
                                    d="M0 20 Q 25 10 50 20 T 100 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeOpacity="0.2"
                                    strokeWidth="0.5"
                                    className="animate-pulse"
                                    style={{ animationDuration: '8s' }}
                                />
                                <path
                                    d="M0 30 Q 25 20 50 30 T 100 30"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeOpacity="0.2"
                                    strokeWidth="0.3"
                                    className="animate-pulse"
                                    style={{ animationDuration: '12s', animationDelay: '2s' }}
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#footer-scent-pattern)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-screen-2xl mx-auto">

                    {/* Main Responsive Grid with clean divider lines */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 mb-20">

                        {/* Column 1: Collections */}
                        <div className="flex flex-col pb-8 lg:pb-0 border-b lg:border-b-0 lg:border-r border-dark/10 pr-4 lg:pr-8">
                            <h4 className="font-serif text-lg tracking-widest uppercase mb-6 text-dark">Shop By</h4>
                            <ul className="flex flex-col gap-4 text-sm text-dark/70">
                                <li><Link href="/brands" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Designer Houses</Link></li>
                                <li><Link href="/fragrances?family=niche" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Niche Fragrances</Link></li>
                                <li><Link href="/fragrances?concentration=eau-de-parfum" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Extrait de Parfum</Link></li>
                                <li><Link href="/fragrances?family=oud" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Signature Oud Collection</Link></li>
                                <li><Link href="/shop" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Discovery Sets</Link></li>
                                <li><Link href="/shop" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Luxury Gifting</Link></li>
                                <li><Link href="/shop?filter=new_arrivals" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">New Arrivals</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: Information */}
                        <div className="flex flex-col py-8 lg:py-0 border-b lg:border-b-0 lg:border-r border-dark/10 md:pl-8 lg:px-8">
                            <h4 className="font-serif text-lg tracking-widest uppercase mb-6 text-dark">Information</h4>
                            <ul className="flex flex-col gap-4 text-sm text-dark/70">
                                <li><Link href="/journals" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">The Journal (Blog)</Link></li>
                                <li><Link href="/journals" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Newsroom</Link></li>
                                <li><Link href="/terms-and-conditions" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Terms & Conditions</Link></li>
                                <li><Link href="/privacy-policy" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Privacy Policy</Link></li>
                                <li><Link href="/refund-and-return" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Refund & Return</Link></li>
                                <li><Link href="/shipping-policy" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Shipping Policy</Link></li>
                                <li><Link href="/shop" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Corporate Gifting</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Support */}
                        <div className="flex flex-col py-8 lg:py-0 border-b lg:border-b-0 lg:border-r border-dark/10 lg:px-8">
                            <h4 className="font-serif text-lg tracking-widest uppercase mb-6 text-dark">Support</h4>
                            <ul className="flex flex-col gap-4 text-sm text-dark/70">
                                <li><Link href="/about" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Contact Us</Link></li>
                                <li><Link href="/track-order" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Order Tracking</Link></li>
                                <li><Link href="/shop" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">All Products</Link></li>
                                <li><Link href="/faqs" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">FAQ</Link></li>
                                <li><Link href="/shop" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300 block">Sitemap</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Contact Us (Details from Client PDF) */}
                        <div className="flex flex-col py-8 lg:py-0 border-b lg:border-b-0 lg:border-r border-dark/10 md:pl-8 lg:px-8">
                            <h4 className="font-serif text-lg tracking-widest uppercase mb-6 text-dark">Contact Us</h4>
                            <div className="flex flex-col gap-4 text-sm text-dark/70 leading-relaxed">
                                <p>
                                    Premium Essence Perfumes LLC<br />
                                    Musaffah, M/9, Abu Dhabi, UAE<br />
                                    PO Box: 92282
                                </p>
                                <div className="flex flex-col gap-1 mt-2">
                                    <a href="mailto:sales@premium-perfumes.com" className="hover:text-[#D4AF37] transition-colors underline underline-offset-4 decoration-dark/20">
                                        sales@premium-perfumes.com
                                    </a>
                                    <a href="tel:+971557232010" className="hover:text-[#D4AF37] transition-colors mt-2 block">
                                        Mob: +971 55 723 2010
                                    </a>
                                    <a href="tel:025508990" className="hover:text-[#D4AF37] transition-colors block">
                                        Tel: 02 550 8990
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Column 5: Exclusive Newsletter */}
                        <div className="flex flex-col pt-8 lg:pt-0 lg:pl-8">
                            <h4 className="font-serif text-lg tracking-widest uppercase mb-6 text-dark">Exclusive</h4>

                            {/* Elegant Input Field */}
                            <form className="relative mb-6 group">
                                <input
                                    type="email"
                                    placeholder="Enter email here"
                                    className="w-full bg-transparent border-b border-dark/20 pb-3 text-sm text-dark outline-none placeholder:text-dark/40 focus:border-[#4A323A] transition-colors pr-8"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 text-dark/50 group-hover:text-[#D4AF37] transition-colors"
                                >
                                    <ArrowRight size={18} strokeWidth={1.5} />
                                </button>
                            </form>

                            <p className="text-xs text-dark/60 leading-relaxed mb-8">
                                Sign up here to get the latest news, updates and special offers delivered to your inbox.
                                <br /><br />
                                Plus, you'll be the first to know about our private sales.
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center gap-6 text-dark/70">
                                <a href="#" className="hover:text-[#D4AF37] hover:-translate-y-1 transition-all duration-300">
                                    <Facebook size={20} strokeWidth={1.5} />
                                </a>
                                <a href="#" className="hover:text-[#D4AF37] hover:-translate-y-1 transition-all duration-300">
                                    <Twitter size={20} strokeWidth={1.5} />
                                </a>
                                <a href="#" className="hover:text-[#D4AF37] hover:-translate-y-1 transition-all duration-300">
                                    <Instagram size={20} strokeWidth={1.5} />
                                </a>
                                <a href="#" className="hover:text-[#D4AF37] hover:-translate-y-1 transition-all duration-300">
                                    <Youtube size={20} strokeWidth={1.5} />
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Copyright Bar */}
                    <div className="pt-8 border-t border-dark/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-dark/40">
                        <p>© {new Date().getFullYear()} Premium Essence Perfumes LLC. All Rights Reserved.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-[#D4AF37] transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-[#D4AF37] transition-colors">Terms</Link>
                        </div>
                    </div>

                </div>
            </footer>
        </>
    );
}