import { create } from "zustand";

export const useAuthLoginStore = create((set) => ({
  show: false,
  setShow: (show) => set({show}),
}));

export const useProfileStore = create((set) => ({
  show: false,
  setShow: (show) => set({show}),
}));
