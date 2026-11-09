"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, FileText, Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import SeoHead from "@/components/seo/SeoHead";
import PageBanner from "@/components/global/PageBanner";

interface CmsPageData {
    title: string;
    slug: string;
    content: string;
}

export default function PrivacyPolicyPage() {
    const [pageData, setPageData] = useState<CmsPageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api<CmsPageData>("/storefront/cms/privacy-policy")
            .then((data) => setPageData(data || null))
            .catch(() => setPageData(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-[#1B1315] font-sans pb-24">
            <SeoHead pageSlug="privacy-policy" />
            {/* Dynamic Inner Page Banner */}
            <PageBanner
                pageKey="policies"
                fallbackImage="/banners/banner1.jpg"
                title={pageData?.title || "Privacy Policy"}
                subtitle="Your privacy is of utmost importance. Learn how we protect your personal information with 256-bit SSL encryption and strict data protection."
                kicker="Data Protection & Security"
                breadcrumbs={[{ label: "Privacy Policy" }]}
            />

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
                            <Loader2 className="animate-spin text-dark" size={20} /> Loading privacy policy...
                        </div>
                    ) : pageData?.content ? (
                        <div
                            className="prose prose-stone max-w-none text-dark/80 text-xs md:text-sm leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: pageData.content }}
                        />
                    ) : (
                        <div className="text-center py-12">
                            <Lock size={36} className="mx-auto text-dark/30 mb-4" />
                            <h2 className="font-serif text-xl text-dark mb-2">Privacy Policy</h2>
                            <p className="text-xs text-dark/60">We protect customer data with high-grade SSL encryption.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
