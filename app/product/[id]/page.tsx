"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { Product } from "@/components/ui/ProductCard";
import ProductGallery from "@/components/product-detail/ProductGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductTabs from "@/components/product-detail/ProductTabs";
import { getStorefrontProductDetail, getStorefrontProducts, StorefrontProduct } from "@/lib/storefront";
import SeoHead from "@/components/seo/SeoHead";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [productDetail, setProductDetail] = useState<StorefrontProduct | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        getStorefrontProductDetail(id).then((detail) => {
            if (!isMounted) return;
            if (detail) {
                setProductDetail(detail);
                // Fetch related products from same category or brand
                getStorefrontProducts({
                    category: detail.category?.slug,
                    per_page: 4,
                }).then((relProducts) => {
                    if (isMounted) {
                        setRelatedProducts(relProducts.filter((p: Product) => p.id !== String(detail.id)).slice(0, 4));
                    }
                }).catch(() => {});
            }
            setIsLoading(false);
        }).catch(() => {
            if (isMounted) setIsLoading(false);
        });

        return () => { isMounted = false; };
    }, [id]);

    if (isLoading) {
        return (
            <main className="w-full bg-[#F7F3F4] min-h-screen font-sans py-32 flex items-center justify-center">
                <div className="text-center flex flex-col items-center gap-4">
                    <span className="w-8 h-8 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs uppercase tracking-widest text-dark font-bold">Loading Fragrance...</span>
                </div>
            </main>
        );
    }

    const images = productDetail?.gallery && productDetail.gallery.length > 0
        ? productDetail.gallery
        : productDetail?.featured_image
        ? [productDetail.featured_image]
        : ["/logo/logo-black.png"];

    const sizes = productDetail?.variants && productDetail.variants.length > 0
        ? productDetail.variants.map((v) => `${v.size || ""}${v.unit || ""}`.trim()).filter(Boolean)
        : ["50ml", "100ml"];

    const formattedVariants = productDetail?.variants?.map((v) => ({
        id: v.id,
        size: v.size || "",
        unit: v.unit || "",
        label: v.label || `${v.size || ""}${v.unit || ""}`.trim(),
        price: v.price,
        originalPrice: v.original_price,
        stock: v.stock,
    })) || [];

    const formattedProduct = {
        id: String(productDetail?.id || id),
        slug: productDetail?.slug,
        brand: productDetail?.brand?.name || "PREMIUM ESSENCE",
        name: productDetail?.name || "Perfume",
        price: productDetail?.price || 0,
        originalPrice: productDetail?.max_price && productDetail.max_price > (productDetail.price || 0) ? productDetail.max_price : undefined,
        rating: productDetail?.rating || 5.0,
        reviews: productDetail?.review_count || (productDetail?.reviews?.length ?? 0),
        sizes: sizes.length ? sizes : ["50ml", "100ml"],
        variants: formattedVariants,
        description: productDetail?.description || "Exquisite luxury fragrance crafted from fine ingredients.",
        images: images,
        notes: {
            top: productDetail?.top_notes_list && productDetail.top_notes_list.length > 0 ? productDetail.top_notes_list : ["Bergamot", "Pink Pepper"],
            heart: productDetail?.middle_notes_list && productDetail.middle_notes_list.length > 0 ? productDetail.middle_notes_list : ["Rose", "Jasmine", "Oud"],
            base: productDetail?.base_notes_list && productDetail.base_notes_list.length > 0 ? productDetail.base_notes_list : ["Amber", "Vanilla", "Musk"]
        },
        highlights: productDetail?.key_features || [
            "100% Authentic Guaranteed",
            "Long-lasting Sillage",
            "Bespoke Formulation",
            "Complimentary Gift Wrap"
        ],
        reviewsList: productDetail?.reviews || []
    };

    return (
        <main className="w-full bg-[#F7F3F4] min-h-screen font-sans pb-20">
            <SeoHead
                pageSlug={`product-${productDetail?.slug || id}`}
                fallbackTitle={`${productDetail?.name || "Product"} | Premium Essence`}
                fallbackDescription={productDetail?.description ? productDetail.description.replace(/<[^>]*>?/gm, '').slice(0, 160) : undefined}
                fallbackKeywords={productDetail?.top_notes || productDetail?.category?.name || "luxury fragrance"}
                overrideTitle={productDetail?.meta_title}
                overrideDescription={productDetail?.meta_description}
                overrideKeywords={productDetail?.meta_keywords}
            />
            <style jsx global>{`
                .product-gallery-scroll {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .product-gallery-scroll::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Breadcrumbs */}
            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 py-6">
                <nav className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-dark font-bold">
                    <Link href="/" className="hover:text-dark/60 transition-colors">Home</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <Link href="/brands" className="hover:text-dark/60 transition-colors">Brands</Link>
                    <ArrowRight size={10} strokeWidth={2.5} />
                    <span className="text-dark/50">{formattedProduct.name}</span>
                </nav>
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                <ProductGallery images={formattedProduct.images} name={formattedProduct.name} />
                <ProductInfo product={formattedProduct} />
            </div>

            <ProductTabs 
                productId={formattedProduct.id}
                description={formattedProduct.description}
                notes={formattedProduct.notes}
                highlights={formattedProduct.highlights}
                reviews={formattedProduct.reviewsList}
            />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="mt-40 max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex justify-between items-end mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs tracking-[0.4em] uppercase text-gold font-bold">Curated for You</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-dark">You May Also Like</h2>
                        </div>
                        <Link href="/brands" className="text-[10px] tracking-[0.3em] uppercase font-bold text-dark/60 hover:text-dark transition-colors border-b-2 border-transparent hover:border-dark/20 pb-1">
                            View Portfolio
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                        {relatedProducts.map((relProduct) => (
                            <ProductCard
                                key={relProduct.id}
                                product={relProduct}
                            />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
