"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, ShieldCheck, Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import SeoHead from "@/components/seo/SeoHead";
import PageBanner from "@/components/global/PageBanner";

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    variant_details?: string;
    line_total: number;
    image?: string;
    brand?: string;
}

const getDealFallbackImage = (itemName?: string, variantDetails?: string): string | null => {
    if (!itemName && !variantDetails) return null;
    const name = (itemName || "").toLowerCase();
    const variant = (variantDetails || "").toLowerCase();
    const combined = `${name} ${variant}`;

    if (combined.includes("discovery") || combined.includes("travel spray")) {
        return "/deals/The%20Signature%20Discovery%20Set.png";
    }
    if (combined.includes("his & hers") || combined.includes("his and hers") || combined.includes("ultimate") || combined.includes("couples")) {
        return "/deals/Ultimate%20His%20%26%20Hers%20Box.png";
    }
    if (combined.includes("trio") || combined.includes("oud master") || combined.includes("rare oud")) {
        return "/deals/Top%20Collection%20Trio.png";
    }
    if (combined.includes("travel") || combined.includes("vault") || combined.includes("atomizer")) {
        return "/deals/travel_vault.png";
    }
    if (combined.includes("midnight") || combined.includes("nighttime") || combined.includes("seductive")) {
        return "/deals/midnight_exclusive.png";
    }
    return null;
};

interface TimelineStep {
    title: string;
    description: string;
    completed: boolean;
    current: boolean;
    date?: string;
}

interface TrackingData {
    id: number;
    order_number: string;
    date: string;
    status: string;
    payment_status: string;
    payment_method: string;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    grand_total: number;
    courier_name?: string;
    airwaybill_number?: string;
    shipment_label_url?: string;
    postaplus_tracking_url?: string;
    delivery_type: string;
    shipping_address: {
        name: string;
        address_line_1: string;
        address_line_2?: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
        phone: string;
    };
    items: OrderItem[];
    timeline: TimelineStep[];
}

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const initialOrderNumber = searchParams.get("order_number") || "";
    const initialEmail = searchParams.get("email") || searchParams.get("phone") || "";

    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [emailOrPhone, setEmailOrPhone] = useState(initialEmail);

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!orderNumber || !emailOrPhone) {
            setErrorMsg("Please enter both your order number and email address or phone number.");
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            const data = await api<TrackingData>("/track-order", {
                method: "POST",
                body: JSON.stringify({
                    order_number: orderNumber,
                    email_or_phone: emailOrPhone,
                }),
            });
            setTrackingData(data);
        } catch (err: any) {
            setTrackingData(null);
            setErrorMsg(err?.message || "No order found matching the provided order number and contact details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialOrderNumber && initialEmail) {
            void handleTrack();
        }
    }, [initialOrderNumber, initialEmail]);

    return (
        <main className="min-h-screen bg-[#F7F3F4] font-sans pb-24">
            <SeoHead pageSlug="track-order" />

            {/* Dynamic Inner Page Banner */}
            <PageBanner
                pageKey="track_order"
                fallbackImage="/banners/banner2.jpg"
                title="Track Your Order"
                subtitle="Enter your order number and contact details to monitor real-time preparation, dispatch, and express doorstep delivery across UAE."
                kicker="Fulfillment & Concierge"
                breadcrumbs={[{ label: "Track Order" }]}
            />

            <div className="max-w-4xl mx-auto px-6 md:px-12 pt-12">
                {/* Track Order Form */}
                <div className="bg-white border border-dark/10 p-8 md:p-10 shadow-sm mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                            <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Order Number *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. TC-000123"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                            <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Email or Phone Number *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. email@example.com or +971 50..."
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-[#1B1315] text-[#F7F3F4] py-4 px-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#4A323A] transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                            Track Order
                        </button>
                    </form>

                    {errorMsg && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                            {errorMsg}
                        </div>
                    )}
                </div>

                {/* Tracking Details View */}
                {trackingData && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Header Banner */}
                        <div className="bg-white border border-dark/10 p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-serif text-2xl text-dark">{trackingData.order_number}</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 border ${trackingData.payment_status === 'paid'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                        Payment: {trackingData.payment_status}
                                    </span>
                                </div>
                                <p className="text-xs text-dark/60">Placed on {trackingData.date}</p>
                            </div>
                            <div className="text-left md:text-right">
                                <span className="text-[10px] uppercase tracking-widest text-dark/50 block font-bold">Total Amount</span>
                                <span className="font-serif text-2xl text-dark">AED {trackingData.grand_total}</span>
                            </div>
                        </div>

                            {/* Unpaid / Pending Online Payment Notice */ }
                        {trackingData.payment_status !== 'paid' && !['cod', 'cash_on_delivery', 'cash'].includes((trackingData.payment_method || '').toLowerCase()) && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-5 text-xs shadow-sm flex items-start gap-3">
                                <Clock className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold uppercase tracking-wider text-[11px]">Payment Awaiting Verification</p>
                                    <p className="text-amber-800/80 mt-1 leading-relaxed">
                                        Your online payment is currently pending or incomplete. Fragrance inspection, packaging, and courier dispatch will begin immediately once payment is successfully received.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* PostaPlus / Courier Waybill Status (Only shown if shipment has been created with an active AWB) */}
                        {Boolean(trackingData.airwaybill_number && trackingData.airwaybill_number.trim()) && (
                            <div className="bg-[#1B1315] text-[#F7F3F4] border border-[#D4AF37]/30 p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start md:items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-[#D4AF37]">
                                        <Truck size={22} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                                                {trackingData.courier_name || "PostaPlus Express"}
                                            </span>
                                            <span className="text-xs text-white/40">•</span>
                                            <span className="text-xs font-mono font-bold tracking-wider text-white">
                                                AWB: {trackingData.airwaybill_number}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/70 mt-1">
                                            Your parcel is dispatched and being handled by our official logistics partner.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                                    <a
                                        href={trackingData.postaplus_tracking_url || `https://www.postaplus.com/track?code=${trackingData.airwaybill_number}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1B1315] hover:bg-[#c5a059] px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                                    >
                                        Live Courier Track
                                        <ExternalLink size={13} />
                                    </a>
                                    {trackingData.shipment_label_url && (
                                        <a
                                            href={trackingData.shipment_label_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 border border-white/20 text-white/90 hover:bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Waybill Label
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Order Progress Timeline */}
                        <div className="bg-white border border-dark/10 p-8 md:p-10 shadow-sm">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-dark mb-8 border-b border-dark/10 pb-4">
                                Fulfillment Timeline
                            </h3>

                            <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-2.5 md:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-dark/10">
                                {trackingData.timeline.map((step, idx) => (
                                    <div key={idx} className="relative flex items-start gap-4">
                                        <div className={`absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step.completed
                                            ? 'bg-dark text-white shadow-sm'
                                            : step.current
                                                ? 'bg-[#C5A059] text-white animate-pulse'
                                                : 'bg-white border border-dark/20 text-dark/40'
                                            }`}>
                                            {step.completed ? <CheckCircle2 size={14} /> : idx + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className={`text-sm font-bold ${step.completed || step.current ? 'text-dark' : 'text-dark/40'}`}>
                                                    {step.title}
                                                </h4>
                                                {step.date && (
                                                    <span className="text-[10px] text-dark/50 font-medium">({step.date})</span>
                                                )}
                                            </div>
                                            <p className={`text-xs mt-1 ${step.completed || step.current ? 'text-dark/70' : 'text-dark/40'}`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address & Order Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-5 bg-white border border-dark/10 p-8 shadow-sm">
                                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-dark mb-4 border-b border-dark/10 pb-3 flex items-center gap-2">
                                    <MapPin size={16} /> Shipping Destination
                                </h3>
                                <p className="text-sm font-bold text-dark">{trackingData.shipping_address.name}</p>
                                <p className="text-xs text-dark/60 mt-1">{trackingData.shipping_address.phone}</p>
                                <p className="text-xs text-dark/80 mt-3 leading-relaxed">
                                    {trackingData.shipping_address.address_line_1}
                                    {trackingData.shipping_address.address_line_2 ? `, ${trackingData.shipping_address.address_line_2}` : ""}
                                    <br />
                                    {trackingData.shipping_address.city}, {trackingData.shipping_address.state} {trackingData.shipping_address.postcode}
                                    <br />
                                    {trackingData.shipping_address.country}
                                </p>
                            </div>

                            <div className="md:col-span-7 bg-white border border-dark/10 p-8 shadow-sm">
                                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-dark mb-4 border-b border-dark/10 pb-3 flex items-center gap-2">
                                    <Package size={16} /> Items Ordered ({trackingData.items.length})
                                </h3>
                                <div className="space-y-4">
                                    {trackingData.items.map((item) => {
                                        const dealFallback = getDealFallbackImage(item.name, item.variant_details);
                                        const isDeal = Boolean(dealFallback) || item.brand === "Exclusive Curation" || item.brand === "Special Curation Bundle";
                                        const isProductImage = item.image && item.image.includes("/storage/products/");
                                        const initialImage = (isDeal && isProductImage && dealFallback)
                                            ? dealFallback
                                            : (item.image && !item.image.includes("brand-logo-nobg") && !item.image.includes("logo-black")
                                                ? item.image
                                                : (dealFallback || item.image || "/logo/logo-black.png"));

                                        return (
                                            <div key={item.id} className="flex items-center gap-4 py-2 border-b border-dark/5 last:border-0">
                                                <div className="relative w-14 h-16 bg-[#F7F3F4] border border-dark/10 shrink-0">
                                                    <Image
                                                        src={initialImage}
                                                        alt={item.name}
                                                        fill
                                                        unoptimized
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            if (target) {
                                                                if (dealFallback && target.src !== dealFallback) {
                                                                    target.src = dealFallback;
                                                                } else {
                                                                    target.src = "/logo/logo-black.png";
                                                                }
                                                            }
                                                        }}
                                                        className="object-contain p-1"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-dark truncate">{item.name}</p>
                                                    <p className="text-[11px] font-semibold text-[#C5A059] mt-0.5">
                                                        {item.brand ? `${item.brand} • ` : ""}
                                                        Size/Variant: {item.variant_details || "Standard Edition"}
                                                    </p>
                                                    <p className="text-xs text-dark/80 mt-1">Qty: {item.quantity} &times; AED {item.price}</p>
                                                </div>
                                                <div className="text-right font-serif text-sm text-dark font-medium">
                                                    AED {item.line_total}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
