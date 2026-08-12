"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Share2, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface JournalDetail {
    id: number;
    title: string;
    slug: string;
    category: string;
    author: string;
    excerpt: string;
    content: string;
    image: string | null;
    published_at: string;
    related?: {
        id: number;
        title: string;
        slug: string;
        category: string;
        excerpt: string;
        image: string | null;
    }[];
}

export default function JournalArticlePage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [article, setArticle] = useState<JournalDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        api<JournalDetail>(`/storefront/journals/${slug}`)
            .then((data) => setArticle(data || null))
            .catch(() => setArticle(null))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F7F3F4] flex items-center justify-center p-12">
                <div className="text-center flex items-center gap-3 text-dark/70">
                    <Loader2 className="animate-spin text-dark" size={24} /> Loading luxury article...
                </div>
            </main>
        );
    }

    if (!article) {
        return (
            <main className="min-h-screen bg-[#F7F3F4] py-20 px-6 text-center">
                <div className="max-w-md mx-auto bg-white border border-dark/10 p-12 shadow-sm">
                    <Sparkles size={36} className="mx-auto text-dark/30 mb-4" />
                    <h1 className="font-serif text-2xl text-dark">Article Not Found</h1>
                    <p className="text-xs text-dark/60 mt-2 mb-6">The requested journal story may have been moved or archived.</p>
                    <Link
                        href="/journals"
                        className="inline-block bg-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors"
                    >
                        Back to All Journals
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            {/* Header Banner */}
            <div className="bg-[#1B1315] text-[#FAFAF8] pt-16 pb-24 px-6 md:px-12 relative overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/journals"
                        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-[#D4AF37] hover:underline mb-8 transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Journal Index
                    </Link>

                    <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] mb-4">
                        <span>{article.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-white/60">
                            <Calendar size={12} /> {article.published_at}
                        </span>
                    </div>

                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-dark font-serif font-bold text-sm flex items-center justify-center">
                                {article.author.charAt(0)}
                            </div>
                            <div>
                                <span className="text-xs font-bold text-white block">{article.author}</span>
                                <span className="text-[10px] uppercase tracking-wider text-white/50">Journal Contributor</span>
                            </div>
                        </div>

                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider border border-white/20 transition-all cursor-pointer"
                        >
                            <Share2 size={14} /> {copied ? "Link Copied!" : "Share Story"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-10">
                <div className="relative aspect-[16/9] w-full bg-dark border border-dark/10 overflow-hidden shadow-xl rounded-sm">
                    <Image
                        src={article.image || "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop"}
                        alt={article.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Main Article Body */}
            <article className="max-w-3xl mx-auto px-6 mt-16 bg-white border border-dark/10 p-8 md:p-14 shadow-sm">
                {article.excerpt && (
                    <p className="font-serif text-lg md:text-xl text-dark/90 leading-relaxed border-l-2 border-[#C5A059] pl-6 italic mb-10">
                        {article.excerpt}
                    </p>
                )}

                <div
                    className="prose prose-stone max-w-none text-dark/80 text-sm md:text-base leading-relaxed space-y-6"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>

            {/* Related Articles */}
            {article.related && article.related.length > 0 && (
                <div className="max-w-4xl mx-auto px-6 mt-20 border-t border-dark/10 pt-12">
                    <h3 className="font-serif text-2xl text-dark mb-8 text-center">More Journal Stories</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {article.related.map((rel) => (
                            <Link
                                key={rel.id}
                                href={`/journals/${rel.slug}`}
                                className="group bg-white border border-dark/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-[#C5A059] block mb-2">{rel.category}</span>
                                    <h4 className="font-serif text-base text-dark group-hover:text-[#C5A059] transition-colors leading-snug mb-2">
                                        {rel.title}
                                    </h4>
                                    <p className="text-xs text-dark/60 line-clamp-2 leading-relaxed">{rel.excerpt}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-dark/5 text-[10px] uppercase font-bold tracking-widest text-dark flex items-center justify-between">
                                    <span>Read Story</span>
                                    <ArrowRight size={12} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}
