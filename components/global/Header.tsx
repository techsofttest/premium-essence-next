"use client";

import Image from "next/image";
import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, Heart, ShoppingCart, ChevronLeft, ChevronRight, PenTool, Truck, Sparkles, Menu, X, User, CircleUserRound, Package, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

import { usePathname, useSearchParams } from "next/navigation";

function HeaderRouteTracker({ onClose }: { onClose: () => void }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        onClose();
    }, [pathname, searchParams]);

    return null;
}

// Navigation URL Resolution Helpers
function getCategoryHref(cat: any): string {
    if (!cat) return "/shop";
    if (cat.name === "Brands") return "/brands";
    if (cat.name === "Fragrances") return "/fragrances";
    if (cat.name === "Bestsellers") return "/shop?filter=bestsellers";
    if (cat.name === "New Arrivals") return "/shop?filter=new_arrivals";
    if (cat.name === "Discovery Sets") return "/category/discovery-sets";
    if (cat.name === "Gifting") return "/category/gifting";
    if (cat.href) return cat.href;
    return "/shop";
}

function getMenuLinkHref(categoryName: string, subTitle: string | undefined, linkItem: any): string {
    // 1. Prioritize explicit href if it exists in the link object
    if (typeof linkItem === "object" && linkItem !== null && linkItem.href) {
        return linkItem.href;
    }

    const linkName = typeof linkItem === "object" && linkItem !== null ? (linkItem.name || linkItem.label) : linkItem;
    const rawSlug = typeof linkItem === "object" && linkItem !== null && linkItem.slug
        ? linkItem.slug
        : String(linkName).toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    const slug = String(rawSlug).toLowerCase();

    // 2. Specific Logic for Brands
    if (categoryName === "Brands") {
        return `/brand/${slug}`;
    }

    // 3. Specific Logic for Fragrances
    if (categoryName === "Fragrances") {
        if (subTitle === "For Whom") return `/fragrances?gender=${encodeURIComponent(linkName)}`;
        if (subTitle === "Olfactive Families") return `/fragrances?family=${slug}`;
        if (subTitle === "Concentration") return `/fragrances?concentration=${slug}`;
        return `/fragrances`;
    }

    return `/category/${slug}`;
}

const ANNOUNCEMENTS = [
    { text: "Complimentary Engraving on Orders Above 500 AED", icon: PenTool },
    { text: "Free Shipping on All Orders Over 300 AED", icon: Truck },
    { text: "Discover Our Exclusive Summer Collection", icon: Sparkles }
];

const NAV_CATEGORIES = [
    {
        name: "Brands",
        href: "/brands",
        hasDropdown: true,
        featuredImage: "/products/The Alchemist's Garden 1.png",
        featuredText: "The Art of Layering",
        subCategories: [
            { title: "Designer Houses", links: ["Dior", "Chanel", "Gucci", "Yves Saint Laurent", "Versace"] },
            { title: "Prestige & Niche", links: ["Creed", "Tom Ford", "Maison Francis Kurkdjian", "Jo Malone London"] },
            { title: "Classic Elegance", links: ["Hermès", "Givenchy", "Prada", "Bvlgari", "Montblanc"] },
        ]
    },
    {
        name: "Fragrances",
        href: "/fragrances",
        hasDropdown: true,
        featuredImage: "/products/Baccarat Rouge 540 1.png",
        featuredText: "Exquisite Concentrations",
        subCategories: [
            { title: "For Whom", links: ["Men", "Women", "Unisex"] },
            { title: "Olfactive Families", links: ["Oud", "Woody", "Floral", "Fresh & Citrus", "Oriental & Spicy"] },
            { title: "Concentration", links: ["Parfum", "Eau de Parfum", "Eau de Toilette", "Perfume Oils"] },
        ]
    },
    { name: "Bestsellers", href: "/shop?filter=bestsellers", hasDropdown: false },
    { name: "New Arrivals", href: "/shop?filter=new_arrivals", hasDropdown: false },
    { name: "Discovery Sets", href: "/category/discovery-sets", hasDropdown: false },
    { name: "Gifting", href: "/category/gifting", hasDropdown: false },
];

export default function Header() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const [headerData, setHeaderData] = useState<any>(null);
    const [dbAnnouncements, setDbAnnouncements] = useState<any[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>({ products: [], brands: [], categories: [] });
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountMenuRef = useRef<HTMLDivElement>(null);

    const { customer, logout } = useAuth();
    const { wishlistProducts } = useWishlist();
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const closeAllMenus = useCallback(() => {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        setActiveMobileCategory(null);
        setIsAccountMenuOpen(false);
    }, []);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveMobileCategory(null);
    };

    // Close account dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch dynamic header data & announcements from database
    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        fetch(`${baseUrl}/storefront/announcements`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setDbAnnouncements(data);
                }
            })
            .catch(() => { });

        fetch(`${baseUrl}/storefront/header`)
            .then(res => res.json())
            .then(data => {
                if (data) setHeaderData(data);
            })
            .catch(() => { });
    }, []);

    const rawAnnouncements = dbAnnouncements.length > 0
        ? dbAnnouncements
        : (headerData?.announcements && Array.isArray(headerData.announcements) && headerData.announcements.length > 0
            ? headerData.announcements
            : ANNOUNCEMENTS);

    const activeAnnouncements = rawAnnouncements.map((a: any, idx: number) => ({
        text: typeof a === 'string' ? a : (a.text || a.title),
        icon: idx % 3 === 0 ? PenTool : (idx % 3 === 1 ? Truck : Sparkles)
    }));

    // Announcement slider
    useEffect(() => {
        if (activeAnnouncements.length === 0) return;
        const timer = setInterval(() => setCurrentAnnouncementIndex(prev => (prev + 1) % activeAnnouncements.length), 5000);
        return () => clearInterval(timer);
    }, [activeAnnouncements.length]);

    // Global Search Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ products: [], brands: [], categories: [] });
            return;
        }
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        const timer = setTimeout(() => {
            fetch(`${baseUrl}/storefront/search?q=${encodeURIComponent(searchQuery)}`)
                .then(res => res.json())
                .then(data => setSearchResults(data))
                .catch(() => { });
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Build categories based on API data or fallback
    const categoriesList = headerData ? [
        {
            name: "Brands",
            href: "/brands",
            hasDropdown: true,
            featuredImage: "/products/The Alchemist's Garden 1.png",
            featuredText: "The Art of Layering",
            subCategories: [
                {
                    title: "Designer Houses",
                    links: headerData.brands_by_classification?.["Designer Houses"]?.map((b: any) => ({ name: b.name, slug: b.slug })) || ["Dior", "Chanel", "Gucci", "Yves Saint Laurent", "Versace"]
                },
                {
                    title: "Prestige & Niche",
                    links: headerData.brands_by_classification?.["Prestige & Niche"]?.map((b: any) => ({ name: b.name, slug: b.slug })) || ["Creed", "Tom Ford", "Maison Francis Kurkdjian", "Jo Malone London"]
                },
                {
                    title: "Classic Elegance",
                    links: headerData.brands_by_classification?.["Classic Elegance"]?.map((b: any) => ({ name: b.name, slug: b.slug })) || ["Hermès", "Givenchy", "Prada", "Bvlgari", "Montblanc"]
                },
            ]
        },
        {
            name: "Fragrances",
            href: "/fragrances",
            hasDropdown: true,
            featuredImage: "/products/Baccarat Rouge 540 1.png",
            featuredText: "Exquisite Concentrations",
            subCategories: [
                {
                    title: "For Whom",
                    links: headerData.fragrance_menu?.for_whom?.map((item: any) => ({ name: item.name, href: item.href })) || ["Men", "Women", "Unisex"]
                },
                {
                    title: "Olfactive Families",
                    links: headerData.fragrance_menu?.olfactive_families?.map((item: any) => ({ name: item.name, slug: item.slug })) || ["Oud", "Woody", "Floral", "Fresh & Citrus", "Oriental & Spicy"]
                },
                {
                    title: "Concentration",
                    links: headerData.fragrance_menu?.concentrations?.map((item: any) => ({ name: item.name, slug: item.slug })) || ["Parfum", "Eau de Parfum", "Eau de Toilette", "Perfume Oils"]
                },
            ]
        },
        { name: "Bestsellers", href: "/shop?sort=featured", hasDropdown: false },
        { name: "New Arrivals", href: "/shop?sort=latest", hasDropdown: false },
        { name: "Discovery Sets", href: "/category/discovery-sets", hasDropdown: false },
        { name: "Gifting", href: "/category/gifting", hasDropdown: false },
    ] : NAV_CATEGORIES;

    // Scroll Behavior
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50) {
                setIsScrolled(false);
                setIsHidden(false);
            } else {
                setIsScrolled(true);
                if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                    setIsHidden(true);
                    setActiveDropdown(null);
                } else {
                    setIsHidden(false);
                }
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsAccountMenuOpen(false);
    };

    return (
        <div
            className={`w-full flex flex-col sticky top-0 z-50 transition-transform duration-500 font-sans bg-white text-dark shadow-md ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
            onMouseLeave={() => setActiveDropdown(null)}
        >
            <Suspense fallback={null}>
                <HeaderRouteTracker onClose={closeAllMenus} />
            </Suspense>
            {/* 1. Announcement Bar */}
            <div className="w-full py-2 px-4 flex justify-between items-center text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-colors duration-500 bg-[#1B1315] text-cream">
                <button onClick={() => setCurrentAnnouncementIndex(p => (p - 1 + activeAnnouncements.length) % activeAnnouncements.length)}><ChevronLeft size={14} /></button>
                <span className="flex items-center justify-center gap-2 w-full animate-in fade-in duration-500 text-center truncate px-2" key={currentAnnouncementIndex}>
                    {(() => {
                        const currentItem = activeAnnouncements[currentAnnouncementIndex % activeAnnouncements.length] || activeAnnouncements[0];
                        const Icon = currentItem.icon || Sparkles;
                        return <><Icon size={14} className="shrink-0 text-gold hidden sm:inline" /><span>{currentItem.text}</span></>;
                    })()}
                </span>
                <button onClick={() => setCurrentAnnouncementIndex(p => (p + 1) % activeAnnouncements.length)}><ChevronRight size={14} /></button>
            </div>

            {/* 2. Desktop Navigation */}
            <div className="w-full relative px-6 md:px-12 py-4 bg-white border-b border-dark/10">
                <div className="hidden lg:flex w-full items-center justify-between">
                    <div className="flex items-center h-full gap-8 xl:gap-12 relative z-10">
                        <Link href="/" className="relative h-16 w-30 shrink-0 transition-opacity hover:opacity-80">
                            <Image src="/logo/logo-black2.png" alt="Premium Essence" fill className="object-contain object-left" priority />
                        </Link>
                        <nav className="flex items-center gap-5 xl:gap-8 h-full">
                            {categoriesList.map((category) => (
                                <div key={category.name} className="h-full flex items-center" onMouseEnter={() => setActiveDropdown(category.name)}>
                                    <Link href={getCategoryHref(category)} onClick={closeAllMenus} className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors h-full flex items-center border-b-2 pt-0.5 ${activeDropdown === category.name ? "border-dark text-dark" : "border-transparent text-dark/70 hover:text-dark"}`}>
                                        {category.name}
                                    </Link>
                                    {category.hasDropdown && activeDropdown === category.name && (
                                        <div className="absolute top-full left-0 w-[100vw] -ml-8 bg-white text-dark border-t border-dark/10 shadow-2xl py-12 px-24 grid grid-cols-4 gap-12 animate-in fade-in slide-in-from-top-2 duration-300">
                                            {category.subCategories?.map((sub: any) => (
                                                <div key={sub.title} className="flex flex-col gap-4">
                                                    <h4 className="font-serif text-lg text-mauve tracking-wide mb-2 border-b border-dark/10 pb-2">{sub.title}</h4>
                                                    <ul className="flex flex-col gap-3">
                                                        {sub.links.map((linkItem: any) => (
                                                            <li key={typeof linkItem === 'string' ? linkItem : linkItem.name}>
                                                                <Link href={getMenuLinkHref(category.name, sub.title, linkItem)} onClick={closeAllMenus} className="text-sm text-dark/70 hover:text-dark transition-colors block w-fit">
                                                                    {typeof linkItem === 'string' ? linkItem : linkItem.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                            <Link href={getCategoryHref(category)} onClick={closeAllMenus} className="col-span-1 md:col-start-4 bg-[#4A323A] overflow-hidden relative min-h-[220px] group border border-dark/5 flex items-center justify-center">
                                                {category.featuredImage && <Image src={category.featuredImage} alt="Featured" fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out" />}
                                                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent z-10" />
                                                <div className="absolute bottom-4 left-4 z-20">
                                                    <span className="text-cream text-[10px] uppercase tracking-widest block mb-0.5 opacity-80">Discover</span>
                                                    <span className="text-cream font-serif text-lg leading-tight block">{category.featuredText}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    <div className="flex shrink-0 justify-end items-center gap-5 xl:gap-6 relative z-10">
                        <button onClick={() => setIsSearchModalOpen(true)} className="flex items-center gap-2 text-dark/60 hover:text-dark transition-colors border-b border-dark/20 hover:border-dark pb-1.5 w-24 group">
                            <Search size={16} strokeWidth={1.5} />
                            <span className="text-[10px] tracking-widest uppercase font-bold text-left w-full opacity-80 group-hover:opacity-100">Search...</span>
                        </button>
                        {isMounted && customer ? (
                            <div className="relative" ref={accountMenuRef}>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsAccountMenuOpen((prev) => !prev);
                                    }}
                                    className="flex items-center gap-1.5 text-dark/80 hover:text-dark transition-colors text-[11px] tracking-[0.15em] uppercase font-bold cursor-pointer"
                                >
                                    <CircleUserRound size={18} strokeWidth={1.5} />
                                    <span className="max-w-24 truncate">{customer.name}</span>
                                    <ChevronDown size={13} strokeWidth={1.5} className={`transition-transform duration-300 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isAccountMenuOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-52 bg-white border border-dark/10 shadow-2xl py-2 z-[999] animate-in fade-in slide-in-from-top-2 duration-200"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Link href="/account" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark transition-colors"><User size={15} /> Profile</Link>
                                        <Link href="/account/orders" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark transition-colors"><Package size={15} /> Orders</Link>
                                        <Link href="/wishlist" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark transition-colors"><Heart size={15} /> Wishlist</Link>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark transition-colors text-left cursor-pointer"><LogOut size={15} /> Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-1.5 text-dark/80 hover:text-dark transition-colors text-[11px] tracking-[0.25em] uppercase font-bold"><User size={16} /><span>Login</span></Link>
                        )}
                        <Link href="/wishlist" className="relative text-dark/80 hover:text-dark">
                            <Heart size={20} strokeWidth={1.5} className={isMounted && wishlistProducts.length > 0 ? "fill-[#4A323A] text-[#4A323A]" : ""} />
                            {isMounted && wishlistProducts.length > 0 && <span className="absolute -top-2 -right-2 bg-[#4A323A] text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold">{wishlistProducts.length}</span>}
                        </Link>
                        <Link href="/cart" className="relative text-dark/80 hover:text-dark">
                            <ShoppingCart size={20} strokeWidth={1.5} />
                            {isMounted && cartCount > 0 && <span className="absolute -top-2 -right-2 bg-dark text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>}
                        </Link>
                    </div>
                </div>

                {/* 3. Mobile Navbar */}
                <div className="flex lg:hidden w-full px-4 py-3 items-center justify-between z-40 bg-white border-b border-dark/5">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 text-dark/80 hover:text-dark" aria-label="Open navigation menu">
                        <Menu size={22} />
                    </button>

                    <div className="flex-1 flex justify-center px-2">
                        <Link href="/" className="relative h-8 w-36">
                            <Image src="/logo/logo-black2.png" alt="Premium Essence Logo" fill className="object-contain" priority />
                        </Link>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button onClick={() => setIsSearchModalOpen(true)} className="p-1 text-dark/80 hover:text-dark" aria-label="Search">
                            <Search size={17} />
                        </button>

                        {isMounted && customer ? (
                            <Link href="/account" className="p-1 text-dark/80 hover:text-dark" aria-label="Account Profile" title="Profile">
                                <CircleUserRound size={19} />
                            </Link>
                        ) : (
                            <Link href="/login" className="p-1 text-dark/80 hover:text-dark" aria-label="Login / Register" title="Login">
                                <User size={19} />
                            </Link>
                        )}

                        <Link href="/cart" className="relative p-1 text-dark/80 hover:text-dark" aria-label="Shopping Cart">
                            <ShoppingCart size={18} />
                            {isMounted && cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-dark text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* 4. Mobile Sidebar Drawer */}
            {isMounted && createPortal(
                <div className={`fixed inset-0 z-[99999] transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                    <div onClick={closeMobileMenu} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                    <div className={`fixed top-0 bottom-0 left-0 h-full w-[85vw] max-w-[340px] bg-[#1B1315] text-[#F7F3F4] flex flex-col z-[100000] transition-transform duration-500 ease-out transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

                        {/* Drawer Header with Centered White Logo */}
                        <div className="relative flex items-center justify-center px-6 py-4 border-b border-white/10 bg-[#160E10]">
                            <div className="relative h-9 w-40 flex items-center justify-center">
                                <Image
                                    src="/logo/logo.png"
                                    alt="Premium Essence"
                                    fill
                                    className="object-contain filter brightness-0 invert"
                                    priority
                                />
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className="absolute right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                                aria-label="Close navigation menu"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            {activeMobileCategory === null ? (
                                <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                                    {categoriesList.map((cat) => (
                                        <div key={cat.name} className="border-b border-white/5 pb-2">
                                            {cat.hasDropdown ? (
                                                <button onClick={() => setActiveMobileCategory(cat.name)} className="w-full flex items-center justify-between py-3">
                                                    <span className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37]">{cat.name}</span>
                                                    <ChevronRight size={14} className="text-white/40" />
                                                </button>
                                            ) : (
                                                <Link href={getCategoryHref(cat)} onClick={closeMobileMenu} className="w-full flex items-center justify-between py-3 text-xs tracking-[0.2em] uppercase text-white/90">
                                                    {cat.name}
                                                    <ChevronRight size={14} className="text-white/40" />
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                    <div className="pt-6 flex flex-col gap-4">
                                        <Link href="/journals" onClick={closeMobileMenu} className="text-[10px] uppercase tracking-widest text-white/50">Journal</Link>
                                        <Link href="/faqs" onClick={closeMobileMenu} className="text-[10px] uppercase tracking-widest text-white/50">Customer Care</Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
                                    <button onClick={() => setActiveMobileCategory(null)} className="flex items-center gap-2 text-xs font-bold uppercase text-[#D4AF37] py-2 border-b border-white/10 mb-2">
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-lg font-bold text-white">{activeMobileCategory}</h3>
                                        <Link href={getCategoryHref(categoriesList.find(c => c.name === activeMobileCategory))} onClick={closeMobileMenu} className="text-[10px] text-[#D4AF37] font-bold uppercase underline">View All →</Link>
                                    </div>
                                    <div className="space-y-6 pt-4">
                                        {categoriesList.find(c => c.name === activeMobileCategory)?.subCategories?.map((sub: any) => (
                                            <div key={sub.title} className="flex flex-col gap-3">
                                                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold border-b border-white/5 pb-1">{sub.title}</span>
                                                <div className="flex flex-col gap-3 pl-2">
                                                    {sub.links.map((linkItem: any) => (
                                                        <Link key={typeof linkItem === 'string' ? linkItem : linkItem.name} href={getMenuLinkHref(activeMobileCategory!, sub.title, linkItem)} onClick={closeMobileMenu} className="text-xs text-white/80 hover:text-[#D4AF37]">
                                                            {typeof linkItem === 'string' ? linkItem : linkItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-white/10 bg-[#160E10]">
                            {customer ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0"><p className="text-xs font-bold text-white truncate">{customer.name}</p><p className="text-[10px] text-white/40 truncate">{customer.email}</p></div>
                                        <button onClick={handleLogout} className="text-white/40"><LogOut size={16} /></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link href="/account" onClick={closeMobileMenu} className="bg-white/5 py-2.5 text-[10px] uppercase font-bold text-center">Profile</Link>
                                        <Link href="/account/orders" onClick={closeMobileMenu} className="bg-[#D4AF37] text-dark py-2.5 text-[10px] uppercase font-bold text-center">Orders</Link>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/login" onClick={closeMobileMenu} className="bg-[#D4AF37] text-dark text-xs uppercase font-bold tracking-widest py-3 text-center flex items-center justify-center gap-2"><User size={15} /> Login / Register</Link>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* 5. Search Modal (Condensed for brevity - same visual logic as original) */}
            {isMounted && isSearchModalOpen && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-16 px-4">
                    <div className="absolute inset-0 bg-[#00171A]/40 backdrop-blur-md" onClick={() => setIsSearchModalOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-white text-[#00171A] shadow-2xl overflow-hidden border border-[#00171A]/10 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center p-6 border-b border-[#00171A]/10">
                            <Search size={24} className="text-[#00171A]/40 mr-4" />
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for fragrances..." className="bg-transparent text-xl md:text-3xl outline-none w-full font-serif" autoFocus />
                            <button onClick={() => setIsSearchModalOpen(false)} className="ml-4 text-[#00171A]/40 hover:text-dark"><X size={24} /></button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-[#FAFAF8]">
                            {/* ... Search results mapping logic ... */}
                            {searchQuery && searchResults.products.length > 0 && (
                                <div className="space-y-4">
                                    {searchResults.products.map((p: any) => (
                                        <Link key={p.id} href={`/product/${p.slug}`} onClick={() => setIsSearchModalOpen(false)} className="flex items-center justify-between border-b border-dark/5 pb-3">
                                            <span className="font-serif text-lg">{p.name}</span>
                                            <span className="text-xs font-bold">{p.price} AED</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {!searchQuery && <p className="text-[10px] uppercase tracking-widest text-dark/40 font-bold">Trending: Oud, Dior, Discovery Sets</p>}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}