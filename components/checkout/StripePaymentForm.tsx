"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

interface StripePaymentFormProps {
    onConfirmPayment: (cardElement: any, stripe: any) => Promise<void>;
    isProcessing: boolean;
    disabled?: boolean;
}

export default function StripePaymentForm({ onConfirmPayment, isProcessing, disabled }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        await onConfirmPayment(cardElement, stripe);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#F7F3F4] border border-dark/10 p-5 rounded-none">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80 flex items-center gap-2">
                        <Lock size={12} className="text-[#C5A059]" /> Credit / Debit Card Details
                    </label>
                    <span className="text-[9px] uppercase tracking-wider text-dark/50 font-bold">256-Bit SSL Encrypted</span>
                </div>

                <div className="bg-white border border-dark/15 p-4 transition-all focus-within:border-dark">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "14px",
                                    color: "#1B1315",
                                    fontFamily: "Inter, sans-serif",
                                    "::placeholder": {
                                        color: "#9CA3AF",
                                    },
                                },
                                invalid: {
                                    color: "#DC2626",
                                },
                            },
                        }}
                        onChange={(e) => setCardError(e.error ? e.error.message : null)}
                    />
                </div>

                {cardError && (
                    <p className="text-xs text-red-600 font-medium mt-2.5">{cardError}</p>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-dark/60 font-light">
                <ShieldCheck size={16} className="text-[#C5A059] shrink-0" />
                <span>Your card details are securely processed directly by Stripe. No payment info is stored on our servers.</span>
            </div>

            <button
                type="submit"
                disabled={!stripe || isProcessing || disabled}
                className="w-full bg-[#1B1315] text-[#F7F3F4] py-5 px-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#4A323A] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md flex items-center justify-center gap-3 cursor-pointer"
            >
                {isProcessing ? (
                    <>
                        <Loader2 size={16} className="animate-spin" /> Processing Payment...
                    </>
                ) : (
                    <>
                        <Lock size={14} /> Pay & Complete Checkout
                    </>
                )}
            </button>
        </form>
    );
}
