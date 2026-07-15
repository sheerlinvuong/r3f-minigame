import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useRef } from 'react'
import { vec3 } from 'gl-matrix'


export default function Player() {
    const body = useRef()
    const [subscribeKeys, getKeys] = useKeyboardControls()

    const speed = 0.1
    let position = {}
    position["current"] = vec3.fromValues(1, 2, 1)
    position["previous"] = vec3.clone(position.current)

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward } = getKeys()

        if (forward) {
            position.current[0] += speed
        }
        if (rightward) {
            position.current[2] += speed
        }
        if (backward) {
            position.current[0] -= speed
        }
        if (leftward) {
            position.current[2] -= speed
        }

        body.current.position.set(position.current[0], position.current[1], position.current[2])
    })

    return <>
        <mesh ref={body} castShadow scale={2} position={[2, 2, 0]}>
            <boxGeometry />
            <meshStandardMaterial flatShading={true} color="mediumpurple" />
        </mesh>

    </>

}