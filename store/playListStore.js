import { GetUserPlayList } from "@/app/data/user/playlist/route";
import { create } from "zustand";

export const useMyPlayListStore = create((set) => ({
  list: null,
  loading: false,
  error: null,
  setList: (list) => set({ list }),
  fetchList: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await GetUserPlayList(token)
      set({ loading: false, list: response });
    } catch (err) {
      set({ error: err?.message, loading: false });
    }
  },
}));
