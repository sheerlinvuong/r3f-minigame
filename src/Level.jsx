import * as THREE from 'three'
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'


//TO DO [] Add player

function Environment() {
    //TO DO [] Create points UI

    return <>
        <mesh receiveShadow scale={[4, 0.2, 4]}>
            <boxGeometry />
            <meshStandardMaterial color="greenyellow" wireframe={false} />
        </mesh>
    </>
}

function Items() {
    //TO DO [] Import diff foods
    //TO DO [] Create points system

    const radius = 5; // Circle radius
    const totalPoints = 12;
    let coordArray = new Array(totalPoints).fill(0)

    return coordArray.map((item, i) => {
        const angle = (i * 2 * Math.PI) / totalPoints;

        // Calculate coordinates
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
            <mesh key={i} castShadow position={[x.toFixed(2), 0, y.toFixed(2)]} scale={0.75}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        )
    })
}

function Bounds() {
    return <>
        <RigidBody type="fixed" restitution={0.2} friction={0} >
            {/* <mesh scale={[4, 0.2, 4]}>
                <boxGeometry />
                <meshStandardMaterial wireframe color="blue" />
            </mesh> */}
            <CuboidCollider args={[2, 0.10, 2]}
                restitution={0.2}
                friction={1} />
        </RigidBody>
    </>
}


const ringGeometry = new THREE.RingGeometry(4, 6, 32);
export default function Level() {
    const tableRef = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time / 5, 0))
        tableRef.current.setNextKinematicRotation(rotation)
    })

    return <>
        {/* Main Area */}
        <RigidBody ref={tableRef} type="kinematicPosition">
            <group position-y={1} >
                {/* Items */}
                <group position-y={0.5}>
                    <Items />
                </group>
                {/* Table */}
                <mesh castShadow geometry={ringGeometry} rotation={[-Math.PI / 2, 0, 0]} position-x={0}>
                    <meshStandardMaterial side={THREE.DoubleSide} color={new THREE.Color().setHex(0xDEB887)} />
                </mesh>
            </group >
        </RigidBody>

        <group scale={4}>
            <Bounds />
        </group>
        <group scale={4}>
            <Environment />
        </group>
    </>
}
