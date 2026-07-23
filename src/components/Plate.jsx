import { useAssets } from "../stores/useAssets";
import { Clone } from "@react-three/drei";

export function Plate({ ...props }) {
  const { plateAsset } = useAssets();

  return <Clone object={plateAsset} {...props} />;
}
