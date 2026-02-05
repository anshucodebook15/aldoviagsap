import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
// import { MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
// import { useFrame } from "@react-three/fiber";

type ActionName = "Cylinder.021Action" | "Mesh.002Action" | "Mesh.003Action";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Cylinder021: THREE.Mesh;
    Mesh002: THREE.Mesh;
    Mesh003: THREE.Mesh;
  };
  materials: {
    ["Material.006"]: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

interface FeatherMainProps {
  id: string | number;
  isActive: boolean;
  setActiveId: (id: string | number) => void;
  [key: string]: any;
}

const FeatherRotate = ({
  id,
  isActive,
  setActiveId,
  ...props
}: FeatherMainProps) => {
  const groupRef = useRef<THREE.Group>(null!);

  const isDragging = useRef(false);
  const targetRot = useRef({ x: 0, y: 0 });

  // const { nodes, materials, animations } = useGLTF(
  //   "./models/feather_2.glb",
  // ) as unknown as GLTFResult;

  const { animations } = useGLTF(
    "./models/feather_2.glb",
  ) as unknown as GLTFResult;

  useAnimations(animations, groupRef);

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
    targetRot.current.y += e.movementX * 0.02; // left/right
    targetRot.current.x += e.movementY * 0.02; // up/down

    // Optional clamp (prevents flipping)
    targetRot.current.x = THREE.MathUtils.clamp(
      targetRot.current.x,
      -Math.PI / 2,
      Math.PI / 2,
    );
  };

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth damping
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRot.current.x,
      0.15,
    );

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRot.current.y,
      0.15,
    );
  });

  // 🔄 Rotate around its own axis
  // useFrame((_, delta) => {
  //   rotateRef.current.rotation.y += delta * 0.6;
  // });

  /* -------------------------------
   * Smooth rotation (NO position change)
   * ------------------------------- */

  // const FeatherMesh = () => {
  //   return (
  //     <>
  //       <mesh
  //         geometry={nodes.Cylinder021.geometry}
  //         material={materials["Material.006"]}
  //         rotation={[-0.566, 0.458, 0.274]}
  //       />
  //       <mesh
  //         geometry={nodes.Mesh002.geometry}
  //         material={nodes.Mesh002.material}
  //         rotation={[0, 0.529, 0]}
  //       />
  //       <mesh
  //         geometry={nodes.Mesh003.geometry}
  //         material={nodes.Mesh003.material}
  //         rotation={[0, 0.529, 0]}
  //       />
  //     </>
  //   );
  // };

  const BoxMesh = () => {
    return (
      <>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#4cc9f0" />
        </mesh>
      </>
    );
  };

  return (
    <>
      {/* <Center> */}

      {/* This group rotates on its own pivot */}

      {/* Offset correction preserved */}
      <group
        ref={groupRef}
        // position={[26.751, 0.706, -0.304]}
        position={[0, -0.5, 0]}
        {...props}
        dispose={null}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        {/* <FeatherMesh /> */}
        <BoxMesh />
      </group>
      {/* </Center> */}
    </>
  );
};

useGLTF.preload("./models/feather_2.glb");

export default React.memo(FeatherRotate);
