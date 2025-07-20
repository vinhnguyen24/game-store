// app/api/accounts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const result = await apiFetch("/accounts", {
      method: "POST",
      data: body,
      token: (session as { jwt?: string })?.jwt,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error("Error in /api/accounts:", error);

    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
