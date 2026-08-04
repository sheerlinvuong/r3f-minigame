import { useMemo, useState } from "react";
import { MeshCollider, RigidBody, BallCollider } from "@react-three/rapier";
import FoodData from "../FoodData";
import { FoodItem } from "./FoodItem";
import { Plate } from "./Plate";
import usePlayer from "../stores/usePlayer";
import useGame from "../stores/useGame";

const MenuNames = Object.keys(FoodData);

function randomFoodName() {
  const randomNumber = Math.floor(Math.random() * MenuNames.length);
  return MenuNames[randomNumber]; // string
}

export default function TableItems() {
  const radius = 5; // Circle radius
  const totalItems = 12;
  const itemLength = new Array(totalItems).fill(0);

  const platePositions = useMemo(() => {
    return itemLength.map((_, i) => {
      const angle = (i * 2 * Math.PI) / totalItems;
      return {
        id: i,
        position: [radius * Math.cos(angle), 0, radius * Math.sin(angle)],
      };
    });
  }, []);

  const [foods, setFoods] = useState(() =>
    platePositions.map(() => randomFoodName()),
  );

  const logCollectedFood = usePlayer((state) => state.logCollectedFood);

  function collectFood(id) {
    logCollectedFood("player1", foods[id]);

    setFoods((prev) => {
      const next = [...prev];
      next[id] = null;
      return next;
    });

    // Respawn after 5 seconds
    // TODO spawn rate weighting
    setTimeout(() => {
      setFoods((prev) => {
        const next = [...prev];
        next[id] = randomFoodName();
        return next;
      });
    }, 5000);
  }

  const phase = useGame((state) => state.phase);
  // TODO get some transitions on in and out

  return platePositions.map((plate) => (
    <group key={plate.id} position={plate.position}>
      <group position-y={0}>
        <Plate scale={0.28} />
      </group>
      {foods[plate.id] && phase === "playing" && (
        <>
          <FoodItem type={foods[plate.id]} />
          <BallCollider
            args={[0.5]}
            //   position={[0, 0.5, 0]}
            sensor
            onIntersectionEnter={() => collectFood(plate.id)}
          />
        </>
      )}
    </group>
  ));
}
