import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const usePlayerHistoryStore = create(
    persist(
        (set, get) => ({
            history: {}, // ساختار: { lectureId: lastTime }

            // ذخیره زمان جدید
            savePosition: (lectureId, time) => set((state) => ({
                history: { ...state.history, [lectureId]: time }
            })),

            // گرفتن زمان ذخیره شده
            getPosition: (lectureId) => {
                return get().history[lectureId] || 0;
            },
        }),
        {
            name: 'player-history-storage', // نام کلید در localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);