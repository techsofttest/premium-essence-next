import type { Metadata } from "next";
import { EB_Garamond, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/global/ClientLayout";
import Script from "next/script";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Premium Essence Perfumes | Essence of Elegance",
  description: "A luxury fragrance boutique specializing in authentic perfumes from the world's most prestigious international brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} ${spaceGrotesk.variable} h - full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-teal selection:text-cream">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TRHT9899V6"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-TRHT9899V6');
            `}
        </Script>

        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}