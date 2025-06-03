import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import "./globals.css";
import { Cinzel, Bebas_Neue, Rajdhani, Anton } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-cinzel",
});
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-rajdhani",
});
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

export const metadata = {
  title: "Ceasar Shop",
  description: "Shop bán account Rise of Kingdoms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-gray-900 text-gray-200 min-h-screen ${cinzel.variable} ${bebas.variable} ${rajdhani.variable} ${anton.variable}`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
