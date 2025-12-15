import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSyncMediaSourceStore = create(
  persist(
    (set) => ({
      sync: { lectureId: null, time: null },
      isHydrated: false,
      setSync: (sync) => set({ sync }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "sync-media-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export const useSyncVerseMediaSourceStore = create(
  persist(
    (set) => ({
      sync: { surah: null, verse: null, time: null },
      isHydrated: false,
      setSync: (sync) => set({ sync }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "sync-media-store",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
