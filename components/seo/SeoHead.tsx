"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface SeoHeadProps {
    pageSlug: string;
    fallbackTitle?: string;
    fallbackDescription?: string;
    fallbackKeywords?: string;
    overrideTitle?: string | null;
    overrideDescription?: string | null;
    overrideKeywords?: string | null;
}

interface SeoData {
    title?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
}

export default function SeoHead({
    pageSlug,
    fallbackTitle = "Premium Essence Perfumes | Luxury Fragrances UAE",
    fallbackDescription = "A luxury fragrance boutique specializing in authentic perfumes from the world's most prestigious international brands.",
    fallbackKeywords = "perfumes, luxury fragrances, UAE, Abu Dhabi, Dubai, niche perfumes, Oud, Eau de Parfum",
    overrideTitle,
    overrideDescription,
    overrideKeywords,
}: SeoHeadProps) {
    const [seoData, setSeoData] = useState<SeoData | null>(null);

    useEffect(() => {
        if (overrideTitle !== undefined && overrideTitle !== null && overrideTitle !== "") {
            return;
        }

        api<SeoData>(`/storefront/seo?page=${encodeURIComponent(pageSlug)}`)
            .then((data) => {
                if (data && (data.meta_title || data.meta_description || data.meta_keywords)) {
                    setSeoData(data);
                }
            })
            .catch(() => undefined);
    }, [pageSlug, overrideTitle]);

    useEffect(() => {
        const finalTitle = overrideTitle || seoData?.meta_title || fallbackTitle;
        const finalDescription = overrideDescription || seoData?.meta_description || fallbackDescription;
        const finalKeywords = overrideKeywords || seoData?.meta_keywords || fallbackKeywords;

        if (finalTitle && typeof document !== "undefined") {
            document.title = finalTitle;
        }

        if (typeof document !== "undefined") {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement("meta");
                metaDesc.setAttribute("name", "description");
                document.head.appendChild(metaDesc);
            }
            if (finalDescription) {
                metaDesc.setAttribute("content", finalDescription);
            }

            let metaKey = document.querySelector('meta[name="keywords"]');
            if (!metaKey) {
                metaKey = document.createElement("meta");
                metaKey.setAttribute("name", "keywords");
                document.head.appendChild(metaKey);
            }
            if (finalKeywords) {
                metaKey.setAttribute("content", finalKeywords);
            }
        }
    }, [seoData, overrideTitle, overrideDescription, overrideKeywords, fallbackTitle, fallbackDescription, fallbackKeywords]);

    return null;
}
