"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, User, MessageSquare } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";

export default function ContactForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");

        try {
            const res = await fetch(`${baseUrl}/storefront/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ name, phone, email, message }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccessMessage(data.message || "Thank you! Your inquiry has been submitted successfully.");
                setName("");
                setPhone("");
                setEmail("");
                setMessage("");
            } else {
                setErrorMessage(data.message || "Failed to submit your inquiry. Please check your fields and try again.");
            }
        } catch {
            setErrorMessage("An unexpected network error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-dark/10 p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="mb-8">
                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block mb-2">
                    Private Concierge Inquiry
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-dark font-bold">
                    Send Us an Inquiry
                </h2>
                <p className="text-xs text-dark/60 mt-1">
                    Our master fragrance consultants and customer care team will respond within 24 business hours.
                </p>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/80 mb-2">
                            Full Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Lord / Lady Sterling"
                                className="w-full pl-10 pr-4 py-3 bg-[#F7F3F4] border border-dark/10 text-xs text-dark placeholder:text-dark/40 focus:outline-none focus:border-dark transition-colors"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/80 mb-2">
                            Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40" />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+971 50 123 4567"
                                className="w-full pl-10 pr-4 py-3 bg-[#F7F3F4] border border-dark/10 text-xs text-dark placeholder:text-dark/40 focus:outline-none focus:border-dark transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/80 mb-2">
                        Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="concierge@domain.com"
                            className="w-full pl-10 pr-4 py-3 bg-[#F7F3F4] border border-dark/10 text-xs text-dark placeholder:text-dark/40 focus:outline-none focus:border-dark transition-colors"
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-dark/80 mb-2">
                        Your Message / Inquiry <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <MessageSquare size={16} className="absolute left-3.5 top-4 text-dark/40" />
                        <textarea
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us about your bespoke perfume query, order assistance, or wholesale inquiries..."
                            className="w-full pl-10 pr-4 py-3 bg-[#F7F3F4] border border-dark/10 text-xs text-dark placeholder:text-dark/40 focus:outline-none focus:border-dark transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <GlowingButton
                    type="submit"
                    disabled={submitting}
                    fullWidth
                    className="h-14 text-[11px] tracking-[0.3em] uppercase flex items-center justify-center gap-2"
                >
                    <Send size={14} />
                    {submitting ? "Sending Inquiry..." : "Submit Inquiry"}
                </GlowingButton>
            </form>
        </div>
    );
}
