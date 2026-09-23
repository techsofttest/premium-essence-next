"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ContactProvider } from "@/context/ContactContext";
import dynamic from "next/dynamic";

const AddToCartModal = dynamic(() => import("@/components/ui/AddToCartModal"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer"), { ssr: false });
const FloatingWhatsApp = dynamic(() => import("@/components/global/FloatingWhatsApp"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup") || pathname?.startsWith("/verify") || pathname?.startsWith("/forgot-password");

    return (
        <AuthProvider>
            <ContactProvider>
                <WishlistProvider>
                    <CartProvider>
                        {!isAuthPage && (
                            <Suspense fallback={null}>
                                <Header />
                            </Suspense>
                        )}
                        <main className="flex-1 flex flex-col">
                            {children}
                        </main>
                        {!isAuthPage && <Footer />}
                        <AddToCartModal />
                        <CartDrawer />
                        <FloatingWhatsApp />
                    </CartProvider>
                </WishlistProvider>
            </ContactProvider>
        </AuthProvider>
    );
}
