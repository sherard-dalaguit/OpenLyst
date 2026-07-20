const UA = "OpenLyst/2.0 (job aggregator; contact: support@openlyst.io)";

export async function fetchJson<T>(
  url: string,
  init: RequestInit = {},
  timeoutMs = 30000
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "User-Agent": UA,
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return (await res.json()) as T;
}

export async function fetchText(url: string, timeoutMs = 60000): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return await res.text();
}

export function jitter(maxMs = 800): Promise<void> {
  return new Promise(r => setTimeout(r, 200 + Math.random() * maxMs));
}
