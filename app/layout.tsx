import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flip Phone Finder | Best Dumbphones & Digital Wellness Devices 2024",
  description: "Find the perfect flip phone for digital detox & minimalist living. Compare 100+ dumbphones, read expert reviews, and discover your ideal digital wellness device.",
  keywords: "flip phone, dumbphone, digital detox, minimalist phone, basic phone, feature phone, digital wellness, smartphone alternative",
  openGraph: {
    title: "Flip Phone Finder | Best Dumbphones & Digital Wellness Devices 2024",
    description: "Find the perfect flip phone for digital detox & minimalist living. Compare 100+ dumbphones, read expert reviews, and discover your ideal digital wellness device.",
    url: "https://flipphonefinder.com",
    siteName: "Flip Phone Finder",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flip Phone Finder | Best Dumbphones & Digital Wellness Devices 2024",
    description: "Find the perfect flip phone for digital detox & minimalist living. Compare 100+ dumbphones, read expert reviews, and discover your ideal digital wellness device.",
  },
  alternates: {
    canonical: "https://flipphonefinder.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W8SSV10KTS"
          strategy="afterInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W8SSV10KTS');
            `,
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "sf06nax95h");
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Flip Phone Finder",
              "url": "https://flipphonefinder.com",
              "description": "Find the perfect flip phone for digital detox & minimalist living. Compare 100+ dumbphones, read expert reviews, and discover your ideal digital wellness device.",
              "publisher": {
                "@type": "Organization",
                "name": "Broad Publications LLC",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "201 N US Highway 1, STE D10 #1129",
                  "addressLocality": "Jupiter",
                  "addressRegion": "FL",
                  "postalCode": "33477",
                  "addressCountry": "US"
                },
                "email": "hello@broadpublications.com"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://flipphonefinder.com/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
