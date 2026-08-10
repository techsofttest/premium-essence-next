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

            <div className="w-full md:w-1/2 flex flex-col p-8 md:p-20 justify-center relative">
                <Link 
                    href={backLink} 
                    onClick={onBackClick}
                    className="absolute top-10 left-10 md:left-20 flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-dark/60 hover:text-dark transition-colors group z-20"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    {backLabel}
                </Link>

                <div className="w-full max-w-md mx-auto relative z-10">
                    {children}
                </div>

                {/* Shared Auth Footer */}
                <div className="mt-20 md:absolute md:bottom-10 md:left-20 md:right-20 flex justify-between items-center text-[9px] tracking-widest uppercase text-dark/30 font-bold">
                    <span>© 2026 Premium Essence</span>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-dark">Privacy</Link>
                        <Link href="#" className="hover:text-dark">Terms</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
