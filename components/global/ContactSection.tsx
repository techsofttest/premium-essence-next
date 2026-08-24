"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useContactSettings } from "@/context/ContactContext";

export default function ContactSection() {
    const { contactSettings } = useContactSettings();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="bg-white border border-dark/10 p-6 flex flex-col gap-3 shadow-sm hover:border-dark/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                    <MapPin size={20} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark">
                    Flagship Boutique & HQ
                </h3>
                <p className="text-xs text-dark/70 leading-relaxed">
                    {contactSettings.company_name}<br />
                    {contactSettings.address}
                </p>
                {contactSettings.google_maps_link && (
                    <a
                        href={contactSettings.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#C5A059] font-bold hover:underline"
                    >
                        View on Google Maps →
                    </a>
                )}
            </div>

            {/* Phone & Concierge */}
            <div className="bg-white border border-dark/10 p-6 flex flex-col gap-3 shadow-sm hover:border-dark/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                    <Phone size={20} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark">
                    Direct Phone Concierge
                </h3>
                <div className="text-xs text-dark/70 space-y-1 font-mono">
                    {contactSettings.phone && (
                        <p>
                            <a href={`tel:${contactSettings.phone.replace(/\s+/g, '')}`} className="hover:text-[#C5A059] transition-colors">
                                Mob: {contactSettings.phone}
                            </a>
                        </p>
                    )}
                    {contactSettings.telephone && (
                        <p>
                            <a href={`tel:${contactSettings.telephone.replace(/\s+/g, '')}`} className="hover:text-[#C5A059] transition-colors">
                                Tel: {contactSettings.telephone}
                            </a>
                        </p>
                    )}
                    {contactSettings.whatsapp && (
                        <p>
                            <a href={`https://wa.me/${contactSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                                WhatsApp: {contactSettings.whatsapp}
                            </a>
                        </p>
                    )}
                </div>
            </div>

            {/* Email & Business Hours */}
            <div className="bg-white border border-dark/10 p-6 flex flex-col gap-3 shadow-sm hover:border-dark/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center">
                    <Mail size={20} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-dark">
                    Private Inquiry Email
                </h3>
                <div className="text-xs text-dark/70 font-mono space-y-1">
                    {contactSettings.email && (
                        <p>
                            <a href={`mailto:${contactSettings.email}`} className="hover:text-[#C5A059] transition-colors">
                                {contactSettings.email}
                            </a>
                        </p>
                    )}
                    {contactSettings.support_email && (
                        <p>
                            <a href={`mailto:${contactSettings.support_email}`} className="hover:text-[#C5A059] transition-colors">
                                {contactSettings.support_email} (Support)
                            </a>
                        </p>
                    )}
                </div>
                {contactSettings.working_hours && (
                    <div className="flex items-center gap-1.5 text-[11px] text-dark/60 pt-2 border-t border-dark/5">
                        <Clock size={12} className="text-[#C5A059]" />
                        <span>{contactSettings.working_hours}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
