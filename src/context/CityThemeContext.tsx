"use client";

import { createContext, useContext, ReactNode } from "react";

export type CityThemes = {
  id: number;
  name: string;
  type: "infantry" | "archer" | "cavalry" | "mix" | "ultility";
  buff: string;
  image: {
    url: string;
  };
};

// Create the context with a default value
export const CityThemeContext = createContext<CityThemes[]>([]);

// Custom hook to use the context
export const useCityThemes = () => {
  const context = useContext(CityThemeContext);
  if (context === undefined) {
    throw new Error("useCityThemes must be used within a CityThemeProvider");
  }
  return context;
};

// Provider component
interface CityThemeProviderProps {
  children: ReactNode;
  initialData: CityThemes[];
}

export const CityThemeProvider = ({
  children,
  initialData,
}: CityThemeProviderProps) => {
  return (
    <CityThemeContext.Provider value={initialData}>
      {children}
    </CityThemeContext.Provider>
  );
};
