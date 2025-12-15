import { create } from "zustand";

export const useMainMenuStore = create((set) => ({
  show: false,
  setShow: (show) => set({show}),
}));
