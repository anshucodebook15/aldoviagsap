import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

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

  /* ---------------- PHYSICS STATE ---------------- */

  const physics = useRef({
    y: position[1] + 24,
    time: 0,
    landed: false,
  });

  const localDelay = useRef(0);

  const config = useMemo(
    () => ({
      // slightly faster but still feather-like
      fallSpeed: 0.012 + Math.random() * 0.014,
      swaySpeed: 0.8 + Math.random() * 0.7,
      swayWidth: 1.6,
      phase: Math.random() * Math.PI * 2,
      delay: Number(id) * 0.14,
    }),
    [id],
  );

  /* ---------------- INITIAL SETUP ---------------- */

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const [x, y, z] = position;

    physics.current.y = y + 24;
    physics.current.time = 0;
    physics.current.landed = false;

    group.position.set(x, physics.current.y, z);
    group.scale.set(0.88, 0.88, 0.88);
    group.rotation.set(0, 0, 0);

    localDelay.current = 0;

    const mat = bubbleMeshRef.current?.material as THREE.MeshPhysicalMaterial;
    if (mat) mat.opacity = 0;
  }, []);

  /* ---------------- DROP PHYSICS ---------------- */

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // if (!dropStarted) return; // ⛔ physics waits here

    localDelay.current += delta;
    if (localDelay.current < config.delay) return;

    physics.current.time += delta;
    const t = physics.current.time;

    const floorY = position[1];

    /* --- Vertical fall (terminal velocity) --- */
    if (!physics.current.landed) {
      physics.current.y -= config.fallSpeed * 60 * delta;

      if (physics.current.y <= floorY) {
        physics.current.y = floorY;
        physics.current.landed = true;

        // landing settle (ONE TIME)
        gsap.to(group.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.35)",
        });

        const mat = bubbleMeshRef.current
          ?.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          gsap.to(mat, {
            opacity: 0.14,
            duration: 1.2,
            ease: "power1.out",
          });
        }
      }
    }

    /* --- Height dampening --- */
    const distance = Math.max(0, physics.current.y - floorY);
    const heightFactor = Math.min(1, distance / 8);
    const damp = Math.pow(heightFactor, 2) + 0.01;

    /* --- Air sway --- */
    const swayX =
      Math.sin(t * config.swaySpeed + config.phase) * config.swayWidth * damp;

    const swayZ =
      Math.cos(t * (config.swaySpeed * 0.7) + config.phase) * 0.8 * damp;

    /* --- Banking & glide --- */
    const bank = Math.cos(t * config.swaySpeed + config.phase) * 0.35 * damp;

    const glide = Math.PI * 0.35 * Math.sqrt(heightFactor);

    /* --- Apply transforms --- */
    group.position.set(
      position[0] + swayX,
      physics.current.y,
      position[2] + swayZ,
    );

    group.rotation.z = bank;
    group.rotation.x = glide;
    group.rotation.y = Math.sin(t * 0.5) * 0.1;
  });

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

  /* ---------------- RESET (OLD BEHAVIOR ✅) ---------------- */

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

  // useEffect(() => {
  //   const group = groupRef.current;
  //   const mesh = bubbleMeshRef.current;
  //   if (!group || !mesh) return;

  //   // reset physics (fresh drop — as requested)
  //   physics.current.y = position[1] + 24;
  //   physics.current.time = 0;
  //   physics.current.landed = false;
  //   localDelay.current = 0;

  //   group.position.set(position[0], physics.current.y, position[2]);
  //   group.rotation.set(0, 0, 0);

  //   mesh.visible = true;

  //   gsap.to(mesh.material as any, {
  //     opacity: 0.14,
  //     duration: 0.35,
  //     ease: "power2.out",
  //   });

  //   gsap.to(group.scale, {
  //     x: 1,
  //     y: 1,
  //     z: 1,
  //     duration: 0.35,
  //     ease: "power2.out",
  //   });

  //   setBurst(false);
  // }, [resetSignal]);

  return {
    refs: { groupRef, bubbleMeshRef },
    burst,
    burstBubble,
    radius,
  };
}
