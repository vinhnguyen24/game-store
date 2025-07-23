// app/api/upload/route.ts
import { apiFetch } from "@/lib/api";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { authOptions } from "@/lib/auth";

type UploadedFile = {
  id: number;
  url: string;
  name: string;
};
type Negotiation = {
  id: number;
};
type StrapiResponse<T> = {
  json(): UploadedFile[] | PromiseLike<UploadedFile[]>;
  data: T[];
  meta?: any;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const strapiFormData = new FormData();
    const files = formData.getAll("files") as File[];
    files.forEach((file) => {
      strapiFormData.append("files", file);
    });

    // Gửi tới Strapi endpoint
    const response = await apiFetch<StrapiResponse<Negotiation>>(`/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.jwt}`,
      },
      data: strapiFormData, // Gửi FormData trực tiếp
    });

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
