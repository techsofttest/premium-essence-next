"use client";

import EmptyCart from "@/components/cart/EmptyCart";
import CartHeader from "@/components/cart/CartHeader";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 30;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <main className="w-full bg-[#F7F3F4] min-h-screen font-sans pb-32">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 py-12">
                <CartHeader title="Shopping Bag" itemCount={cartItems.length} currentStep={1} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {cartItems.map((item) => (
                            <CartItem 
                                key={`${item.id}-${item.size}`} 
                                item={item} 
                                onUpdateQuantity={(id, delta) => updateQuantity(id, item.size, delta)} 
                                onRemove={(id) => removeFromCart(id, item.size)} 
                            />
                        ))}
                    </div>

                    {/* Right Column: Summary (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit flex flex-col gap-6">
                        <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
                    </div>
                </div>
            </div>
        </main>
    );
}
