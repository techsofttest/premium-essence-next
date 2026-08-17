"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Check, Loader2, AlertCircle, CreditCard, Lock, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export interface SavedAddress {
    id: number;
    label?: string;
    contact_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    suburb?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    is_default_shipping?: boolean;
}

export default function CheckoutForm() {
    const router = useRouter();
    const { customer } = useAuth();
    const { cartItems, appliedCoupon, clearCart, validateCartStock } = useCart();

    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
    const [saveAddressToProfile, setSaveAddressToProfile] = useState<boolean>(true);
    const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);

    // Contact & Shipping Form State
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [suburb, setSuburb] = useState("");
    const [city, setCity] = useState("Dubai");
    const [state, setState] = useState("Dubai");
    const [postcode, setPostcode] = useState("00000");
    const [country, setCountry] = useState("United Arab Emirates");
    const [deliveryNotes, setDeliveryNotes] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch saved addresses if logged in
    useEffect(() => {
        if (customer) {
            setEmail(customer.email || "");
            setPhone(customer.phone || "");
            const names = (customer.name || "").split(" ");
            setFirstName(names[0] || "");
            setLastName(names.slice(1).join(" ") || "");

            setLoadingAddresses(true);
            api<SavedAddress[]>("/customer/addresses")
                .then((data) => {
                    const list = data || [];
                    setSavedAddresses(list);
                    const defaultAddr = list.find((a) => a.is_default_shipping) || list[0];
                    if (defaultAddr) {
                        applySavedAddress(defaultAddr);
                    }
                })
                .catch(() => undefined)
                .finally(() => setLoadingAddresses(false));
        }
    }, [customer]);

    const applySavedAddress = (addr: SavedAddress) => {
        setSelectedAddressId(addr.id);
        const parts = (addr.contact_name || "").split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        setPhone(addr.phone || "");
        setAddressLine1(addr.address_line_1 || "");
        setAddressLine2(addr.address_line_2 || "");
        setSuburb(addr.suburb || "");
        setCity(addr.city || "Dubai");
        setState(addr.state || "Dubai");
        setPostcode(addr.postcode || "00000");
        setCountry(addr.country || "United Arab Emirates");
    };

    const handleSelectAddress = (id: number | "new") => {
        if (id === "new") {
            setSelectedAddressId("new");
            setAddressLine1("");
            setAddressLine2("");
            setSuburb("");
            setCity("Dubai");
            setState("Dubai");
            setPostcode("00000");
        } else {
            const found = savedAddresses.find((a) => a.id === id);
            if (found) applySavedAddress(found);
        }
    };

    const handleProceedToStripeGateway = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        const contactName = `${firstName} ${lastName}`.trim();
        if (!email || !firstName || !addressLine1 || !city || !state || !postcode) {
            setErrorMessage("Please fill out all required contact and shipping address fields (including postcode).");
            return;
        }

        if (!cartItems.length) {
            setErrorMessage("Your cart is empty. Please add items before checking out.");
            return;
        }

        setIsProcessing(true);

        try {
            // Live Inventory Stock Verification before payment
            const stockCheck = await validateCartStock();
            if (!stockCheck.valid) {
                setErrorMessage(`Inventory Error: ${stockCheck.errors.join(" ")}`);
                setIsProcessing(false);
                return;
            }

            // 1. Save address to profile if checked
            if (customer && selectedAddressId === "new" && saveAddressToProfile) {
                try {
                    await api("/customer/addresses", {
                        method: "POST",
                        body: JSON.stringify({
                            label: "Saved Checkout Address",
                            contact_name: contactName,
                            phone,
                            address_line_1: addressLine1,
                            address_line_2: addressLine2,
                            suburb,
                            city,
                            state,
                            postcode: postcode || "00000",
                            country,
                        }),
                    });
                } catch {
                    // Non-blocking address save fallback
                }
            }

            const originUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

            // 2. Create Checkout Order & Hosted Stripe Session
            const orderPayload = {
                cart: cartItems.map((item: any) => {
                    const rawPid = item.productId || item.product_id || item.id;
                    const numericPid = Number(rawPid);
                    const isPidNumeric = !isNaN(numericPid) && typeof rawPid !== "string";
                    const isDealItem = !!(
                        item.isDeal ||
                        (typeof item.id === "string" && item.id.startsWith("deal-")) ||
                        (typeof rawPid === "string" && String(rawPid).startsWith("deal-")) ||
                        (item.dealSlug && typeof item.dealSlug === "string" && !item.dealSlug.match(/^\d+$/))
                    );

                    const dealSlug = isDealItem
                        ? (item.dealSlug || item.deal_slug || (typeof item.id === "string" && item.id.startsWith("deal-") ? item.id.replace("deal-", "") : null))
                        : null;

                    return {
                        id: item.id,
                        product_id: isDealItem ? (isPidNumeric ? numericPid : (item.dealId || item.deal_id || 1)) : (isPidNumeric ? numericPid : Number(rawPid) || 1),
                        variant_id: (item.variantId && !isNaN(Number(item.variantId))) ? Number(item.variantId) : null,
                        name: item.name || item.title || null,
                        variant: item.variant || item.subtitle || item.size || null,
                        size: item.size || item.variant || item.subtitle || null,
                        deal_slug: dealSlug,
                        dealSlug: dealSlug,
                        dealId: isDealItem ? (item.dealId || item.deal_id || null) : null,
                        isDeal: isDealItem,
                        quantity: item.quantity,
                        price: item.price,
                    };
                }),
                customer_id: customer?.id || null,
                coupon_code: appliedCoupon?.code || null,
                customer_name: contactName,
                customer_email: email,
                customer_phone: phone,
                address: {
                    contact_name: contactName,
                    email,
                    phone,
                    address_line_1: addressLine1,
                    address_line_2: addressLine2 || "N/A",
                    suburb,
                    city,
                    state,
                    postcode: postcode || "00000",
                    country,
                    delivery_notes: deliveryNotes,
                },
                delivery_type: "courier",
                payment_method: "stripe",
                success_url: `${originUrl}/checkout/success`,
                cancel_url: `${originUrl}/checkout`,
            };

            const response: any = await api("/checkout", {
                method: "POST",
                body: JSON.stringify(orderPayload),
            });

            if (!response?.valid) {
                throw new Error(response?.error || response?.message || "Failed to initialize order checkout.");
            }

            // Clear cart & redirect to Stripe hosted checkout page or local success
            clearCart();

            if (response.checkout_url) {
                window.location.href = response.checkout_url;
            } else if (response.order_number) {
                router.push(`/checkout/success?order_number=${encodeURIComponent(response.order_number)}`);
            } else {
                throw new Error("Invalid payment gateway response.");
            }
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.error || err?.message || "An error occurred initiating Stripe gateway.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleProceedToStripeGateway} className="flex flex-col gap-10 font-sans">
            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* 1. Contact Information */}
            <section className="bg-white p-8 md:p-10 border border-dark/10 shadow-sm">
                <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold text-dark mb-8 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-[10px]">1</span>
                    Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Email Address *</label>
                        <input
                            type="email"
                            required
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Phone Number *</label>
                        <input
                            type="tel"
                            required
                            placeholder="+971 50 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Shipping Address & Zip Code */}
            <section className="bg-white p-8 md:p-10 border border-dark/10 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold text-dark flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-[10px]">2</span>
                        Shipping Address & Location
                    </h2>
                </div>

                {/* Saved Address Selector */}
                {customer && (
                    <div className="mb-8">
                        <p className="text-[10px] tracking-widest uppercase font-bold text-dark/60 mb-3">
                            Choose Saved Address or Enter New
                        </p>
                        {loadingAddresses ? (
                            <div className="p-4 text-xs text-dark/50 flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Loading saved addresses...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {savedAddresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr.id;
                                    return (
                                        <div
                                            key={addr.id}
                                            onClick={() => handleSelectAddress(addr.id)}
                                            className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                                                isSelected ? "border-dark bg-dark/5" : "border-dark/10 hover:border-dark/30 bg-white"
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] uppercase font-bold text-dark/70 tracking-wider">
                                                        {addr.label || "Address"}
                                                    </span>
                                                    {isSelected && <Check size={14} className="text-dark" />}
                                                </div>
                                                <p className="text-xs font-bold text-dark">{addr.contact_name}</p>
                                                <p className="text-xs text-dark/70 mt-1">{addr.address_line_1}</p>
                                                <p className="text-xs text-dark/60">{addr.city}, {addr.state} ({addr.postcode})</p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div
                                    onClick={() => handleSelectAddress("new")}
                                    className={`p-4 border cursor-pointer transition-all flex items-center gap-3 ${
                                        selectedAddressId === "new" ? "border-dark bg-dark/5" : "border-dashed border-dark/20 hover:border-dark/40 bg-white"
                                    }`}
                                >
                                    <Plus size={18} className="text-dark/60" />
                                    <span className="text-xs font-bold text-dark">Enter New Address</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Address Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">First Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Last Name *</label>
                        <input
                            type="text"
                            required
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Street Address *</label>
                        <input
                            type="text"
                            required
                            placeholder="Building, Street, Area"
                            value={addressLine1}
                            onChange={(e) => setAddressLine1(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Apartment / Suite (Optional)</label>
                        <input
                            type="text"
                            placeholder="Apartment, Suite, Unit Number"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">City *</label>
                        <input
                            type="text"
                            required
                            placeholder="Dubai"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Emirate / State *</label>
                        <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors appearance-none"
                        >
                            <option value="Dubai">Dubai</option>
                            <option value="Abu Dhabi">Abu Dhabi</option>
                            <option value="Sharjah">Sharjah</option>
                            <option value="Ajman">Ajman</option>
                            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                            <option value="Fujairah">Fujairah</option>
                            <option value="Umm Al Quwain">Umm Al Quwain</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Postal / Zip Code *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 92282 or 00000"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Country *</label>
                        <input
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    {customer && selectedAddressId === "new" && (
                        <div className="md:col-span-2 mt-2">
                            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-dark/80">
                                <input
                                    type="checkbox"
                                    checked={saveAddressToProfile}
                                    onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                                    className="w-4 h-4 accent-dark"
                                />
                                Save this address to my profile for future orders
                            </label>
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Delivery Method */}
            <section className="bg-white p-8 md:p-10 border border-dark/10 shadow-sm">
                <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold text-dark mb-8 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-[10px]">3</span>
                    Delivery Method
                </h2>
                <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between p-6 border-2 border-dark cursor-pointer bg-dark/5">
                        <div className="flex items-center gap-4">
                            <div className="w-5 h-5 rounded-full border-2 border-dark flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-dark" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-dark">Premium Express Delivery</span>
                                <span className="text-[10px] text-dark/60 uppercase tracking-widest font-bold">1-2 Business Days</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-dark">Complimentary</span>
                    </label>
                </div>
            </section>

            {/* 4. Payment via Hosted Stripe Gateway */}
            <section className="bg-white p-8 md:p-10 border border-dark/10 shadow-sm">
                <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold text-dark mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-[10px]">4</span>
                    Payment Method
                </h2>

                <div className="border border-dark/15 p-6 md:p-8 bg-[#F7F3F4]/50 mb-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                        <div className="flex items-center gap-3">
                            <CreditCard className="text-dark" size={24} />
                            <div>
                                <h3 className="text-sm font-bold text-dark">Stripe Hosted Gateway</h3>
                                <p className="text-xs text-dark/60">Credit/Debit Cards, Apple Pay, Google Pay, UPI & More</p>
                            </div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-emerald-300">
                            SSL Secured
                        </span>
                    </div>

                    <p className="text-xs text-dark/70 leading-relaxed">
                        When you click below, you will be securely redirected to Stripe's encrypted payment gateway to choose your preferred payment method (Card, UPI, Wallets, etc.) and complete your purchase.
                    </p>

                    <div className="flex items-center gap-4 pt-2 text-dark/60">
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                            <ShieldCheck size={16} className="text-emerald-600" /> 256-Bit Encryption
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                            <Smartphone size={16} /> Mobile & UPI Support
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#1B1315] text-[#F7F3F4] py-5 px-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#4A323A] transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Connecting to Stripe Gateway...
                        </>
                    ) : (
                        <>
                            <Lock size={16} />
                            Proceed to Stripe Payment Gateway
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </section>
        </form>
    );
}
