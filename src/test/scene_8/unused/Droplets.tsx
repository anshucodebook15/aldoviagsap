import { useMemo, useRef } from "react";
import { Points, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  count?: number;
  onComplete?: () => void;
};

export default function Droplets({ position, count = 80, onComplete }: Props) {
  const ref = useRef<Points>(null!);

  const { positions, droplets } = useMemo(() => {
    const p = new Float32Array(count * 3);

    const d = Array.from({ length: count }, () => {
      // 🌐 Random direction on a sphere
      const dir = new Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();

      return {
        direction: dir,
        velocity: dir.clone().multiplyScalar(THREE.MathUtils.randFloat(3, 6)),
        life: 1,
      };
    });

    return { positions: p, droplets: d };
  }, [count]);

  useFrame((_, dt) => {
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    let alive = false;

    droplets.forEach((d, i) => {
      const i3 = i * 3;

      // ⬇ gravity
      d.velocity.y -= 7 * dt;

      // 🌊 integrate velocity
      pos[i3] += d.velocity.x * dt;
      pos[i3 + 1] += d.velocity.y * dt;
      pos[i3 + 2] += d.velocity.z * dt;

      // 🌫 fade life
      d.life -= dt * 0.4;
      if (d.life > 0) alive = true;
    });

    ref.current.geometry.attributes.position.needsUpdate = true;

    if (!alive) onComplete?.();
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>

      <pointsMaterial
        size={0.045}
        transparent
        opacity={0.75}
        color="#d9f3ff"
        depthWrite={false}
      />
    </points>
  );
}
