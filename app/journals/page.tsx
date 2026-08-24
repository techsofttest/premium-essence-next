"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, User, ArrowRight, Search, Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import SeoHead from "@/components/seo/SeoHead";

interface JournalArticle {
    id: number;
    title: string;
    slug: string;
    category: string;
    author: string;
    excerpt: string;
    image: string | null;
    published_at: string;
}

export default function JournalsPage() {
    const [articles, setArticles] = useState<JournalArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
            params.set("category", selectedCategory);
        }
        if (searchQuery) {
            params.set("search", searchQuery);
        }

        api<JournalArticle[]>(`/storefront/journals?${params.toString()}`)
            .then((data) => setArticles(Array.isArray(data) ? data : []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, [selectedCategory, searchQuery]);

    const categories = ["All", "Haute Parfumerie", "Fragrance Craft", "Heritage & Notes", "Olfactory Guides", "Luxury Lifestyle"];

    const featuredArticle = articles[0];
    const gridArticles = articles.slice(1);

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            <SeoHead pageSlug="journals" />
            {/* Hero Header with Banner 3 (matching FAQ page) */}
            <div className="relative bg-[#1B1315] text-[#FAFAF8] py-28 px-6 md:px-12 lg:px-20 text-center overflow-hidden">
                <Image
                    src="/banners/banner3.jpg"
                    alt="The Perfume Journal Banner"
                    fill
                    className="object-cover opacity-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315]/90 via-[#1B1315]/40 to-black/30" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#D4AF37] block mb-3 drop-shadow-sm">
                        The Olfactory Gazette
                    </span>
                    <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-white mb-6 drop-shadow-md">
                        The Perfume Journal
                    </h1>
                    <p className="text-xs md:text-sm text-white max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                        Explorations into rare ingredients, European perfume heritage, layer accords, and master perfumer insights.
                    </p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 mt-12">
                {/* Search & Category Filter Bar */}
                <div className="bg-white border border-dark/10 p-4 md:p-6 mb-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                                    selectedCategory === cat
                                        ? "bg-dark text-white shadow-sm"
                                        : "bg-[#F7F3F4] text-dark/70 hover:text-dark hover:bg-dark/5"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/15 pl-9 pr-4 py-2.5 text-xs text-dark outline-none focus:border-dark"
                        />
                        <Search size={14} className="absolute left-3 top-3 text-dark/40" />
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white border border-dark/10 p-20 text-center text-dark/60 flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-dark" size={24} /> Loading luxury journal entries...
                    </div>
                ) : articles.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-16 text-center shadow-sm">
                        <BookOpen size={36} className="mx-auto text-dark/30 mb-4" />
                        <h2 className="font-serif text-2xl text-dark">No Journal Articles Found</h2>
                        <p className="text-xs text-dark/60 mt-2 mb-6">Try selecting a different category or clearing search.</p>
                        <button
                            onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                            className="bg-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Featured Hero Article */}
                        {featuredArticle && selectedCategory === "All" && !searchQuery && (
                            <Link
                                href={`/journals/${featuredArticle.slug}`}
                                className="group bg-white border border-dark/10 grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                            >
                                <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[420px] bg-[#1B1315] overflow-hidden">
                                    <Image
                                        src={featuredArticle.image || "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop"}
                                        alt={featuredArticle.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                                    />
                                    <div className="absolute top-6 left-6 bg-[#1B1315] text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 border border-[#D4AF37]/30">
                                        Featured Edition
                                    </div>
                                </div>
                                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-4">
                                            <span>{featuredArticle.category}</span>
                                            <span>&bull;</span>
                                            <span className="flex items-center gap-1 text-dark/50">
                                                <Calendar size={12} /> {featuredArticle.published_at}
                                            </span>
                                        </div>
                                        <h2 className="font-serif text-2xl lg:text-3xl text-dark tracking-tight leading-tight group-hover:text-[#C5A059] transition-colors mb-4">
                                            {featuredArticle.title}
                                        </h2>
                                        <p className="text-xs text-dark/70 leading-relaxed line-clamp-4 mb-6">
                                            {featuredArticle.excerpt}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-dark/10 pt-6">
                                        <span className="flex items-center gap-2 text-xs font-semibold text-dark/60">
                                            <User size={13} /> {featuredArticle.author}
                                        </span>
                                        <span className="text-xs uppercase font-bold tracking-widest text-dark group-hover:text-[#C5A059] flex items-center gap-2 transition-all">
                                            Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Article Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(selectedCategory === "All" && !searchQuery ? gridArticles : articles).map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/journals/${article.slug}`}
                                    className="group bg-white border border-dark/10 flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
                                >
                                    <div className="relative aspect-[16/10] bg-[#1B1315] overflow-hidden">
                                        <Image
                                            src={article.image || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop"}
                                            alt={article.title}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-dark text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1">
                                            {article.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-[10px] text-dark/50 mb-3">
                                                <Calendar size={11} /> {article.published_at}
                                                <span>&bull;</span>
                                                <User size={11} /> {article.author}
                                            </div>
                                            <h3 className="font-serif text-xl text-dark tracking-tight group-hover:text-[#C5A059] transition-colors mb-3 leading-snug">
                                                {article.title}
                                            </h3>
                                            <p className="text-xs text-dark/70 leading-relaxed line-clamp-3 mb-6">
                                                {article.excerpt}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-dark/10 pt-4 text-xs font-bold uppercase tracking-widest text-dark group-hover:text-[#C5A059] transition-colors">
                                            <span>Read Story</span>
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
