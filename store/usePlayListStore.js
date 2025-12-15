import { create } from "zustand";

export const usePlayListStore = create((set) => ({
  show: false,
  setShow: (show) => set({ show }),
}));

export const useAddToPlayListStore = create((set) => ({
  show: false,
  item: null,
  setShow: (show, item) => set({ show, item }),
}));
