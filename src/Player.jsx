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
import useGame from "./stores/useGame";
import usePlayer from "./stores/usePlayer";

function lerpAngle(current, target, alpha) {
  const difference = Math.atan2(
    Math.sin(target - current),
    Math.cos(target - current),
  );

  return current + difference * alpha;
}

const SPEED = 4;
const ROTATION_LERP = 0.1;
const FACE_CAMERA_ROTATION_Y = Math.PI;

const GRAB_COLLECT_WINDOW = 300;
const GRAB_ANIMATION_DURATION = 2000;

const IDLE_ANIMATION = "0028_OUJI";
const WALK_ANIMATION = "0003_OUJI";
const GRAB_ANIMATION = "0056_OUJI";
const WAITING_ANIMATION = "0022_OUJI";
const WIN_ANIMATION = "0097_OUJI";
const LOSE_ANIMATION = "0092_OUJI";

const UP = new THREE.Vector3(0, 1, 0);
const sensorOffset = new THREE.Vector3(0, 0.2, 1.1); // this places the offset from body

export default function Player({
  playerId,
  startPosition = [0, 2, 0],
  CharacterComponent = Character,
}) {
  const phase = useGame((state) => state.phase);
  const winner = usePlayer((state) => state.winner);
  const isWinner = playerId === winner.id;

  const body = useRef();
  const sensorBody = useRef();
  const playerRef = useRef();
  const collectTimeout = useRef();
  const animationTimeout = useRef();

  const [_, getKeys] = useKeyboardControls();
  const [animation, setAnimation] = useState(IDLE_ANIMATION);
  const rotationTarget = useRef(FACE_CAMERA_ROTATION_Y);

  // SensorBody
  const sensorPosition = useRef(new THREE.Vector3());
  const sensorQuaternion = useRef(new THREE.Quaternion());

  // Eating/Grab
  const isBusy = useRef(false); // blocks movement, lasts the full animation
  const isCollecting = useRef(false); // short pulse, food collection only happens here
  const previousGrab = useRef(false);
  const sensorUserData = useRef({
    type: "player",
    id: playerId,
    isGrabbing: false,
  }).current;

  useEffect(() => {
    return () => {
      clearTimeout(collectTimeout.current);
      clearTimeout(animationTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    if (!body.current) return;

    body.current.setTranslation(
      { x: startPosition[0], y: startPosition[1], z: startPosition[2] },
      true,
    );
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

    rotationTarget.current = FACE_CAMERA_ROTATION_Y;
    if (playerRef.current)
      playerRef.current.rotation.y = rotationTarget.current;

    isBusy.current = false;
    isCollecting.current = false;
    previousGrab.current = false;
    clearTimeout(collectTimeout.current);
    clearTimeout(animationTimeout.current);

    setAnimation(IDLE_ANIMATION);
  }, [phase, startPosition]);

  useEffect(() => {
    if (phase !== "results") return;
    rotationTarget.current = FACE_CAMERA_ROTATION_Y;
  }, [phase]);

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

    const canMove = phase === "playing";

    const justPressedGrab = grab && !previousGrab.current;
    previousGrab.current = grab;

    if (canMove && justPressedGrab && !isBusy.current) {
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

    if (canMove && !isBusy.current) {
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

    if (phase === "winner") {
      playAnimation(isWinner ? WIN_ANIMATION : LOSE_ANIMATION);
    } else if (phase === "results") {
      playAnimation(WAITING_ANIMATION);
    } else if (canMove && !isBusy.current) {
      playAnimation(isMoving ? WALK_ANIMATION : IDLE_ANIMATION);
    } else if (!isBusy.current) {
      playAnimation(IDLE_ANIMATION);
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
    sensorBody.current.setNextKinematicTranslation(
      {
        x: playerPosition.x + sensorPosition.current.x,
        y: playerPosition.y + sensorPosition.current.y,
        z: playerPosition.z + sensorPosition.current.z,
      },
      true,
    );

    sensorBody.current.setNextKinematicRotation(sensorQuaternion.current, true);
    sensorUserData.isGrabbing = isCollecting.current;
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders={false}
        position={startPosition}
        lockRotations
      >
        <group ref={playerRef}>
          <CharacterComponent position-y={-0.7} animation={animation} />
          <CapsuleCollider args={[0.25, 0.5]} />
        </group>
      </RigidBody>

      <RigidBody
        ref={sensorBody}
        type="kinematicPosition"
        colliders={false}
        lockRotations
        userData={sensorUserData}
      >
        <CuboidCollider args={[0.2, 0.1, 0.5]} sensor />
      </RigidBody>
    </>
  );
}
