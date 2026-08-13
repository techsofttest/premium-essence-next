import HeroSlider from "@/components/global/HeroSlider";
import ProductShowcase from "@/components/sections/ProductShowcase";
import { Product } from "@/components/ui/ProductCard";
import BrandCarousel from "../components/sections/BrandCarousel";
import InteractiveShowcase from "@/components/sections/InteractiveShowcase";
import ProductBanner from "@/components/sections/ProductBanner";
import DealsCarousel from "@/components/sections/DealsCarousel";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import ProductCarousel from "@/components/sections/ProductCarousel";
import BestChoicesGrid from "@/components/sections/BestChoicesGrid";
import { getStorefrontHome, getStorefrontProducts } from "@/lib/storefront";

export default async function Home() {
  const [homeData, fallbackProducts] = await Promise.all([
    getStorefrontHome(),
    getStorefrontProducts(),
  ]);

  const collections = homeData.collections || {};

  // Best Sellers & New Arrivals from DB collections
  const bestsellersList = collections["best-sellers"] || collections["bestsellers"] || fallbackProducts.slice(0, 4);
  const newArrivalsList = collections["new-arrivals"] || collections["newarrivals"] || fallbackProducts.slice(0, 4);

  // Trending collection from DB
  const trendingList = collections["trending"] || collections["featured"] || fallbackProducts.slice(0, 6);

  // Best Choice & Special Deals from DB
  const bestChoicesList = collections["best-choice"] || collections["bestchoice"] || fallbackProducts.slice(0, 4);
  const specialDealsList = collections["special-deals"] || collections["specialdeals"] || fallbackProducts.slice(0, 4);

  const showcaseProducts: Record<"bestsellers" | "newArrivals", Product[]> = {
    bestsellers: bestsellersList.length ? bestsellersList.slice(0, 4) : fallbackProducts.slice(0, 4),
    newArrivals: newArrivalsList.length ? newArrivalsList.slice(0, 4) : fallbackProducts.slice(0, 4),
  };

  const bestChoicesGridData: Record<"bestsellers" | "newArrivals", Product[]> = {
    bestsellers: bestChoicesList.length ? bestChoicesList.slice(0, 4) : showcaseProducts.bestsellers,
    newArrivals: specialDealsList.length ? specialDealsList.slice(0, 4) : showcaseProducts.newArrivals,
  };

  // Featured collection from DB for 3D Showcase section
  const featuredList = collections["featured"] || fallbackProducts.slice(0, 5);

  const mainBanner = homeData.banners?.[0];
  const homeBannerUrl = mainBanner?.image_url || homeData.home_advertisement?.banner_url || "/product-banner/Acqua Di Giò-B.png";
  const homeBannerAlt = mainBanner?.name || homeData.home_advertisement?.name || "Featured Fragrance Banner";
  const rawBannerLink = mainBanner?.url || homeData.home_advertisement?.url || "/shop";
  const homeBannerLink = rawBannerLink.replace(/^https?:\/\/[^\/]+/, "") || "/shop";

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Full-width Slider using Banners from DB */}
      <HeroSlider initialBanners={homeData.banners} />

      {/* Product Showcase (Best Sellers & New Arrivals Collections from DB) */}
      <ProductShowcase products={showcaseProducts} />

      {/* Dynamic Brands Carousel from DB */}
      <BrandCarousel initialBrands={homeData.brands} />

      {/* Trending Collections from DB */}
      <ProductCarousel
        title="Trending Collections"
        subtitle="Curated Selections"
        products={trendingList}
        viewAllLink="/shop"
      />

      {/* 3D Showcase displaying Featured Collection from DB */}
      <InteractiveShowcase products={featuredList} />

      {/* Dynamic Mid-page Banner from DB Banners Table */}
      <ProductBanner
        imageUrl={homeBannerUrl}
        altText={homeBannerAlt}
        linkUrl={homeBannerLink}
      />

      <DealsCarousel />

      {/* Best Choices Grid from DB */}
      <BestChoicesGrid products={bestChoicesGridData} />

      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
