import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { negotiationId, price, message, type } = await req.json();

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
          type,
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
