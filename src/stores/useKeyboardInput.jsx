import { useKeyboardControls } from "@react-three/drei";

export function useKeyboardInput() {
  const [, getKeys] = useKeyboardControls();
  return getKeys;
}
