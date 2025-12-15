import { create } from "zustand";

export const usePlayerActionStore = create((set) => ({
  show: false,
  data: null,
  pictureInPicture: false,
  setShow: (show, data, pictureInPicture = false) =>
    set({ show, data, pictureInPicture }),
}));
