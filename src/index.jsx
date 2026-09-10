import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { KeyboardControls } from "@react-three/drei";
import GameManager from "./components/GameManager.jsx";
import Debug from "./components/Debug.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-5, 8, -12],
      }}
    >
      <axesHelper args={[50]} />
      <Experience />
    </Canvas>
    <GameManager />
    {/* <Debug /> */}
  </>,
);
