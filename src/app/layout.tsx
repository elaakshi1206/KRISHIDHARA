import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KrishiDhara | Empowering Farmers",
  description: "Advanced agriculture companion for Indian farmers with crop monitoring, market prices, and government schemes.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
