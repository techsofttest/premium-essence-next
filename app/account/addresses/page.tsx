"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, CheckCircle2, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export interface AddressItem {
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
    is_default_billing?: boolean;
}

const DEFAULT_FORM_DATA = {
    label: "Home",
    contact_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    suburb: "",
    city: "",
    state: "",
    postcode: "",
    country: "United Arab Emirates",
};

export default function AccountAddressesPage() {
    const { customer, loading: authLoading } = useAuth();
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const data = await api<AddressItem[]>("/customer/addresses");
            setAddresses(data || []);
        } catch {
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customer) {
            void fetchAddresses();
        }
    }, [customer]);

    const openAddModal = () => {
        setEditingAddress(null);
        setFormData({
            ...DEFAULT_FORM_DATA,
            contact_name: customer?.name || "",
            phone: customer?.phone || "",
        });
        setErrorMsg(null);
        setModalOpen(true);
    };

    const openEditModal = (addr: AddressItem) => {
        setEditingAddress(addr);
        setFormData({
            label: addr.label || "Home",
            contact_name: addr.contact_name || "",
            phone: addr.phone || "",
            address_line_1: addr.address_line_1 || "",
            address_line_2: addr.address_line_2 || "",
            suburb: addr.suburb || "",
            city: addr.city || "",
            state: addr.state || "",
            postcode: addr.postcode || "",
            country: addr.country || "Australia",
        });
        setErrorMsg(null);
        setModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg(null);

        try {
            if (editingAddress) {
                await api(`/customer/addresses/${editingAddress.id}`, {
                    method: "PUT",
                    body: JSON.stringify(formData),
                });
            } else {
                await api("/customer/addresses", {
                    method: "POST",
                    body: JSON.stringify(formData),
                });
            }
            setModalOpen(false);
            await fetchAddresses();
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || err?.message || "Failed to save address.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await api(`/customer/addresses/${id}`, { method: "DELETE" });
            await fetchAddresses();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Cannot delete default address.");
        }
    };

    const handleSetDefault = async (id: number, type: "shipping" | "billing") => {
        try {
            await api(`/customer/addresses/${id}/default-${type}`, { method: "POST" });
            await fetchAddresses();
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to set default address.");
        }
    };

    if (!authLoading && !customer) {
        return (
            <main className="min-h-screen bg-[#F7F3F4] p-12 text-center">
                <p className="text-dark/70 mb-4">Please sign in to manage your addresses.</p>
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059]">Address Book</p>
                        <h1 className="font-serif text-3xl md:text-4xl text-dark mt-1">Saved Delivery Addresses</h1>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 bg-[#1B1315] text-[#F7F3F4] px-6 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#4A323A] transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Add New Address
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white border border-dark/10 p-12 text-center text-dark/60 flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={20} /> Loading addresses...
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="bg-white border border-dark/10 p-12 text-center">
                        <MapPin size={32} className="mx-auto text-dark/30 mb-3" />
                        <p className="font-serif text-xl text-dark">No saved addresses yet</p>
                        <p className="text-xs text-dark/60 mt-1 mb-6">Add an address to make your checkout faster and effortless.</p>
                        <button
                            onClick={openAddModal}
                            className="bg-[#1B1315] text-[#F7F3F4] px-8 py-3 text-xs tracking-widest uppercase font-bold hover:bg-[#4A323A] transition-colors"
                        >
                            Add Address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="bg-white border border-dark/10 p-6 flex flex-col justify-between relative group hover:border-dark/30 transition-all">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-xs uppercase font-bold tracking-widest bg-dark/5 px-2.5 py-1 text-dark/80">
                                            {addr.label || "Address"}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {addr.is_default_shipping && (
                                                <span className="text-[9px] uppercase tracking-wider font-bold bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 border border-[#C5A059]/30">
                                                    Default Shipping
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-dark text-base">{addr.contact_name}</h3>
                                    <p className="text-xs text-dark/70 mt-1">{addr.phone}</p>
                                    <p className="text-xs text-dark/80 mt-3 leading-relaxed">
                                        {addr.address_line_1}
                                        {addr.address_line_2 ? `, ${addr.address_line_2}` : ""}
                                        <br />
                                        {addr.suburb ? `${addr.suburb}, ` : ""}
                                        {addr.city}, {addr.state} {addr.postcode}
                                        <br />
                                        {addr.country}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-dark/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {!addr.is_default_shipping && (
                                            <button
                                                onClick={() => handleSetDefault(addr.id, "shipping")}
                                                className="text-[10px] uppercase font-bold text-dark/60 hover:text-dark transition-colors"
                                            >
                                                Set Default
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openEditModal(addr)}
                                            className="p-1.5 text-dark/60 hover:text-dark transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(addr.id)}
                                            className="p-1.5 text-red-500/70 hover:text-red-700 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto font-sans shadow-xl border border-dark/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-2xl text-dark">
                                {editingAddress ? "Edit Address" : "Add New Address"}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-dark/50 hover:text-dark text-xl font-bold">
                                &times;
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Label (e.g. Home, Work)</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    placeholder="Home"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Full Contact Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contact_name}
                                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                        className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Phone Number *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Street Address *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address_line_1}
                                    onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                                    className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    placeholder="123 Luxury Lane"
                                />
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Apartment, Suite, Unit (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.address_line_2}
                                    onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                                    className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    placeholder="Apt 4B"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">State *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Postcode *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.postcode}
                                        onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                        className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold uppercase tracking-wider text-dark/70 mb-1">Country *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full border border-dark/20 p-3 outline-none focus:border-dark"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-dark/10">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-dark/60 hover:text-dark"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#1B1315] text-[#F7F3F4] px-7 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#4A323A] transition-colors flex items-center gap-2"
                                >
                                    {submitting && <Loader2 className="animate-spin" size={14} />}
                                    {editingAddress ? "Update Address" : "Save Address"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
