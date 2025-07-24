// App Router: src/app/api/accounts/[id]/route.ts
import { apiFetch } from "@/lib/api";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
type StrapiResponse<T> = {
  data: T;
  meta?: any;
};
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const token = await getToken({ req });
  let userId = null;
  if (token) userId = token.sub;

  try {
    const res = await apiFetch<StrapiResponse<any>>(
      `/accounts?filters[documentId][$eq]=${id}&populate[0]=thumbnail&populate[1]=images&populate[2]=city_themes&populate[3]=user`,
      {
        method: "GET",
      }
    );
    const account = res.data?.[0];
    let hasNegotiation = false;
    if (userId) {
      const negotiationRes = await apiFetch<StrapiResponse<any>>(
        `/negotiations?filters[account][id][$eq]=${account.id}&filters[user][id][$eq]=${userId}`,
        { method: "GET" }
      );

      hasNegotiation = negotiationRes.data?.length > 0;
    }
    return NextResponse.json({
      ...res,
      hasNegotiation,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
