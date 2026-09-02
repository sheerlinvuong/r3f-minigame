import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { Character } from "./components/Character";
import { MathUtils } from "three";

function lerpAngle(current, target, alpha) {
  const difference = Math.atan2(
    Math.sin(target - current),
    Math.cos(target - current),
  );

  return current + difference * alpha;
}

export default function Player() {
  const body = useRef();
  const [_, getKeys] = useKeyboardControls();
  const startPostion = [0, 2, 0];
  const speed = 4;

  const container = useRef();
  const rotationTarget = useRef(0);

  const [animation, setAnimation] = useState("0028_OUJI"); //idle

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    if (body.current) {
      const vel = body.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (forward) {
        movement.z = 1;
      }
      if (backward) {
        movement.z = -1;
      }
      if (leftward) {
        movement.x = 1;
      }
      if (rightward) {
        movement.x = -1;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        rotationTarget.current = Math.atan2(movement.x, movement.z);

        vel.x = speed * movement.x;
        vel.z = speed * movement.z;

        setAnimation("0003_OUJI");
      } else {
        setAnimation("0028_OUJI");
      }

      body.current.setLinvel(vel, true);
    }

    container.current.rotation.y = lerpAngle(
      container.current.rotation.y,
      rotationTarget.current,
      0.1,
    );
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={startPostion}
      lockRotations
    >
      <group ref={container}>
        <Character position-y={-0.7} animation={animation} />
        <CapsuleCollider args={[0.25, 0.5]} />
      </group>
    </RigidBody>
  );
}
