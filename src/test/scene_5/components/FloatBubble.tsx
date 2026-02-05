import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import * as THREE from "three";
// import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
// import FeatherMain from "../unused/Feather";
// import { Center } from "@react-three/drei";
import FeatherRotate from "./FeatherRotate";
// import Droplets from "./Droplets";

type Props = {
  position: [number, number, number];
  radius?: number;
  onBurst?: () => void;
  id: string | number;
  setActiveId: (id: any) => void;
  setFocusTarget: (v: THREE.Vector3) => void;
};

const FloatBubble = ({
  position,
  radius = 1,
  onBurst,
  id,
  setActiveId,
  setFocusTarget,
}: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const bubbleMeshRef = useRef<THREE.Mesh>(null!);

  const [burst, setBurst] = useState(false);
  // const [_droplets, setDroplets] = useState(false);

  /* -------------------------------------------
   * GSAP DROP-IN ANIMATION (ON MOUNT)
   * ------------------------------------------- */
  useLayoutEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      const [x, finalY, z] = position;
      const startY = finalY + 22;

      groupRef.current.position.set(x, startY, z);
      groupRef.current.scale.set(0.9, 0.9, 0.9);

      gsap.to(groupRef.current.position, {
        y: finalY,
        duration: 1.4,
        delay: Number(id) * 0.12,
        ease: "power3.out",
      });

      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        delay: Number(id) * 0.12 + 0.5,
        ease: "elastic.out(1, 0.5)",
      });

      if (bubbleMeshRef.current?.material) {
        const mat = bubbleMeshRef.current
          .material as THREE.MeshPhysicalMaterial;
        mat.transparent = true;
        mat.opacity = 0;

        gsap.to(mat, {
          opacity: 0.14,
          duration: 1,
          delay: Number(id) * 0.12,
          ease: "power2.out",
        });
      }
    }, groupRef);

    return () => ctx.revert(); // 🔥 kills all GSAP tweens
  }, []);

  useEffect(() => {
    return () => {
      if (bubbleMeshRef.current) {
        bubbleMeshRef.current.geometry.dispose();

        const mat = bubbleMeshRef.current.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      }
    };
  }, []);

  /* -------------------------------------------
   * BURST LOGIC (UNCHANGED)
   * ------------------------------------------- */
  const handleClick = () => {
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    setActiveId(id);
    setFocusTarget(worldPos); // 🎥 camera zoom

    if (burst) return;

    setBurst(true);
    // setDroplets(true);
    onBurst?.();

    // Scale whole bubble + feather
    gsap.to(groupRef.current.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 0.18,
    });

    // Fade only bubble shell
    gsap.to(bubbleMeshRef.current.material as any, {
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        bubbleMeshRef.current.visible = false;
      },
    });
  };

  /* -------------------------------------------
   * FLOATING MOTION (AFTER LANDING)
   * ------------------------------------------- */
  //   useFrame(({ clock }) => {
  //       if (!burst && groupRef.current) {
  //           groupRef.current.position.y +=
  //               Math.sin(clock.elapsedTime * 1.5 + Number(id)) * 0.008;
  //       }
  //   });

  return (
    <>
      {/* <Center> */}
      <group ref={groupRef} onClick={handleClick}>
        {/* 🫧 Bubble shell */}
        <mesh ref={bubbleMeshRef}>
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
            clearcoatRoughness={0.03}
            envMapIntensity={2}
          />
        </mesh>

        {/* 🪶 Feather inside bubble */}
        <group scale={1}>
          {/* <FeatherMain id={id} isActive={false} setActiveId={setActiveId} /> */}
          <FeatherRotate id={id} isActive={false} setActiveId={setActiveId} />
        </group>
      </group>
      {/* </Center> */}

      {/* 💧 Droplets (optional – keep commented for now) */}
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

export default React.memo(FloatBubble);
