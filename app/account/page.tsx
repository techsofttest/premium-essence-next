"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Package, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type Summary = { total_orders: number; active_orders: number; saved_addresses_count: number; wishlist_count: number };

export default function AccountPage() {
    const { customer, loading } = useAuth();
    const [summary, setSummary] = useState<Summary | null>(null);

    useEffect(() => { if (customer) void api<Summary>("/customer/dashboard-summary").then(setSummary).catch(() => undefined); }, [customer]);

    if (!loading && !customer) return <main className="min-h-screen bg-[#F7F3F4] p-12 text-center"><Link href="/login" className="text-sm font-bold text-dark underline">Sign in to view your account</Link></main>;

    return <main className="min-h-screen bg-[#F7F3F4] py-16 px-6 md:px-12"><div className="max-w-5xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059]">My Account</p>
        <h1 className="font-serif text-4xl text-dark mt-3">Welcome, {customer?.name || ""}</h1>
        <p className="text-sm text-dark/60 mt-2">{customer?.email}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
            <Link href="/account/orders" className="bg-white border border-dark/10 p-7 hover:border-dark/30 transition-colors"><Package size={20} className="text-dark mb-5"/><p className="text-2xl font-serif text-dark">{summary?.total_orders ?? "-"}</p><p className="text-[10px] uppercase tracking-widest font-bold text-dark/60 mt-1">Orders</p></Link>
            <Link href="/account/orders" className="bg-white border border-dark/10 p-7 hover:border-dark/30 transition-colors"><Package size={20} className="text-dark mb-5"/><p className="text-2xl font-serif text-dark">{summary?.active_orders ?? "-"}</p><p className="text-[10px] uppercase tracking-widest font-bold text-dark/60 mt-1">Active Orders</p></Link>
            <Link href="/wishlist" className="bg-white border border-dark/10 p-7 hover:border-dark/30 transition-colors"><Heart size={20} className="text-dark mb-5"/><p className="text-2xl font-serif text-dark">{summary?.wishlist_count ?? "-"}</p><p className="text-[10px] uppercase tracking-widest font-bold text-dark/60 mt-1">Wishlist</p></Link>
        </div>
        <Link href="/account/addresses" className="mt-8 bg-white border border-dark/10 p-7 flex items-center justify-between hover:border-dark/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
                <MapPin size={20} className="text-dark"/>
                <div>
                    <p className="text-sm font-bold text-dark">Saved delivery addresses</p>
                    <p className="text-xs text-dark/60 mt-1">{summary?.saved_addresses_count ?? 0} saved addresses</p>
                </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-dark/50 group-hover:text-dark">Manage &rarr;</span>
        </Link>
    </div></main>;
}
