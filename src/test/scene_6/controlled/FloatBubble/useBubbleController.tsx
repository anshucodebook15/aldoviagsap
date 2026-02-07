import { useLayoutEffect, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

export function useBubbleController(
  id: string | number,
  position: [number, number, number],
  radius: number,
  resetSignal: number,
  onBurst?: () => void,
) {
  const groupRef = useRef<THREE.Group>(null!);
  const bubbleMeshRef = useRef<THREE.Mesh>(null!);

  const [burst, setBurst] = useState(false);

  /* ---------------- DROP IN ---------------- */
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const [x, finalY, z] = position;
    const startY = finalY + 22;

    group.position.set(x, startY, z);
    group.scale.set(0.9, 0.9, 0.9);

    const ctx = gsap.context(() => {
      gsap.to(group.position, {
        y: finalY,
        duration: 1.4,
        delay: Number(id) * 0.12,
        ease: "power3.out",
      });

      gsap.to(group.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        delay: Number(id) * 0.12 + 0.5,
        ease: "elastic.out(1, 0.5)",
      });

      const mat = bubbleMeshRef.current?.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.opacity = 0;
        gsap.to(mat, {
          opacity: 0.14,
          duration: 1,
          delay: Number(id) * 0.12,
        });
      }
    }, group);

    return () => ctx.revert();
  }, []);

  /* ---------------- BURST ---------------- */
  const burstBubble = () => {
    if (burst) return;
    setBurst(true);
    onBurst?.();

    gsap.to(groupRef.current.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 0.18,
    });

    gsap.to(bubbleMeshRef.current.material as any, {
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        bubbleMeshRef.current.visible = false;
      },
    });
  };

  /* ---------------- Reset Logic ---------------- */
  useEffect(() => {
    if (!groupRef.current || !bubbleMeshRef.current) return;

    // RESET bubble shell
    bubbleMeshRef.current.visible = true;

    gsap.to(bubbleMeshRef.current.material as any, {
      opacity: 0.14,
      duration: 0.35,
      ease: "power2.out",
    });

    // RESET scale
    gsap.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.35,
      ease: "power2.out",
    });

    setBurst(false);
  }, [resetSignal]);

  /* ---------------- CLEANUP ---------------- */
  useEffect(() => {
    return () => {
      bubbleMeshRef.current?.geometry.dispose();
      const mat = bubbleMeshRef.current?.material;
      Array.isArray(mat) ? mat.forEach((m) => m.dispose()) : mat?.dispose();
    };
  }, []);

  return {
    refs: { groupRef, bubbleMeshRef },
    burst,
    burstBubble,
    radius,
  };
}
