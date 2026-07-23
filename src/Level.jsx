import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import TableItems from "./components/TableItems";

function Environment() {
  //TO DO [] Create points UI
  return (
    // Floor
    <RigidBody type="fixed" colliders={false}>
      <mesh receiveShadow scale={[4, 0.2, 4]}>
        <boxGeometry />
        <meshStandardMaterial color="greenyellow" wireframe={false} />
      </mesh>
      <CuboidCollider args={[2, 0.1, 2]} restitution={0.2} friction={10} />
    </RigidBody>
  );
}

const ringGeometry = new THREE.RingGeometry(4, 6, 32);

export default function Level() {
  const tableRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time / 5, 0));
    if (tableRef.current) {
      tableRef.current.setNextKinematicRotation(rotation);
    }
  });
  return (
    <>
      {/* Table & Items */}
      <group position-y={1}>
        {/* Items */}
        <RigidBody ref={tableRef} type="kinematicPosition" colliders={false}>
          <TableItems />
        </RigidBody>

        {/* Table */}
        <mesh
          castShadow
          geometry={ringGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial
            side={THREE.DoubleSide}
            color={new THREE.Color().setHex(0xdeb887)}
          />
        </mesh>
      </group>

      <group scale={4}>
        <Environment />
      </group>
    </>
  );
}
