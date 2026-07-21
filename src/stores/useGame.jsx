import { create } from "zustand";

const Menu = [
  {
    price: 2.5,
    name: "Jelly",
    colour: "white",
  },
  {
    price: 5.5,
    name: "Pancake",
    colour: "mediumpurple",
  },
  {
    price: 4.1,
    name: "Cube",
    colour: "dustypink",
  },
];

// Game loop
//1. Intro card                             Ready -> Set Playing
//3. Timer start                            Playing
//2. Countdown 321...Start! Food appears    Playing
//4. Timer End                              Set Ended
//5. Calculate winner                       Ended -> Set Ready
//5. restart/ intro card

export default create((set) => {
  return {
    /**
     * Phases
     */
    phase: "ready",
    isCountdown: false,

    start: () => {
      set({ phase: "playing" });
      // hide interface
      // countdown begin

      //   setTimeout(() => {
      //     set((state) => ({ phase: "ended" }));
      //   }, 5000);
      setTimeout(() => {
        end();
      }, 5000);
    },
    restart: () => {
      set(() => {
        return { phase: "ready" };
      });
    },

    end: () => {
      set(() => {
        return { phase: "ended" };
      });
    },
  };
});
