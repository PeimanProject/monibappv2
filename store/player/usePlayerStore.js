import { create } from "zustand";
import { persist } from "zustand/middleware";

// export const useCCTypeStore = create((set) => ({
//   type: "fa",
//   setType: (type) => set({type}),
// }));

export const useCCTypeStore = create(
  persist(
    (set) => ({
      type: "fa",
      setType: (type) => set({ type }),
    }),
    {
      name: "cc-type-store",
    }
  )
);

export const useCurrentPositionStore = create((set) => ({
  current: 0,
  setPosition: (current) => set({ current }),
}));

export const useSoundControlStore = create((set) => ({
  audio: null,
  setAudio: (audio) => set({ audio }),
}));


export const useVideoControlStore = create((set) => ({
  video: null,
  setVideo: (video) => set({ video }),
}));
