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
  // useLayoutEffect(() => {
  //   const group = groupRef.current;
  //   if (!group) return;

  //   const [x, finalY, z] = position;
  //   const startY = finalY + 22;

  //   group.position.set(x, startY, z);
  //   group.scale.set(0.9, 0.9, 0.9);

  //   const ctx = gsap.context(() => {
  //     gsap.to(group.position, {
  //       y: finalY,
  //       duration: 1.4,
  //       delay: Number(id) * 0.12,
  //       ease: "power3.out",
  //     });

  //     gsap.to(group.scale, {
  //       x: 1,
  //       y: 1,
  //       z: 1,
  //       duration: 0.8,
  //       delay: Number(id) * 0.12 + 0.5,
  //       ease: "elastic.out(1, 0.5)",
  //     });

  //     const mat = bubbleMeshRef.current?.material as THREE.MeshPhysicalMaterial;
  //     if (mat) {
  //       mat.opacity = 0;
  //       gsap.to(mat, {
  //         opacity: 0.14,
  //         duration: 1,
  //         delay: Number(id) * 0.12,
  //       });
  //     }
  //   }, group);

  //   return () => ctx.revert();
  // }, []);

  // v1
  // useLayoutEffect(() => {
  //   const group = groupRef.current;
  //   if (!group) return;

  //   const [finalX, finalY, finalZ] = position;
  //   const startY = finalY + 22;

  //   group.position.set(finalX, startY, finalZ);
  //   group.scale.set(0.9, 0.9, 0.9);
  //   group.rotation.set(0, 0, 0);

  //   const delay = Number(id) * 0.12;

  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({ delay });

  //     /* 🌊 MAIN DROP (Y axis) */
  //     tl.to(group.position, {
  //       y: finalY,
  //       duration: 1.8,
  //       ease: "power2.out",
  //     }, 0);

  //     /* 🌬️ SIDE SWAY (X axis – feather drift) */
  //     tl.to(group.position, {
  //       x: finalX + gsap.utils.random(-1.2, 1.2),
  //       duration: 0.6,
  //       ease: "sine.inOut",
  //       yoyo: true,
  //       repeat: 2,
  //     }, 0.1);

  //     /* 🌀 DEPTH SWAY (Z axis – depth illusion) */
  //     tl.to(group.position, {
  //       z: finalZ + gsap.utils.random(-0.8, 0.8),
  //       duration: 0.7,
  //       ease: "sine.inOut",
  //       yoyo: true,
  //       repeat: 1,
  //     }, 0.2);

  //     /* 🪶 FEATHER SWING (rotation like pendulum) */
  //     tl.to(group.rotation, {
  //       z: gsap.utils.random(-0.25, 0.25),
  //       duration: 0.5,
  //       ease: "sine.inOut",
  //       yoyo: true,
  //       repeat: 3,
  //     }, 0);

  //     /* 🧘 FINAL SETTLE */
  //     tl.to(group.rotation, {
  //       z: 0,
  //       duration: 0.4,
  //       ease: "power2.out",
  //     }, ">-0.3");

  //     /* ✨ SCALE POP */
  //     tl.to(group.scale, {
  //       x: 1,
  //       y: 1,
  //       z: 1,
  //       duration: 0.8,
  //       ease: "elastic.out(1, 0.5)",
  //     }, 0.6);

  //     /* 💎 BUBBLE FADE IN */
  //     const mat = bubbleMeshRef.current?.material as THREE.MeshPhysicalMaterial;
  //     if (mat) {
  //       mat.opacity = 0;
  //       tl.to(mat, {
  //         opacity: 0.14,
  //         duration: 1,
  //         ease: "power2.out",
  //       }, 0.2);
  //     }

  //   }, group);

  //   return () => ctx.revert();
  // }, []);

  // V2
  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const [finalX, finalY, finalZ] = position;
    const startY = finalY + 24;

    group.position.set(finalX, startY, finalZ);
    group.scale.set(0.88, 0.88, 0.88);
    group.rotation.set(0, 0, 0);

    const delay = Number(id) * 0.14;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay });

      /* 🌊 SLOW MAIN DROP */
      tl.to(
        group.position,
        {
          y: finalY,
          duration: 2.8, // ⏳ slower fall
          ease: "power1.out", // softer gravity
        },
        0,
      );

      /* 🌬️ BIGGER SIDE SWAY (X) */
      tl.to(
        group.position,
        {
          x: finalX + gsap.utils.random(-1.8, 1.8),
          duration: 1.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 3, // 🌊 more waves
        },
        0,
      );

      /* 🌬️ DEPTH SWAY (Z) */
      tl.to(
        group.position,
        {
          z: finalZ + gsap.utils.random(-1.2, 1.2),
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 2,
        },
        0.2,
      );

      /* 🪶 FEATHER PENDULUM SWING */
      tl.to(
        group.rotation,
        {
          z: gsap.utils.random(-0.35, 0.35),
          duration: 1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 4, // slower oscillation
        },
        0,
      );

      /* 🧘 SOFT SETTLE */
      tl.to(
        group.rotation,
        {
          z: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        ">-0.6",
      );

      /* ✨ SCALE BLOOM */
      tl.to(
        group.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.35)", // softer elastic
        },
        0.8,
      );

      /* 💎 BUBBLE FADE IN (slow + silky) */
      const mat = bubbleMeshRef.current?.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.opacity = 0;
        tl.to(
          mat,
          {
            opacity: 0.14,
            duration: 1.4,
            ease: "power1.out",
          },
          0.6,
        );
      }

      /* 🌫️ MICRO FLOAT (after landing – optional but 🔥) */
      // tl.to(
      //   group.position,
      //   {
      //     y: finalY + 0.45,
      //     duration: 3.5,
      //     ease: "sine.inOut",
      //     yoyo: true,
      //     repeat: -1, // continuous gentle float
      //   },
      //   ">-0.2",
      // );
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
