// import { Canvas, useThree } from "@react-three/fiber";
// import { Environment, OrbitControls } from "@react-three/drei";

// import gsap from "gsap";
// import Bubble from "./components/Bubble";

// function CameraRig() {
//   const { camera } = useThree();

//   const onBurst = () => {
//     gsap.to(camera.position, {
//       z: 2.5,
//       duration: 0.4,
//       ease: "power2.out",
//     });

//     gsap.to(camera.position, {
//       x: "+=0.08",
//       y: "+=0.05",
//       yoyo: true,
//       repeat: 3,
//       duration: 0.05,
//     });
//   };

//   return <Bubble position={[0, 0, 0]} onBurst={onBurst} />;
// }

// const Scene4 = () => {
//   return (
//     <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
//       <ambientLight intensity={0.6} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />
//       <Environment preset="sunset" />
//       <CameraRig />
//       <OrbitControls />
//     </Canvas>
//   );
// };

// export default Scene4;
