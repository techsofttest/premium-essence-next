"use client";

import { useState } from "react";
import { CheckCircle2, Star, MessageSquare, Send } from "lucide-react";
import { StorefrontReview } from "@/lib/storefront";
import { api } from "@/lib/api";

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

    // Form state for submitting review
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [revName, setRevName] = useState("");
    const [revEmail, setRevEmail] = useState("");
    const [revRating, setRevRating] = useState(5);
    const [revTitle, setRevTitle] = useState("");
    const [revContent, setRevContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

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

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;
        setIsSubmitting(true);
        try {
            const res = await api<{ message: string }>(`/storefront/products/${productId}/reviews`, {
                method: "POST",
                body: JSON.stringify({
                    name: revName,
                    email: revEmail,
                    rating: revRating,
                    title: revTitle,
                    content: revContent,
                }),
            });
            setSubmitSuccess(res.message || "Thank you! Your review has been submitted for approval.");
            setRevName("");
            setRevEmail("");
            setRevTitle("");
            setRevContent("");
            setShowReviewForm(false);
        } catch {
            setSubmitSuccess("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-32 max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
            {/* Tabs Header */}
            <div className="border-b border-dark/10 flex gap-8 md:gap-12 mb-12 overflow-x-auto no-scrollbar">
                {[
                    { id: "description", label: "Description" },
                    { id: "scent notes", label: "Scent Notes" },
                    { id: "highlights", label: "Highlights" },
                    { id: "reviews", label: `Reviews (${reviews.length})` },
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
                        <div className="flex flex-col gap-10 animate-in fade-in duration-500">
                            {submitSuccess && (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                                    {submitSuccess}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-dark/10 pb-8">
                                <div>
                                    <h3 className="font-serif text-2xl text-dark">Customer Reviews</h3>
                                    <p className="text-xs uppercase tracking-widest text-dark/50 mt-1">
                                        {reviews.length} verified review{reviews.length === 1 ? "" : "s"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="px-6 py-3 bg-dark text-white text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-dark/90 transition-all flex items-center gap-2"
                                >
                                    <MessageSquare size={14} /> Write a Review
                                </button>
                            </div>

                            {/* Submit Review Form */}
                            {showReviewForm && (
                                <form onSubmit={handleSubmitReview} className="p-8 bg-white border border-dark/15 shadow-sm flex flex-col gap-6 max-w-2xl">
                                    <h4 className="font-serif text-xl text-dark">Write Your Review</h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-dark/70">Your Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={revName}
                                                onChange={(e) => setRevName(e.target.value)}
                                                className="p-3 border border-dark/20 text-sm focus:outline-none focus:border-dark"
                                                placeholder="e.g. Alexander Vance"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-dark/70">Your Email *</label>
                                            <input
                                                type="email"
                                                required
                                                value={revEmail}
                                                onChange={(e) => setRevEmail(e.target.value)}
                                                className="p-3 border border-dark/20 text-sm focus:outline-none focus:border-dark"
                                                placeholder="alex@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-dark/70">Rating *</label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRevRating(star)}
                                                    className="p-1 hover:scale-110 transition-transform"
                                                >
                                                    <Star
                                                        size={22}
                                                        className={star <= revRating ? "fill-[#C5A059] text-[#C5A059]" : "text-dark/20"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-dark/70">Review Title</label>
                                        <input
                                            type="text"
                                            value={revTitle}
                                            onChange={(e) => setRevTitle(e.target.value)}
                                            className="p-3 border border-dark/20 text-sm focus:outline-none focus:border-dark"
                                            placeholder="Exquisite Scent & Longevity"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-dark/70">Review Content *</label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={revContent}
                                            onChange={(e) => setRevContent(e.target.value)}
                                            className="p-3 border border-dark/20 text-sm focus:outline-none focus:border-dark"
                                            placeholder="Share your experience with this fragrance..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowReviewForm(false)}
                                            className="px-6 py-3 border border-dark/20 text-dark text-xs uppercase font-bold tracking-widest hover:bg-dark/5"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-8 py-3 bg-dark text-white text-xs uppercase font-bold tracking-widest hover:bg-dark/90 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <Send size={14} /> {isSubmitting ? "Submitting..." : "Submit Review"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Reviews List */}
                            {reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="p-8 bg-white border border-dark/10 shadow-sm flex flex-col gap-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-1 text-[#C5A059]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={14}
                                                            fill={i < rev.rating ? "currentColor" : "none"}
                                                            className={i < rev.rating ? "" : "text-dark/20"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[11px] text-dark/40 font-mono">{rev.date}</span>
                                            </div>
                                            {rev.title && (
                                                <h4 className="font-serif text-lg text-dark font-medium">{rev.title}</h4>
                                            )}
                                            <p className="text-sm text-dark/80 leading-relaxed italic">
                                                "{rev.content}"
                                            </p>
                                            <span className="text-xs uppercase font-bold tracking-widest text-dark/60 border-t border-dark/5 pt-3 mt-auto">
                                                — {rev.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-white border border-dark/10 flex flex-col items-center gap-3">
                                    <Star size={28} className="text-dark/20" />
                                    <p className="text-sm text-dark/60">Be the first to review this fragrance!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
