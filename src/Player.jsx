import { RigidBody } from '@react-three/rapier'


export default function Player() {

    return <>
        <RigidBody canSleep={false} colliders="ball" restitution={0.2} friction={1} position={[0, 1, 0]}>
            <mesh castShadow scale={2}>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading={true} color="mediumpurple" />
            </mesh>
        </RigidBody>
    </>

}