import { useGLTF } from "@react-three/drei";

//TO DO [] Create points system & state

export const Menu = {
  Pancake_Bottom: {
    node: "Pancake_Bottom",
    price: 2.5,
    name: "Pancake_Bottom",
    scale: 0.4,
  },
  Cream: {
    node: "Cream",
    price: 5.5,
    name: "Cream",
    scale: 0.25,
  },
  Strawberry: {
    node: "Strawberry",
    price: 4.1,
    name: "Strawberry",
    scale: 0.05,
  },
  Syrup: {
    node: "Syrup",
    price: 4.1,
    name: "Syrup",
    scale: 0.3,
  },
};

export function useFoods() {
  return useGLTF("/pancake_assets.glb");
}

useGLTF.preload("/pancake_assets.glb");

// math rand between 0 and menulength, then get colour
// or lets import now
// console.log(x, y);

//    const RandNode = Math.floor(Math.random() * pancakeNodesArray.length);
//    console.log("test", RandNode, pancakeNodesArray[RandNode]);
//    const clone = useMemo(
//      () => jelly.nodes[pancakeNodesArray[RandNode]].clone(),
//      [jelly.node],
//    );

//   const jelly = useGLTF("./pancake_colour.glb");
//   console.log(jelly);
//   const pancakeNodesArray = Object.keys(jelly.nodes);

// function Pancake() {
//   const jelly = useGLTF("./pancake_assets.glb");
//   const clone = useMemo(() => jelly.scene.clone(), [jelly.scene]);

//   return <primitive object={clone} scale={0.3} />;
// }
