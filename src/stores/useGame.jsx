import { create } from "zustand";

export default create((set) => {
  return {
    phase: "ready",

    start: () => set({ phase: "countdown" }),

    beginPlaying: () => set({ phase: "playing" }),

    endPlaying: () => set({ phase: "results" }),

    revealWinner: () => set({ phase: "winner" }),

    restart: () => set({ phase: "ready" }),
  };
});
