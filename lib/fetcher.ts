export async function fetcher(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

