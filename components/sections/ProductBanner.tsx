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
    if (!imageUrl) return null;

    return (
        <section className="relative w-full overflow-hidden bg-dark/5 cursor-pointer">
            <Link href={linkUrl} className="block w-full">
                <Image
                    src={imageUrl}
                    alt={altText}
                    width={1500}
                    height={540}
                    priority={priority}
                    unoptimized={imageUrl.startsWith("http")}
                    className="w-full h-auto object-cover object-center transition-transform duration-1000 hover:scale-105"
                    sizes="100vw"
                />
            </Link>
        </section>
    );
}