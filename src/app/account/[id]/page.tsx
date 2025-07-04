import AccountDetailPage from "@/components/Account/AccountDetails";
import { apiFetch } from "@/lib/api";

type Params = Promise<{ id: string }>;
export default async function page({ params }: { params: Params }) {
  const { id } = await params;
  let data;
  try {
    data = await apiFetch(
      `/accounts?filters[documentId][$eq]=${id}&populate[0]=thumbnail&populate[1]=images&populate[2]=city_themes`,
      {
        method: "GET",
      }
    );
  } catch (err) {
    console.error(err);
  } finally {
  }

  return (
    <main>
      <AccountDetailPage account={data?.data[0]} />
    </main>
  );
}
