import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const startPostion = [0, 2, 0];
  const speed = 4;

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

      if (movement.z !== 0 || movement.x !== 0) {
        vel.x = speed * movement.x;
        vel.z = speed * movement.z;
      }

      body.current.setLinvel(vel, true);
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        position={startPostion}
        lockRotations
      >
        <mesh castShadow scale={0.5}>
          <capsuleGeometry />
          <meshStandardMaterial flatShading={true} color="orangered" />
        </mesh>
        <CapsuleCollider args={[0.25, 0.5]} />
      </RigidBody>
    </>
  );
}
