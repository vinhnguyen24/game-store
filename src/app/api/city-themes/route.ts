// app/api/city-themes/route.ts

import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

type ApiResponse<T> = {
  data: T;
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

export async function GET() {
  try {
    const res = await apiFetch<ApiResponse<CityThemes[]>>(
      "/city-themes?populate=*&pagination[pageSize]=100",
      { method: "GET" }
    );
    return NextResponse.json({ data: res?.data || [] });
  } catch (err) {
    console.error("Failed to fetch city themes", err);
    return NextResponse.json(
      { error: "Failed to fetch city themes" },
      { status: 500 }
    );
  }
}
