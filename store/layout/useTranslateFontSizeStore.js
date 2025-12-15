import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTranslateFontSizeStore = create(
  persist(
    (set) => ({
      translateFontSize: 50,
      setTranslateFontSize: (translateFontSize) => set({ translateFontSize }),
    }),
    {
      name: "translate-font-size-store",
    }
  )
);
