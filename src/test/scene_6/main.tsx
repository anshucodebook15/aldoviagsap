import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";

import MenuFrame from "./components/menuframe";
import CameraFocusController from "./components/CameraController";
import FloatBubble from "./controlled/FloatBubble/FloatBubble";

gsap.registerPlugin(useGSAP);

const MainScene = () => {
  const [_focused, setFocused] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<THREE.Vector3 | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  const bubbles = [
    { id: 1, position: [-12, 0, -14] },
    { id: 2, position: [0, 2, -10] },
    { id: 3, position: [11, -2, -10] }, // center hero
    { id: 4, position: [-6, -8, -9] },
    { id: 5, position: [4, -10, -12] },
  ];



  const handleResetScene = () => {
    setActiveId(null);
    setFocusTarget(null);   // 🎥 camera zoom out
    setResetSignal(v => v + 1); // 🔄 trigger reset everywhere
  };



  console.log("Focus Target", focusTarget);
  console.log("Active ID", activeId);

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
              setFocusTarget={setFocusTarget} // 👈 ADD THIS
              resetSignal={resetSignal}   // 👈 NEW
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
      <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
        <MenuFrame />
      </div>

      <div className="gallery_slider fixed bottom-40 left-10  z-10 ">
        {/* <button className=" bg-gray-900 cursor-pointer" onClick={handleResetScene}>
          click{" "}
        </button> */}
        <button className="close border p-4" onClick={handleResetScene}>
          Close feather
        </button>
      </div>
    </div>
  );
};

const SceneTest = () => {
  return (
    <>
      {/* <TestCameraZoom /> */}
      <MainScene />
    </>
  );
};

export default SceneTest;
