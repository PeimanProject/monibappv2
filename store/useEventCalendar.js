import { create } from "zustand";

export const useEventCalendarStore = create((set) => ({
  event: null,
  setEvent: (event) => set({ event }),
}));
