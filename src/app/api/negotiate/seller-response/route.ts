import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
type NegotiationRes = {
  id: number;
  buyerZalo: string;
  statusTransaction: string;
};
type StrapiResponseRes<T> = {
  data: {
    id: number;
    attributes: T;
  };
  meta?: any;
};
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { negotiationId, price, message, type, negotiationDoc, accountId } =
      await req.json();

    await apiFetch("/negotiation-messages", {
      method: "POST",
      data: {
        data: {
          negotiation: {
            connect: [{ id: negotiationId }],
          },
          sender: {
            connect: [{ id: session.user.id }],
          },
          content: message,
          price,
          type,
        },
      },
      token: session?.user?.jwt,
    });

    if (type === "reject") {
      const res = await apiFetch<StrapiResponseRes<NegotiationRes>>(
        `/negotiations/${negotiationDoc}`,
        {
          method: "PUT",
          data: {
            data: {
              statusTransaction: "rejected",
            },
          },
          token: session?.user?.jwt,
        }
      );
    }

    if (type === "accept") {
      await apiFetch<StrapiResponseRes<NegotiationRes>>(
        `/negotiations/${negotiationDoc}`,
        {
          method: "PUT",
          data: {
            data: {
              statusTransaction: "accepted",
            },
          },
          token: session?.user?.jwt,
        }
      );
      await apiFetch(`/negotiations/update-others`, {
        method: "POST",
        data: {
          accountId: accountId,
          negotiationId: negotiationDoc,
        },
        token: session?.user?.jwt,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Negotiation API error", err);
    return NextResponse.json(
      { error: "Lỗi xử lý thương lượng." },
      { status: 500 }
    );
  }
}
