"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthSidebar from "./AuthSidebar";

interface AuthContainerProps {
    children: React.ReactNode;
    sidebarData: {
        image: string;
        label: string;
        title: string;
        description: string;
    };
    backLink: string;
    backLabel: string;
    onBackClick?: (e: React.MouseEvent) => void;
}

export default function AuthContainer({ 
    children, 
    sidebarData, 
    backLink, 
    backLabel,
    onBackClick 
}: AuthContainerProps) {
    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F7F3F4] font-sans">
            <AuthSidebar {...sidebarData} />

            <div className="w-full md:w-1/2 flex flex-col p-6 sm:p-8 md:p-20 justify-center relative min-h-screen">
                <div className="pt-4 pb-6 md:py-0 md:absolute md:top-10 md:left-20 z-20 shrink-0">
                    <Link 
                        href={backLink} 
                        onClick={onBackClick}
                        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-dark/60 hover:text-dark transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        {backLabel}
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto relative z-10 my-auto py-4">
                    {children}
                </div>

                {/* Shared Auth Footer */}
                <div className="mt-12 md:mt-20 md:absolute md:bottom-10 md:left-20 md:right-20 flex justify-between items-center text-[9px] tracking-widest uppercase text-dark/40 font-bold shrink-0">
                    <span>© 2026 Premium Essence</span>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-dark">Privacy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-dark">Terms</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
