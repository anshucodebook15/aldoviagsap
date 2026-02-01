import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

const Ripple = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const ref = useRef<Mesh>(null!);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.scale.x += 0.08;
    ref.current.scale.z += 0.08;
    const material = Array.isArray(ref.current.material) ? ref.current.material[0] : ref.current.material;
    material.opacity -= 0.015;

    if (material.opacity <= 0) {
      ref.current.visible = false;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.2, 0.25, 64]} />
      <meshBasicMaterial transparent opacity={0.6} color="#ccefff" />
    </mesh>
  );
}


export default Ripple;
