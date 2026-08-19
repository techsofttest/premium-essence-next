"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
    id: string;
    brand: string;
    name: string;
    price: number;
    size: string;
    image: string;
    quantity: number;
    stock?: number;
    cartItemId?: string;
    productId?: number;
    variantId?: number;
    dealSlug?: string;
    isDeal?: boolean;
}

export interface AppliedCoupon {
    code: string;
    discount: number;
    type?: number;
    amount?: number;
    name?: string;
}

export interface ShippingSettingsConfig {
    default_shipping_fee: number;
    free_shipping_threshold: number;
    is_enabled: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, delta: number) => void;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    selectedProduct: any | null;
    setSelectedProduct: (product: any) => void;
    appliedCoupon: AppliedCoupon | null;
    applyCoupon: (code: string, subtotal: number) => Promise<{ success: boolean; message: string }>;
    removeCoupon: () => void;
    validateCartStock: () => Promise<{ valid: boolean; errors: string[] }>;
    clearCart: () => void;
    shippingSettings: ShippingSettingsConfig;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { customer } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [shippingSettings, setShippingSettings] = useState<ShippingSettingsConfig>({
        default_shipping_fee: 20,
        free_shipping_threshold: 200,
        is_enabled: true,
    });

    // Fetch dynamic shipping settings from backend home API
    useEffect(() => {
        api<any>("/storefront/home")
            .then((data) => {
                if (data?.shipping_settings) {
                    setShippingSettings(data.shipping_settings);
                }
            })
            .catch(() => undefined);
    }, []);

    // Initial load from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem("premium_essence_cart");
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch {
                setCartItems([]);
            }
        }
        const savedCoupon = localStorage.getItem("premium_essence_coupon");
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch {
                setAppliedCoupon(null);
            }
        }
    }, []);

    // Sync from DB if customer is authenticated, while merging local guest items & preserving deals
    useEffect(() => {
        if (!customer) return;

        const savedCartStr = localStorage.getItem("premium_essence_cart");
        let localCart: CartItem[] = [];
        if (savedCartStr) {
            try {
                localCart = JSON.parse(savedCartStr);
            } catch {
                localCart = [];
            }
        }

        void api<CartItem[]>("/customer/cart")
            .then(async (serverItems) => {
                if (Array.isArray(serverItems)) {
                    let mergedCart = [...serverItems];

                    // Transfer unSynced guest products to DB cart
                    const unSyncedGuestProducts = localCart.filter(localItem => 
                        localItem.productId && 
                        localItem.variantId && 
                        !serverItems.some(s => s.productId === localItem.productId && s.variantId === localItem.variantId)
                    );

                    for (const guestItem of unSyncedGuestProducts) {
                        try {
                            const res = await api<CartItem[]>("/customer/cart/items", {
                                method: "POST",
                                body: JSON.stringify({
                                    product_id: guestItem.productId,
                                    variant_id: guestItem.variantId,
                                    quantity: guestItem.quantity,
                                }),
                            });
                            if (Array.isArray(res)) {
                                mergedCart = res;
                            }
                        } catch {
                            // ignore errors
                        }
                    }

                    // Preserve local deal / collection items
                    const localDeals = localCart.filter(item => item.isDeal || (typeof item.id === "string" && item.id.startsWith("deal-")));
                    for (const dealItem of localDeals) {
                        if (!mergedCart.some(m => m.id === dealItem.id)) {
                            mergedCart.push(dealItem);
                        }
                    }

                    setCartItems(mergedCart);
                    try {
                        localStorage.setItem("premium_essence_cart", JSON.stringify(mergedCart));
                    } catch {
                        // ignore storage errors
                    }
                }
            })
            .catch(() => undefined);
    }, [customer]);

    // Save cart state helper
    const saveCartState = (newCart: CartItem[]) => {
        setCartItems(newCart);
        localStorage.setItem("premium_essence_cart", JSON.stringify(newCart));
    };

    // Helper to merge server cart items while retaining local deal items
    const mergeServerItemsWithDeals = (serverItems: CartItem[], currentCartItems: CartItem[]): CartItem[] => {
        const localDeals = currentCartItems.filter(item => item.isDeal || (typeof item.id === "string" && item.id.startsWith("deal-")));
        const merged = [...serverItems];
        for (const dealItem of localDeals) {
            if (!merged.some(m => m.id === dealItem.id)) {
                merged.push(dealItem);
            }
        }
        return merged;
    };

    const addToCart = (newItem: CartItem) => {
        const existingIndex = cartItems.findIndex(item => item.id === newItem.id && item.size === newItem.size);
        let updated: CartItem[];
        if (existingIndex > -1) {
            updated = cartItems.map((item, idx) =>
                idx === existingIndex
                    ? { ...item, quantity: item.quantity + newItem.quantity, stock: newItem.stock ?? item.stock }
                    : item
            );
        } else {
            updated = [newItem, ...cartItems];
        }
        saveCartState(updated);

        setIsModalOpen(false);
        setIsDrawerOpen(true);

        if (customer && newItem.productId && newItem.variantId) {
            void api<CartItem[]>("/customer/cart/items", {
                method: "POST",
                body: JSON.stringify({
                    product_id: newItem.productId,
                    variant_id: newItem.variantId,
                    quantity: newItem.quantity,
                }),
            })
                .then((items) => {
                    if (Array.isArray(items)) saveCartState(mergeServerItemsWithDeals(items, updated));
                })
                .catch(() => undefined);
        }
    };

    const removeFromCart = (id: string, size: string) => {
        const targetItem = cartItems.find((item) => item.id === id && item.size === size);
        const updated = cartItems.filter((item) => !(item.id === id && item.size === size));
        saveCartState(updated);

        if (customer) {
            const cartItemId = targetItem?.cartItemId;
            if (cartItemId) {
                void api<CartItem[]>(`/customer/cart/items/${cartItemId}`, { method: "DELETE" })
                    .then((items) => {
                        if (Array.isArray(items)) saveCartState(mergeServerItemsWithDeals(items, updated));
                    })
                    .catch(() => undefined);
            } else {
                void api<CartItem[]>("/customer/cart")
                    .then((items) => {
                        if (Array.isArray(items)) saveCartState(mergeServerItemsWithDeals(items, updated));
                    })
                    .catch(() => undefined);
            }
        }
    };

    const updateQuantity = (id: string, size: string, delta: number) => {
        const targetItem = cartItems.find((item) => item.id === id && item.size === size);
        if (!targetItem) return;
        const newQuantity = Math.max(1, targetItem.quantity + delta);

        const updated = cartItems.map((item) =>
            item.id === id && item.size === size
                ? { ...item, quantity: newQuantity }
                : item
        );
        saveCartState(updated);

        if (customer && targetItem.cartItemId) {
            void api<CartItem[]>(`/customer/cart/items/${targetItem.cartItemId}`, {
                method: "PUT",
                body: JSON.stringify({ quantity: newQuantity }),
            })
                .then((items) => {
                    if (Array.isArray(items)) saveCartState(mergeServerItemsWithDeals(items, updated));
                })
                .catch(() => undefined);
        }
    };

    const validateCartStock = async (): Promise<{ valid: boolean; errors: string[] }> => {
        const errors: string[] = [];
        try {
            const res = await api<{
                valid: boolean;
                stock_issues: Array<{ id: string; name: string; message: string; available_stock: number }>;
                stock_map: Record<string, number>;
            }>("/cart/validate-stock", {
                method: "POST",
                body: JSON.stringify({
                    cart: cartItems.map((item) => ({
                        id: item.id,
                        product_id: item.productId || item.id,
                        variant_id: item.variantId || null,
                        quantity: item.quantity,
                        name: item.name,
                    })),
                }),
            });

            if (res && Array.isArray(res.stock_issues)) {
                const apiErrors = res.stock_issues.map((issue) => issue.message);
                if (res.stock_map) {
                    const updated = cartItems.map((item) => {
                        const vStock = item.variantId ? res.stock_map[item.variantId] : undefined;
                        const pStock = res.stock_map[`p_${item.productId || item.id}`];
                        const freshStock = vStock !== undefined ? vStock : pStock;
                        return freshStock !== undefined ? { ...item, stock: freshStock } : item;
                    });
                    saveCartState(updated);
                }
                return { valid: res.valid, errors: apiErrors };
            }
        } catch {
            // Fallback to local stock check if API fails
        }

        for (const item of cartItems) {
            if (item.stock !== undefined && item.stock !== null) {
                if (item.stock <= 0) {
                    errors.push(`"${item.name} (${item.size})" is currently out of stock.`);
                } else if (item.quantity > item.stock) {
                    errors.push(`"${item.name} (${item.size})" has only ${item.stock} left in stock (Requested: ${item.quantity}).`);
                }
            }
        }
        return { valid: errors.length === 0, errors };
    };

    const applyCoupon = async (code: string, subtotal: number): Promise<{ success: boolean; message: string }> => {
        try {
            const res = await api<{
                valid: boolean;
                message: string;
                discount: number;
                coupon?: { coupon_code: string; coupon_type: number; coupon_amount: number; coupon_name?: string };
            }>("/coupons/validate", {
                method: "POST",
                body: JSON.stringify({ coupon_code: code, subtotal: subtotal }),
            });

            if (res.valid) {
                const couponData: AppliedCoupon = {
                    code: res.coupon?.coupon_code || code,
                    discount: res.discount,
                    type: res.coupon?.coupon_type,
                    amount: res.coupon?.coupon_amount,
                    name: res.coupon?.coupon_name,
                };
                setAppliedCoupon(couponData);
                localStorage.setItem("premium_essence_coupon", JSON.stringify(couponData));
                return { success: true, message: res.message || "Coupon applied successfully" };
            } else {
                return { success: false, message: res.message || "Invalid coupon code" };
            }
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed to validate coupon code" };
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        localStorage.removeItem("premium_essence_coupon");
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedCoupon(null);
        localStorage.removeItem("cart");
        localStorage.removeItem("premium_essence_coupon");
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            isDrawerOpen,
            setIsDrawerOpen,
            isModalOpen,
            setIsModalOpen,
            selectedProduct,
            setSelectedProduct,
            appliedCoupon,
            applyCoupon,
            removeCoupon,
            validateCartStock,
            clearCart,
            shippingSettings,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
