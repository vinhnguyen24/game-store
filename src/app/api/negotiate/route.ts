import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Negotiation = {
  id: number;
  attributes: {
    offeredPrice: number;
    statusTransaction: string;
    // Thêm các field khác nếu cần
  };
};
type NegotiationRes = {
  id: number;
  buyerZalo: string;
  statusTransaction: string;
};
type StrapiResponse<T> = {
  data: T[];
  meta?: any;
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

    const { accountId, price, message, buyerZalo } = await req.json();

    const existingNegotiation = await apiFetch<StrapiResponse<Negotiation>>(
      `/negotiations?filters[account][id][$eq]=${accountId}&filters[buyer][id][$eq]=${session.user.id}`,
      {
        method: "GET",
        token: session?.user?.jwt,
      }
    );
    let negotiationId: number;

    if (existingNegotiation?.data?.length > 0) {
      negotiationId = existingNegotiation.data[0].id;
    } else {
      const negotiationRes = await apiFetch<StrapiResponseRes<NegotiationRes>>(
        "/negotiations",
        {
          method: "POST",
          data: {
            data: {
              account: {
                connect: [{ id: accountId }],
              },
              buyer: {
                connect: [{ id: session.user.id }],
              },
              offeredPrice: price,
              buyerZalo,
              statusTransaction: "pending",
            },
          },
          token: session?.user?.jwt,
        }
      );
      negotiationId = negotiationRes.data.id;
    }

    // 3. Tạo message đầu tiên
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
          type: "offer",
        },
      },
      token: session?.user?.jwt,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Negotiation API error", err);
    return NextResponse.json(
      { error: "Lỗi xử lý thương lượng." },
      { status: 500 }
    );
  }
}
