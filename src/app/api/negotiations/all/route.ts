// app/api/negotiations/all/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = token.sub;
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "buyer";
  let filters = "";
  if (role === "seller") {
    filters = `filters[account][user][id][$eq]=${userId}`;
  } else {
    filters = `filters[buyer][id][$eq]=${userId}`;
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/negotiations?${filters}&populate[account][populate]=thumbnail&populate[negotiation_messages][populate]=sender`,
    {
      headers: {
        Authorization: `Bearer ${token.jwt}`,
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
