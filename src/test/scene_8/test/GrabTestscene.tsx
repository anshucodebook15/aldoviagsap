import { Canvas } from "@react-three/fiber";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Box({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);

  const isDragging = useRef(false);
  const targetRot = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    document.body.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;

    // 🧠 Mouse → 3D rotation
    targetRot.current.y += e.movementX * 0.01; // left/right
    targetRot.current.x += e.movementY * 0.01; // up/down

    // Optional clamp (prevents flipping)
    targetRot.current.x = THREE.MathUtils.clamp(
      targetRot.current.x,
      -Math.PI / 2,
      Math.PI / 2,
    );
  };

  useFrame(() => {
    if (!ref.current) return;

    // Smooth damping
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetRot.current.x,
      0.15,
    );

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetRot.current.y,
      0.15,
    );
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        if (!isDragging.current) {
          document.body.style.cursor = "default";
        }
      }}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4cc9f0" />
    </mesh>
  );
}

const GrabRotateScene = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <Box position={[-4, 0, 0]} />
        <Box position={[4, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default GrabRotateScene;
