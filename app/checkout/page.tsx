"use client";

import CartHeader from "@/components/cart/CartHeader";
import OrderSummary from "@/components/cart/OrderSummary";
import PromoCode from "@/components/cart/PromoCode";
import GlowingButton from "@/components/ui/GlowingButton";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderItemsPreview from "@/components/checkout/OrderItemsPreview";
import OrderNote from "@/components/checkout/OrderNote";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
    const { cartItems, appliedCoupon } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 30;
    const discount = appliedCoupon?.discount ?? 0;
    const total = Math.max(0, subtotal + shipping - discount);

    return (
        <main className="w-full bg-[#F7F3F4] min-h-screen font-sans pb-32">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 py-12">
                <CartHeader title="Secure Checkout" currentStep={2} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                    {/* Left Column: Checkout Details */}
                    <div className="lg:col-span-8">
                        <CheckoutForm />
                    </div>

                    {/* Right Column: Order Review & Summary */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit flex flex-col gap-6">
                        <OrderItemsPreview items={cartItems} />
                        <OrderNote />
                        <PromoCode />
                        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
                    </div>
                </div>
            </div>
        </main>
    );
}
