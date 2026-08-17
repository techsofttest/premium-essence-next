import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Award } from "lucide-react";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");

async function getAboutCmsPage() {
    try {
        const res = await fetch(`${baseUrl}/storefront/cms/about-us`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export const metadata = {
    title: "About Us | Premium Essence Perfumes LLC",
    description: "Discover the story behind Premium Essence Perfumes LLC, Abu Dhabi's premier haute perfumerie celebrating royal oud, rare florals, and artisan olfactory mastery.",
};

export default async function AboutPage() {
    const cmsData = await getAboutCmsPage();

    const title = cmsData?.title || "About Premium Essence";
    const contentHtml = cmsData?.content || `
        <h2>Haute Parfumerie from Abu Dhabi</h2>
        <p>Established in the heart of the United Arab Emirates at Musaffah M/9, Abu Dhabi, <strong>Premium Essence Perfumes LLC</strong> is dedicated to the ancient art and modern sophistication of fine fragrance creation.</p>
        
        <h3>Our Olfactory Heritage</h3>
        <p>We combine centuries-old Arabian perfumery traditions—celebrating Royal Oud, Damask Rose, Ambergris, and Saffron—with contemporary European formulation standards. Every perfume in our catalog is crafted from certified essential oils sourced directly from renowned perfume houses in Grasse, Florence, and the Middle East.</p>

        <h3>Commitment to Authenticity</h3>
        <p>We guarantee 100% genuine, authentic fragrances. Our products undergo rigorous batch testing, temperature-controlled storage, and quality inspection before reaching your hands.</p>
    `;

    return (
        <main className="min-h-screen bg-[#F7F3F4] text-dark font-sans pb-24">
            {/* Hero Header with Banner 1 */}
            <div className="relative bg-[#1B1315] text-[#E9D7C3] py-28 px-6 md:px-12 text-center border-b border-[#C5A059]/20 overflow-hidden">
                <Image
                    src="/banners/banner1.jpg"
                    alt="About Us Banner"
                    fill
                    className="object-cover opacity-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315]/90 via-[#1B1315]/40 to-black/30" />
                
                <div className="relative z-10 max-w-4xl mx-auto space-y-4">
                    <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#C5A059] block drop-shadow-sm">
                        Abu Dhabi's Premier Haute Perfumerie
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
                        {title}
                    </h1>
                    <p className="text-xs md:text-sm text-[#E9D7C3] max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                        Curating rare, handcrafted scents and artisanal olfactory masterpieces for discerning perfume connoisseurs worldwide.
                    </p>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto px-6 md:px-12 pt-16 space-y-16">
                
                {/* CMS Dynamic Rich Content Block (Editable via Admin Panel) */}
                <div className="bg-white border border-dark/10 p-8 md:p-14 shadow-sm">
                    <div
                        className="prose prose-sm md:prose-base max-w-none prose-headings:font-serif prose-headings:text-dark prose-h2:text-2xl prose-h2:md:text-3xl prose-h3:text-lg prose-p:text-dark/80 prose-p:leading-relaxed prose-strong:text-dark"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>

                {/* Brand Values / Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-dark/10 p-6 flex items-start gap-4">
                        <Award className="text-[#C5A059] shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-dark mb-1">Grasse Essential Oils</h4>
                            <p className="text-xs text-dark/70 leading-relaxed">Sourced from historic French & Middle Eastern scent ateliers with high oil concentrations.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-dark/10 p-6 flex items-start gap-4">
                        <ShieldCheck className="text-[#C5A059] shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-dark mb-1">100% Authentic Guarantee</h4>
                            <p className="text-xs text-dark/70 leading-relaxed">Certified authentic formulations batch-tested in Abu Dhabi laboratories.</p>
                        </div>
                    </div>
                    <div className="bg-white border border-dark/10 p-6 flex items-start gap-4">
                        <Sparkles className="text-[#C5A059] shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-dark mb-1">Concierge Delivery</h4>
                            <p className="text-xs text-dark/70 leading-relaxed">Temperature-controlled express courier shipping across the UAE and globally.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
