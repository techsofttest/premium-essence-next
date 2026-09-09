import { Product } from "@/components/ui/ProductCard";

export type StorefrontReview = {
    id: number;
    name: string;
    rating: number;
    title: string | null;
    content: string;
    date: string;
};

export type StorefrontProduct = {
    id: number;
    slug: string;
    name: string;
    price: number;
    buying_price?: number;
    original_price?: number;
    min_price?: number;
    max_price: number;
    featured_image: string | null;
    gallery?: string[];
    rating: number;
    review_count: number;
    is_featured: boolean;
    brand: { id?: number; name: string; slug?: string; classification?: string } | null;
    category: { id?: number; name: string; slug?: string } | null;
    variants: { id: number; size: string | null; unit: string | null; label?: string; price: number; buying_price?: number; original_price?: number; stock: number }[];
    description?: string;
    key_features?: string;
    top_notes?: string;
    middle_notes?: string;
    base_notes?: string;
    top_notes_list?: string[];
    middle_notes_list?: string[];
    base_notes_list?: string[];
    concentration?: string | { id?: number; name: string; slug?: string } | null;
    fragrance_concentration?: { id?: number; name: string; slug?: string } | null;
    reviews?: StorefrontReview[];
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
};

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");

export function toProduct(product: StorefrontProduct): Product {
    const mainVariant = product.variants?.[0];
    const mainBuying = mainVariant?.buying_price ?? mainVariant?.original_price ?? product.buying_price ?? product.original_price;
    const originalPrice = (mainBuying && mainBuying > product.price) ? mainBuying : undefined;

    const concentrationName = typeof product.concentration === "string" 
        ? product.concentration 
        : (product.fragrance_concentration?.name || (typeof product.concentration === "object" ? product.concentration?.name : undefined));

    return {
        id: String(product.id),
        slug: product.slug,
        brand: product.brand?.name || "Premium Essence",
        name: product.name,
        concentration: concentrationName || "Eau de Parfum",
        price: product.price,
        originalPrice: originalPrice,
        rating: product.rating,
        reviews: product.review_count,
        image: product.featured_image || "/images/placeholder.png",
        badge: product.is_featured ? "Bestseller" : undefined,
        variants: (product.variants || []).map((variant) => {
            const vBuying = variant.buying_price ?? variant.original_price;
            return {
                id: variant.id,
                size: variant.size || "",
                unit: variant.unit || "",
                label: variant.label || `${variant.size || ""}${variant.unit || ""}`.trim(),
                price: variant.price,
                originalPrice: (vBuying && vBuying > variant.price) ? vBuying : undefined,
                stock: variant.stock,
            };
        }),
    };
}

export interface FetchProductsOptions {
    category?: string;
    brand?: string;
    family?: string;
    gender?: string;
    concentration?: string;
    classification?: string;
    collection?: string;
    search?: string;
    sort?: string;
    filter?: string;
    page?: number;
    per_page?: number;
}

export interface FetchProductsResult {
    products: Product[];
    rawProducts: StorefrontProduct[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export async function getStorefrontProducts(options: FetchProductsOptions = {}): Promise<Product[]> {
    try {
        const query = new URLSearchParams();
        if (options.category) query.set("category", options.category);
        if (options.brand) query.set("brand", options.brand);
        if (options.family) query.set("family", options.family);
        if (options.gender) query.set("gender", options.gender);
        if (options.concentration) query.set("concentration", options.concentration);
        if (options.classification) query.set("classification", options.classification);
        if (options.collection) query.set("collection", options.collection);
        if (options.search) query.set("search", options.search);
        if (options.sort) query.set("sort", options.sort);
        if (options.filter) query.set("filter", options.filter);
        if (options.page) query.set("page", String(options.page));
        query.set("per_page", String(options.per_page || 24));

        const response = await fetch(`${baseUrl}/storefront/products?${query.toString()}`, { cache: "no-store" });
        if (!response.ok) return [];
        const body = await response.json() as { data: StorefrontProduct[] };
        return (body.data || []).map(toProduct);
    } catch {
        return [];
    }
}

export async function getStorefrontProductsWithMeta(options: FetchProductsOptions = {}): Promise<FetchProductsResult> {
    try {
        const query = new URLSearchParams();
        if (options.category) query.set("category", options.category);
        if (options.brand) query.set("brand", options.brand);
        if (options.family) query.set("family", options.family);
        if (options.gender) query.set("gender", options.gender);
        if (options.concentration) query.set("concentration", options.concentration);
        if (options.classification) query.set("classification", options.classification);
        if (options.collection) query.set("collection", options.collection);
        if (options.search) query.set("search", options.search);
        if (options.sort) query.set("sort", options.sort);
        if (options.filter) query.set("filter", options.filter);
        if (options.page) query.set("page", String(options.page));
        query.set("per_page", String(options.per_page || 24));

        const response = await fetch(`${baseUrl}/storefront/products?${query.toString()}`, { cache: "no-store" });
        if (!response.ok) return { products: [], rawProducts: [] };
        const body = await response.json() as { data: StorefrontProduct[]; meta?: { current_page: number; last_page: number; per_page: number; total: number } };
        return {
            products: (body.data || []).map(toProduct),
            rawProducts: body.data || [],
            meta: body.meta,
        };
    } catch {
        return { products: [], rawProducts: [] };
    }
}

export async function getStorefrontProductDetail(idOrSlug: string): Promise<StorefrontProduct | null> {
    try {
        const response = await fetch(`${baseUrl}/storefront/products/${encodeURIComponent(idOrSlug)}`, { cache: "no-store" });
        if (!response.ok) return null;
        return (await response.json()) as StorefrontProduct;
    } catch {
        return null;
    }
}

export interface WhyChooseUsItemData {
    id: number;
    title: string;
    description: string;
    icon: string;
}

export interface ShippingSettingsData {
    default_shipping_fee: number;
    free_shipping_threshold: number;
    is_enabled: boolean;
}

export interface StorefrontHomeData {
    collections: Record<string, Product[]>;
    brands: { id: number; name: string; slug: string; classification?: string; logo?: string }[];
    banners?: { id: number; name: string; image_url: string; url?: string }[];
    middle_banner?: { id: number; name: string; image_url: string; url?: string } | null;
    why_choose_us?: WhyChooseUsItemData[];
    shipping_settings?: ShippingSettingsData;
    home_advertisement?: { id: number; name: string; title?: string; banner_url: string; url?: string } | null;
}

export async function getStorefrontHome(): Promise<StorefrontHomeData> {
    try {
        const response = await fetch(`${baseUrl}/storefront/home`, { next: { revalidate: 60 } });
        if (!response.ok) return { collections: {}, brands: [], banners: [], middle_banner: null, why_choose_us: [], shipping_settings: { default_shipping_fee: 20, free_shipping_threshold: 200, is_enabled: true }, home_advertisement: null };
        const data = await response.json();

        const collectionsMap: Record<string, Product[]> = {};
        if (Array.isArray(data.collections)) {
            data.collections.forEach((col: { slug?: string; products?: StorefrontProduct[] }) => {
                if (col.slug && Array.isArray(col.products)) {
                    collectionsMap[col.slug] = col.products.map(toProduct);
                }
            });
        }

        const brands = (data.brands || []).map((b: { id: number; name: string; slug?: string; classification?: string; logo?: string; logo_url?: string }) => ({
            id: b.id,
            name: b.name,
            slug: b.slug || b.name.toLowerCase().replace(/ /g, "-"),
            classification: b.classification,
            logo: b.logo || b.logo_url || undefined,
        }));

        const banners = (data.banners || []).map((b: { id: number; name?: string; image_url?: string; image?: string; url?: string }) => ({
            id: b.id,
            name: b.name || "Banner",
            image_url: b.image_url || b.image || "",
            url: b.url || "/shop",
        }));

        const middleBanner = data.middle_banner ? {
            id: data.middle_banner.id,
            name: data.middle_banner.name || "Middle Banner",
            image_url: data.middle_banner.image_url || data.middle_banner.image || "",
            url: data.middle_banner.url || "/shop",
        } : null;

        const whyChooseUs = (data.why_choose_us || []).map((w: { id: number; title: string; description: string; icon?: string }) => ({
            id: w.id,
            title: w.title,
            description: w.description,
            icon: w.icon || "ShieldCheck",
        }));

        const shippingSettings: ShippingSettingsData = data.shipping_settings || {
            default_shipping_fee: 20,
            free_shipping_threshold: 200,
            is_enabled: true,
        };

        return {
            collections: collectionsMap,
            brands,
            banners,
            middle_banner: middleBanner,
            why_choose_us: whyChooseUs,
            shipping_settings: shippingSettings,
            home_advertisement: data.home_advertisement || null,
        };
    } catch {
        return { collections: {}, brands: [], banners: [], middle_banner: null, why_choose_us: [], shipping_settings: { default_shipping_fee: 20, free_shipping_threshold: 200, is_enabled: true }, home_advertisement: null };
    }
}

export type FragranceReelItem = {
    id: number;
    title: string;
    subtitle?: string;
    video_url: string;
    thumbnail?: string;
    badge?: string;
    button_text?: string;
    button_link?: string;
    product?: Product;
};

export type FragranceFamilyItem = {
    id: number;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    product_count?: number;
    href: string;
};

export async function getStorefrontReels(): Promise<FragranceReelItem[]> {
    try {
        const response = await fetch(`${baseUrl}/storefront/reels`, { cache: "no-store" });
        if (!response.ok) return [];
        const data = await response.json();
        if (Array.isArray(data)) {
            return data.map((item: { id: number; title: string; subtitle?: string; video_url: string; thumbnail?: string; badge?: string; button_text?: string; button_link?: string; product?: StorefrontProduct }) => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                video_url: item.video_url,
                thumbnail: item.thumbnail,
                badge: item.badge,
                button_text: item.button_text,
                button_link: item.button_link,
                product: item.product ? toProduct(item.product) : undefined,
            }));
        }
        return [];
    } catch {
        return [];
    }
}

export async function getFragranceFamilies(): Promise<FragranceFamilyItem[]> {
    try {
        const response = await fetch(`${baseUrl}/storefront/fragrance-families`, { cache: "no-store" });
        if (!response.ok) return [];
        const data = await response.json();
        if (Array.isArray(data)) {
            return data.map((item: { id: number; name: string; slug: string; image?: string; description?: string; product_count?: number; href?: string }) => ({
                id: item.id,
                name: item.name,
                slug: item.slug,
                image: item.image,
                description: item.description,
                product_count: item.product_count,
                href: item.href || `/fragrances?family=${item.slug}`,
            }));
        }
        return [];
    } catch {
        return [];
    }
}
