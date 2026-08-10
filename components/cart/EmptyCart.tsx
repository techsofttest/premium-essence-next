import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import GlowingButton from "@/components/ui/GlowingButton";

export default function EmptyCart() {
    return (
        <main className="w-full bg-[#F7F3F4] min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 shadow-2xl flex flex-col items-center gap-6 max-w-md w-full border border-dark/10">
                <div className="bg-[#F7F3F4] p-8 rounded-full">
                    <ShoppingBag size={48} className="text-dark/20" />
                </div>
                <h1 className="font-serif text-3xl text-dark">Your Bag is Empty</h1>
                <p className="text-dark/70 text-sm leading-relaxed">
                    It looks like you haven't added any luxury fragrances to your collection yet.
                </p>
                <Link href="/category/men" className="w-full">
                    <GlowingButton fullWidth>Start Shopping</GlowingButton>
                </Link>
            </div>
        </main>
    );
}
