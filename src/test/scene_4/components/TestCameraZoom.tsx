import { Canvas, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
// import { OrbitControls } from "@react-three/drei";

function Box({ position }: { position: [number, number, number] }) {
    const ref = useRef<THREE.Mesh>(null!);
    const { camera } = useThree();

    const handleClick = () => {
        const target = new THREE.Vector3();
        ref.current.getWorldPosition(target);

        console.log("Target Position", ref.current.position);

        // Camera offset (in front of object)
        const direction = new THREE.Vector3()
            .subVectors(camera.position, target)
            .normalize();

        const newCamPos = target.clone().add(direction.multiplyScalar(5));

        // 🎥 Animate camera position
        gsap.to(camera.position, {
            x: newCamPos.x,
            y: newCamPos.y + 1,
            z: newCamPos.z,
            duration: 1,
            ease: "power3.inOut",
            onUpdate: () => {
                camera.lookAt(target);
            },
        });
    };

    console.log("camera Position", camera.position);

    return (
        <mesh ref={ref} position={position} onClick={handleClick}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#4cc9f0" />
        </mesh>
    );
}

const TestCameraZoom = () => {
    return (
        <div className="w-screen h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                {/* Light */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                {/* 📦 Test meshes */}
                <Box position={[-4, 0, 0]} />
                <Box position={[4, 0, 0]} />

                {/* <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    maxPolarAngle={Math.PI / 2}
                /> */}
            </Canvas>
        </div>
    );
};

export default TestCameraZoom;
