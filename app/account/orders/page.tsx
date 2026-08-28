"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Search, MapPin, Truck, ChevronDown, ChevronUp, ArrowRight, Loader2, ArrowLeft, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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

interface AccountOrder {
    id: number;
    order_number: string;
    date: string;
    status: string;
    payment_status: string;
    payment_method?: string;
    subtotal?: number;
    shipping_cost?: number;
    discount?: number;
    grand_total: number;
    items_count?: number;
    billing_same_as_shipping?: boolean;
    shipping_address?: {
        name?: string;
        phone?: string;
        street?: string;
        city?: string;
        state?: string;
        postcode?: string;
        country?: string;
    };
    billing_address?: {
        name?: string;
        phone?: string;
        street?: string;
        city?: string;
        state?: string;
        postcode?: string;
        country?: string;
    };
    items?: OrderItem[];
}

export default function AccountOrdersPage() {
    const { customer, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<AccountOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("all"); // Default filter: All orders
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (activeTab && activeTab !== "all") {
                if (activeTab === "paid") {
                    queryParams.set("payment_status", "paid");
                } else {
                    queryParams.set("status", activeTab);
                }
            }
            if (searchQuery) {
                queryParams.set("search", searchQuery);
            }

            const data = await api<AccountOrder[]>(`/customer/orders?${queryParams.toString()}`);
            setOrders(data || []);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customer) {
            void fetchOrders();
        }
    }, [customer, activeTab, searchQuery]);

    const toggleExpand = (id: number) => {
        setExpandedOrderId((prev) => (prev === id ? null : id));
    };

    if (!authLoading && !customer) {
        return (
            <main className="min-h-screen bg-[#F7F3F4] p-12 text-center">
                <p className="text-dark/70 mb-4">Please sign in to view your orders.</p>
                <Link href="/login" className="text-sm font-bold text-dark underline">
                    Sign in to your account
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F3F4] py-16 px-6 md:px-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <Link href="/account" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-dark/50 hover:text-dark mb-6 transition-colors">
                    <ArrowLeft size={14} /> Back to Account
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059]">Order History</p>
                        <h1 className="font-serif text-3xl md:text-4xl text-dark mt-1">My Orders</h1>
                    </div>
                    <Link
                        href="/track-order"
                        className="inline-flex items-center justify-center gap-2 border border-dark/20 bg-white text-dark px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-dark hover:text-white transition-colors"
                    >
                        <Truck size={16} /> Track Any Order
                    </Link>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white border border-dark/10 p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                        <button
                            onClick={() => setActiveTab("paid")}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                activeTab === "paid" ? "bg-dark text-white" : "bg-[#F7F3F4] text-dark/70 hover:text-dark"
                            }`}
                        >
                            Paid (Completed)
                        </button>
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                activeTab === "all" ? "bg-dark text-white" : "bg-[#F7F3F4] text-dark/70 hover:text-dark"
                            }`}
                        >
                            All Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("confirmed")}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                activeTab === "confirmed" ? "bg-dark text-white" : "bg-[#F7F3F4] text-dark/70 hover:text-dark"
                            }`}
                        >
                            Confirmed
                        </button>
                        <button
                            onClick={() => setActiveTab("out_for_delivery")}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                activeTab === "out_for_delivery" ? "bg-dark text-white" : "bg-[#F7F3F4] text-dark/70 hover:text-dark"
                            }`}
                        >
                            Out for Delivery
                        </button>
                        <button
                            onClick={() => setActiveTab("delivered")}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                activeTab === "delivered" ? "bg-dark text-white" : "bg-[#F7F3F4] text-dark/70 hover:text-dark"
                            }`}
                        >
                            Delivered
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search order # or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#F7F3F4] border border-dark/10 pl-9 pr-4 py-2 text-xs text-dark outline-none focus:border-dark"
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-dark/40" />
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="bg-white border border-dark/10 p-12 text-center text-dark/60 flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={20} /> Fetching orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-16 text-center">
                        <Package size={36} className="mx-auto text-dark/30 mb-4" />
                        <p className="font-serif text-2xl text-dark">No orders found</p>
                        <p className="text-xs text-dark/60 mt-1 mb-6">
                            {activeTab === "paid" ? "You have no completed paid orders yet." : "No orders matching your criteria."}
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block bg-[#1B1315] text-[#F7F3F4] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4A323A] transition-colors"
                        >
                            Explore Fragrances
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const isExpanded = expandedOrderId === order.id;
                            const isPaid = order.payment_status === "paid";

                            return (
                                <div key={order.id} className="bg-white border border-dark/10 shadow-sm transition-all overflow-hidden">
                                    {/* Order Card Header */}
                                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="font-serif text-xl font-bold text-dark">{order.order_number}</span>
                                                <span className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 border ${
                                                    isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    Payment: {order.payment_status}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-wider font-bold bg-dark/5 text-dark/80 px-2.5 py-1 border border-dark/10">
                                                    Status: {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-dark/60">Placed on {order.date}</p>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-dark/5">
                                            <div className="text-left md:text-right">
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-dark/50 block">Total</span>
                                                <span className="font-serif text-xl text-dark">{order.grand_total.toFixed(2)} AED</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/track-order?order_number=${encodeURIComponent(order.order_number)}&email=${encodeURIComponent(customer?.email || "")}`}
                                                    className="bg-dark text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-[#4A323A] transition-colors flex items-center gap-1.5"
                                                >
                                                    <Truck size={12} /> Track
                                                </Link>
                                                <button
                                                    onClick={() => toggleExpand(order.id)}
                                                    className="p-2 border border-dark/10 hover:border-dark text-dark/70 hover:text-dark transition-colors"
                                                    title="Toggle Details"
                                                >
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="px-6 md:px-8 pb-6 bg-[#F7F3F4]/50 border-t border-dark/5 pt-4">
                                            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3 shrink-0 bg-white p-2.5 border border-dark/10 max-w-[240px]">
                                                        <div className="relative w-10 h-12 bg-[#F7F3F4] shrink-0 border border-dark/5">
                                                            <Image
                                                                src={item.image || "/logo/logo-black.png"}
                                                                alt={item.name}
                                                                fill
                                                                unoptimized
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    if (target) target.src = "/logo/logo-black.png";
                                                                }}
                                                                className="object-contain p-0.5"
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-dark truncate">{item.name}</p>
                                                            {item.variant_details && (
                                                                <p className="text-[10px] text-[#C5A059] font-semibold tracking-wide truncate">
                                                                    {item.variant_details}
                                                                </p>
                                                            )}
                                                            <p className="text-[10px] text-dark/60">Qty: {item.quantity} &bull; {item.line_total} AED</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expanded Details Panel */}
                                    {isExpanded && (
                                        <div className="p-6 md:p-8 bg-white border-t border-dark/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-dark">
                                            {/* Shipping Address */}
                                            <div className="p-4 bg-[#F7F3F4] border border-dark/5">
                                                <h4 className="text-[10px] uppercase font-bold tracking-wider text-dark/70 mb-2">Shipping Address</h4>
                                                <p className="font-bold">{order.shipping_address?.name || customer?.name}</p>
                                                <p className="text-dark/80 mt-1">{order.shipping_address?.street}</p>
                                                <p className="text-dark/70">{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postcode}</p>
                                                <p className="text-dark/70">{order.shipping_address?.country}</p>
                                                {order.shipping_address?.phone && <p className="text-dark/60 mt-1">Tel: {order.shipping_address.phone}</p>}
                                            </div>

                                            {/* Billing Address */}
                                            <div className="p-4 bg-[#F7F3F4] border border-dark/5">
                                                <h4 className="text-[10px] uppercase font-bold tracking-wider text-dark/70 mb-2">Billing Address</h4>
                                                {order.billing_same_as_shipping || !order.billing_address?.street ? (
                                                    <p className="italic text-dark/60">Same as Shipping Address</p>
                                                ) : (
                                                    <>
                                                        <p className="font-bold">{order.billing_address.name || customer?.name}</p>
                                                        <p className="text-dark/80 mt-1">{order.billing_address.street}</p>
                                                        <p className="text-dark/70">{order.billing_address.city}, {order.billing_address.state} {order.billing_address.postcode}</p>
                                                        <p className="text-dark/70">{order.billing_address.country}</p>
                                                        {order.billing_address.phone && <p className="text-dark/60 mt-1">Tel: {order.billing_address.phone}</p>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
