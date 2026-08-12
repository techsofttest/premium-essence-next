"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Search, Mail, Phone, Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category?: string;
}

export default function FaqsPage() {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const DEFAULT_FAQS: FaqItem[] = [
        {
            id: 1,
            question: "Are all perfumes sold on Premium Essence 100% authentic originals?",
            answer: "Yes, absolutely. We source exclusively from authorized European and Middle Eastern perfume houses, official distributors, and certified brand laboratories. Every bottle comes sealed in its original luxury packaging with official batch codes."
        },
        {
            id: 2,
            question: "How fast is delivery within the UAE?",
            answer: "Orders placed before 2:00 PM GST are dispatched on the same day. Urban deliveries across Abu Dhabi, Dubai, and Sharjah typically arrive within 24 to 48 hours. Direct driver fulfillment is available for select Abu Dhabi postcodes."
        },
        {
            id: 3,
            question: "What is your return & exchange policy?",
            answer: "We offer a 14-day return and exchange period for unused, unopened items in their original shrink-wrapped packaging. Opened perfume bottles cannot be returned due to international cosmetics safety standards."
        },
        {
            id: 4,
            question: "How do I choose between Eau de Parfum and Extrait de Parfum?",
            answer: "Extrait de Parfum contains the highest concentration of essential perfume oils (20%–40%), providing unmatched longevity and skin intimacy. Eau de Parfum contains 15%–20% oil concentration, providing exceptional projection and radiance throughout the day."
        },
        {
            id: 5,
            question: "What payment methods do you accept?",
            answer: "We accept Visa, MasterCard, American Express, Apple Pay via Stripe's encrypted payment gateway. Cash on Delivery (COD) is also supported across all UAE Emirates."
        },
        {
            id: 6,
            question: "How should I store my luxury perfume to preserve scent quality?",
            answer: "Store your fragrance bottles in a cool, dark place away from direct sunlight, ambient heat, and bathroom humidity. Keeping your flacon in its original luxury box preserves the delicate essential oil accords for years."
        }
    ];

    useEffect(() => {
        setLoading(true);
        api<FaqItem[]>("/storefront/faqs")
            .then((data) => setFaqs(Array.isArray(data) && data.length > 0 ? data : DEFAULT_FAQS))
            .catch(() => setFaqs(DEFAULT_FAQS))
            .finally(() => setLoading(false));
    }, []);

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            {/* Hero Header */}
            <div className="bg-[#1B1315] text-[#FAFAF8] py-20 px-6 md:px-12 text-center relative overflow-hidden">
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#D4AF37] block mb-3">
                        Concierge Assistance
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xs md:text-sm text-white/70 max-w-xl mx-auto leading-relaxed mb-8">
                        Everything you need to know about our fragrance portfolio, authenticity verification, express delivery, and care recommendations.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Type a question (e.g. delivery, authenticity, returns)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white text-dark border border-white/20 pl-11 pr-4 py-3.5 text-xs outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-lg"
                        />
                        <Search size={16} className="absolute left-4 top-4 text-dark/50" />
                    </div>
                </div>
            </div>

            {/* Accordion Content */}
            <div className="max-w-4xl mx-auto px-6 mt-16">
                {loading ? (
                    <div className="bg-white border border-dark/10 p-16 text-center text-dark/60 flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-dark" size={20} /> Loading FAQ directory...
                    </div>
                ) : filteredFaqs.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-12 text-center shadow-sm">
                        <HelpCircle size={36} className="mx-auto text-dark/30 mb-4" />
                        <h2 className="font-serif text-2xl text-dark">No Matching Questions</h2>
                        <p className="text-xs text-dark/60 mt-1 mb-6">Try searching for different terms or contact our concierge.</p>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="bg-dark text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, idx) => {
                            const isOpen = openIndex === idx;
                            return (
                                <div
                                    key={faq.id || idx}
                                    className="bg-white border border-dark/10 shadow-sm transition-all overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg text-dark hover:text-[#C5A059] transition-colors cursor-pointer"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`shrink-0 text-dark/50 transition-transform duration-300 ${
                                                isOpen ? "rotate-180 text-[#C5A059]" : ""
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-dark/70 leading-relaxed border-t border-dark/5">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Support Box */}
                <div className="mt-16 bg-white border border-dark/10 p-8 md:p-10 text-center shadow-sm">
                    <h3 className="font-serif text-2xl text-dark mb-2">Still Have Questions?</h3>
                    <p className="text-xs text-dark/60 max-w-md mx-auto mb-6">
                        Our fragrance advisors are at your service for personal scent recommendations and order assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="mailto:sales@premium-perfumes.com"
                            className="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors w-full sm:w-auto justify-center"
                        >
                            <Mail size={14} /> Email Advisor
                        </a>
                        <a
                            href="tel:+971557232010"
                            className="inline-flex items-center gap-2 border border-dark/20 text-dark px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-dark hover:text-white transition-colors w-full sm:w-auto justify-center"
                        >
                            <Phone size={14} /> +971 55 723 2010
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
