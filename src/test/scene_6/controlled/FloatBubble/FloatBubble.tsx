import * as THREE from "three";
import React from "react";
import { useBubbleController } from "./useBubbleController";
import FeatherRotate from "../FeatherRotate/FeatherRotate";
// import FeatherRotate from "./FeatherRotate";
// import { useBubbleController } from "../hooks/useBubbleController";

type Props = {
  id: string | number;
  position: [number, number, number];
  radius?: number;
  setActiveId: (id: string | number) => void;
  setFocusTarget: (v: THREE.Vector3) => void;
  resetSignal: number; // 👈 NEW
};

const FloatBubble = ({
  id,
  position,
  radius = 5,
  setActiveId,
  setFocusTarget,
  resetSignal,
}: Props) => {
  const { refs, burstBubble } = useBubbleController(
    id,
    position,
    radius,
    resetSignal,
  );

  const handleClick = () => {
    const worldPos = new THREE.Vector3();
    refs.groupRef.current.getWorldPosition(worldPos);

    setActiveId(id);
    setFocusTarget(worldPos);
    burstBubble();


  };

  return (
    <group ref={refs.groupRef} onClick={handleClick}>
      {/* Bubble */}
      <mesh ref={refs.bubbleMeshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.14}
          roughness={0.7}
          metalness={0.2}
          transmission={1.2}
          thickness={0.6}
          ior={1.8}
          clearcoat={1}
        />
      </mesh>

      {/* Feather */}
      <group scale={1}>
        <FeatherRotate id={id} resetSignal={resetSignal} />
      </group>
    </group>
  );
};

export default React.memo(FloatBubble);
