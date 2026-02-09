import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { GroupProps } from "@react-three/fiber";
import gsap from "gsap";
import { useGLTF } from "@react-three/drei";

type FeatherDropProps = GroupProps & {
  startY?: number;
  groundY?: number;
  duration?: number;
};

export const FeatherDrop = ({
  children,
  startY = 8,
  groundY = 0,
  duration = 3, // ⬅ slower = lighter
  ...props
}: FeatherDropProps) => {
  const groupRef = useRef<THREE.Group>(null!);

  useLayoutEffect(() => {
    const feather = groupRef.current;
    if (!feather) return;

    /* 🎲 low-density randomness */

    const rotateSpeed = gsap.utils.random(0.15, 0.9);

    const swayAmplitude = gsap.utils.random(0.9, 1.4); // ⬅ more swing
    const swaySpeed = gsap.utils.random(0.7, 1.1);

    /* initial state */
    gsap.set(feather.position, {
      x: gsap.utils.random(-0.5, 0.5),
      y: startY,
      z: 0,
    });

    gsap.set(feather.rotation, {
      x: gsap.utils.random(-0.2, 0.2),
      y: gsap.utils.random(-Math.PI, Math.PI),
      z: gsap.utils.random(-0.4, 0.4),
    });

    /* 🧠 vertical fall (very light gravity) */
    const tl = gsap.timeline();

    tl.to(feather.position, {
      y: groundY,
      duration,
      ease: "none", // ⬅ floating, not accelerating
    });

    /* 🌬 air flow (side drift + rotation) */
    /* 🌬 air flow (enhanced low-density drift) */
    /* 🌬 strong low-density airflow */
    let t = 0;
    let drift = 0;

    const floatMotion = () => {
      t += 0.015;

      // 🧠 slow sideways travel (this breaks straight fall)
      drift += 0.004; // increase for more travel

      // 🌊 wide oscillation + travel
      feather.position.x =
        drift +
        Math.sin(t * swaySpeed) * swayAmplitude +
        Math.sin(t * 0.4) * swayAmplitude * 2;

      // slight depth sway
      feather.position.z = Math.cos(t * 0.6) * 0.22;

      // strong flutter
      feather.rotation.z = Math.sin(t * 1.2) * 0.55;

      feather.rotation.x += Math.sin(t * 0.8) * rotateSpeed * 0.003;
    };

    gsap.ticker.add(floatMotion);

    return () => {
      tl.kill();
      gsap.ticker.remove(floatMotion);
    };
  }, [startY, groundY, duration]);

  return (
    <group ref={groupRef} {...props}>
      {children}
    </group>
  );
};

/* 🪶 Usage */
const FeatherDragDrop = () => {
  const { scene } = useGLTF("/models/featherkb.glb");

  return (
    <FeatherDrop>
      <primitive object={scene} scale={2} />
    </FeatherDrop>
  );
};

export default FeatherDragDrop;
