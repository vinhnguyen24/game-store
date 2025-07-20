// app/api/negotiations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/negotiations?filters[account][id][$eq]=${accountId}`,
    {
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
