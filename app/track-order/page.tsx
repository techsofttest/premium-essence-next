"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

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
        <main className="min-h-screen bg-[#F7F3F4] py-16 px-6 md:px-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block mb-2">
                        Real-Time Fulfillment Status
                    </span>
                    <h1 className="font-serif text-3xl md:text-5xl text-dark tracking-tight">
                        Track Your Order
                    </h1>
                    <p className="text-xs md:text-sm text-dark/60 mt-3 max-w-md mx-auto leading-relaxed">
                        Enter your order number and email address or phone number used during checkout to track delivery status.
                    </p>
                </div>

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
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 border ${
                                        trackingData.payment_status === 'paid' 
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
                                <span className="font-serif text-2xl text-dark">{trackingData.grand_total} AED</span>
                            </div>
                        </div>

                        {/* Order Progress Timeline */}
                        <div className="bg-white border border-dark/10 p-8 md:p-10 shadow-sm">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-dark mb-8 border-b border-dark/10 pb-4">
                                Fulfillment Timeline
                            </h3>

                            <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-2.5 md:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-dark/10">
                                {trackingData.timeline.map((step, idx) => (
                                    <div key={idx} className="relative flex items-start gap-4">
                                        <div className={`absolute -left-6 md:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                            step.completed 
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
                                    {trackingData.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 py-2 border-b border-dark/5 last:border-0">
                                            <div className="relative w-14 h-16 bg-[#F7F3F4] border border-dark/10 shrink-0">
                                                <Image
                                                    src={item.image || "/products/Aventus 1.png"}
                                                    alt={item.name}
                                                    fill
                                                    unoptimized
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-dark truncate">{item.name}</p>
                                                <p className="text-[10px] text-dark/60 mt-0.5">{item.brand} {item.variant_details ? `(${item.variant_details})` : ""}</p>
                                                <p className="text-xs text-dark/80 mt-1">Qty: {item.quantity} &times; {item.price} AED</p>
                                            </div>
                                            <div className="text-right font-serif text-sm text-dark font-medium">
                                                {item.line_total} AED
                                            </div>
                                        </div>
                                    ))}
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
