import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";
// import { OrbitControls } from "@react-three/drei";

function Box({ position, onFocus }: any) {
    const ref = useRef<THREE.Mesh>(null!);
    // const { camera } = useThree();

    const handleClick = () => {
        const target = new THREE.Vector3();
        ref.current.getWorldPosition(target);

        onFocus(target); // notify parent
    };

    return (
        <mesh ref={ref} position={position} onClick={handleClick}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#4cc9f0" />
        </mesh>
    );
}





function CameraController({
    target,
}: {
    target: THREE.Vector3 | null;
}) {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);
    const progressRef = useRef(0);
    const isAnimating = useRef(false);

    useEffect(() => {
        if (!target) return;

        // 🔴 Stop any previous animation
        gsap.killTweensOf(progressRef);
        isAnimating.current = false;

        // 🔒 Disable controls BEFORE anything moves
        if (controlsRef.current) {
            controlsRef.current.enabled = false;
        }

        // ✅ EXACT current camera position (no offset)
        const start = camera.position.clone();

        // 🎯 Final camera position (front view)
        const end = new THREE.Vector3(
            target.x,
            target.y + 0.5,
            target.z + 5
        );

        // 🎥 Control point — curve ONLY, does NOT affect start
        const mid = start.clone().lerp(end, 0.5);
        mid.y += 2; // subtle lift
        mid.x += 1; // subtle arc

        // Build curve ONCE
        curveRef.current = new THREE.CatmullRomCurve3(
            [start, mid, end],
            false,
            "catmullrom",
            0.5
        );

        progressRef.current = 0;
        isAnimating.current = true;

        // Animate progress ONLY
        gsap.to(progressRef, {
            current: 1,
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: () => {
                isAnimating.current = false;

                if (controlsRef.current) {
                    controlsRef.current.target.copy(target);
                    controlsRef.current.enabled = true;
                }
            },
        });
    }, [target, camera]);

    // 🚀 Camera moves ONLY here (single source of truth)
    useFrame(() => {
        if (!curveRef.current || !isAnimating.current) return;

        const point = curveRef.current.getPoint(progressRef.current);
        camera.position.copy(point);

        if (target) camera.lookAt(target);
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enabled={false}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.4}
            minAzimuthAngle={-Math.PI / 8}
            maxAzimuthAngle={Math.PI / 8}
            minPolarAngle={Math.PI / 2.15}
            maxPolarAngle={Math.PI / 1.85}
        />
    );
}



const TestCameraZoom = () => {
    const [target, setTarget] = useState<THREE.Vector3 | null>(null);
    // const [_focused, setFocused] = useState(false);

    return (
        <div className="w-screen h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <Box position={[-4, 0, 0]} onFocus={setTarget} />
                <Box position={[4, 0, 0]} onFocus={setTarget} />

                {target && (
                    <CameraController target={target} />
                )}
            </Canvas>
        </div>
    );
};

export default TestCameraZoom;
