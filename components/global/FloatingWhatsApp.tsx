"use client";

import React from "react";
import { useContactSettings } from "@/context/ContactContext";

export default function FloatingWhatsApp() {
    const { contactSettings } = useContactSettings();

    const rawWhatsapp = contactSettings.whatsapp || "";
    const cleanNumber = rawWhatsapp.replace(/\D/g, "");

    if (!cleanNumber) {
        return null;
    }

    const whatsappUrl = `https://wa.me/${cleanNumber}`;

    return (
        <aside aria-label="WhatsApp Support">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 group"
                title={`Chat with us on WhatsApp (${rawWhatsapp})`}
                aria-label={`Chat with us on WhatsApp (${rawWhatsapp})`}
            >
                {/* Expandable Hover Label */}
                <span className="hidden sm:inline-block bg-dark/95 text-cream text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
                    Chat on WhatsApp
                </span>

                {/* Floating Button with Pulse Halo */}
                <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40 animate-ping" />
                    <div className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/40 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/20">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 fill-white"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.403 5.638A8.955 8.955 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.2 4.488L3 21l4.704-1.234a8.938 8.938 0 0 0 4.348 1.127h.004c4.947 0 8.975-4.027 8.977-8.977a8.927 8.927 0 0 0-2.633-6.278zM12.055 19.39h-.003a7.465 7.465 0 0 1-3.805-1.041l-.272-.162-2.828.742.755-2.756-.177-.282a7.472 7.472 0 0 1-1.144-4.015c.002-4.12 3.354-7.471 7.477-7.471 1.996 0 3.873.778 5.285 2.19 1.412 1.413 2.189 3.29 2.188 5.287-.001 4.122-3.353 7.472-7.476 7.472zm4.102-5.6c-.225-.113-1.334-.658-1.541-.733-.207-.075-.357-.113-.507.113-.15.225-.582.733-.713.882-.132.15-.263.169-.488.056-.225-.113-.951-.35-1.81-1.117-.67-.597-1.122-1.334-1.253-1.56-.132-.225-.014-.346.098-.458.102-.102.225-.263.338-.395.113-.132.15-.263.225-.376.075-.15.038-.282-.019-.395-.056-.113-.507-1.219-.695-1.67-.183-.438-.369-.378-.507-.385-.13-.007-.281-.008-.431-.008-.15 0-.395.056-.601.282-.207.225-.789.77-.789 1.877 0 1.107.807 2.176.919 2.326.113.15 1.589 2.427 3.85 3.404.538.233.958.372 1.285.476.54.172 1.031.148 1.419.09.433-.065 1.334-.545 1.522-1.07.188-.526.188-.976.131-1.07-.056-.094-.207-.15-.432-.263z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                </div>
            </a>
        </aside>
    );
}
