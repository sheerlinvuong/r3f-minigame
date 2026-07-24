import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import FoodData from "../FoodData.jsx";

export function useAssets() {
  const { nodes } = useGLTF("/assets/models/pancake_assetss.glb");

  const foodAssets = useMemo(() => {
    return Object.fromEntries(
      Object.entries(FoodData).map(([key, value]) => [
        key,
        {
          ...value,
          object: nodes[key],
        },
      ]),
    );
  }, [nodes]);

  return {
    foodAssets,
    plateAsset: nodes.Plate,
  };
}

useGLTF.preload("/assets/models/pancake_assetss.glb");
