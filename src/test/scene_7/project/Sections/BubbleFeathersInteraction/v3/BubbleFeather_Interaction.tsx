import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import CameraFocusController from "../../../components/CameraFocusController/CameraFocusController";
import FloatBubble from "../../../components/FloatBubble/FloatBubble";

gsap.registerPlugin(useGSAP);

const Scene = () => {
  const [_focused, setFocused] = useState(false);
  const [_activeId, setActiveId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const bubbles = [
    { id: 1, position: [-12, 0, -14] },
    { id: 2, position: [0, 2, -10] },
    { id: 3, position: [11, -2, -10] }, // center hero
    { id: 4, position: [-6, -8, -9] },
    { id: 5, position: [4, -10, -12] },
  ];

  useEffect(() => {
    // slider initial hidden state
    gsap.set(".bubble-slider", {
      xPercent: 100,
      autoAlpha: 0,
      pointerEvents: "none",
    });
  }, []);

  useEffect(() => {
    // open slider when bubble is clicked
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

  // const handleResetScene = () => {
  //   setActiveId(null);
  //   setFocusTarget(null); // 🎥 camera zoom out
  //   setResetSignal((v) => v + 1); // 🔄 trigger reset everywhere
  // };

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
        setResetSignal((v) => v + 1);
      },
    });
  };

  const Lights = () => {
    return (
      <>
        {/* 🌫 Very soft ambient (just base visibility) */}
        <ambientLight intensity={0.7} />

        {/* ☀ KEY light — strong, angled */}
        <directionalLight position={[-8, 12, 8]} intensity={4} castShadow />

        {/* ✨ RIM light — THIS MAKES THE EDGE GLOW */}
        <spotLight
          position={[0, 6, -10]}
          intensity={5}
          angle={0.35}
          penumbra={1}
          color="#cce6ff"
        />

        {/* 💎 Side crystal highlights */}
        <pointLight position={[6, 2, 4]} intensity={0.9} color="#ffffff" />
        <pointLight position={[-6, -2, -4]} intensity={0.6} color="#bcdcff" />
      </>
    );
  };

  return (
    <div>
      <div className="fixed inset-0 w-screen h-screen bg-black">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 4, 18], fov: 45 }}
          onPointerMissed={() => {
           
            (setFocused(false), setActiveId(null), setFocusTarget(null));
          }}
        >
          {/**Lights On to Objects */}
          <Lights />

          {/* 🧭 Controls (locked zoom for cinematic feel) */}

          {/* 🎥 Camera focus controller */}
          <CameraFocusController target={focusTarget} enabled={!!focusTarget} />

          {/* 🪶 Drop your feathers here */}
          {bubbles.map((b) => (
            <FloatBubble
              key={b.id}
              id={b.id}
              position={b.position as [number, number, number]}
              radius={5}
              setActiveId={(id) => setActiveId(String(id))}
              setFocusTarget={(v) => setFocusTarget(v)}
              // setActiveId={(id) => setActiveId(String(id))}
              // setFocusTarget={setFocusTarget} // 👈 ADD THIS
              resetSignal={resetSignal} // 👈 NEW
            />
          ))}

          {/* <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
          /> */}
        </Canvas>
      </div>

      {/* 🧭 UI LAYER (only buttons clickable) */}
      {/* <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
        <MenuFrame />
      </div> */}

      {/* 👉 SLIDER (HTML UI) */}
      <div
        className="
    bubble-slider
    fixed
    top-10
    right-10
    h-[calc(100vh-5rem)]
    w-[520px]
    rounded-2xl
    bg-black/20
    backdrop-blur-2xl
    shadow-2xl
    z-30
    overflow-hidden
    pad
  "
      >
        {/* Close button */}
        <button
          className="
      absolute
      top-5
      right-5
      text-white/80
      border
      border-white/20
      rounded-full
      px-4
      py-2
      text-sm
      hover:bg-white/10
      transition
    "
          onClick={handleResetScene}
        >
          ✕ Close
        </button>

        {/* Content */}
        <div className=" text-white">
          <h2 className="text-3xl font-light tracking-wide mb-6">
            Bubble Details
          </h2>

          <div className="space-y-4 text-white/70">
            <p>
              <span className="uppercase text-xs tracking-widest text-white/40">
                Active Bubble
              </span>
              <br />
              <span className="text-lg">{_activeId}</span>
            </p>

            <div className="h-px w-full bg-white/10 my-6" />

            <p className="leading-relaxed">
              This feather represents a unique moment in the experience. Each
              bubble opens contextual content with cinematic motion and fluid
              interaction.
            </p>
          </div>
        </div>
      </div>

      {/* <div className="gallery_slider fixed bottom-40 left-10  z-10 ">
        <button className="close border p-4" onClick={handleResetScene}>
          Close feather
        </button>
      </div> */}
    </div>
  );
};

const BubbleFeather_Interaction = ({ masterTl }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_enabled, setEnabled] = useState(false);

  useLayoutEffect(() => {
    if (!masterTl?.current || !containerRef.current) return;

    // ⛔ start hidden
    gsap.set(containerRef.current, {
      autoAlpha: 0,
      pointerEvents: "none",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // 🔓 interaction unlocked
        setEnabled(true);
        gsap.set(containerRef.current, { pointerEvents: "auto" });
      },
    });

    tl.to(containerRef.current, {
      autoAlpha: 1,
      duration: 1,
      ease: "power3.out",
    });

    // ⛓️ START AFTER MENU FINISHES
    masterTl.current.add(tl, "menu-complete+=0.2");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-30">
      <Scene />
    </div>
  );
};

export default BubbleFeather_Interaction;
