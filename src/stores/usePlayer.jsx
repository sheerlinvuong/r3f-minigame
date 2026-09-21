import { create } from "zustand";
import FoodData from "../FoodData";

const initialPlayerArray = [
  {
    id: "player1",
    label: "1P",
    colour: "blue",
    score: 0,
    collectedFood: [],
  },
  {
    id: "player2",
    label: "2P",
    colour: "red",
    score: 0,
    collectedFood: [],
  },
  {
    id: "player3",
    label: "3P",
    colour: "green",
    score: 0,
    collectedFood: [],
  },
  {
    id: "player4",
    label: "4P",
    colour: "gold",
    score: 0,
    collectedFood: [],
  },
];

export default create((set) => {
  return {
    comboPoints: 10,

    players: initialPlayerArray,

    winner: 0,

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

    calculateWinner: () =>
      set((state) => ({
        winner: state.players.reduce((prev, curr) =>
          prev.score > curr.score ? prev : curr,
        ),
      })),

    resetScore: () =>
      set((state) => ({
        players: initialPlayerArray,
        winner: 0,
      })),
  };
});
