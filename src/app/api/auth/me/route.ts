// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const strapiRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me?populate=avatar&populate=accounts`,
    {
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    }
  );

  const data = await strapiRes.json();
  return NextResponse.json(data);
}
