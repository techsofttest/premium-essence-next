"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Check, Loader2, AlertCircle, CreditCard, Lock, ArrowRight, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import MarketplaceLogos from "@/components/ui/MarketplaceLogos";

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

const POPULAR_COUNTRIES = [
    { code: "AE", name: "United Arab Emirates" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "KW", name: "Kuwait" },
    { code: "QA", name: "Qatar" },
    { code: "OM", name: "Oman" },
    { code: "BH", name: "Bahrain" },
];

export default function CheckoutForm() {
    const router = useRouter();
    const { customer } = useAuth();
    const {
        cartItems,
        appliedCoupon,
        clearCart,
        validateCartStock,
        shippingFee,
        shippingLabel,
        isShippingLoading,
        updateDeliveryAddress
    } = useCart();

    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
    const [saveAddressToProfile, setSaveAddressToProfile] = useState<boolean>(true);
    const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);

    // Terms & Conditions Acceptance State
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
    const [termsError, setTermsError] = useState<boolean>(false);

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
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

    // Billing Address State
    const [billingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(true);
    const [billingFirstName, setBillingFirstName] = useState("");
    const [billingLastName, setBillingLastName] = useState("");
    const [billingPhone, setBillingPhone] = useState("");
    const [billingAddressLine1, setBillingAddressLine1] = useState("");
    const [billingAddressLine2, setBillingAddressLine2] = useState("");
    const [billingCity, setBillingCity] = useState("Dubai");
    const [billingState, setBillingState] = useState("Dubai");
    const [billingPostcode, setBillingPostcode] = useState("00000");
    const [billingCountry, setBillingCountry] = useState("United Arab Emirates");

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
        const selectedCountry = addr.country || "United Arab Emirates";
        setCountry(selectedCountry);
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
            setCountry("United Arab Emirates");
        } else {
            const found = savedAddresses.find((a) => a.id === id);
            if (found) applySavedAddress(found);
        }
    };

    // Synchronize shipping calculation whenever delivery address inputs change
    useEffect(() => {
        updateDeliveryAddress({
            country,
            city,
            state,
            postcode,
        });
    }, [country, city, state, postcode, updateDeliveryAddress]);

    const handleProceedToStripeGateway = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setTermsError(false);

        const contactName = `${firstName} ${lastName}`.trim();
        if (!email || !firstName || !addressLine1 || !city || !state || !postcode) {
            setErrorMessage("Please fill out all required contact and shipping address fields (including postcode).");
            return;
        }

        if (!cartItems.length) {
            setErrorMessage("Your cart is empty. Please add items before checking out.");
            return;
        }

        if (!acceptTerms) {
            setTermsError(true);
            setErrorMessage("Please read and accept the Terms & Conditions to proceed with your order.");
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
                billing_same_as_shipping: billingSameAsShipping,
                delivery_details: {
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
                billing_details: billingSameAsShipping ? {
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
                } : {
                    contact_name: `${billingFirstName} ${billingLastName}`.trim() || contactName,
                    email,
                    phone: billingPhone || phone,
                    address_line_1: billingAddressLine1,
                    address_line_2: billingAddressLine2 || "N/A",
                    city: billingCity,
                    state: billingState,
                    postcode: billingPostcode || "00000",
                    country: billingCountry,
                },
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
                payment_method: paymentMethod,
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
                                            className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${isSelected ? "border-dark bg-dark/5" : "border-dark/10 hover:border-dark/30 bg-white"
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
                                    className={`p-4 border cursor-pointer transition-all flex items-center gap-3 ${selectedAddressId === "new" ? "border-dark bg-dark/5" : "border-dashed border-dark/20 hover:border-dark/40 bg-white"
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
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Emirate / State / Province *</label>
                        {(country.toLowerCase().includes("united arab") || country.toLowerCase() === "uae" || country.toLowerCase() === "ae") ? (
                            <select
                                value={state}
                                onChange={(e) => {
                                    setState(e.target.value);
                                    setCity(e.target.value);
                                }}
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
                        ) : (
                            <input
                                type="text"
                                required
                                placeholder="Province / State / Region"
                                value={state}
                                onChange={(e) => {
                                    setState(e.target.value);
                                    setCity(e.target.value);
                                }}
                                className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Postal / Zip Code *</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 12345 or 00000"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Country *</label>
                        <select
                            value={POPULAR_COUNTRIES.some(c => c.name.toLowerCase() === country.toLowerCase()) ? (POPULAR_COUNTRIES.find(c => c.name.toLowerCase() === country.toLowerCase())?.name || country) : "Other"}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val !== "Other") {
                                    setCountry(val);
                                    if (val === "United Arab Emirates") {
                                        setState("Dubai");
                                        setCity("Dubai");
                                    } else if (val === "Saudi Arabia") {
                                        setState("Riyadh");
                                        setCity("Riyadh");
                                    } else if (val === "Kuwait") {
                                        setState("Kuwait City");
                                        setCity("Kuwait City");
                                    } else if (val === "Qatar") {
                                        setState("Doha");
                                        setCity("Doha");
                                    } else if (val === "Oman") {
                                        setState("Muscat");
                                        setCity("Muscat");
                                    } else if (val === "Bahrain") {
                                        setState("Manama");
                                        setCity("Manama");
                                    }
                                } else {
                                    setCountry("");
                                }
                            }}
                            className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors appearance-none"
                        >
                            {POPULAR_COUNTRIES.map((c) => (
                                <option key={c.code} value={c.name}>
                                    {c.name} {c.code === "AE" ? "(UAE)" : c.code === "SA" ? "(KSA)" : ""}
                                </option>
                            ))}
                            <option value="Other">Other International Country...</option>
                        </select>
                        {(!POPULAR_COUNTRIES.some(c => c.name.toLowerCase() === country.toLowerCase())) && (
                            <input
                                type="text"
                                required
                                placeholder="Enter Country Name (e.g. Jordan, Egypt)"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors mt-2"
                            />
                        )}
                    </div>

                    {customer && selectedAddressId === "new" && (
                        <div className="md:col-span-2 mt-2">
                            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-dark/80 select-none">
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

                {/* Live Delivery Rate Calculation Overview */}
                <div className="mt-8 p-4 md:p-5 bg-[#F7F3F4]/90 border border-dark/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-white border border-dark/10 flex items-center justify-center shrink-0">
                            <Truck className="text-[#C5A059]" size={20} />
                        </div>
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-dark flex items-center gap-2">
                                <span>{shippingLabel || "Calculated Delivery Rate"}</span>
                                {isShippingLoading && <Loader2 size={12} className="animate-spin text-dark/40" />}
                            </div>
                            <div className="text-[10px] text-dark/60 font-medium">
                                Destination: {city || "Dubai"}, {country} {postcode ? `(${postcode})` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="text-right sm:self-auto self-end">
                        {isShippingLoading ? (
                            <span className="text-xs text-dark/50 italic flex items-center gap-1.5">
                                <Loader2 size={12} className="animate-spin" /> Calculating rate...
                            </span>
                        ) : shippingFee === 0 ? (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 border border-emerald-300 uppercase tracking-wider">
                                FREE Delivery
                            </span>
                        ) : (
                            <div className="flex flex-col items-end">
                                <span className="font-serif text-lg font-bold text-dark">
                                    AED {shippingFee.toFixed(2).replace(/\.00$/, '')}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold">
                                    Live Courier Rate
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Billing Address Checkbox Toggle */}
                <div className="mt-8 pt-6 border-t border-dark/10">
                    <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-dark select-none">
                        <input
                            type="checkbox"
                            checked={billingSameAsShipping}
                            onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                            className="w-4 h-4 accent-dark"
                        />
                        <span>Billing address is same as shipping address</span>
                    </label>
                </div>

                {/* Separate Billing Address Input Fields */}
                {!billingSameAsShipping && (
                    <div className="mt-6 pt-6 border-t border-dark/10 flex flex-col gap-6">
                        <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-dark/70">
                            Billing Address Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing First Name *</label>
                                <input
                                    type="text"
                                    required={!billingSameAsShipping}
                                    placeholder="First Name"
                                    value={billingFirstName}
                                    onChange={(e) => setBillingFirstName(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Last Name *</label>
                                <input
                                    type="text"
                                    required={!billingSameAsShipping}
                                    placeholder="Last Name"
                                    value={billingLastName}
                                    onChange={(e) => setBillingLastName(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Phone *</label>
                                <input
                                    type="tel"
                                    required={!billingSameAsShipping}
                                    placeholder="+971 50 123 4567"
                                    value={billingPhone}
                                    onChange={(e) => setBillingPhone(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Street Address *</label>
                                <input
                                    type="text"
                                    required={!billingSameAsShipping}
                                    placeholder="Building, Street, Area"
                                    value={billingAddressLine1}
                                    onChange={(e) => setBillingAddressLine1(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Apartment / Suite (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Apartment, Suite, Unit Number"
                                    value={billingAddressLine2}
                                    onChange={(e) => setBillingAddressLine2(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing City *</label>
                                <input
                                    type="text"
                                    required={!billingSameAsShipping}
                                    placeholder="Dubai"
                                    value={billingCity}
                                    onChange={(e) => setBillingCity(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Emirate / State *</label>
                                <select
                                    value={billingState}
                                    onChange={(e) => setBillingState(e.target.value)}
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
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Postal / Zip Code *</label>
                                <input
                                    type="text"
                                    required={!billingSameAsShipping}
                                    placeholder="e.g. 92282 or 00000"
                                    value={billingPostcode}
                                    onChange={(e) => setBillingPostcode(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] tracking-widest uppercase font-bold text-dark/80">Billing Country *</label>
                                <input
                                    type="text"
                                    required={!billingSameAsShipping}
                                    value={billingCountry}
                                    onChange={(e) => setBillingCountry(e.target.value)}
                                    className="w-full bg-[#F7F3F4] border border-dark/10 p-4 text-sm text-dark outline-none focus:border-dark transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                )}
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

            {/* 4. Payment Method Selection */}
            <section className="bg-white p-8 md:p-10 border border-dark/10 shadow-sm">
                <h2 className="text-[11px] tracking-[0.3em] uppercase font-bold text-dark mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-[10px]">4</span>
                    Select Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Stripe Card Option */}
                    <div
                        onClick={() => setPaymentMethod("stripe")}
                        className={`p-5 border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${paymentMethod === "stripe"
                            ? "border-dark bg-dark/5 shadow-xs"
                            : "border-dark/10 bg-white hover:border-dark/30"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <CreditCard size={22} className="text-dark" />
                                <div>
                                    <h3 className="text-xs font-bold text-dark uppercase tracking-wider">Pay Online (Stripe)</h3>
                                    <p className="text-[10px] text-dark/60 mt-0.5">Cards, Apple Pay, Google Pay & Wallets</p>
                                </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "stripe" ? "border-dark" : "border-dark/30"}`}>
                                {paymentMethod === "stripe" && <div className="w-2 h-2 rounded-full bg-dark" />}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 border border-emerald-200 w-fit">
                            <ShieldCheck size={13} /> Instant Confirmation
                        </div>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div
                        onClick={() => setPaymentMethod("cod")}
                        className={`p-5 border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${paymentMethod === "cod"
                            ? "border-dark bg-dark/5 shadow-xs"
                            : "border-dark/10 bg-white hover:border-dark/30"
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px] tracking-wider border border-amber-300">
                                    COD
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-dark uppercase tracking-wider">Cash on Delivery</h3>
                                    <p className="text-[10px] text-dark/60 mt-0.5">Pay with cash upon courier delivery</p>
                                </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-dark" : "border-dark/30"}`}>
                                {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-dark" />}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-amber-800 font-bold bg-amber-50 px-2.5 py-1 border border-amber-200 w-fit">
                            <MapPin size={13} /> Pay on Doorstep
                        </div>
                    </div>
                </div>

                <div className="border border-dark/15 p-6 md:p-8 bg-[#F7F3F4]/50 mb-8 space-y-4">
                    {paymentMethod === "stripe" ? (
                        <>
                            <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-dark" size={24} />
                                    <div>
                                        <h3 className="text-sm font-bold text-dark">Stripe Hosted Gateway</h3>
                                        <p className="text-xs text-dark/60">Credit/Debit Cards, Apple Pay, Google Pay & More</p>
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-emerald-300">
                                    SSL Secured
                                </span>
                            </div>
                            <p className="text-xs text-dark/70 leading-relaxed">
                                When you click below, you will be securely redirected to Stripe's encrypted payment gateway to choose your preferred card or wallet method and complete your purchase.
                            </p>
                            <div className="flex items-center gap-4 pt-2 text-dark/60">
                                <div className="flex items-center gap-1 text-[11px] font-bold">
                                    <ShieldCheck size={16} className="text-emerald-600" /> 256-Bit SSL Encryption
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-bold">
                                    <Smartphone size={16} /> Apple & Google Pay Support
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between border-b border-dark/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs border border-amber-300">
                                        COD
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-dark">Cash on Doorstep Delivery</h3>
                                        <p className="text-xs text-dark/60">Pay cash directly to the courier agent upon arrival</p>
                                    </div>
                                </div>
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-amber-300">
                                    No Online Payment Required
                                </span>
                            </div>
                            <p className="text-xs text-dark/70 leading-relaxed">
                                Your order will be registered in our system and dispatched immediately. Please prepare the exact cash amount in AED to hand over to the courier courier upon delivery.
                            </p>
                        </>
                    )}
                </div>

                {/* Terms & Conditions Agreement Checkbox */}
                <div className="mb-6 pt-6 border-t border-dark/10">
                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => {
                                setAcceptTerms(e.target.checked);
                                if (e.target.checked) setTermsError(false);
                            }}
                            className="w-4 h-4 mt-0.5 accent-dark shrink-0 cursor-pointer"
                        />
                        <span className="text-xs text-dark/80 group-hover:text-dark transition-colors leading-relaxed">
                            I have read and agree to the{" "}
                            <Link
                                href="/terms-and-conditions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-dark underline underline-offset-2 hover:text-[#C5A059] transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                            <span className="text-rose-500 font-bold ml-1">*</span>
                        </span>
                    </label>
                    {termsError && (
                        <p className="text-xs text-rose-600 font-semibold mt-2.5 flex items-center gap-1.5 pl-7">
                            <AlertCircle size={14} className="shrink-0" />
                            You must accept the Terms & Conditions to proceed with your order.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-[#1B1315] text-[#F7F3F4] py-5 px-8 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#4A323A] transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            {paymentMethod === "stripe" ? "Connecting to Stripe Gateway..." : "Placing Order with Cash on Delivery..."}
                        </>
                    ) : paymentMethod === "stripe" ? (
                        <>
                            <Lock size={16} />
                            Proceed to Stripe Payment Gateway
                            <ArrowRight size={16} />
                        </>
                    ) : (
                        <>
                            <Check size={16} />
                            Place Order with Cash on Delivery
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>

                {/* Also Available On Marketplace Trust Section */}
                <div className="mt-8">
                    <MarketplaceLogos variant="checkout" />
                </div>
            </section>
        </form>
    );
}
