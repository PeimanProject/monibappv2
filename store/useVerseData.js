import { create } from "zustand";

export const useVerseDataStore = create((set) => ({
  title: null,
  subText: null,
  mode: "normal",
  setVerse: (title, subText, mode) => set({ title, subText, mode }),
}));
