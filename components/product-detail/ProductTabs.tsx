"use client";

import { useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { StorefrontReview } from "@/lib/storefront";
import ProductReviews from "./ProductReviews";

interface ProductTabsProps {
    productId?: string;
    description: string;
    notes: {
        top: string[];
        heart: string[];
        base: string[];
    };
    highlights: string | string[];
    reviews?: StorefrontReview[];
}

export default function ProductTabs({ productId, description, notes, highlights, reviews = [] }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState("description");

    // Parse highlights: explode <li> tags if HTML string or fallback to array
    const parsedHighlights = (): string[] => {
        if (Array.isArray(highlights)) return highlights;
        if (!highlights || typeof highlights !== "string") return [];

        // Regex to extract inner text of <li>...</li>
        const liMatches = highlights.match(/<li[^>]*>(.*?)<\/li>/gi);
        if (liMatches && liMatches.length > 0) {
            return liMatches.map((item) => item.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
        }

        // Strip HTML tags and split by lines or bullets
        const plainText = highlights.replace(/<[^>]+>/g, "\n");
        return plainText
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    };

    const highlightList = parsedHighlights();
    const hasReviews = Boolean(reviews && reviews.length > 0);

    return (
        <section className="mt-32 max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
            {/* Tabs Header */}
            <div className="border-b border-dark/10 flex gap-8 md:gap-12 mb-12 overflow-x-auto no-scrollbar">
                {[
                    { id: "description", label: "Description" },
                    { id: "scent notes", label: "Scent Notes" },
                    { id: "highlights", label: "Highlights" },
                    { id: "reviews", label: hasReviews ? `Reviews (${reviews.length})` : "Reviews" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-[13px] tracking-[0.25em] uppercase font-bold transition-all relative shrink-0 ${activeTab === tab.id ? "text-dark" : "text-dark/60 hover:text-dark/90"}`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-dark animate-in fade-in slide-in-from-left-2 duration-300" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-12">
                    {/* Description Tab */}
                    {activeTab === "description" && (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-4xl">
                            {description.includes("<") ? (
                                <div
                                    className="prose max-w-none text-dark/80 text-[15px] md:text-[16px] leading-loose"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            ) : (
                                <p className="text-[15px] md:text-[16px] text-dark/80 leading-loose">
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Scent Notes Tab */}
                    {activeTab === "scent notes" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                            <div className="flex flex-col gap-6 p-10 bg-white border border-dark/10 shadow-sm">
                                <span className="text-[12px] tracking-[0.3em] uppercase font-bold text-[#C5A059] border-b border-dark/5 pb-2">
                                    Top Notes
                                </span>
                                <ul className="flex flex-col gap-3">
                                    {(notes.top.length ? notes.top : ["Bergamot", "Pink Pepper", "Citrus"]).map((note) => (
                                        <li key={note} className="text-[15px] font-medium text-dark/90 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-6 p-10 bg-white border border-dark/10 shadow-sm">
                                <span className="text-[12px] tracking-[0.3em] uppercase font-bold text-[#C5A059] border-b border-dark/5 pb-2">
                                    Heart Notes
                                </span>
                                <ul className="flex flex-col gap-3">
                                    {(notes.heart.length ? notes.heart : ["Rose", "Jasmine", "Oud"]).map((note) => (
                                        <li key={note} className="text-[15px] font-medium text-dark/90 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-6 p-10 bg-white border border-dark/10 shadow-sm">
                                <span className="text-[12px] tracking-[0.3em] uppercase font-bold text-[#C5A059] border-b border-dark/5 pb-2">
                                    Base Notes
                                </span>
                                <ul className="flex flex-col gap-3">
                                    {(notes.base.length ? notes.base : ["Amber", "Vanilla", "Musk"]).map((note) => (
                                        <li key={note} className="text-[15px] font-medium text-dark/90 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Highlights Tab */}
                    {activeTab === "highlights" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                            {highlightList.length > 0 ? (
                                highlightList.map((h, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-6 bg-white border border-dark/10 shadow-sm">
                                        <div className="bg-[#C5A059]/10 p-2.5 rounded-full shrink-0">
                                            <CheckCircle2 size={18} className="text-[#C5A059]" />
                                        </div>
                                        <span className="text-[15px] font-semibold text-dark/90 leading-snug">{h}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-dark/50 italic text-sm">No highlights available for this fragrance.</p>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === "reviews" && (
                            <div className="animate-in fade-in duration-500">
                                <ProductReviews productId={productId} reviews={reviews} />
                            </div>
                    )}
                        </div>
            </div>
        </section>
    );
}
