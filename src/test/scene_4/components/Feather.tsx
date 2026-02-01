import * as THREE from "three";
import { useRef } from "react";
import { useGLTF, useAnimations, Center } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
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
      onPointerDown={(e) => {
        e.stopPropagation();
        setActiveId(id);
        document.body.style.cursor = "grabbing";
      }}
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
