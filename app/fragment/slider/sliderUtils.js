/** Read link from slider item (API may use link, url, or href). */
export function getSliderHref(item) {
  if (!item || typeof item !== "object") return null;

  const raw = item.link ?? item.url ?? item.href ?? item.actionLink ?? "";
  if (typeof raw !== "string") return null;

  const trimmed = raw.trim();
  return trimmed || null;
}

export function isExternalSliderHref(href) {
  return (
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href)
  );
}

/** Normalize internal app paths for Next.js router / Link. */
export function toSliderNavigationHref(href) {
  if (!href) return null;
  if (isExternalSliderHref(href)) return href;
  return href.startsWith("/") ? href : `/${href}`;
}
