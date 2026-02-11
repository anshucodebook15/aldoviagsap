import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import CameraFocusController from "../../../components/CameraFocusController/CameraFocusController";
// import CameraFocusController from "../project/components/CameraFocusController/CameraFocusController";
// import CameraFocusController from "../../../components/CameraFocusController/CameraFocusController";

// Register GSAP
gsap.registerPlugin(useGSAP);

// --------------------------------------------------------
// 1. NATURAL FEATHER COMPONENT
// --------------------------------------------------------
const NaturalFeather = ({
  position = [0, 0, 0],
  delay = 0,
  started = false,
  variant = 1,
}: {
  position: [number, number, number];
  delay?: number;
  started?: boolean;
  variant?: number;
}) => {
  const group = useRef<THREE.Group>(null!);
  const rotateRef = useRef<THREE.Group>(null!);
  const [landed, setLanded] = useState(false);
  const localTime = useRef(0);

  const config = useMemo(
    () => ({
      // ✅ RANDOMIZED SPEED: Range from 0.01 (slow) to 0.022 (fast)
      fallSpeed: 0.01 + Math.random() * 0.012,

      // ✅ RANDOMIZED SWAY: Some sway fast (1.5), some slow (0.8)
      swaySpeed: 0.8 + Math.random() * 0.7,

      swayWidth: 2.0,
      startDelay: delay,
      randomPhase: Math.random() * Math.PI,
    }),
    [delay],
  );

  const animState = useRef({
    y: position[1] + 20,
    time: 0,
    isActive: true,
  });

  const { nodes, materials } = useGLTF("/models/feather_2.glb") as any;

  // Define unique "Shape" rotations based on variant
  const initialRotation = useMemo(() => {
    if (variant === 2) return new THREE.Euler(-0.8, 0, 0.2); // "Tail Up"
    if (variant === 3) return new THREE.Euler(0, 0, 1.2); // "Side"
    return new THREE.Euler(0, 0, 0); // Normal
  }, [variant]);

  useFrame((_state, delta) => {
    if (!group.current || !rotateRef.current) return;
    if (!started) return;

    localTime.current += delta;
    if (localTime.current < config.startDelay) return;

    animState.current.time += delta;
    const t = animState.current.time;

    // --- Vertical Fall ---
    if (animState.current.y > position[1]) {
      animState.current.y -= config.fallSpeed * 60 * delta;
    } else {
      animState.current.y = position[1];
      if (!landed) setLanded(true);
    }

    // --- Dampening ---
    const distanceToFloor = Math.max(0, animState.current.y - position[1]);
    const heightFactor = Math.min(1, distanceToFloor / 8);
    const stopDampener = Math.pow(heightFactor, 2);
    const movementDampener = stopDampener + 0.01;

    // --- Wavy Position ---
    const swayX =
      Math.sin(t * config.swaySpeed + config.randomPhase) *
      config.swayWidth *
      movementDampener;

    // --- Dynamic Rotations ---
    const bankingAngle =
      Math.cos(t * config.swaySpeed + config.randomPhase) *
      0.3 *
      movementDampener;
    const glideAngle = Math.PI * 0.35 * Math.pow(heightFactor, 0.5);

    // Apply Transforms
    group.current.position.y = animState.current.y;
    group.current.position.x = position[0] + swayX;
    group.current.position.z = position[2];

    // Apply Rotations
    rotateRef.current.rotation.z = bankingAngle + initialRotation.z;
    rotateRef.current.rotation.y =
      (Math.PI / 4) * stopDampener + Math.sin(t * 0.5) * 0.1;
    rotateRef.current.rotation.x =
      (variant === 2 ? glideAngle * 0.5 : glideAngle) + initialRotation.x;
  });

  return (
    <group
      ref={group}
      dispose={null}
      position={[position[0], position[1] + 20, position[2]]}
    >
      <Center>
        <group ref={rotateRef}>
          <group>
            <mesh
              geometry={nodes.Cylinder021.geometry}
              material={materials["Material.006"]}
              rotation={[-0.566, 0.458, 0.274]}
              scale={1.5}
            />
            <mesh
              geometry={nodes.Mesh002.geometry}
              material={nodes.Mesh002.material}
              rotation={[0, 0.529, 0]}
              scale={1.5}
            />
            <mesh
              geometry={nodes.Mesh003.geometry}
              material={nodes.Mesh003.material}
              rotation={[0, 0.529, 0]}
              scale={1.5}
            />
          </group>
        </group>
      </Center>
    </group>
  );
};

// --------------------------------------------------------
// 2. FEATHER MANAGER COMPONENT
// --------------------------------------------------------
const FeatherDragDrop = ({ started }: { started: boolean }) => {
  const featherPositions = [
    { id: 1, pos: [-4, -2, -5], delay: 0, variant: 1 },
    { id: 2, pos: [4, -4, -2], delay: 1.2, variant: 2 },
    { id: 3, pos: [0, -6, -8], delay: 0.6, variant: 3 },
  ];

  return (
    <group>
      {featherPositions.map((f) => (
        <NaturalFeather
          key={f.id}
          position={f.pos as [number, number, number]}
          delay={f.delay}
          started={started}
          variant={f.variant}
        />
      ))}
    </group>
  );
};

// --------------------------------------------------------
// 3. MAIN PAGE COMPONENT
// --------------------------------------------------------
const BubbleFeather_Interaction = ({ masterTl }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_activeId, setActiveId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [started, setStarted] = useState(false);

  useLayoutEffect(() => {
    if (!masterTl?.current || !containerRef.current) return;

    const bubbleTl = gsap.timeline();

    bubbleTl
      .from(containerRef.current, {
        autoAlpha: 0,
        duration: 0.6,
        ease: "power2.out",
      })
      .call(
        () => {
          setStarted(true);
        },
        undefined,
        "<0.2",
      );

    masterTl.current.add(bubbleTl, ">");

    return () => {
      bubbleTl.kill();
    };
  }, []);

  useEffect(() => {
    gsap.set(".bubble-slider", {
      xPercent: 100,
      autoAlpha: 0,
      pointerEvents: "none",
    });
  }, []);

  useEffect(() => {
    if (_activeId) {
      gsap.to(".bubble-slider", {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
        pointerEvents: "auto",
      });
    }
  }, [_activeId]);

  const handleResetScene = () => {
    gsap.to(".bubble-slider", {
      xPercent: 100,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power3.in",
      pointerEvents: "none",
      onComplete: () => {
        setActiveId(null);
        setFocusTarget(null);
      },
    });
  };

  const Lights = () => (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[-8, 12, 8]} intensity={4} castShadow />
      <spotLight
        position={[0, 6, -10]}
        intensity={5}
        angle={0.35}
        penumbra={1}
        color="#cce6ff"
      />
      <pointLight position={[6, 2, 4]} intensity={0.9} color="#ffffff" />
      <pointLight position={[-6, -2, -4]} intensity={0.6} color="#bcdcff" />
    </>
  );

  return (
    <div ref={containerRef} className="fixed inset-0 z-30">
      <div className="fixed inset-0 w-screen h-screen bg-black">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 4, 18], fov: 45 }}
          onPointerMissed={() => {
            setActiveId(null);
            setFocusTarget(null);
          }}
        >
          <Lights />
          <CameraFocusController target={focusTarget} enabled={!!focusTarget} />

          <FeatherDragDrop started={started} />
        </Canvas>
      </div>

      <div className="bubble-slider fixed top-10 right-10 h-[calc(100vh-5rem)] w-[520px] rounded-2xl bg-black/20 backdrop-blur-2xl shadow-2xl z-30 overflow-hidden pad">
        <button
          className="absolute top-5 right-5 text-white/80 border border-white/20 rounded-full px-4 py-2 text-sm hover:bg-white/10 transition"
          onClick={handleResetScene}
        >
          ✕ Close
        </button>

        <div className="p-10 text-white">
          <h2 className="text-3xl font-light tracking-wide mb-6">
            Feather Details
          </h2>
          <div className="space-y-4 text-white/70">
            <p>
              <span className="uppercase text-xs tracking-widest text-white/40">
                Active ID
              </span>
              <br />
              <span className="text-lg">{_activeId}</span>
            </p>
            <div className="h-px w-full bg-white/10 my-6" />
            <p className="leading-relaxed">
              This feather represents a unique moment in the experience...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

useGLTF.preload("/models/feather_2.glb");

export default BubbleFeather_Interaction;
