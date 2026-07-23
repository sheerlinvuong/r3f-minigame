import { useAssets } from "../stores/useAssets";
import { Clone } from "@react-three/drei";

export function FoodItem({ type }) {
  const { foodAssets } = useAssets();
  const food = foodAssets[type];

  return <Clone object={food.object} scale={food.scale} />;
}
