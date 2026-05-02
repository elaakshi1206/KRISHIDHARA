import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/providers/LanguageProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KrishiDhara | Empowering Farmers",
  description: "Advanced agriculture companion for Indian farmers with crop monitoring, market prices, and government schemes.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
