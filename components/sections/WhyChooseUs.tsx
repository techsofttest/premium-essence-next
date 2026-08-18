import { ShieldCheck, Crown, Sparkles, Droplet, Award, Truck, Heart, Star } from "lucide-react";
import { WhyChooseUsItemData } from "@/lib/storefront";

const ICON_MAP: Record<string, any> = {
    ShieldCheck,
    Crown,
    Sparkles,
    Droplet,
    Award,
    Truck,
    Heart,
    Star,
};

const DEFAULT_FEATURES = [
    {
        icon: "ShieldCheck",
        title: "100% Authentic",
        description: "We guarantee 100% authentic products, delivering elegance and trust in every bottle.",
    },
    {
        icon: "Crown",
        title: "Prestigious Brands",
        description: "Specializing in authentic perfumes from the world's most prestigious international design houses.",
    },
    {
        icon: "Sparkles",
        title: "Exceptional Service",
        description: "Committed to providing exceptional service and a premium shopping experience.",
    },
    {
        icon: "Droplet",
        title: "Curated Excellence",
        description: "Abu Dhabi's trusted destination known exclusively for Authenticity, Elegance, and Excellence.",
    },
];

interface WhyChooseUsProps {
    initialItems?: WhyChooseUsItemData[];
    subtitle?: string;
    title?: string;
}

export default function WhyChooseUs({ initialItems, subtitle = "Our Values", title = "Why Premium Essence?" }: WhyChooseUsProps) {
    const items = initialItems && initialItems.length ? initialItems : DEFAULT_FEATURES;

    return (
        <section className="py-24 px-8 bg-[#F7F3F4] w-full font-sans border-t border-dark/5">
            <div className="max-w-screen-2xl mx-auto flex flex-col items-center">

                {/* Section Title */}
                <div className="text-center mb-12">
                    <span className="text-xs tracking-[0.3em] uppercase text-dark/50 block mb-3 font-medium">
                        {subtitle}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight">
                        {title}
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 w-full max-w-6xl mx-auto">
                    {items.map((feature: any, index: number) => {
                        const Icon = ICON_MAP[feature.icon] || ShieldCheck;
                        return (
                            <div
                                key={feature.id || index}
                                className="flex flex-col items-center text-center group px-4"
                            >
                                <div className="mb-6 text-dark/80 group-hover:text-dark transition-colors duration-500 transform group-hover:-translate-y-1">
                                    <Icon size={48} strokeWidth={1} />
                                </div>

                                <h3 className="font-serif text-xl text-dark tracking-wide mb-3">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-dark/60 leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}