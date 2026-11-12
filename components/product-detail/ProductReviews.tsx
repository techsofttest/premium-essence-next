"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
    Star,
    MessageSquare,
    Send,
    CheckCircle2,
    ShieldCheck,
    Play,
    X,
    Camera,
    Video as VideoIcon,
    ThumbsUp,
    Sparkles,
    UploadCloud,
    Filter
} from "lucide-react";
import { StorefrontReview } from "@/lib/storefront";

interface ProductReviewsProps {
    productId?: string;
    reviews?: StorefrontReview[];
}

export default function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
    const activeReviews = Array.isArray(reviews) ? reviews : [];

    // Filter & sort
    const [selectedFilter, setSelectedFilter] = useState<"all" | "media" | "google" | "5star">("all");
    const [activeLightbox, setActiveLightbox] = useState<{ type: "image" | "video"; url: string; title?: string } | null>(null);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [source, setSource] = useState("website");
    const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Filtered list
    const filteredReviews = activeReviews.filter((r) => {
        if (selectedFilter === "media") {
            return (r.images && r.images.length > 0) || (r.videos && r.videos.length > 0);
        }
        if (selectedFilter === "google") {
            return r.source === "google";
        }
        if (selectedFilter === "5star") {
            return Number(r.rating) === 5;
        }
        return true;
    });

    // Rating calculations
    const totalReviews = activeReviews.length;
    const avgScore = totalReviews > 0
        ? (activeReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalReviews)
        : 0;

    const countByRating = (score: number) => activeReviews.filter((r) => Math.round(Number(r.rating)) === score).length;

    // Collect all media items for the top real-customer media strip
    const allCustomerMedia: { type: "image" | "video"; url: string; reviewName: string }[] = [];
    activeReviews.forEach((r) => {
        if (r.images) {
            r.images.forEach((img) => allCustomerMedia.push({ type: "image", url: img, reviewName: r.name }));
        }
        if (r.videos) {
            r.videos.forEach((vid) => allCustomerMedia.push({ type: "video", url: vid, reviewName: r.name }));
        }
    });

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setSelectedPhotos((prev) => [...prev, ...files]);
        const newUrls = files.map((f) => URL.createObjectURL(f));
        setPreviewUrls((prev) => [...prev, ...newUrls]);
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setSelectedVideos((prev) => [...prev, ...files]);
    };

    const removePhoto = (index: number) => {
        setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index: number) => {
        setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;
        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("rating", String(rating));
            if (title) formData.append("title", title);
            formData.append("content", content);
            formData.append("source", source);

            selectedPhotos.forEach((file) => {
                formData.append("images[]", file);
            });
            selectedVideos.forEach((file) => {
                formData.append("videos[]", file);
            });

            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/storefront/products/${productId}/reviews`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Server returned an error");
            }

            const data = await res.json();
            setStatusMessage({
                text: data.message || "Thank you! Your review, photos & video have been submitted for moderation.",
            });
            setName("");
            setEmail("");
            setTitle("");
            setContent("");
            setSelectedPhotos([]);
            setSelectedVideos([]);
            setPreviewUrls([]);
            setShowForm(false);
        } catch (err: any) {
            setStatusMessage({
                text: err.message || "Failed to submit review. Please try again.",
                isError: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Header / Summary Card */}
            <div className="p-6 sm:p-10 bg-white border border-[#1B1315]/10 rounded-2xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                {/* Left: Overall Rating */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex flex-col items-center justify-center p-4 bg-[#1B1315] text-[#F7F3F4] rounded-xl w-28 h-28 shrink-0 shadow-md">
                        <span className="font-serif text-4xl font-bold text-[#E9D7C3] leading-none">
                            {totalReviews > 0 ? avgScore.toFixed(1) : "—"}
                        </span>
                        <div className="flex items-center gap-0.5 text-[#D4AF37] my-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={12}
                                    fill={totalReviews > 0 && i < Math.floor(avgScore) ? "currentColor" : "none"}
                                    className={totalReviews > 0 && i < Math.floor(avgScore) ? "" : "text-white/20"}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-[#E9D7C3]/80">
                            {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
                        </span>
                    </div>

                    {/* Breakdown bars */}
                    <div className="flex flex-col gap-1.5 min-w-[200px]">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = countByRating(stars);
                            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                            return (
                                <div key={stars} className="flex items-center gap-2 text-xs text-[#1B1315]/70">
                                    <span className="w-12 font-medium">{stars} Star</span>
                                    <div className="w-32 sm:w-44 h-2 bg-[#1B1315]/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C59B27] rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <span className="text-[11px] text-[#1B1315]/50 w-6 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Center / Right: Trust Badges */}
                <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 lg:border-l border-[#1B1315]/10 pt-4 lg:pt-0 lg:pl-8">
                    {activeReviews.some((r) => r.source === "google") && (
                        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/20 text-[#1B1315]">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span className="text-xs font-bold tracking-wide">Google Reviews Verified</span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span className="text-xs font-bold tracking-wide">100% Verified Buyers</span>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] hover:from-[#E8C86A] hover:to-[#D4AF37] text-[#1B1315] text-xs font-bold tracking-widest uppercase shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ml-auto"
                    >
                        <MessageSquare size={14} />
                        <span>Write a Review</span>
                    </button>
                </div>
            </div>

            {/* Submission Status Alert */}
            {statusMessage && (
                <div
                    className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${statusMessage.isError
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-emerald-50 border-emerald-200 text-emerald-800"
                        }`}
                >
                    <CheckCircle2 size={18} />
                    <span>{statusMessage.text}</span>
                </div>
            )}

            {/* Write a Review Modal / Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="p-6 sm:p-10 bg-white border border-[#1B1315]/15 rounded-2xl shadow-xl flex flex-col gap-6 max-w-3xl animate-in fade-in duration-300 text-[#1B1315]"
                >
                    <div className="flex items-center justify-between border-b border-[#1B1315]/10 pb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} className="text-[#D4AF37]" />
                            <h3 className="font-serif text-2xl text-[#1B1315]">Write Your Fragrance Review</h3>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="p-1.5 rounded-full hover:bg-black/5 text-[#1B1315]/60 hover:text-[#1B1315]"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1B1315]">Your Name *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="p-3 bg-white border border-[#1B1315]/30 rounded-lg text-sm text-[#1B1315] placeholder:text-neutral-500 focus:outline-none focus:border-[#1B1315] focus:ring-1 focus:ring-[#1B1315]"
                                placeholder="e.g. Tariq Al-Hashimi"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1B1315]">Your Email *</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 bg-white border border-[#1B1315]/30 rounded-lg text-sm text-[#1B1315] placeholder:text-neutral-500 focus:outline-none focus:border-[#1B1315] focus:ring-1 focus:ring-[#1B1315]"
                                placeholder="tariq@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1B1315]">Your Rating *</label>
                            <div className="flex items-center gap-1.5 p-2 bg-[#F7F3F4] rounded-lg">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                    >
                                        <Star
                                            size={22}
                                            className={star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#1B1315]/20"}
                                        />
                                    </button>
                                ))}
                                <span className="text-xs font-bold text-[#1B1315] ml-2">
                                    {rating === 5 ? "5/5 - Outstanding" : `${rating}/5 Stars`}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-[#1B1315]">Review Source / Badge</label>
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="p-3 bg-white border border-[#1B1315]/30 rounded-lg text-sm text-[#1B1315] focus:outline-none focus:border-[#1B1315]"
                            >
                                <option value="website">Verified Website Customer</option>
                                <option value="google">Google Reviewer</option>
                                <option value="verified_buyer">Verified Boutique Buyer</option>
                                <option value="testimonial">Featured Testimonial</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1B1315]">Headline / Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="p-3 bg-white border border-[#1B1315]/30 rounded-lg text-sm text-[#1B1315] placeholder:text-neutral-500 focus:outline-none focus:border-[#1B1315] focus:ring-1 focus:ring-[#1B1315]"
                            placeholder="e.g. Masterpiece Scent with Insane Longevity"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1B1315]">Your Experience & Feedback *</label>
                        <textarea
                            required
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="p-3 bg-white border border-[#1B1315]/30 rounded-lg text-sm text-[#1B1315] placeholder:text-neutral-500 focus:outline-none focus:border-[#1B1315] focus:ring-1 focus:ring-[#1B1315]"
                            placeholder="Describe how the fragrance opens, its longevity, compliments received, and sillage..."
                        />
                    </div>

                    {/* Media Uploads Area */}
                    <div className="p-4 bg-[#F7F3F4] rounded-xl border border-dashed border-[#1B1315]/20 flex flex-col gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1B1315]/80 flex items-center gap-1.5">
                            <Camera size={16} className="text-[#D4AF37]" />
                            Add Real Customer Photos & Videos (Optional)
                        </span>

                        <div className="flex flex-wrap items-center gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                onChange={handlePhotoSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-white border border-[#1B1315]/20 rounded-lg text-xs font-bold text-[#1B1315] hover:bg-[#1B1315] hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                            >
                                <Camera size={14} /> Upload Photos
                            </button>

                            <input
                                ref={videoInputRef}
                                type="file"
                                multiple
                                accept="video/mp4,video/quicktime,video/webm"
                                onChange={handleVideoSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => videoInputRef.current?.click()}
                                className="px-4 py-2 bg-white border border-[#1B1315]/20 rounded-lg text-xs font-bold text-[#1B1315] hover:bg-[#1B1315] hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                            >
                                <VideoIcon size={14} /> Upload Video (MP4 / MOV)
                            </button>
                        </div>

                        {/* Previews */}
                        {previewUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 pt-2">
                                {previewUrls.map((url, i) => (
                                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#1B1315]/20 group">
                                        <Image src={url} alt={`Upload ${i}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedVideos.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {selectedVideos.map((vid, i) => (
                                    <div key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-md text-xs text-[#1B1315]">
                                        <VideoIcon size={14} className="text-[#D4AF37]" />
                                        <span className="max-w-[150px] truncate">{vid.name}</span>
                                        <button type="button" onClick={() => removeVideo(i)} className="text-red-500 hover:text-red-700">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-6 py-2.5 border border-[#1B1315]/20 rounded-full text-xs uppercase font-bold text-[#1B1315] hover:bg-black/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] hover:from-[#E8C86A] hover:to-[#D4AF37] text-[#1B1315] text-xs uppercase font-bold tracking-widest shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Send size={14} />
                            <span>{isSubmitting ? "Submitting Review..." : "Submit Review"}</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Customer Real Media Showcase Strip */}
            {allCustomerMedia.length > 0 && (
                <div className="p-6 bg-gradient-to-r from-[#1B1315] to-[#2E1F24] rounded-2xl text-[#F7F3F4] border border-[#E9D7C3]/20 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Camera size={16} className="text-[#D4AF37]" />
                            <h4 className="font-serif text-lg font-medium text-[#F7F3F4]">
                                Real Customer Photos & Unboxings
                            </h4>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E9D7C3]/15 text-[#E9D7C3]">
                                {allCustomerMedia.length}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {allCustomerMedia.map((media, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveLightbox({ type: media.type, url: media.url, title: `Shared by ${media.reviewName}` })}
                                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E9D7C3]/20 hover:border-[#D4AF37] group transition-all cursor-pointer shadow-md"
                            >
                                {media.type === "image" ? (
                                    <Image
                                        src={media.url}
                                        alt={`Customer photo ${idx + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                        <video src={media.url} className="w-full h-full object-cover opacity-70" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#1B1315] flex items-center justify-center shadow-lg">
                                                <Play size={14} className="fill-[#1B1315] ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Tabs - Only when reviews exist */}
            {totalReviews > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-b border-[#1B1315]/10 pb-4">
                    {[
                        { id: "all", label: `All Reviews (${activeReviews.length})` },
                        { id: "media", label: `With Photos & Videos (${activeReviews.filter((r) => (r.images && r.images.length > 0) || (r.videos && r.videos.length > 0)).length})` },
                        { id: "google", label: `Google Reviews (${activeReviews.filter((r) => r.source === "google").length})` },
                        { id: "5star", label: `5 Stars Only (${countByRating(5)})` },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setSelectedFilter(f.id as any)}
                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${selectedFilter === f.id
                                    ? "bg-[#1B1315] text-[#F7F3F4] shadow-sm"
                                    : "bg-white border border-[#1B1315]/15 text-[#1B1315]/70 hover:bg-[#1B1315]/5 hover:text-[#1B1315]"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Reviews Cards Grid */}
            {filteredReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredReviews.map((rev) => (
                        <div
                            key={rev.id}
                            className="p-6 sm:p-8 bg-white border border-[#1B1315]/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                        >
                            {/* Card Top: Author & Source Badge */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B1315] to-[#4A323A] text-[#E9D7C3] flex items-center justify-center font-serif font-bold text-sm shadow-sm">
                                        {rev.name ? rev.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-[#1B1315]">{rev.name}</span>
                                            {rev.source === "google" && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20">
                                                    Google Review
                                                </span>
                                            )}
                                            {rev.is_verified_buyer && rev.source !== "google" && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 size={11} /> Verified Buyer
                                                </span>
                                            )}
                                            {rev.source === "testimonial" && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#C59B27] border border-[#D4AF37]/30">
                                                    <Sparkles size={11} /> Testimonial
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[11px] text-[#1B1315]/40">{rev.date}</span>
                                    </div>
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-0.5 text-[#D4AF37]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < Number(rev.rating) ? "currentColor" : "none"}
                                            className={i < Number(rev.rating) ? "" : "text-black/15"}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Title & Comment */}
                            {rev.title && (
                                <h4 className="font-serif text-base sm:text-lg font-bold text-[#1B1315]">
                                    {rev.title}
                                </h4>
                            )}
                            <p className="text-sm text-[#1B1315]/80 leading-relaxed italic">
                                "{rev.content}"
                            </p>

                            {/* Real Customer Photos Attached to this Review */}
                            {rev.images && rev.images.length > 0 && (
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {rev.images.map((imgUrl, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setActiveLightbox({ type: "image", url: imgUrl, title: `Photo from ${rev.name}` })}
                                            className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#1B1315]/15 hover:border-[#D4AF37] group transition-all cursor-pointer shadow-sm"
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={`Review attachment ${i + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Real Customer Videos Attached to this Review */}
                            {rev.videos && rev.videos.length > 0 && (
                                <div className="flex flex-wrap gap-2.5 pt-2">
                                    {rev.videos.map((vidUrl, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setActiveLightbox({ type: "video", url: vidUrl, title: `Video from ${rev.name}` })}
                                            className="relative w-28 h-20 rounded-xl overflow-hidden bg-black border border-[#1B1315]/15 hover:border-[#D4AF37] group transition-all cursor-pointer shadow-sm flex items-center justify-center"
                                        >
                                            <video src={vidUrl} className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#1B1315] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <Play size={14} className="fill-[#1B1315] ml-0.5" />
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Admin / Brand Response */}
                            {rev.admin_notes && (
                                <div className="mt-2 p-3.5 bg-[#F7F3F4] border-l-2 border-[#D4AF37] rounded-r-lg text-xs">
                                    <span className="font-bold text-[#1B1315] block mb-0.5">Premium Essence Response</span>
                                    <p className="text-[#1B1315]/75 leading-relaxed">{rev.admin_notes}</p>
                                </div>
                            )}

                            {/* Helpful Counter */}
                            <div className="mt-auto pt-3 border-t border-[#1B1315]/5 flex items-center justify-between text-xs text-[#1B1315]/50">
                                <span>Verified Customer Submission</span>
                                <div className="flex items-center gap-1 hover:text-[#1B1315] cursor-pointer transition-colors">
                                    <ThumbsUp size={13} />
                                    <span>Helpful ({rev.helpful_count || 0})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : totalReviews === 0 ? (
                <div className="p-12 md:p-16 text-center bg-white border border-[#1B1315]/10 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                        <MessageSquare size={26} />
                    </div>
                    <div className="flex flex-col gap-1 max-w-md">
                        <h4 className="font-serif text-2xl text-[#1B1315]">No Reviews Yet</h4>
                        <p className="text-sm text-[#1B1315]/60 leading-relaxed">
                            There are no customer reviews for this fragrance yet. Be the first to share your thoughts and olfactory experience!
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8C86A] to-[#C59B27] hover:from-[#E8C86A] hover:to-[#D4AF37] text-[#1B1315] text-xs font-bold tracking-widest uppercase shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                    >
                        <Sparkles size={14} />
                        <span>Write the First Review</span>
                    </button>
                </div>
            ) : (
                <div className="p-12 text-center bg-white border border-[#1B1315]/10 rounded-2xl flex flex-col items-center gap-3">
                    <Filter size={24} className="text-[#1B1315]/30" />
                    <p className="text-sm font-bold text-[#1B1315]">No reviews matched this filter</p>
                    <button
                        onClick={() => setSelectedFilter("all")}
                        className="text-xs uppercase font-bold text-[#C59B27] underline cursor-pointer"
                    >
                        View all reviews
                    </button>
                </div>
            )}

            {/* Media Lightbox Modal */}
            {activeLightbox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="fixed inset-0" onClick={() => setActiveLightbox(null)} />
                    <div className="relative z-10 max-w-4xl max-h-[90vh] bg-[#1B1315] border border-[#E9D7C3]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 bg-[#140F11] border-b border-[#E9D7C3]/15 flex items-center justify-between text-[#F7F3F4]">
                            <span className="font-serif text-sm font-bold text-[#E9D7C3]">
                                {activeLightbox.title || "Real Customer Media"}
                            </span>
                            <button
                                onClick={() => setActiveLightbox(null)}
                                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-2 flex items-center justify-center bg-black">
                            {activeLightbox.type === "image" ? (
                                <div className="relative w-[80vw] max-w-3xl h-[65vh]">
                                    <Image
                                        src={activeLightbox.url}
                                        alt="Customer Photo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <video
                                    src={activeLightbox.url}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="max-w-full max-h-[70vh] rounded-lg"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

