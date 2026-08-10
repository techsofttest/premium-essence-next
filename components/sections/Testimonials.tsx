"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Luxury-focused mock data
const TESTIMONIALS = [
    {
        id: 1,
        quote: "Premium Essence has completely redefined my standard for luxury. The authenticity of their Tom Ford collection is impeccable, and the packaging was an experience in itself.",
        name: "Sarah Al Mansoori",
        role: "Verified Client, Abu Dhabi",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 2,
        quote: "Finding genuine Creed fragrances can be daunting, but their team provided exceptional guidance. The complimentary engraving added a remarkably personal touch to my gift.",
        name: "James Sterling",
        role: "Verified Client, Dubai",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 3,
        quote: "An absolute masterclass in e-commerce elegance. From the curated selection of Maison Francis Kurkdjian to the seamless delivery, every detail breathes excellence.",
        name: "Elena Rostova",
        role: "Fragrance Collector",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 4,
        quote: "I've ordered multiple custom discovery sets and the presentation is outstanding. It feels like unboxing a piece of pure art.",
        name: "Amina Al Qasimi",
        role: "Connoisseur, Sharjah",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 5,
        quote: "The Signature Oud Collection is legendary. The depth and longevity of these scents are unmatched in any boutique I've visited in Europe.",
        name: "Yousef Al Maktoum",
        role: "Premium Collector, Dubai",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 6,
        quote: "Ordering from Paris, I was surprised by how fast the shipping was. Perfectly authentic luxury perfumes packaged with remarkable care.",
        name: "Chloe Dupont",
        role: "Beauty Editor, Paris",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 7,
        quote: "Their customer support is world-class. They helped me trace down a rare batch of Creed Green Irish Tweed that I couldn't find anywhere else.",
        name: "Faisal Al-Zaabi",
        role: "Verified Purchaser, Abu Dhabi",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 8,
        quote: "A sensory masterclass. The fragrance details and breakdown of olfactory notes on their catalog made it effortless to select my signature scent.",
        name: "Sophia Loren",
        role: "Aesthetic Designer",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 9,
        quote: "Authenticity is hard to find online, but Premium Essence is Abu Dhabi's most trustworthy portal. Every bottle has verified serials.",
        name: "Marcus Vance",
        role: "Frequent Buyer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 10,
        quote: "Purchased the luxury gifting package for a family wedding. The presentation boxes are beautifully heavy and smell of pure rose water.",
        name: "Noora Al Suwaidi",
        role: "Verified Client, Al Ain",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 11,
        quote: "Their extrait de parfum selection is peerless. I highly recommend the discovery vaults if you want to sample high-concentration niche blends.",
        name: "Tariq Al Jamil",
        role: "Perfume Collector, Riyadh",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 12,
        quote: "The elegant engraving options make this the ultimate luxury gifting portal. Highly bespoke service that makes every purchase memorable.",
        name: "Isabella Rossi",
        role: "Gift Concierge",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 13,
        quote: "For authentic French and Italian designer houses, this is easily the premier destination. Unbelievably swift delivery across UAE.",
        name: "Hamdan Al Nahyan",
        role: "VIP Client, Abu Dhabi",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    }
];

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

function TestimonialAvatar({ src, name }: { src?: string; name: string }) {
    const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);

    useEffect(() => {
        setImgSrc(src || DEFAULT_AVATAR);
    }, [src]);

    return (
        <div className="relative w-14 h-14 rounded-none overflow-hidden border border-dark/10 shadow-sm bg-[#F7F3F4]">
            <Image
                src={imgSrc}
                alt={name}
                fill
                unoptimized
                onError={() => setImgSrc(DEFAULT_AVATAR)}
                className="object-cover"
                sizes="56px"
            />
        </div>
    );
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");
        fetch(`${baseUrl}/storefront/testimonials`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setTestimonials(data);
                }
            })
            .catch(() => undefined);
    }, []);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        if (!testimonials.length) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <section className="py-20 w-full bg-gradient-to-br from-[#DEDEDE] to-[#F7F3F4] font-sans overflow-hidden relative">
            {/* 
                The "Perfume in Water" Background Effect 
                We use blurred shapes with opacity to simulate fluid diffusion.
            */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-[#4A323A]/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-[#D4AF37]/10 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '2s' }} />
                <div className="absolute top-[20%] left-[40%] w-[40%] h-[60%] bg-[#F7F3F4]/40 rounded-full mix-blend-overlay filter blur-[80px]" />

                {/* Very subtle noise texture to make it feel like physical water/glass */}
                <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
            </div>

            <div className="max-w-screen-xl mx-auto px-8 md:px-16 flex flex-col items-center relative">

                {/* Section Header */}
                <div className="text-center mb-8">
                    <span className="text-xs tracking-[0.3em] uppercase text-dark/50 block mb-3 font-medium">
                        Client Experiences
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark tracking-tight">
                        Words of <span className="italic text-dark">Elegance</span>
                    </h2>
                </div>

                {/* 
          Slider Container 
          We use a fixed max-width and hidden overflow to create the viewport for the slides.
        */}
                <div className="relative w-full max-w-4xl mx-auto">

                    {/* Decorative Large Quote Mark positioned behind the text */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-midnight/[0.03] z-0 pointer-events-none">
                        <Quote size={120} fill="currentColor" strokeWidth={0} />
                    </div>

                    {/* Viewport */}
                    <div className="overflow-hidden w-full relative z-10">
                        {/* 
              Slider Track
              Translates horizontally based on the active index.
            */}
                        <div
                            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="w-full shrink-0 flex flex-col items-center text-center px-4 md:px-12"
                                >
                                    {/* Rating Stars */}
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                                            <Star key={i} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                                        ))}
                                    </div>

                                    {/* The Quote */}
                                    <div className="min-h-[150px] md:min-h-[120px] flex items-center justify-center">
                                        <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-dark tracking-tight">
                                            "{testimonial.quote}"
                                        </p>
                                    </div>

                                    {/* Author Block Below Text */}
                                    <div className="flex flex-col items-center mt-6 gap-4">
                                        <TestimonialAvatar src={testimonial.image} name={testimonial.name} />
                                        {/* Author Details */}
                                        <div className="flex flex-col items-center">
                                            <span className="font-sans text-sm tracking-widest uppercase text-dark font-medium">
                                                {testimonial.name}
                                            </span>
                                            <span className="text-xs text-dark/50 mt-1">
                                                {testimonial.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left Control Arrow */}
                    <button
                        onClick={prevSlide}
                        aria-label="Previous Testimonial"
                        className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 lg:-left-20 w-12 h-12 rounded-none border border-dark/10 flex items-center justify-center text-dark/50 hover:text-dark hover:border-dark/30 transition-all duration-300 z-20 bg-[#F7F3F4]/90 backdrop-blur-sm"
                    >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>

                    {/* Right Control Arrow */}
                    <button
                        onClick={nextSlide}
                        aria-label="Next Testimonial"
                        className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 lg:-right-20 w-12 h-12 rounded-none border border-dark/10 flex items-center justify-center text-dark/50 hover:text-dark hover:border-dark/30 transition-all duration-300 z-20 bg-[#F7F3F4]/90 backdrop-blur-sm"
                    >
                        <ChevronRight size={20} strokeWidth={1.5} />
                    </button>

                </div>

                {/* Minimalist Dot Indicators */}
                <div className="flex items-center gap-3 mt-8">
                    {testimonials.map((_, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`transition-all duration-500 ease-in-out rounded-none ${isActive
                                    ? "w-8 h-[2px] bg-dark opacity-100"
                                    : "w-2 h-[2px] bg-dark opacity-20 hover:opacity-50"
                                    }`}
                            />
                        );
                    })}
                </div>

            </div>
        </section>
    );
}