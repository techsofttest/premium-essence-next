"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Truck, ShieldCheck, Info, AlertTriangle, Tag, X, Award } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";
import { useCart } from "@/context/CartContext";

interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    showCheckoutButton?: boolean;
}

export default function OrderSummary({ subtotal, shipping, total, showCheckoutButton }: OrderSummaryProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { appliedCoupon, removeCoupon, validateCartStock, shippingSettings } = useCart();
    const [stockErrors, setStockErrors] = useState<string[]>([]);

    const shouldShowButton = showCheckoutButton !== undefined ? showCheckoutButton : (pathname !== "/checkout");

    const discount = appliedCoupon?.discount ?? 0;
    const isFreeShipping = !shippingSettings.is_enabled || subtotal >= shippingSettings.free_shipping_threshold;
    const actualShipping = isFreeShipping ? 0 : (shippingSettings.default_shipping_fee || 20);
    const finalTotal = Math.max(0, subtotal + actualShipping - discount);

    const handleCheckoutClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        const { valid, errors } = await validateCartStock();
        if (!valid) {
            setStockErrors(errors);
        } else {
            setStockErrors([]);
            router.push("/checkout");
        }
    };

    return (
        <div className="bg-white p-8 shadow-xl border border-dark/10 font-sans">
            <h2 className="font-serif text-xl text-dark mb-6 border-b border-dark/10 pb-4">Order Summary</h2>

            {/* Stock Errors Banner */}
            {stockErrors.length > 0 && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider">
                        <AlertTriangle size={15} /> Cannot Proceed to Checkout
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-rose-800 flex flex-col gap-1">
                        {stockErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center text-xs">
                    <span className="text-dark/80 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="text-dark font-bold">{subtotal.toLocaleString()} AED</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between items-center text-xs text-emerald-800 bg-emerald-50/80 p-2.5 border border-emerald-200">
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                            <Tag size={12} /> Coupon ({appliedCoupon?.code})
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                            <span>-{discount.toLocaleString()} AED</span>
                            <button
                                onClick={removeCoupon}
                                className="text-dark/40 hover:text-dark transition-colors"
                                title="Remove coupon"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center text-xs">
                    <div className="flex flex-col gap-1">
                        <span className="text-dark/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            Shipping <Info size={10} className="text-dark/40" />
                        </span>
                        {isFreeShipping && subtotal > 0 && (
                            <span className="text-[9px] text-[#C5A059] font-bold uppercase tracking-[0.15em]">
                                Free Shipping Applied
                            </span>
                        )}
                        {!isFreeShipping && shippingSettings.free_shipping_threshold > 0 && (
                            <span className="text-[9px] text-dark/50 font-medium">
                                Add {(shippingSettings.free_shipping_threshold - subtotal).toLocaleString()} AED more for FREE shipping
                            </span>
                        )}
                    </div>
                    <span className="text-dark font-bold">{actualShipping === 0 ? "FREE" : `${actualShipping} AED`}</span>
                </div>
            </div>

            <div className="pt-6 border-t border-dark/20 mb-8">
                <div className="flex justify-between items-center">
                    <span className="font-serif text-xl text-dark">Total</span>
                    <span className="font-serif text-2xl text-dark">{finalTotal.toLocaleString()} AED</span>
                </div>
                <p className="text-[9px] text-dark/70 mt-2 tracking-widest uppercase text-right font-bold italic">
                    VAT inclusive
                </p>
            </div>

            {shouldShowButton && (
                <GlowingButton
                    fullWidth
                    className="h-[52px] text-[10px] tracking-[0.3em] uppercase cursor-pointer mb-6"
                    onClick={handleCheckoutClick}
                >
                    Checkout Now
                </GlowingButton>
            )}

            <div className="mt-8 pt-6 border-t border-dark/10 grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                    <Truck size={16} className="text-[#C5A059] shrink-0" />
                    <span className="text-[8px] tracking-widest uppercase text-dark font-bold opacity-90 leading-tight">
                        Fast<br />Delivery
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#C5A059] shrink-0" />
                    <span className="text-[8px] tracking-widest uppercase text-dark font-bold opacity-90 leading-tight">
                        Secure<br />Payment
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Award size={16} className="text-[#C5A059] shrink-0" />
                    <span className="text-[8px] tracking-widest uppercase text-dark font-bold opacity-90 leading-tight">
                        100%<br />Authentic
                    </span>
                </div>
            </div>
        </div>
    );
}
