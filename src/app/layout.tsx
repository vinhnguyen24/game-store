// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // Remove duplicate
import Header from "@/components/Header";
import { Cinzel, Bebas_Neue, Rajdhani, Anton } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "keen-slider/keen-slider.min.css";
import { Providers } from "./providers";
import { CityThemeProvider } from "@/context/CityThemeContext"; // Use the Provider component

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

export const metadata: Metadata = {
  title: "Ceasar Shop",
  description: "Shop bán account Rise of Kingdoms",
};

export type CityThemes = {
  id: number;
  name: string;
  type: "infantry" | "archer" | "cavalry" | "mix" | "ultility";
  buff: string;
  image: {
    url: string;
  };
};
const domain = process.env.BASE_URL;
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let cityThemeData: CityThemes[] = [];

  try {
    const res = await fetch(`${domain}/api/city-themes`);
    const json = await res.json();
    cityThemeData = json.data || [];
  } catch (err) {
    console.error("Failed to fetch city themes", err);
  }
  return (
    <html lang="en">
      <body
        className={`bg-gray-900 text-gray-200 min-h-screen ${cinzel.variable} ${bebas.variable} ${rajdhani.variable} ${anton.variable}`}
      >
        <CityThemeProvider initialData={cityThemeData}>
          <Providers>
            <Header />
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </CityThemeProvider>
      </body>
    </html>
  );
}
