export const desktopValues = ({ theme, bTheme }) => ({
  BORDER: 3,
  APP_HEIGHT: 40,
  CALENDAR_APP_HEIGHT: 64,
  CALENDAR_Tools_HEIGHT: 58,
  TITLE_HEIGHT: 86,
  TITLE_HEIGHT_MIN: 46,
});

/** Sticky offset inside `.app-shell__main` (header is outside the scroll area). */
export const mobileStickyTop = (desktop = false) =>
  desktop ? 64 : "var(--app-sticky-top, 0px)";

export const mobileStickyTopOffset = (desktop = false, ...offsetPx) => {
  const extra = offsetPx.reduce((sum, n) => sum + n, 0);
  if (desktop) return 64 + extra;
  if (extra === 0) return "var(--app-sticky-top, 0px)";
  return `calc(var(--app-sticky-top, 0px) + ${extra}px)`;
};

export const appConfig = {
  name: "Monib",
  subName: "AI",
  version: "2.1",
  type: "blue",
  status: "",
  title: "سامانه منیب",
  description: `منیب سامانه جامع آثار و سخنرانی‌های محمد علی انصاری`,
  author:"محمدعلی انصاری"
};
