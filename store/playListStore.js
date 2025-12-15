import { create } from "zustand";

export const useMyPlayListStore = create((set) => ({
  list: null,
  loading: false,
  error: null,
  setList: (list) => set({ list }),
  fetchList: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/user/playlist`, {
        method: "GET",
      });
      const list = await response?.json();
      set({ loading: false, list });
    } catch (err) {
      set({ error: err?.message, loading: false });
    }
  },
}));
