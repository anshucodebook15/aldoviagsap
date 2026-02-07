import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

type Props = {
  id: string | number;
  resetSignal: number;
};

const FeatherRotate = ({ id, resetSignal }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const isDragging = useRef(false);
  const targetRot = useRef({ x: 0, y: 0 });

  useGLTF("./models/feather_2.glb");

  console.log("works ", id);
  

  useEffect(() => {
    targetRot.current.x = 0;
    targetRot.current.y = 0;
  }, [resetSignal]);

  const onDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    document.body.style.cursor = "grabbing";
  };

  const onUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  };

  const onMove = (e: any) => {
    if (!isDragging.current) return;

    targetRot.current.y += e.movementX * 0.02;
    targetRot.current.x += e.movementY * 0.02;

    targetRot.current.x = THREE.MathUtils.clamp(
      targetRot.current.x,
      -Math.PI / 2,
      Math.PI / 2
    );
  };

  useFrame(() => {
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRot.current.x,
      0.15
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRot.current.y,
      0.15
    );
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.5, 0]}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerMove={onMove}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* TEMP BOX — replace with Feather mesh */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4cc9f0" />
      </mesh>
    </group>
  );
};

export default React.memo(FeatherRotate);
