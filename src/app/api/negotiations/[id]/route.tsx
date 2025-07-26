import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiFetch } from "@/lib/api";

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

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await apiFetch<StrapiResponse<any>>(
      `/negotiations?filters[documentId][$eq]=${id}&populate[negotiation_messages][populate]=sender`,
      {
        method: "GET",
        token: token.jwt,
      }
    );
    console.log(res.data);
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error fetching negotiation:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
