import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { username, email, password } = body;

  try {
    const strapiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Đăng ký thất bại" },
        { status: strapiRes.status }
      );
    }

    return NextResponse.json(data); // { jwt, user }
  } catch (err) {
    return NextResponse.json(
      { error: `Lỗi kết nối tới Strapi: ${err}` },
      { status: 500 }
    );
  }
}
