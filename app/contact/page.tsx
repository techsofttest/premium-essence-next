import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageSquare, Sparkles, Building2 } from "lucide-react";
import ContactForm from "@/components/global/ContactForm";
import ContactSection from "@/components/global/ContactSection";
import StoreVideoSection from "@/components/contact/StoreVideoSection";
import SeoHead from "@/components/seo/SeoHead";
import PageBanner from "@/components/global/PageBanner";

export const metadata = {
    title: "Contact Us | Premium Essence Perfumes LLC",
    description: "Get in touch with Premium Essence Perfumes LLC in Abu Dhabi, UAE. Contact our private concierge for bespoke perfume consultations, order assistance, or wholesale inquiries.",
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            <SeoHead pageSlug="contact-us" />

            {/* Dynamic Inner Page Banner */}
            <PageBanner
                pageKey="contact"
                fallbackImage="/banners/banner2.jpg"
                title="Contact Us"
                subtitle="Have a question regarding your order, fragrance recommendation, or bespoke perfume formulation? Our concierge team is at your service."
                kicker="Client Experience & Concierge"
                breadcrumbs={[{ label: "Contact Us" }]}
            />

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 space-y-16">

                {/* Single Primary Contact Details Section */}
                <ContactSection />

                {/* Boutique Video & Concierge Inquiry Form (Side-by-side on desktop, 2-rows responsive on mobile) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
                    <StoreVideoSection />
                    <ContactForm />
                </div>

            </div>
        </main>
    );
}
