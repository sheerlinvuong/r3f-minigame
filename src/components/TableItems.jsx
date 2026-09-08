import { useMemo, useState, useRef } from "react";
import { BallCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import FoodData from "../FoodData";
import { FoodItem } from "./FoodItem";
import { Plate } from "./Plate";
import usePlayer from "../stores/usePlayer";
import useGame from "../stores/useGame";

const MenuNames = Object.keys(FoodData);
const RADIUS = 5;
const TOTAL_ITEMS = 12;
const RESPAWN_DELAY = 5000;

function randomFoodName() {
  const randomNumber = Math.floor(Math.random() * MenuNames.length);
  return MenuNames[randomNumber]; // string
}

export default function TableItems() {
  const platePositions = useMemo(() => {
    return Array.from({ length: TOTAL_ITEMS }, (_, i) => {
      const angle = (i * 2 * Math.PI) / TOTAL_ITEMS;
      return {
        id: i,
        position: [RADIUS * Math.cos(angle), 0, RADIUS * Math.sin(angle)],
      };
    });
  }, []);

  const [foods, setFoods] = useState(() =>
    platePositions.map(() => randomFoodName()),
  );
  const logCollectedFood = usePlayer((state) => state.logCollectedFood);
  const phase = useGame((state) => state.phase);
  // TODO get some transitions on in and out

  const overlapping = useRef({});
  const wasGrabbing = useRef(false);

  function collectFood(id, playerId) {
    logCollectedFood(playerId, foods[id]);

    setFoods((prev) => {
      const next = [...prev];
      next[id] = null;
      return next;
    });

    delete overlapping.current[id];

    // TODO spawn rate weighting
    setTimeout(() => {
      setFoods((prev) => {
        const next = [...prev];
        next[id] = randomFoodName();
        return next;
      });
    }, RESPAWN_DELAY);
  }

  useFrame(() => {
    const overlappingIds = Object.keys(overlapping.current);
    const isGrabbingNow = overlappingIds.some(
      (id) => overlapping.current[id]?.userData?.isGrabbing,
    );

    const justStartedGrabbing = isGrabbingNow && !wasGrabbing.current;
    wasGrabbing.current = isGrabbingNow;

    if (justStartedGrabbing) {
      const id = overlappingIds.find((id) => foods[id]);
      if (id !== undefined) {
        const playerId = overlapping.current[id]?.userData?.id;
        collectFood(id, playerId);
      }
    }
  });

  return platePositions.map((plate) => (
    <group key={plate.id} position={plate.position}>
      <Plate scale={0.28} />

      {foods[plate.id] && phase === "playing" && (
        <group
          userData={{
            type: "food",
            plateId: plate.id,
            food: foods[plate.id],
          }}
        >
          <FoodItem type={foods[plate.id]} />
          <BallCollider
            args={[0.5]}
            sensor
            onIntersectionEnter={({ rigidBody }) => {
              overlapping.current[plate.id] = rigidBody;
            }}
            onIntersectionExit={() => {
              delete overlapping.current[plate.id];
            }}
          />
        </group>
      )}
    </group>
  ));
}
