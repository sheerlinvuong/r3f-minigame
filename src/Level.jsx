import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

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

function Items() {
  //TO DO [] Import diff foods
  //TO DO [] Create points system

  const radius = 5; // Circle radius
  const totalItems = 12;
  const itemLength = new Array(totalItems).fill(0);

  return itemLength.map((item, i) => {
    const angle = (i * 2 * Math.PI) / totalItems;

    // Calculate coordinates
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return (
      <mesh
        key={i}
        castShadow
        position={[x.toFixed(2), 0, y.toFixed(2)]}
        scale={0.75}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
    );
  });
}

const ringGeometry = new THREE.RingGeometry(4, 6, 32);

export default function Level() {
  const tableRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time / 5, 0));
    tableRef.current.setNextKinematicRotation(rotation);
  });
  return (
    <>
      {/* Table & Items */}
      <group position-y={1}>
        <RigidBody ref={tableRef} type="kinematicPosition" colliders="trimesh">
          {/* Items */}
          <group position-y={0.4}>
            <Items />
          </group>
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
        </RigidBody>
      </group>

      <group scale={4}>
        <Environment />
      </group>
    </>
  );
}
