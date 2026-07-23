import { MeshCollider, RigidBody, BallCollider } from "@react-three/rapier";
import { useMemo, useState } from "react";
//TO DO [] Import diff foods
import { Clone } from "@react-three/drei";
import { useFoods, Menu } from "./stores/useFoods";

export function Food({ type, ...props }) {
  const { nodes } = useFoods();
  const food = Menu[type];

  return <Clone object={nodes[food.node]} scale={food.scale} {...props} />;
}

export function Plate({ ...props }) {
  const { nodes } = useFoods();
  return <Clone object={nodes["Plate"]} {...props} />;
}

function randomFoodName() {
  const MenuNames = Object.keys(Menu);
  const randomNumber = Math.floor(Math.random() * MenuNames.length);
  return MenuNames[randomNumber]; // string
}

export default function Items() {
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

  function collectFood(id) {
    // Award points...

    // Remove the food immediately
    setFoods((prev) => {
      const next = [...prev];
      next[id] = null;
      return next;
    });

    // Respawn after 5 seconds
    setTimeout(() => {
      setFoods((prev) => {
        const next = [...prev];
        next[id] = randomFoodName();
        return next;
      });
    }, 5000);
  }

  return platePositions.map((plate) => (
    <group key={plate.id} position={plate.position}>
      <group position-y={0.15}>
        <Plate scale={0.6} />
      </group>
      {foods[plate.id] && (
        <>
          <Food type={foods[plate.id]} />
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
