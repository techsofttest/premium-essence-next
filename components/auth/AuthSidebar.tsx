"use client";

import Image from "next/image";

interface AuthSidebarProps {
    image: string;
    label: string;
    title: string;
    description: string;
}

export default function AuthSidebar({ image, label, title, description }: AuthSidebarProps) {
    return (
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#1B1315]">
            <Image 
                src={image} 
                alt={title} 
                fill 
                className="object-contain p-20 opacity-60 scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B1315] via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-20 left-20 z-10 flex flex-col gap-4 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <span className="text-[10px] tracking-[0.5em] uppercase text-[#C5A059] font-bold">
                    {label}
                </span>
                <h1 className="font-serif text-5xl text-white leading-tight">
                    {title}
                </h1>
                <p className="text-white/60 text-sm leading-relaxed tracking-wide">
                    {description}
                </p>
            </div>
        </div>
    );
}
