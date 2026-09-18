import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const WANDER_RADIUS = 5.5; // roughly where plates sit
const DIRECTION_CHANGE_INTERVAL = 2000; // ms
const GRAB_INTERVAL = 1500; // ms

export function useAutoInput() {
  const state = useRef({
    forward: false,
    backward: false,
    leftward: false,
    rightward: false,
    grab: false,
  });

  const angle = useRef(Math.random() * Math.PI * 2);
  const lastDirectionChange = useRef(0);
  const lastGrab = useRef(0);

  useFrame((_, delta) => {
    lastDirectionChange.current += delta * 1000;
    lastGrab.current += delta * 1000;

    // Occasionally pick a new wander direction
    if (lastDirectionChange.current > DIRECTION_CHANGE_INTERVAL) {
      angle.current += (Math.random() - 0.5) * Math.PI; // turn by up to ±90°
      lastDirectionChange.current = 0;
    }

    // Convert angle into simple forward/leftward booleans your Player.jsx already understands
    state.current.forward = Math.cos(angle.current) > 0.3;
    state.current.backward = Math.cos(angle.current) < -0.3;
    state.current.leftward = Math.sin(angle.current) > 0.3;
    state.current.rightward = Math.sin(angle.current) < -0.3;

    // Periodically try to grab — harmless if nothing's nearby, since collection
    // still depends on the sensor actually overlapping food
    if (lastGrab.current > GRAB_INTERVAL) {
      state.current.grab = true;
      lastGrab.current = 0;
    } else {
      state.current.grab = false;
    }
  });

  // Returning a function (not the object directly) matches useKeyboardControls' shape:
  // Player.jsx calls getKeys() each frame expecting fresh values.
  return () => state.current;
}
