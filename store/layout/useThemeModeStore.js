import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeModeStore = create(
  persist(
    (set) => ({
      mode: "light",
      isHydrated: false,
      setMode: (mode) => set({ mode }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "theme-mode-store",
      onRehydrateStorage: () => (state) => {        
        state?.setHydrated();
      },
    }
  )
);
