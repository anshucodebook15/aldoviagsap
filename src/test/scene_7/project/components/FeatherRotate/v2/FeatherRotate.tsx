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

  console.log("id", id);
  

  // 👉 drag rotation (unchanged)
  const targetRot = useRef({ x: 0, y: 0 });

  // 👉 RANDOM BASE ROTATION (NEW)
  const baseRot = useRef({ x: 0, y: 0, z: 0 });

  const { nodes, materials } = useGLTF("./models/featherkb.glb");

  // 🔥 generate random orientation ONCE
  useEffect(() => {
    baseRot.current = {
      x: THREE.MathUtils.randFloat(-0.4, 0.4),
      y: THREE.MathUtils.randFloat(-Math.PI, Math.PI),
      z: THREE.MathUtils.randFloat(-0.6, 0.6),
    };
  }, []);

  // reset ONLY drag rotation
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
      Math.PI / 2,
    );
  };

  // ✅ APPLY base + drag rotation
  useFrame(() => {
    const g = groupRef.current;

    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      baseRot.current.x + targetRot.current.x,
      0.15,
    );

    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      baseRot.current.y + targetRot.current.y,
      0.15,
    );

    g.rotation.z = THREE.MathUtils.lerp(
      g.rotation.z,
      baseRot.current.z,
      0.15,
    );
  });

  return (
    <group
      ref={groupRef}
      scale={[1.8, 1.8, 1.8]}
      position={[0, -0.3, 0]}
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
      <mesh
        geometry={(nodes.Mesh0 as THREE.Mesh).geometry}
        material={materials.BakedMaterial}
        position={[0.002, -0.002, 0]}
      />
    </group>
  );
};

export default React.memo(FeatherRotate);
