import type { Metadata } from "next";
import { Playwrite_CO } from "next/font/google";
import { Providers } from "./providers";

import "./globals.css";

import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

const playwrite = Playwrite_CO({
  weight: "variable",
  variable: "--font-main",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Receipe&Kitchen",
  description: "International receipes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playwrite.variable}>
      <body className="bg-brand-cream text-brand-deep font-sans">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
