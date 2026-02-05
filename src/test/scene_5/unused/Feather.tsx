import * as THREE from "three";
import { useRef } from "react";
import { useGLTF, useAnimations, Center } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import { MathUtils } from "three";
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

const FeatherMain = ({
  id,
  isActive,
  setActiveId,
  ...props
}: FeatherMainProps) => {
  const isDragging = useRef(false);
  const targetY = useRef(0);
  // const targetRotation = useRef({ x: 0, y: 0 });

  const group = useRef<THREE.Group>(null!);
  const rotateRef = useRef<THREE.Group>(null!);

  const { nodes, materials, animations } = useGLTF(
    "./models/feather_2.glb",
  ) as unknown as GLTFResult;

  useAnimations(animations, group);

  // 🔄 Rotate around its own axis
  // useFrame((_, delta) => {
  //   rotateRef.current.rotation.y += delta * 0.6;
  // });

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    isDragging.current = false;
    document.body.style.cursor = "grab";
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    isDragging.current = true;
    setActiveId(id);
    document.body.style.cursor = "grabbing";
  };

  // const handlePointerMove = (e: any) => {
  //   if (!isDragging.current) return;

  //   // movementX/Y are PERFECT for this use-case
  //   targetRotation.current.y += e.movementX * 0.003;
  //   targetRotation.current.x += e.movementY * 0.003;

  //   // Clamp to keep it elegant
  //   targetRotation.current.x = MathUtils.clamp(
  //     targetRotation.current.x,
  //     -0.4,
  //     0.4
  //   );
  //   targetRotation.current.y = MathUtils.clamp(
  //     targetRotation.current.y,
  //     -0.6,
  //     0.6
  //   );
  // };

  // useFrame(() => {
  //   if (!rotateRef.current) return;

  //   // Smooth follow (damping)
  //   rotateRef.current.rotation.x = MathUtils.lerp(
  //     rotateRef.current.rotation.x,
  //     targetRotation.current.x,
  //     0.08
  //   );

  //   rotateRef.current.rotation.y = MathUtils.lerp(
  //     rotateRef.current.rotation.y,
  //     targetRotation.current.y,
  //     0.08
  //   );

  //   // Gentle return to rest when released
  //   if (!isDragging.current) {
  //     targetRotation.current.x = MathUtils.lerp(
  //       targetRotation.current.x,
  //       0,
  //       0.06
  //     );
  //     targetRotation.current.y = MathUtils.lerp(
  //       targetRotation.current.y,
  //       0,
  //       0.06
  //     );
  //   }
  // });
  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;

    // Horizontal drag → Y-axis rotation
    targetY.current += e.movementX * 0.003;

    // Clamp for elegance
    targetY.current = MathUtils.clamp(targetY.current, -0.6, 0.6);
  };

  /* -------------------------------
   * Smooth rotation (NO position change)
   * ------------------------------- */
  useFrame(() => {
    console.log(group.current.position);

    if (!rotateRef.current) return;

    // Smooth follow
    rotateRef.current.rotation.y = MathUtils.lerp(
      rotateRef.current.rotation.y,
      targetY.current,
      0.12,
    );

    // Gentle return when released
    if (!isDragging.current) {
      targetY.current = MathUtils.lerp(targetY.current, 0, 0.05);
    }
  });

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "grab";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
      /**
       * TODO: Add Handlers
       */

      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <Center>
        {/* This group rotates on its own pivot */}
        <group ref={rotateRef}>
          {/* Offset correction preserved */}
          <group position={[26.751, 0.706, -0.304]}>
            <mesh
              geometry={nodes.Cylinder021.geometry}
              material={materials["Material.006"]}
              rotation={[-0.566, 0.458, 0.274]}
            />
            <mesh
              geometry={nodes.Mesh002.geometry}
              material={nodes.Mesh002.material}
              rotation={[0, 0.529, 0]}
            />
            <mesh
              geometry={nodes.Mesh003.geometry}
              material={nodes.Mesh003.material}
              rotation={[0, 0.529, 0]}
            />
          </group>
        </group>
      </Center>
    </group>
  );
};

useGLTF.preload("./models/feather_2.glb");

export default FeatherMain;
