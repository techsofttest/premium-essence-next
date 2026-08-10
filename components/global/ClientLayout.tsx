"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import AddToCartModal from "@/components/ui/AddToCartModal";
import CartDrawer from "@/components/ui/CartDrawer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/verify") || pathname?.startsWith("/forgot-password");

    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    {!isAuthPage && <Header />}
                    <main className="flex-1 flex flex-col">
                        {children}
                    </main>
                    {!isAuthPage && <Footer />}
                    <AddToCartModal />
                    <CartDrawer />
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    );
}
