"use client";

import React from "react";

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
    variant?: "solid" | "outline";
}

export default function GlowingButton({ children, fullWidth = false, variant = "solid", className = "", ...props }: GlowingButtonProps) {
    const isOutline = variant === "outline";

    return (
        <button
            className={`
        relative overflow-hidden group font-sans text-xs tracking-[0.2em] uppercase h-[44px] flex items-center justify-center px-8 
        transition-all duration-500 ease-out hover:-translate-y-0.5 rounded-none
        ${fullWidth ? "w-full" : "w-auto"}
        ${isOutline ? "border border-dark text-dark hover:text-[#E9D7C3] hover:border-transparent" : "text-[#E9D7C3]"}
        ${className}
      `}
            {...props}
        >
            {/* The Glowing Background */}
            <div
                className={`absolute inset-0 z-0 bg-gradient-to-r from-[#1B1315] from-45% via-[#3A2A2E] via-50% to-[#1B1315] to-55% bg-[length:200%_auto] bg-left transition-all duration-700 ease-out group-hover:bg-right ${isOutline ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
            />

            {/* Inner subtle border for a glass-like edge */}
            {!isOutline && <div className="absolute inset-0 z-0 border border-[#E9D7C3]/10 rounded-none" />}

            {/* Button Content */}
            <span className="relative z-10 font-medium flex items-center justify-center gap-[inherit]">
                {children}
            </span>
        </button>
    );
}