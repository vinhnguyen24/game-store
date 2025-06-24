import HomePage from "@/components/HomePage/HomePage";
import { apiFetch } from "@/lib/api";

export default async function page() {
  let data;
  let cityThemeData;
  try {
    data = await apiFetch("/accounts?populate=*", {
      method: "GET",
    });
    cityThemeData = await apiFetch(
      "/city-themes?populate=*&pagination[pageSize]=100",
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
      <HomePage account={data?.data} cityThemes={cityThemeData?.data} />
    </main>
  );
}
