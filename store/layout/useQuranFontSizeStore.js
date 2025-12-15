import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useQuranFontSizeStore = create(
  persist(
    (set) => ({
      quranFontSize: 50,
      setQuranFontSize: (quranFontSize) => set({ quranFontSize }),
    }),
    {
      name: "quran-font-size-store",
    }
  )
);
