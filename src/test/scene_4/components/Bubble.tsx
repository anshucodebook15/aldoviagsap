import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
// import Droplets from "./Droplets";
import FeatherMain from "./Feather";
// import Droplets from "./Droplets";

type Props = {
    position: [number, number, number];
    radius?: number;
    onBurst?: () => void;
    id: string | number;
    setActiveId: (id: any) => void;
};

const Bubble = ({ position, radius = 1, onBurst, id, setActiveId }: Props) => {
    const groupRef = useRef<THREE.Group>(null!);
    const bubbleMeshRef = useRef<THREE.Mesh>(null!);

    const [burst, setBurst] = useState(false);
    const [_droplets, setDroplets] = useState(false);

    const handleClick = () => {
        if (burst) return;

        setBurst(true);
        setDroplets(true);
        onBurst?.();

        // Scale whole bubble + feather
        gsap.to(groupRef.current.scale, {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            duration: 0.18,
        });

        // Fade only bubble shell
        gsap.to(bubbleMeshRef.current.material, {
            opacity: 0,
            duration: 0.22,
            onComplete: () => {
                bubbleMeshRef.current.visible = false;
            },
        });
    };

    // Floating motion (entire group)
    useFrame(({ clock }) => {
        if (!burst) {
            groupRef.current.position.y =
                position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.05;
        }
    });

    return (
        <>
            <group ref={groupRef} position={position} onClick={handleClick}>
                {/* 🫧 Bubble shell */}
                <mesh ref={bubbleMeshRef}>
                    <sphereGeometry args={[radius, 64, 64]} />
                    {/* <meshPhysicalMaterial
                        transparent
                        opacity={0.35}
                        roughness={0}
                        metalness={0}
                        transmission={1}
                        thickness={0.6}
                        clearcoat={1}
                    /> */}

                    {/* <meshPhysicalMaterial
                        transparent
                        opacity={0.35}
                        roughness={0.05}
                        metalness={0}
                        transmission={1}
                        thickness={1}
                        ior={1.45}
                        clearcoat={1}
                        clearcoatRoughness={0.05}
                        envMapIntensity={1.5}
                    /> */}
                    {/* <meshPhysicalMaterial
                        transparent
                        opacity={0.25}
                        roughness={0.18}
                        metalness={0}
                        transmission={1}
                        thickness={0.9}
                        ior={1.35}
                        clearcoat={1}
                        clearcoatRoughness={0.03}
                        envMapIntensity={2}
                    /> */}

                    <meshPhysicalMaterial
                        transparent
                        opacity={0.14}
                        roughness={0.7}
                        metalness={0.2}
                        transmission={1.2}
                        thickness={0.6}
                        ior={1.8}
                        clearcoat={1}
                        clearcoatRoughness={0.03}
                        envMapIntensity={2}
                    />
                </mesh>

                {/* 🪶 Feather perfectly centered */}
                <group scale={1}>
                    <FeatherMain id={id} isActive={false} setActiveId={setActiveId} />
                </group>
            </group>

            {/* {_droplets && (
                <Droplets
                    position={position}
                    count={500}
                    onComplete={() => setDroplets(false)}
                />
            )} */}
        </>
    );
};

export default Bubble;
