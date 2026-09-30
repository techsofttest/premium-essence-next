export interface CuratedDeal {
    slug: string;
    name: string;
    subtitle: string;
    description: string;
    image: string;
    gallery?: string[];
    price: number;
    originalPrice: number;
    discountPercent: number;
    badge: string;
    contents: string[];
    features: string[];
}

export const CURATED_DEALS: Record<string, CuratedDeal> = {};

export function getCuratedDealBySlug(slug: string): CuratedDeal | undefined {
    return CURATED_DEALS[slug];
}

const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost/perfumes/premiumess/public/api").replace(/\/$/, "");

export async function getStorefrontCuratedDeals(): Promise<CuratedDeal[]> {
    try {
        const response = await fetch(`${baseUrl}/storefront/curated-deals`, { next: { revalidate: 60 } });
        if (!response.ok) return [];
        const data = await response.json();
        if (Array.isArray(data)) return data;
        return [];
    } catch {
        return [];
    }
}

export async function getStorefrontCuratedDeal(slug: string): Promise<CuratedDeal | undefined> {
    try {
        const response = await fetch(`${baseUrl}/storefront/curated-deals/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
        if (!response.ok) return undefined;
        const data = await response.json();
        if (data && data.slug) return data as CuratedDeal;
        return undefined;
    } catch {
        return undefined;
    }
}
