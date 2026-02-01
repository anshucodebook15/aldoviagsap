import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// import CanvasFrame from "./canvasframe";
// import MenuFrame from "./menuframe";

// import { Canvas } from "@react-three/fiber";

// import { OrbitControls } from "@react-three/drei";
// import { useState } from "react";
// import Bubble from "./components/Bubble";
// import TestCameraZoom from "./components/TestCameraZoom";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Bubble from "./components/Bubble";
import { OrbitControls } from "@react-three/drei";
import MenuFrame from "./menuframe";

gsap.registerPlugin(useGSAP);

const MainScene4 = () => {
  const [_focused, setFocused] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  console.log("Feather Code", activeId);

  const bubbles = [
    { id: 1, position: [-10, 2, 6] },
    { id: 2, position: [-5, 4, 7] },
    { id: 3, position: [0, 5, 8] }, // center hero
    { id: 4, position: [5, 4, 7] },
    { id: 5, position: [10, 2, 6] },
  ];

  return (
    <div>
      <div className="fixed inset-0 w-screen h-screen bg-black">
        <Canvas
          className="w-full h-full"
          camera={{ position: [0, 8, 18], fov: 45 }}
          onPointerMissed={() => {
            (setFocused(false), setActiveId(null));
          }}
        >
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

          {/* 🧭 Controls (locked zoom for cinematic feel) */}

          {/* 🎥 Camera focus controller */}
          {/* <CameraController focused={focused} /> */}

          {/* 🪶 Drop your feathers here */}

          {bubbles.map((b) => (
            <Bubble
              key={b.id}
              id={b.id}
              position={b.position as [number, number, number]}
              radius={5}
              setActiveId={setActiveId}
            />
          ))}

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* 🧭 UI LAYER (only buttons clickable) */}
      <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
        <MenuFrame />
      </div>
    </div>
  );
};

const SceneTest = () => {
  return <MainScene4 />;
};

export default SceneTest;
