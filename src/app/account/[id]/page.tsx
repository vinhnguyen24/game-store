import AccountDetailPage from "@/components/Account/AccountDetails";
import { Account } from "@/types/account";
import { getAccountWithNegotiation } from "@/lib/account";

type Params = Promise<{ id: string }>;

type AccountResponse = {
  data: Account[];
  hasNegotiation: boolean;
};
export default async function page({ params }: { params: Params }) {
  const { id } = await params;
  let data: AccountResponse | null = null;

  try {
    data = await getAccountWithNegotiation(id);
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
