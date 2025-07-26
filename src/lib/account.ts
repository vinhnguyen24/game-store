import { apiFetch } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Account } from "@/types/account";

type StrapiResponse<T> = {
  data: T;
  meta?: any;
};

export async function getAccountWithNegotiation(id: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const res = await apiFetch<StrapiResponse<Account[]>>(
    `/accounts?filters[documentId][$eq]=${id}&populate[0]=thumbnail&populate[1]=images&populate[2]=city_themes&populate[3]=user`,
    { method: "GET" }
  );

  const account = res.data?.[0];

  let hasNegotiation = false;

  if (userId && account?.id) {
    const negotiationRes = await apiFetch<StrapiResponse<any>>(
      `/negotiations?filters[account][id][$eq]=${account.id}&filters[buyer][id][$eq]=${userId}`,
      { method: "GET", token: session?.user?.jwt }
    );
    hasNegotiation = negotiationRes.data?.length > 0;
  }

  return {
    data: res.data,
    hasNegotiation,
  };
}
