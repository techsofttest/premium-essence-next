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
        <section className="relative w-full aspect-[2172/724] overflow-hidden bg-dark/5 cursor-pointer">
            <Link href={linkUrl} className="block w-full h-full relative">
                <Image
                    src={imageUrl}
                    alt={altText}
                    fill
                    priority={priority}
                    unoptimized={imageUrl.startsWith("http")}
                    className="object-cover object-center transition-transform duration-1000 hover:scale-105"
                    sizes="100vw"
                />
            </Link>
        </section>
    );
}