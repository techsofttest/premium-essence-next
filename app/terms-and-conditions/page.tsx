"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

interface CmsPageData {
    title: string;
    slug: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
}

export default function TermsAndConditionsPage() {
    const [pageData, setPageData] = useState<CmsPageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api<CmsPageData>("/storefront/cms/terms-and-conditions")
            .then((data) => setPageData(data || null))
            .catch(() => setPageData(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            {/* Header with Banner 2 */}
            <div className="relative bg-[#1B1315] text-[#FAFAF8] py-24 px-6 md:px-12 text-center overflow-hidden">
                <Image
                    src="/banners/banner2.jpg"
                    alt="Terms & Conditions Banner"
                    fill
                    className="object-cover opacity-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315]/90 via-[#1B1315]/40 to-black/30" />

                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#D4AF37] block mb-3 drop-shadow-sm">
                        Legal Agreement
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl tracking-tight text-white mb-4 drop-shadow-md">
                        {pageData?.title || "Terms & Conditions"}
                    </h1>
                    <p className="text-xs text-white uppercase tracking-widest drop-shadow-sm font-medium">
                        Premium Essence Perfumes LLC &bull; Abu Dhabi, UAE
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-dark/50 hover:text-dark mb-6 transition-colors"
                >
                    <ArrowLeft size={14} /> Home Page
                </Link>

                <div className="bg-white border border-dark/10 p-8 md:p-14 shadow-sm rounded-sm">
                    {loading ? (
                        <div className="p-12 text-center text-dark/60 flex items-center justify-center gap-3">
                            <Loader2 className="animate-spin text-dark" size={20} /> Loading terms and conditions...
                        </div>
                    ) : pageData?.content ? (
                        <div
                            className="prose prose-stone max-w-none text-dark/80 text-xs md:text-sm leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: pageData.content }}
                        />
                    ) : (
                        <div className="text-center py-12">
                            <FileText size={36} className="mx-auto text-dark/30 mb-4" />
                            <h2 className="font-serif text-xl text-dark mb-2">Terms Content Loading</h2>
                            <p className="text-xs text-dark/60">Please refer to customer service for full policy details.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
