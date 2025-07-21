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
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
      ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
    },
  };

  if (data) {
    fetchOptions.body = isFormData ? data : JSON.stringify(data);
  }

  const res = await fetch(BASE_URL + endpoint, fetchOptions);

  let json;
  let parseErrorOccurred = false;

  try {
    json = await res.json();
  } catch (e) {
    console.error(e);
    parseErrorOccurred = true;
  }

  if (!res.ok) {
    // If 'json' was successfully parsed (e.g., a JSON error response from the server)
    // and has a 'message' property, use it.
    // If JSON parsing failed (parseErrorOccurred = true), 'json' would likely be undefined here,
    // so json?.message would be undefined, and it falls back to res.statusText.
    const message =
      (json && typeof json === "object" && json?.error?.message) ||
      res.statusText ||
      "Lỗi khi gọi API";
    throw new Error(message);
  }

  // If we are here, res.ok is true.
  // Now, if JSON parsing failed for this successful response, it's an issue.
  if (parseErrorOccurred) {
    throw new Error(
      `Không thể phân tích response JSON từ một response thành công (status: ${res.status})`
    );
  }

  return json as TResponse;
}
