let resolvedDomain = "monibapp.ir";
let isResolved = false;

export async function resolveDomain() {
  if (isResolved) return resolvedDomain;

  if (typeof localStorage !== "undefined") {
    const cached = localStorage.getItem("app_domain");
    if (cached === "monibapp.com" || cached === "monibapp.ir") {
      resolvedDomain = cached;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://monibapp.com", {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);
    resolvedDomain = "monibapp.com";
  } catch {
    resolvedDomain = "monibapp.ir";
  }

  isResolved = true;

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("app_domain", resolvedDomain);
  }

  return resolvedDomain;
}

export function getDomain() {
  return resolvedDomain;
}
