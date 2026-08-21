import Image from "next/image";
import Link from "next/link";

interface ProductBannerProps {
    imageUrl: string;
    altText?: string;
    priority?: boolean;
    linkUrl?: string;
}

export default function ProductBanner({
    imageUrl,
    altText = "Premium fragrance collection",
    priority = false,
    linkUrl = "/shop"
}: ProductBannerProps) {
    return (
        <section className="w-full overflow-hidden bg-dark/5 cursor-pointer">
            <Link href={linkUrl} className="block w-full cursor-pointer">
                {/* eslint-disable-next-html-element-suppress */}
                <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-auto block object-contain transition-transform duration-700 hover:scale-[1.02]"
                />
            </Link>
        </section>
    );
}