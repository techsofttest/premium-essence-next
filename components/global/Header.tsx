"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, ChevronLeft, ChevronRight, PenTool, Truck, Sparkles, Menu, X, Globe, User, CircleUserRound, Package, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

// Top Announcement Data
const ANNOUNCEMENTS = [
    { text: "Complimentary Engraving on Orders Above 500 AED", icon: PenTool },
    { text: "Free Shipping on All Orders Over 300 AED", icon: Truck },
    { text: "Discover Our Exclusive Summer Collection", icon: Sparkles }
];

// Mock data for search
const MOCK_PRODUCTS = [
    "Dior Sauvage Elixir",
    "Creed Aventus",
    "Tom Ford Lost Cherry",
    "Chanel Coco Mademoiselle",
    "YSL Libre Intense",
    "MFK Baccarat Rouge 540",
    "Royal Oud Supreme",
    "Hermès Terre d'Hermès",
    "Gucci Flora",
    "Acqua Di Giò"
];

// Perfume-Exclusive Navigation Data Structure
const NAV_CATEGORIES = [
    {
        name: "Brands",
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
        hasDropdown: true,
        featuredImage: "/products/Baccarat Rouge 540 1.png",
        featuredText: "Exquisite Concentrations",
        subCategories: [
            { title: "For Whom", links: ["Men", "Women", "Unisex"] },
            { title: "Olfactive Families", links: ["Oud", "Woody", "Floral", "Fresh & Citrus", "Oriental & Spicy"] },
            { title: "Concentration", links: ["Parfum", "Eau de Parfum", "Eau de Toilette", "Perfume Oils"] },
        ]
    },
    { name: "Bestsellers", hasDropdown: false },
    { name: "New Arrivals", hasDropdown: false },
    { name: "Discovery Sets", hasDropdown: false },
    { name: "Gifting", hasDropdown: false },
];

export default function Header() {
    const [headerData, setHeaderData] = useState<any>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ products: any[]; brands: any[]; categories: any[] }>({ products: [], brands: [], categories: [] });
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const { customer, logout } = useAuth();
    const { wishlistProducts } = useWishlist();
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        fetch(`${baseUrl}/storefront/header`)
            .then(res => res.json())
            .then(data => {
                if (data && (data.brands_by_classification || data.fragrance_menu)) {
                    setHeaderData(data);
                }
            })
            .catch(() => {});
    }, []);

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
                .catch(() => {});
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const categoriesList = headerData ? [
        { name: "All Products", href: "/shop", hasDropdown: false },
        {
            name: "Brands",
            href: "/brands",
            hasDropdown: true,
            featuredImage: "/products/The Alchemist's Garden 1.png",
            featuredText: "The Art of Layering",
            subCategories: [
                {
                    title: "Designer Houses",
                    links: headerData.brands_by_classification?.["Designer Houses"]?.map((b: any) => ({ name: b.name, href: `/brand/${b.slug}` })) || ["Dior", "Chanel", "Gucci", "Yves Saint Laurent", "Versace"]
                },
                {
                    title: "Prestige & Niche",
                    links: headerData.brands_by_classification?.["Prestige & Niche"]?.map((b: any) => ({ name: b.name, href: `/brand/${b.slug}` })) || ["Creed", "Tom Ford", "Maison Francis Kurkdjian", "Jo Malone London"]
                },
                {
                    title: "Classic Elegance",
                    links: headerData.brands_by_classification?.["Classic Elegance"]?.map((b: any) => ({ name: b.name, href: `/brand/${b.slug}` })) || ["Hermès", "Givenchy", "Prada", "Bvlgari", "Montblanc"]
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
                    links: headerData.fragrance_menu?.for_whom?.map((item: any) => ({ name: item.name, href: item.href || `/fragrances?gender=${encodeURIComponent(item.name)}` })) || [
                        { name: "Men", href: "/fragrances?gender=Men" },
                        { name: "Women", href: "/fragrances?gender=Women" },
                        { name: "Unisex", href: "/fragrances?gender=Unisex" },
                    ]
                },
                {
                    title: "Olfactive Families",
                    links: headerData.fragrance_menu?.olfactive_families?.map((item: any) => ({ name: item.name, href: item.href || `/fragrances?family=${encodeURIComponent(item.slug || item.name)}` })) || [
                        { name: "Oud", href: "/fragrances?family=oud" },
                        { name: "Woody", href: "/fragrances?family=woody" },
                        { name: "Floral", href: "/fragrances?family=floral" },
                        { name: "Fresh & Citrus", href: "/fragrances?family=fresh-citrus" },
                        { name: "Oriental & Spicy", href: "/fragrances?family=oriental-spicy" },
                    ]
                },
                {
                    title: "Concentration",
                    links: headerData.fragrance_menu?.concentrations?.map((item: any) => ({ name: item.name, href: item.href || `/fragrances?concentration=${encodeURIComponent(item.slug || item.name)}` })) || [
                        { name: "Parfum", href: "/fragrances?concentration=parfum" },
                        { name: "Eau de Parfum", href: "/fragrances?concentration=eau-de-parfum" },
                        { name: "Eau de Toilette", href: "/fragrances?concentration=eau-de-toilette" },
                        { name: "Perfume Oils", href: "/fragrances?concentration=perfume-oils" },
                    ]
                },
            ]
        },
        { name: "Bestsellers", href: "/shop?sort=featured", hasDropdown: false },
        { name: "New Arrivals", href: "/shop?sort=latest", hasDropdown: false },
        { name: "Discovery Sets", href: "/category/discovery-sets", hasDropdown: false },
        { name: "Gifting", href: "/category/gifting", hasDropdown: false },
    ] : NAV_CATEGORIES;

    // Scroll states
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    // Handle scroll behavior with a stable listener
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const prevScrollY = lastScrollY.current;

            if (currentScrollY < 50) {
                setIsScrolled(false);
                setIsHidden(false);
            } else {
                setIsScrolled(true);
                if (currentScrollY > prevScrollY && currentScrollY > 100) {
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

    // Auto-slide announcements
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextAnnouncement = () => {
        setCurrentAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    };

    const prevAnnouncement = () => {
        setCurrentAnnouncementIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
    };

    const handleLogout = async () => {
        await logout();
        setIsAccountMenuOpen(false);
    };

    // Search Modal Body Scroll Lock & Escape Key Handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSearchModalOpen(false);
        };
        if (isSearchModalOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchModalOpen]);

    return (
        <div
            className={`w-full flex flex-col sticky top-0 z-50 transition-transform duration-500 font-sans bg-white text-dark shadow-md ${isHidden ? '-translate-y-full' : 'translate-y-0'
                }`}
            onMouseLeave={() => setActiveDropdown(null)}
        >

            {/* 1. Top Announcement Bar */}
            <div className="w-full py-2 px-4 flex justify-between items-center text-[10px] sm:text-xs tracking-[0.15em] uppercase transition-colors duration-500 bg-[#1B1315] text-cream">
                <button onClick={prevAnnouncement} className="hover:text-white transition-colors" aria-label="Previous announcement"><ChevronLeft size={14} /></button>
                <span className="flex items-center justify-center gap-2 w-full animate-in fade-in duration-500 text-center truncate px-2" key={currentAnnouncementIndex}>
                    {(() => {
                        const Icon = ANNOUNCEMENTS[currentAnnouncementIndex].icon;
                        return (
                            <>
                                <Icon size={14} className="text-current shrink-0" />
                                <span className="truncate">{ANNOUNCEMENTS[currentAnnouncementIndex].text}</span>
                            </>
                        );
                    })()}
                </span>
                <button onClick={nextAnnouncement} className="hover:text-white transition-colors" aria-label="Next announcement"><ChevronRight size={14} /></button>
            </div>

            {/* 2. Main Navbar (Desktop Only) */}
            <div className="hidden lg:flex w-full px-8 h-24 items-center justify-between relative overflow-visible group/navbar transition-colors duration-500 border-b border-dark/5 bg-white">

                {/* Background wrapper for overflow (Subtle Scent Wave SVG Pattern) */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 transition-opacity duration-700 opacity-5 group-hover/navbar:opacity-10">
                        <svg width="100%" height="100%" className="w-full h-full">
                            <defs>
                                <pattern id="scent-pattern" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
                                    <path
                                        d="M0 20 Q 25 10 50 20 T 100 20"
                                        fill="none"
                                        stroke="#1B1315"
                                        strokeWidth="0.5"
                                        className="animate-pulse"
                                        style={{ animationDuration: '8s' }}
                                    />
                                    <path
                                        d="M0 30 Q 25 20 50 30 T 100 30"
                                        fill="none"
                                        stroke="#1B1315"
                                        strokeWidth="0.3"
                                        className="animate-pulse"
                                        style={{ animationDuration: '12s', animationDelay: '2s' }}
                                    />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#scent-pattern)" />
                        </svg>
                    </div>
                </div>

                {/* LEFT BLOCK: Logo & Categories perfectly glued together */}
                <div className="flex items-center h-full gap-8 xl:gap-12 relative z-10">

                    {/* Logo */}
                    <Link href="/" className="relative h-16 w-30 shrink-0 transition-opacity hover:opacity-80">
                        <Image
                            src="/logo/logo-black2.png"
                            alt="Premium Essence Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </Link>

                    {/* Categories */}
                    <nav className="flex items-center gap-5 xl:gap-8 h-full">
                        {categoriesList.map((category) => (
                            <div
                                key={category.name}
                                className="h-full flex items-center"
                                onMouseEnter={() => setActiveDropdown(category.name)}
                            >
                                <Link
                                    href={(category as any).href || (category.name === "Brands" ? "/brands" : `/category/${category.name.toLowerCase().replace(/ /g, '-')}`)}
                                    className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-colors h-full flex items-center border-b-2 pt-0.5 ${activeDropdown === category.name ? "border-dark text-dark" : "border-transparent text-dark/70 hover:text-dark"
                                        }`}
                                >
                                    {category.name}
                                </Link>

                                {/* Mega Menu Dropdown */}
                                {category.hasDropdown && activeDropdown === category.name && (
                                    <div className="absolute top-full left-0 w-[100vw] -ml-8 bg-white text-dark border-t border-dark/10 shadow-2xl py-12 px-24 grid grid-cols-4 gap-12 animate-in fade-in slide-in-from-top-2 duration-300 cursor-default">
                                        {category.subCategories?.map((sub: any) => (
                                            <div key={sub.title} className="flex flex-col gap-4">
                                                <h4 className="font-serif text-lg text-mauve tracking-wide mb-2 border-b border-dark/10 pb-2">
                                                    {sub.title}
                                                </h4>
                                                <ul className="flex flex-col gap-3">
                                                    {sub.links.map((linkItem: any) => {
                                                        const isObj = typeof linkItem === 'object' && linkItem !== null;
                                                        const linkName = isObj ? (linkItem.name || linkItem.label) : linkItem;
                                                        const linkHref = isObj && linkItem.href ? linkItem.href : `${category.name === "Brands" ? "/brand" : "/category"}/${linkName.toLowerCase().replace(/ /g, '-')}`;
                                                        return (
                                                            <li key={linkName}>
                                                                <Link
                                                                    href={linkHref}
                                                                    className="text-sm text-dark/70 hover:text-dark transition-colors block w-fit"
                                                                >
                                                                    {linkName}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}

                                        {/* Dynamic Featured Image inside Megamenu */}
                                        <Link
                                            href={category.name === "Brands" ? "/brands" : `/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                                            className="col-span-1 md:col-start-4 bg-[#4A323A] rounded-none overflow-hidden relative min-h-[220px] group cursor-pointer border border-dark/5 flex items-center justify-center"
                                        >
                                            {category.featuredImage && (
                                                <Image
                                                    src={category.featuredImage}
                                                    alt={category.featuredText || "Featured"}
                                                    fill
                                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent z-10" />
                                            <div className="absolute bottom-4 left-4 z-20">
                                                <span className="text-cream text-[10px] uppercase tracking-widest block mb-0.5 opacity-80">Discover</span>
                                                <span className="text-cream font-serif text-lg leading-tight block">
                                                    {category.featuredText || "The Signature Collection"}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* RIGHT BLOCK: Search & Icons */}
                <div className="flex shrink-0 justify-end items-center gap-5 xl:gap-6 relative z-10">
                    <button onClick={() => setIsSearchModalOpen(true)} className="flex items-center gap-2 text-dark/60 hover:text-dark transition-colors border-b border-dark/20 hover:border-dark pb-1.5 w-24 group" aria-label="Search">
                        <Search size={16} strokeWidth={1.5} className="group-hover:text-dark transition-colors shrink-0" />
                        <span className="text-[10px] tracking-widest uppercase font-bold text-left w-full opacity-80 group-hover:opacity-100 transition-opacity">
                            Search...
                        </span>
                    </button>

                    <div className="flex items-center gap-1 text-dark/80 text-[11px] tracking-[0.25em] uppercase font-bold">
                        <Globe size={16} strokeWidth={1.5} />
                        <button className="hover:text-dark transition-colors font-bold text-dark ml-1">EN</button>
                        <span className="text-dark/40">/</span>
                        <button className="hover:text-dark transition-colors text-dark/60">AR</button>
                    </div>

                    {customer ? (
                        <div className="relative">
                            <button onClick={() => setIsAccountMenuOpen((open) => !open)} className="flex items-center gap-1.5 text-dark/80 hover:text-dark transition-colors text-[11px] tracking-[0.15em] uppercase font-bold" aria-label="Open account menu" aria-expanded={isAccountMenuOpen}>
                                <CircleUserRound size={18} strokeWidth={1.5} />
                                <span className="max-w-24 truncate">{customer.name}</span>
                                <ChevronDown size={13} strokeWidth={1.5} />
                            </button>
                            {isAccountMenuOpen && (
                                <div className="absolute right-0 top-full mt-4 w-52 bg-white border border-dark/10 shadow-xl py-2 z-50">
                                    <Link href="/account" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark">
                                        <User size={15} strokeWidth={1.5} /> Profile
                                    </Link>
                                    <Link href="/account/orders" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark">
                                        <Package size={15} strokeWidth={1.5} /> Orders
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark">
                                        <Heart size={15} strokeWidth={1.5} /> Wishlist
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] tracking-widest uppercase font-bold text-dark/70 hover:bg-dark/5 hover:text-dark">
                                        <LogOut size={15} strokeWidth={1.5} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="flex items-center gap-1.5 text-dark/80 hover:text-dark transition-colors text-[11px] tracking-[0.25em] uppercase font-bold">
                            <User size={16} strokeWidth={1.5} />
                            <span>Login</span>
                        </Link>
                    )}

                    <Link href="/wishlist" className="text-dark/80 hover:text-dark transition-colors relative" title="View Wishlist">
                        <Heart size={20} strokeWidth={1.5} className={wishlistProducts.length > 0 ? "fill-[#4A323A] text-[#4A323A]" : ""} />
                        {wishlistProducts.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#4A323A] text-white text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                                {wishlistProducts.length}
                            </span>
                        )}
                    </Link>

                    <Link href="/cart" className="text-dark/80 hover:text-dark transition-colors relative" title="View Cart">
                        <ShoppingCart size={20} strokeWidth={1.5} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-dark text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-none font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* 2b. Main Navbar (Mobile & Tablet Viewports) */}
            <div className="flex lg:hidden w-full px-4 sm:px-6 py-3 items-center justify-between relative overflow-hidden bg-white border-b border-dark/5 z-40">
                {/* Left: Menu Hamburger Trigger */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-dark/80 hover:text-dark transition-colors z-10 p-1"
                    aria-label="Open navigation menu"
                >
                    <Menu size={22} strokeWidth={1.5} />
                </button>

                {/* Center: Scaled Logo Asset to never overflow on 375px */}
                <div className="flex-1 flex justify-center relative z-10 px-4">
                    <Link href="/" className="relative h-8 w-32 sm:w-40 transition-opacity hover:opacity-80">
                        <Image
                            src="/logo/logo2.png"
                            alt="Premium Essence Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Right: Compact Icon Links */}
                <div className="flex items-center gap-2 sm:gap-3 relative z-10">
                    <button onClick={() => setIsSearchModalOpen(true)} className="text-dark/80 hover:text-dark transition-colors p-1" aria-label="Search">
                        <Search size={16} strokeWidth={1.5} />
                    </button>
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-dark/80 hidden sm:flex">
                        <Globe size={14} strokeWidth={1.5} />
                        <button className="text-dark hover:text-dark p-0.5 font-bold">EN</button>
                        <span className="text-dark/30">/</span>
                        <button className="text-dark/60 hover:text-dark p-0.5">AR</button>
                    </div>
                    {customer ? (
                        <Link href="/account" aria-label="Account" className="text-dark/80 hover:text-dark transition-colors p-1">
                            <CircleUserRound size={18} strokeWidth={1.5} />
                        </Link>
                    ) : (
                        <Link href="/login" aria-label="Login" className="text-dark/80 hover:text-dark transition-colors p-1">
                            <User size={18} strokeWidth={1.5} />
                        </Link>
                    )}
                    <Link href="/wishlist" aria-label="Wishlist" className="text-dark/80 hover:text-dark transition-colors relative p-1">
                        <Heart size={18} strokeWidth={1.5} />
                    </Link>
                    <Link href="/cart" className="text-dark/80 hover:text-dark transition-colors relative p-1" aria-label="Shopping Cart">
                        <ShoppingCart size={18} strokeWidth={1.5} />
                        <span className="absolute top-0 right-0 bg-dark text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold transform translate-x-1 -translate-y-1">
                            0
                        </span>
                    </Link>
                </div>
            </div>

            {/* Mobile Sidebar Navigation Drawer */}
            <div className={`fixed inset-0 z-[100] transition-all duration-500 pointer-events-none ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"}`}>
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
                />
                <div className={`absolute top-0 bottom-0 left-0 w-[295px] sm:w-[320px] bg-[#1B1315] text-[#F7F3F4] p-6 flex flex-col gap-6 shadow-2xl transition-transform duration-500 ease-out transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#F7F3F4]/50 font-medium">Bespoke Menu</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[#F7F3F4]/70 hover:text-white transition-colors p-1"
                        >
                            <X size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 scrollbar-none">
                        {categoriesList.map((cat) => (
                            <div key={cat.name} className="flex flex-col gap-2">
                                {cat.hasDropdown ? (
                                    <>
                                        <Link
                                            href={cat.name === "Brands" ? "/brands" : `/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-xs tracking-[0.2em] uppercase text-[#D4AF37] font-semibold block mb-1 hover:underline"
                                        >
                                            {cat.name}
                                        </Link>
                                        <div className="flex flex-col gap-4 pl-3 border-l border-white/10 mt-1">
                                            {cat.subCategories?.map((sub: any) => (
                                                <div key={sub.title} className="flex flex-col gap-1.5">
                                                    <span className="text-[9px] uppercase tracking-[0.1em] text-[#F7F3F4]/40 font-semibold">
                                                        {sub.title}
                                                    </span>
                                                    <div className="flex flex-col gap-2 pl-1">
                                                        {sub.links.map((linkItem: any) => {
                                                            const isObj = typeof linkItem === 'object' && linkItem !== null;
                                                            const linkName = isObj ? (linkItem.name || linkItem.label) : linkItem;
                                                            const linkHref = isObj && linkItem.href ? linkItem.href : `${cat.name === "Brands" ? "/brand" : "/category"}/${linkName.toLowerCase().replace(/ /g, '-')}`;
                                                            return (
                                                                <Link
                                                                    key={linkName}
                                                                    href={linkHref}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="text-xs text-[#F7F3F4]/80 hover:text-white transition-colors"
                                                                >
                                                                    {linkName}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-xs tracking-[0.2em] uppercase text-[#F7F3F4]/80 hover:text-white transition-colors py-1 block"
                                    >
                                        {cat.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-1.5 text-[9px] text-[#F7F3F4]/40 leading-relaxed font-sans">
                        {customer ? (
                            <>
                                <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-bold mb-2">
                                    <CircleUserRound size={16} strokeWidth={1.5} />
                                    <span>My Account</span>
                                </Link>
                                <Link href="/account/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-bold mb-4 pb-4 border-b border-white/10">
                                    <Package size={16} strokeWidth={1.5} />
                                    <span>My Orders</span>
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 text-white hover:text-[#D4AF37] transition-colors uppercase tracking-widest font-bold mb-4 pb-4 border-b border-white/10">
                                <User size={16} strokeWidth={1.5} />
                                <span>Login / Register</span>
                            </Link>
                        )}
                        <p>Premium Essence Perfumes LLC</p>
                        <p>Musaffah, Abu Dhabi, UAE</p>
                        <p>sales@premium-perfumes.com</p>
                    </div>
                </div>
            </div>

            {/* Boxed Search Modal Overlay */}
            {isSearchModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">

                    {/* Elegant Blurred Backdrop */}
                    <div
                        className="absolute inset-0 bg-[#00171A]/40 backdrop-blur-md transition-opacity"
                        onClick={() => setIsSearchModalOpen(false)}
                    />

                    {/* Boxed Modal - Sharp edges, no border-radius for an editorial look */}
                    <div className="relative w-full max-w-3xl bg-white text-[#00171A] shadow-2xl z-10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-[#00171A]/10">

                        {/* Header/Input area */}
                        <div className="flex items-center bg-white px-6 md:px-8 py-6 md:py-8 border-b border-[#00171A]/10 relative">
                            <Search size={28} strokeWidth={1} className="text-[#00171A]/40 mr-4 md:mr-6 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for fragrances, brands..."
                                className="bg-transparent text-2xl md:text-4xl text-[#00171A] outline-none w-full placeholder:text-[#00171A]/20 font-serif tracking-tight"
                                autoFocus
                            />
                            <div className="flex items-center gap-4 shrink-0 ml-4">
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="text-[#00171A]/40 hover:text-[#00171A] transition-colors p-2">
                                        <X size={24} strokeWidth={1.5} />
                                    </button>
                                )}
                                <div className="w-px h-8 bg-[#00171A]/10 hidden sm:block"></div>
                                <button onClick={() => setIsSearchModalOpen(false)} className="text-[#00171A]/40 hover:text-[#00171A] transition-colors text-xs font-medium uppercase tracking-[0.2em] hidden sm:flex items-center">
                                    Close
                                </button>
                                <button onClick={() => setIsSearchModalOpen(false)} className="sm:hidden text-[#00171A]/40 hover:text-[#00171A] transition-colors p-2">
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 md:p-8 max-h-[65vh] overflow-y-auto scrollbar-none bg-[#FAFAF8]">
                            {!searchQuery ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">

                                    {/* Popular Searches */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <Sparkles size={14} strokeWidth={1.5} className="text-[#004C54]" />
                                            <span className="text-[#00171A]/50 text-[10px] tracking-[0.2em] uppercase font-bold">Trending Now</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {/* Pills use sharp borders and heavy contrast instead of shadows */}
                                            {["Oud", "Tom Ford", "Baccarat Rouge", "Discovery Sets", "Gifting"].map(term => (
                                                <button key={term} onClick={() => setSearchQuery(term)} className="px-5 py-2 border border-[#00171A]/10 text-[#00171A]/70 hover:text-[#E9D7C3] hover:bg-[#00171A] hover:border-[#00171A] transition-all duration-300 text-[10px] tracking-widest uppercase bg-transparent">
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Suggested Categories */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <Search size={14} strokeWidth={1.5} className="text-[#004C54]" />
                                            <span className="text-[#00171A]/50 text-[10px] tracking-[0.2em] uppercase font-bold">Suggested Collections</span>
                                        </div>
                                        <ul className="flex flex-col">
                                            {["Niche Fragrances", "Best Sellers", "New Arrivals", "Exclusive Gifts"].map((cat, idx, arr) => (
                                                <li key={cat}>
                                                    {/* Clean underline separation */}
                                                    <Link href={`/category/${cat.toLowerCase().replace(/ /g, '-')}`} onClick={() => setIsSearchModalOpen(false)} className={`group flex items-center justify-between py-3 text-[#00171A]/70 hover:text-[#00171A] transition-colors ${idx !== arr.length - 1 ? 'border-b border-[#00171A]/5' : ''}`}>
                                                        <span className="font-serif text-xl group-hover:translate-x-1 transition-transform duration-300">{cat}</span>
                                                        <ChevronRight size={16} strokeWidth={1} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#004C54]" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            ) : (
                                <div className="text-left animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between mb-2 pb-4 border-b border-[#00171A]/10">
                                        <span className="text-[#00171A]/50 text-[10px] tracking-[0.2em] uppercase font-bold">
                                            Search Results
                                        </span>
                                        <span className="text-[#00171A]/40 text-xs font-serif italic">
                                            {(searchResults.products.length + searchResults.brands.length + searchResults.categories.length)} items found
                                        </span>
                                    </div>
                                    {(searchResults.products.length > 0 || searchResults.brands.length > 0 || searchResults.categories.length > 0) ? (
                                        <div className="flex flex-col gap-6">
                                            {searchResults.brands.length > 0 && (
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#004C54] block mb-2">Brands</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {searchResults.brands.map(b => (
                                                            <Link key={b.id} href={`/brand/${b.slug}`} onClick={() => setIsSearchModalOpen(false)} className="px-3 py-1 bg-white border border-dark/10 text-xs font-bold text-dark hover:bg-dark hover:text-white transition-colors">
                                                                {b.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {searchResults.products.length > 0 && (
                                                <ul className="flex flex-col">
                                                    {searchResults.products.map((item, idx, arr) => (
                                                        <li key={item.id}>
                                                            <Link href={`/product/${item.id}`} onClick={() => setIsSearchModalOpen(false)} className={`group flex items-center gap-4 py-3 hover:bg-[#00171A]/[0.02] px-2 -mx-2 transition-colors ${idx !== arr.length - 1 ? 'border-b border-[#00171A]/5' : ''}`}>
                                                                <div className="flex flex-col flex-1">
                                                                    <span className="text-xs uppercase font-bold text-[#D4AF37]">{item.brand?.name}</span>
                                                                    <span className="text-[#00171A]/90 group-hover:text-[#00171A] font-serif text-lg">{item.name}</span>
                                                                </div>
                                                                <span className="text-sm font-bold text-dark">{item.price} AED</span>
                                                                <ChevronRight size={18} strokeWidth={1} className="text-[#00171A]/20 group-hover:text-[#004C54] transition-colors shrink-0" />
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-[#00171A]/50">
                                            <Search size={32} strokeWidth={1} className="mx-auto mb-6 opacity-20 text-[#00171A]" />
                                            <p className="font-serif text-2xl text-[#00171A]/80 mb-2 tracking-tight">No results found</p>
                                            <p className="text-sm font-light">We couldn't find anything matching "{searchQuery}".<br />Try exploring our collections instead.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
