import { MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function ContactSection() {
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
                    Musaffah M/9, PO Box 92282,<br />
                    Abu Dhabi, United Arab Emirates
                </p>
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
                    <p>+971 4 123 4567 (Boutique)</p>
                    <p>+971 50 987 6543 (WhatsApp)</p>
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
                <p className="text-xs text-dark/70 font-mono">
                    concierge@premiumessence.ae
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-dark/60 pt-2 border-t border-dark/5">
                    <Clock size={12} className="text-[#C5A059]" />
                    <span>Mon - Sat: 9:00 AM – 10:00 PM GST</span>
                </div>
            </div>
        </div>
    );
}
