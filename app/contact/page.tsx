import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageSquare, Sparkles, Building2 } from "lucide-react";
import ContactForm from "@/components/global/ContactForm";
import ContactSection from "@/components/global/ContactSection";

export const metadata = {
    title: "Contact Us | Premium Essence Perfumes LLC",
    description: "Get in touch with Premium Essence Perfumes LLC in Abu Dhabi, UAE. Contact our private concierge for bespoke perfume consultations, order assistance, or wholesale inquiries.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            {/* Hero Header with Banner 2 */}
            <div className="relative bg-[#1B1315] text-[#E9D7C3] py-28 px-6 md:px-12 text-center border-b border-[#C5A059]/20 overflow-hidden">
                <Image
                    src="/banners/banner2.jpg"
                    alt="Contact Us Banner"
                    fill
                    className="object-cover opacity-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315]/90 via-[#1B1315]/40 to-black/30" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-4">
                    <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#C5A059] block drop-shadow-sm">
                        Client Experience & Concierge
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
                        Contact Us
                    </h1>
                    <p className="text-xs md:text-sm text-[#E9D7C3] max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                        Have a question regarding your order, fragrance recommendation, or bespoke perfume formulation? Our concierge team is at your service.
                    </p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 space-y-16">
                
                {/* Single Primary Contact Details Section */}
                <ContactSection />

                {/* Main Inquiry Form */}
                <div className="max-w-4xl mx-auto">
                    <ContactForm />
                </div>

            </div>
        </main>
    );
}
