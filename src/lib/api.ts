type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions<TData = unknown> {
  method?: HttpMethod;
  data?: TData;
  token?: string;
  headers?: HeadersInit;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function apiFetch<TResponse = unknown, TData = unknown>(
  endpoint: string,
  options: ApiOptions<TData> = {}
): Promise<TResponse> {
  const { method = "GET", data, token, headers = {} } = options;

  const jwtToken =
    token ||
    (typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null);

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
    },
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  const res = await fetch(BASE_URL + endpoint, fetchOptions);

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error("Không thể phân tích response JSON");
  }

  if (!res.ok) {
    const message = json?.message || res.statusText || "Lỗi khi gọi API";
    throw new Error(message);
  }

  return json as TResponse;
}
