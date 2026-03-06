import type { Metadata, Viewport } from "next";
import { Literata, Plus_Jakarta_Sans, Sarabun, Prompt } from "next/font/google";
import "./globals.css";
import { LIFFProvider } from "../providers/liff-providers";

const literata = Literata({ subsets: ["latin"], variable: "--font-literata" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const sarabun = Sarabun({ subsets: ["thai"], weight: ["400"], variable: "--font-sarabun" });
const prompt = Prompt({ subsets: ["thai"], weight: ["300"], variable: "--font-prompt" });

export const metadata: Metadata = {
  title: "LIFF App",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${literata.variable} ${jakarta.variable} ${sarabun.variable} ${prompt.variable}`}>
        <LIFFProvider>{children}</LIFFProvider>
      </body>
    </html>
  );
}
