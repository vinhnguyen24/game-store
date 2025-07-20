import HomePage from "@/components/HomePage/HomePage";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";

type AccountResponse = {
  data: Account[];
};
export default async function page() {
  let data: AccountResponse | null = null;
  try {
    data = await apiFetch("/accounts?populate=*", {
      method: "GET",
    });
  } catch (err) {
    console.error(err);
  } finally {
  }

  return (
    <main>
      <HomePage account={data?.data || []} />
    </main>
  );
}
