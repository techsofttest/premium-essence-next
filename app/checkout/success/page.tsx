"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface PaymentStatusResponse {
    order_id: number;
    order_number: string;
    payment_status: string;
    payment_method?: string;
    is_cod?: boolean;
    status: string;
    is_success: boolean;
    grand_total: number;
    message: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order_number");
    const paymentIntent = searchParams.get("payment_intent");

    const [statusData, setStatusData] = useState<PaymentStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderNumber) {
            api<PaymentStatusResponse>("/checkout/payment-status", {
                method: "POST",
                body: JSON.stringify({ order_number: orderNumber }),
            })
                .then((res) => setStatusData(res))
                .catch(() => undefined)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [orderNumber]);

    const isCod = !!(statusData?.is_cod || statusData?.payment_method === "cod" || (statusData?.payment_method && ["cod", "cash_on_delivery", "cash"].includes(statusData.payment_method.toLowerCase())));

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F7F3F4] flex flex-col items-center justify-center p-6">
                <Loader2 className="animate-spin text-dark mb-4" size={32} />
                <p className="font-serif text-xl text-dark">Confirming your order...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F3F4] py-16 px-6 md:px-12 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-dark/10 p-8 md:p-12 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={36} />
                    </div>

                    <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] mb-2">
                        Order Confirmed
                    </p>

                    <h1 className="font-serif text-3xl md:text-5xl text-dark tracking-tight mb-4">
                        Thank You for Your Order
                    </h1>

                    <p className="text-sm text-dark/70 max-w-md mx-auto mb-8 leading-relaxed">
                        {statusData?.message || (isCod 
                            ? "Your order has been placed and confirmed successfully! We are preparing your luxury fragrances with meticulous care. Payment will be collected in cash upon doorstep delivery."
                            : "Your payment was processed successfully! We are preparing your luxury fragrances with meticulous care.")}
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-[#F7F3F4] border border-dark/10 p-6 md:p-8 text-left mb-10 space-y-4">
                        <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest text-dark/50 font-bold block">Order Number</span>
                                <span className="font-serif text-xl text-dark">{statusData?.order_number || orderNumber || "-"}</span>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 border border-emerald-300">
                                {isCod ? "Order Confirmed" : (statusData?.payment_status || "Paid & Confirmed")}
                            </span>
                        </div>

                        {/* Payment Method Explicit Display */}
                        <div className="flex items-center justify-between border-b border-dark/10 pb-3 pt-1">
                            <span className="text-xs uppercase font-bold text-dark/70">Payment Method</span>
                            <span className="text-xs font-bold text-dark uppercase tracking-wider">
                                {isCod ? "Cash on Delivery (COD)" : "Online Card (Stripe)"}
                            </span>
                        </div>

                        {statusData?.grand_total !== undefined && (
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs uppercase font-bold text-dark/70">
                                    {isCod ? "Amount Payable on Delivery" : "Total Paid"}
                                </span>
                                <span className={`font-serif text-2xl ${isCod ? "text-amber-900" : "text-dark"}`}>
                                    {statusData.grand_total} AED
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/account/orders"
                            className="w-full sm:w-auto bg-[#1B1315] text-[#F7F3F4] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#4A323A] transition-colors flex items-center justify-center gap-2"
                        >
                            <Package size={16} /> View Orders in Account
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto border border-dark/20 text-dark px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-dark hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            Continue Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F7F3F4] flex items-center justify-center">
                <Loader2 className="animate-spin text-dark" size={32} />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
