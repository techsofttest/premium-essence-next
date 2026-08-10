import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
    itemCount?: number;
    title: string;
    currentStep: 1 | 2 | 3;
}

export default function CartHeader({ itemCount, title, currentStep }: CartHeaderProps) {
    const progressWidth = currentStep === 1 ? "w-0" : currentStep === 2 ? "w-1/2" : "w-full";

    return (
        <div className="flex flex-col gap-8">
            <Link href={currentStep === 1 ? "/" : "/cart"} className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold text-dark hover:text-dark/70 transition-colors w-fit">
                <ArrowLeft size={12} /> {currentStep === 1 ? "Back to Shopping" : "Back to Bag"}
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-dark/10 pb-10">
                <h1 className="font-serif text-2xl md:text-3xl text-dark">
                    {title} {itemCount !== undefined && `(${itemCount})`}
                </h1>

                {/* Progressive Progress Bar (Right Aligned) */}
                <div className="relative w-full max-w-sm mb-1">
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex flex-col gap-3 items-center">
                            <span className={`text-[9px] tracking-[0.2em] uppercase font-bold text-dark ${currentStep < 1 ? "opacity-50" : ""}`}>01 Bag</span>
                            <div className={`w-2.5 h-2.5 rounded-full ring-[6px] ring-[#F7F3F4] ${currentStep >= 1 ? "bg-dark" : "bg-white border border-dark/20"}`} />
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <span className={`text-[9px] tracking-[0.2em] uppercase font-bold text-dark ${currentStep < 2 ? "opacity-50" : ""}`}>02 Checkout</span>
                            <div className={`w-2.5 h-2.5 rounded-full ring-[6px] ring-[#F7F3F4] ${currentStep >= 2 ? "bg-dark" : "bg-white border border-dark/20"}`} />
                        </div>
                        <div className="flex flex-col gap-3 items-center">
                            <span className={`text-[9px] tracking-[0.2em] uppercase font-bold text-dark ${currentStep < 3 ? "opacity-50" : ""}`}>03 Payment</span>
                            <div className={`w-2.5 h-2.5 rounded-full ring-[6px] ring-[#F7F3F4] ${currentStep >= 3 ? "bg-dark" : "bg-white border border-dark/20"}`} />
                        </div>
                    </div>
                    {/* Connection Line */}
                    <div className="absolute bottom-[4.5px] left-0 w-full h-[1px] bg-dark/20 -z-0" />
                    <div className={`absolute bottom-[4.5px] left-0 h-[1px] bg-dark -z-0 transition-all duration-500 ${progressWidth}`} />
                </div>
            </div>
        </div>
    );
}
