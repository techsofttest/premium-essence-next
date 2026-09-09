"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { Product } from "@/components/ui/ProductCard";

interface WishlistContextType {
    wishlistProducts: Product[];
    wishlistIds: Set<string>;
    loading: boolean;
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (product: Product) => Promise<void>;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { customer } = useAuth();
    const router = useRouter();
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshWishlist = useCallback(async () => {
        if (!customer) {
            setWishlistProducts([]);
            return;
        }
        setLoading(true);
        try {
            const rawWishlist = await api<Array<Record<string, unknown>>>("/customer/wishlist");
            const formatted: Product[] = (rawWishlist || []).map((item) => ({
                id: String(item.id ?? ""),
                slug: String(item.slug ?? ""),
                brand: String(item.brand ?? "Premium Essence"),
                name: String(item.title ?? item.name ?? ""),
                price: Number(item.price ?? 0),
                originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
                rating: Number(item.rating ?? 5.0),
                reviews: Number(item.reviews ?? 0),
                image: String(item.image ?? "/logo/logo-black.png"),
                badge: item.badge ? (item.badge as Product["badge"]) : undefined,
            }));
            setWishlistProducts(formatted);
        } catch {
            setWishlistProducts([]);
        } finally {
            setLoading(false);
        }
    }, [customer]);

    useEffect(() => {
        let isMounted = true;
        if (!customer) {
            queueMicrotask(() => {
                if (isMounted) setWishlistProducts([]);
            });
            return;
        }
        queueMicrotask(() => {
            if (isMounted) setLoading(true);
        });
        api<Array<Record<string, unknown>>>("/customer/wishlist")
            .then((rawWishlist) => {
                if (!isMounted) return;
                const formatted: Product[] = (rawWishlist || []).map((item) => ({
                    id: String(item.id ?? ""),
                    slug: String(item.slug ?? ""),
                    brand: String(item.brand ?? "Premium Essence"),
                    name: String(item.title ?? item.name ?? ""),
                    price: Number(item.price ?? 0),
                    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
                    rating: Number(item.rating ?? 5.0),
                    reviews: Number(item.reviews ?? 0),
                    image: String(item.image ?? "/logo/logo-black.png"),
                    badge: item.badge ? (item.badge as Product["badge"]) : undefined,
                }));
                setWishlistProducts(formatted);
            })
            .catch(() => {
                if (isMounted) setWishlistProducts([]);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [customer]);

    const wishlistIds = useMemo(() => {
        return new Set(wishlistProducts.map((p) => p.id));
    }, [wishlistProducts]);

    const isInWishlist = (productId: string): boolean => {
        return wishlistIds.has(productId);
    };

    const toggleWishlist = async (product: Product) => {
        if (!customer) {
            router.push("/login");
            return;
        }

        const currentlyInWishlist = isInWishlist(product.id);

        try {
            if (currentlyInWishlist) {
                // Optimistic remove
                setWishlistProducts((prev) => prev.filter((p) => p.id !== product.id));
                await api(`/customer/wishlist/${product.id}`, { method: "DELETE" });
            } else {
                // Optimistic add
                setWishlistProducts((prev) => [...prev, product]);
                await api("/customer/wishlist", {
                    method: "POST",
                    body: JSON.stringify({ product_id: product.id }),
                });
            }
            await refreshWishlist();
        } catch (err) {
            console.error("Wishlist operation failed:", err);
            await refreshWishlist();
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistProducts,
                wishlistIds,
                loading,
                isInWishlist,
                toggleWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
    return context;
}
