import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { CartDrawer } from "@/components/menu/CartDrawer";
import { AuthProvider } from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  themeColor: "#EAB308",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "FeastOS | Luxury Dining & Cultural Gastronomy",
  description: "Experience a masterclass in culinary fusion. FeastOS brings together high-end international techniques and authentic Nigerian heritage across multiple branches.",
  keywords: ["luxury dining", "nigerian cuisine", "michelin star restaurant", "lagos dining", "food storytelling", "feastos"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FeastOS Elite",
  },
  openGraph: {
    title: "FeastOS | Luxury Dining & Cultural Gastronomy",
    description: "Explore the art of flavor with our curated menus and interactive dish backstories.",
    type: "website",
    locale: "en_US",
    siteName: "FeastOS Elite Dining",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FeastOS Luxury Dining",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FeastOS | Elite Gastronomy",
    description: "Redefining the luxury dining journey with AI-powered recommendations.",
  },
};

import { ToastProvider } from "@/components/providers/ToastProvider";

import { AuthModal } from "@/components/auth/AuthModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <CartDrawer />
            <AuthModal />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
