import { create } from "zustand";
import FoodData from "../FoodData";

const initialPlayerArray = [
  {
    id: "player1",
    score: 0,
    collectedFood: [],
  },
  {
    id: "player2",
    score: 0,
    collectedFood: [],
  },
];

export default create((set) => {
  return {
    comboPoints: 10,

    players: initialPlayerArray,

    logCollectedFood: (playerId, foodName) =>
      set((state) => ({
        players: state.players.map((player) =>
          player.id === playerId
            ? {
                ...player,
                collectedFood: [...player.collectedFood, foodName],
              }
            : player,
        ),
      })),

    calculateScore: () =>
      set((state) => ({
        players: state.players.map((player) => {
          let totalScore = 0;
          let streak = 0;
          let previousItem = null;

          player.collectedFood.forEach((item) => {
            totalScore += FoodData[item].price;
            // Award bonus points for 3 in a row
            if (previousItem === item) {
              streak++;
              if (streak === 2) {
                totalScore += state.comboPoints;
                streak = 0;
              }
            } else {
              streak = 0;
            }
            previousItem = item;
          });

          return {
            ...player,
            score: totalScore,
          };
        }),
      })),

    resetScore: () =>
      set((state) => ({
        players: initialPlayerArray,
      })),
  };
});
