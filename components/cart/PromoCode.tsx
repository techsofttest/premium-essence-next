"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2, AlertCircle, X, Tag } from "lucide-react";

export default function PromoCode() {
    const { cartItems, applyCoupon, appliedCoupon, removeCoupon } = useCart();
    const [couponInput, setCouponInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleApply = async () => {
        if (!couponInput.trim()) return;
        setLoading(true);
        setMessage(null);

        const res = await applyCoupon(couponInput.trim(), subtotal);
        setLoading(false);

        if (res.success) {
            setMessage({ type: "success", text: res.message });
            setCouponInput("");
        } else {
            setMessage({ type: "error", text: res.message });
        }
    };

    return (
        <div className="bg-white p-6 border border-dark/10 flex flex-col gap-3 font-sans">
            <div className="flex justify-between items-center">
                <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark flex items-center gap-1.5">
                    <Tag size={13} className="text-[#C5A059]" /> Promo Code
                </h3>
                {appliedCoupon && (
                    <span className="text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 font-bold uppercase tracking-wider">
                        Applied
                    </span>
                )}
            </div>

            {appliedCoupon ? (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                            <CheckCircle2 size={13} /> {appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-emerald-800">
                            Discount: {appliedCoupon.discount} AED
                        </span>
                    </div>
                    <button
                        onClick={removeCoupon}
                        className="text-dark/40 hover:text-dark p-1 transition-colors"
                        title="Remove Coupon"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code (e.g. SAVE10)"
                        className="flex-1 bg-[#F7F3F4] border border-dark/10 p-2.5 text-xs text-dark placeholder:text-dark/40 outline-none focus:border-dark transition-colors uppercase font-mono tracking-widest"
                    />
                    <button
                        disabled={loading || !couponInput.trim()}
                        onClick={handleApply}
                        className="px-5 py-2.5 bg-dark text-white text-[9px] tracking-widest uppercase font-bold hover:bg-dark/80 transition-colors disabled:opacity-40 shrink-0"
                    >
                        {loading ? "..." : "Apply"}
                    </button>
                </div>
            )}

            {message && !appliedCoupon && (
                <p className={`text-[10px] font-bold flex items-center gap-1 mt-1 ${message.type === "success" ? "text-emerald-700" : "text-rose-600"}`}>
                    {message.type === "success" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {message.text}
                </p>
            )}
        </div>
    );
}
