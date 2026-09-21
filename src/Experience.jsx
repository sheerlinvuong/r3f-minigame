import { OrbitControls, KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Player from "./Player.jsx";
import Lights from "./Lights.jsx";
import Level from "./Level.jsx";
import { Character } from "./components/Character";
import { CharacterTwo } from "./components/CharacterTwo";
import { CharacterThree } from "./components/CharacterThree";
import { CharacterFour } from "./components/CharacterFour";
import { useAutoInput } from "./stores/useAutoInput.jsx";

const player1Map = [
  { name: "forward", keys: ["KeyW"] },
  { name: "backward", keys: ["KeyS"] },
  { name: "leftward", keys: ["KeyA"] },
  { name: "rightward", keys: ["KeyD"] },
  { name: "grab", keys: ["Space"] },
];

const player2Map = [
  { name: "forward", keys: ["ArrowUp"] },
  { name: "backward", keys: ["ArrowDown"] },
  { name: "leftward", keys: ["ArrowLeft"] },
  { name: "rightward", keys: ["ArrowRight"] },
  { name: "grab", keys: ["Enter"] },
];

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics>
        <Lights />
        <Level />
        <KeyboardControls map={player1Map}>
          <Player
            playerId="player1"
            startPosition={[-2, 2, -2]}
            CharacterComponent={Character}
          />
        </KeyboardControls>
        <KeyboardControls map={player2Map}>
          <Player
            playerId="player2"
            startPosition={[2, 2, -2]}
            CharacterComponent={CharacterTwo}
          />
        </KeyboardControls>
        <Player
          playerId="player3"
          startPosition={[-2, 2, 2]}
          CharacterComponent={CharacterThree}
          useInput={useAutoInput}
        />
        <Player
          playerId="player4"
          startPosition={[2, 2, 2]}
          CharacterComponent={CharacterFour}
          useInput={useAutoInput}
        />
      </Physics>
    </>
  );
}
