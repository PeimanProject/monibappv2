import { create } from "zustand";

export const useNavBarStore = create((set) => ({
  navBar: {},
  links: [],
  setNavBar: (navBar) => set({ navBar })
}));
