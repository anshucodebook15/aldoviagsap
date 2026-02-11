import * as THREE from "three";
import gsap from "gsap";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { useBubbleController } from "./useBubbleController";
// import FeatherRotate from "../FeatherRotate/FeatherRotate";
// import { useBubbleController } from "./v2/useBubbleController";
import { useFrame } from "@react-three/fiber";
import FeatherRotate from "../../../components/FeatherRotate/v2/FeatherRotate";
// import FeatherRotate from "./FeatherRotate";
// import { useBubbleController } from "../hooks/useBubbleController";

type Props = {
  id: string | number;
  position: [number, number, number];
  radius?: number;
  setActiveId: (id: string | number) => void;
  setFocusTarget: (v: THREE.Vector3) => void;
  resetSignal: number; // 👈 NEW
};

const FloatBubble = ({
  id,
  position,
  radius = 5,
  setActiveId,
  setFocusTarget,
  resetSignal,
}: Props) => {
  // const { refs, burstBubble } = useBubbleController(
  //   id,
  //   position,
  //   radius,
  //   resetSignal,
  //   dropStarted,
  // );

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
    // onBurst?.();

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

  const handleClick = () => {
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    setActiveId(id);
    setFocusTarget(worldPos);
    burstBubble();
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Bubble */}
      <mesh ref={bubbleMeshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        {/* <meshPhysicalMaterial
          transparent
          opacity={0.14}
          roughness={0.7}
          metalness={0.2}
          transmission={1.2}
          thickness={0.6}
          ior={1.8}
          clearcoat={1}
        /> */}

        <meshPhysicalMaterial
          transparent
          opacity={0.14}
          // 🫧 bubble physics
          transmission={1}
          thickness={0.6}
          ior={1.45}
          // ✨ shine & glow
          roughness={0.08}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.4}
          color="#e8f6ff"
        />
      </mesh>

      {/* Feather */}
      <group scale={1}>
        <FeatherRotate id={id} resetSignal={resetSignal} />
      </group>
    </group>
  );
};

export default React.memo(FloatBubble);
