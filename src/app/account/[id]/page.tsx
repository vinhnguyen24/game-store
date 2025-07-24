import AccountDetailPage from "@/components/Account/AccountDetails";
import { Account } from "@/types/account";

type Params = Promise<{ id: string }>;

type AccountResponse = {
  data: Account[];
  hasNegotiation: boolean;
};
export default async function page({ params }: { params: Params }) {
  const { id } = await params;
  let data: AccountResponse | null = null;
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/accounts/${id}`, {
      method: "GET",
    });
    data = await res.json();
  } catch (err) {
    console.error("Error fetching account:", err);
  }

  return (
    <main>
      {data?.data?.[0] && (
        <AccountDetailPage
          account={data.data[0]}
          hasNegotiation={data.hasNegotiation}
        />
      )}
    </main>
  );
}
