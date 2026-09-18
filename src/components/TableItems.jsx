import { useMemo, useState, useRef, useEffect } from "react";
import { BallCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import FoodData from "../FoodData";
import { FoodItem } from "./FoodItem";
import { Plate } from "./Plate";
import usePlayer from "../stores/usePlayer";
import useGame from "../stores/useGame";
import { ActiveCollisionTypes } from "@dimforge/rapier3d-compat";

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
  const wasGrabbing = useRef({});

  useEffect(() => {
    if (phase !== "ready") return;
    overlapping.current = {};
    wasGrabbing.current = {};
  }, [phase]);

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
    const activePlayers = {};
    for (const plateId in overlapping.current) {
      for (const playerId in overlapping.current[plateId]) {
        activePlayers[playerId] = overlapping.current[plateId][playerId];
      }
    }

    for (const playerId in activePlayers) {
      const rigidBody = activePlayers[playerId];
      const isGrabbingNow = !!rigidBody?.userData?.isGrabbing;
      const justStartedGrabbing =
        isGrabbingNow && !wasGrabbing.current[playerId];
      wasGrabbing.current[playerId] = isGrabbingNow;

      if (justStartedGrabbing) {
        const plateId = Object.keys(overlapping.current).find(
          (id) => overlapping.current[id]?.[playerId] && foods[id],
        );
        if (plateId !== undefined) collectFood(plateId, playerId);
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
            activeCollisionTypes={
              ActiveCollisionTypes.DEFAULT |
              ActiveCollisionTypes.KINEMATIC_KINEMATIC
            }
            onIntersectionEnter={({ rigidBody }) => {
              const playerId = rigidBody?.userData?.id;
              if (!overlapping.current[plate.id]) {
                overlapping.current[plate.id] = {};
              }
              overlapping.current[plate.id][playerId] = rigidBody;
            }}
            onIntersectionExit={({ rigidBody }) => {
              const playerId = rigidBody?.userData?.id;
              if (playerId) delete overlapping.current[plate.id]?.[playerId];
            }}
          />
        </group>
      )}
    </group>
  ));
}
