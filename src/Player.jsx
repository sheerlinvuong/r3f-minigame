import * as THREE from "three";
import {
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Character } from "./components/Character";

function lerpAngle(current, target, alpha) {
  const difference = Math.atan2(
    Math.sin(target - current),
    Math.cos(target - current),
  );

  return current + difference * alpha;
}

const START_POSITION = [0, 2, 0];
const SPEED = 4;
const ROTATION_LERP = 0.1;

const GRAB_COLLECT_WINDOW = 300;
const GRAB_ANIMATION_DURATION = 2000;

const IDLE_ANIMATION = "0028_OUJI";
const WALK_ANIMATION = "0003_OUJI";
const GRAB_ANIMATION = "0056_OUJI";

const UP = new THREE.Vector3(0, 1, 0);
const sensorOffset = new THREE.Vector3(0, 0.2, 1.1); // this places the offset from body

export default function Player() {
  const body = useRef();
  const sensorBody = useRef();
  const playerRef = useRef();
  const collectTimeout = useRef();
  const animationTimeout = useRef();

  const [_, getKeys] = useKeyboardControls();
  const [animation, setAnimation] = useState(IDLE_ANIMATION);

  // SensorBody
  const rotationTarget = useRef(0);
  const sensorPosition = useRef(new THREE.Vector3());
  const sensorQuaternion = useRef(new THREE.Quaternion());

  // Eating/Grab
  const isBusy = useRef(false); // blocks movement, lasts the full animation
  const isCollecting = useRef(false); // short pulse, food collection only happens here
  const previousGrab = useRef(false);
  const sensorUserData = useRef({
    type: "player",
    id: "player1",
    isGrabbing: false,
  }).current;

  useEffect(() => {
    return () => {
      clearTimeout(collectTimeout.current);
      clearTimeout(animationTimeout.current);
    };
  }, []);

  function playAnimation(name) {
    if (animation !== name) setAnimation(name);
  }

  useFrame(() => {
    if (!body.current || !sensorBody.current) return;

    const { forward, backward, leftward, rightward, grab } = getKeys();
    const vel = body.current.linvel();
    const movement = {
      x: 0,
      z: 0,
    };

    const justPressedGrab = grab && !previousGrab.current;
    previousGrab.current = grab;

    if (justPressedGrab && !isBusy.current) {
      isBusy.current = true;
      isCollecting.current = true;
      playAnimation(GRAB_ANIMATION);

      collectTimeout.current = setTimeout(() => {
        isCollecting.current = false;
      }, GRAB_COLLECT_WINDOW);

      animationTimeout.current = setTimeout(() => {
        isBusy.current = false;
      }, GRAB_ANIMATION_DURATION);
    }

    if (!isBusy.current) {
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
    }

    const isMoving = movement.x !== 0 || movement.z !== 0;

    if (isMoving) {
      rotationTarget.current = Math.atan2(movement.x, movement.z);
      vel.x = SPEED * movement.x;
      vel.z = SPEED * movement.z;
    } else {
      vel.x = 0;
      vel.z = 0;
    }

    body.current.setLinvel(vel, true);

    if (!isBusy.current) {
      playAnimation(isMoving ? WALK_ANIMATION : IDLE_ANIMATION);
    }

    const rotation = lerpAngle(
      playerRef.current.rotation.y,
      rotationTarget.current,
      ROTATION_LERP,
    );
    playerRef.current.rotation.y = rotation;

    sensorQuaternion.current.setFromAxisAngle(UP, rotation);
    sensorPosition.current
      .copy(sensorOffset)
      .applyQuaternion(sensorQuaternion.current);

    const playerPosition = body.current.translation();
    sensorBody.current.setTranslation(
      {
        x: playerPosition.x + sensorPosition.current.x,
        y: playerPosition.y + sensorPosition.current.y,
        z: playerPosition.z + sensorPosition.current.z,
      },
      true,
    );

    sensorBody.current.setRotation(sensorQuaternion.current, true);
    sensorUserData.isGrabbing = isCollecting.current;
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        position={START_POSITION}
        lockRotations
      >
        <group ref={playerRef}>
          <Character position-y={-0.7} animation={animation} />
          <CapsuleCollider args={[0.25, 0.5]} />
        </group>
      </RigidBody>

      <RigidBody
        ref={sensorBody}
        type="dynamic"
        gravityScale={0}
        colliders={false}
        lockRotations
        userData={sensorUserData}
      >
        <CuboidCollider args={[0.2, 0.1, 0.5]} />
      </RigidBody>
    </>
  );
}
