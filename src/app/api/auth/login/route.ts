// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { identifier, password } = body;

  if (!identifier || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  try {
    const strapiRes = await fetch(`${process.env.STRAPI_API}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Login failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      jwt: data.jwt,
      user: data.user,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
