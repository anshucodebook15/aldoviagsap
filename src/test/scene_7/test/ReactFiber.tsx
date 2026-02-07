// import { useEffect, useRef, useState } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import * as THREE from "three";
// import FeatherGLB from "../models/Feather";
// import BubbleFeather from "../models/Bubblefeather";
// import FeatherMain from "../models/feathermain";
// import CanvasFrame from "./components/CanvasFrame";

// Setup First Scene in react fiber architecture
// useGLB model and Render it on to the Screen

/*

const BoxHovered = () => {
  const [hovered, setHovered] = useState(false);

  console.log("Hovered Boxgeometry", hovered);

  return (
    <mesh
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const BoxClick = () => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

const BoxAnimateFrame = () => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color="orange" />
    </mesh>
  );
};

const BoxAnimateInteract = () => {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += hovered ? 0.03 : 0.01;
    }
  });

  return (
    <mesh
      ref={ref}
      scale={active ? 1.4 : 1}
      onClick={() => setActive(!active)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};



const Canvastest = () => {
  return (
    <div>
      <div className="w-screen h-screen border">
        <Canvas
          className="w-full h-full bg-transparent"
          onPointerMissed={() => console.log("clicked outside")}
        >
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshPhongMaterial />
          </mesh>

          <BoxHovered />
          <BoxClick />
          <BoxAnimateFrame />
          <BoxAnimateInteract />
          <CameraController focused={true} />

          <FeatherMain />


          <ambientLight intensity={1} />
          <directionalLight position={[0, 0, 5]} color={"white"} />

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

*/

const ReactFiber = () => {
  return <div></div>;
};

export default ReactFiber;
