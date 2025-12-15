import { create } from "zustand";

export const useCurrentVerseStore = create((set) => ({
  verse: null,
  setVerse: (verse) => set({ verse }),
}));
