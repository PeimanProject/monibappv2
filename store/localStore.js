import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocaleStore = create(
    persist(
        (set) => ({
            locale: "fa",
            setLocale: (newLocale) => set({ locale: newLocale })
        }),
        { name: 'locale-storage' }
    )
);