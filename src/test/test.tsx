/**
 * Test Key Frames
 * 1. ADD GSAP in Test
 */
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// import LandingPage from "./scene_7/project/LandingPage";
// import App from "./scene_7/project/App";
import ProjectRoot from "./scene_7/project/ProjectRoot";

gsap.registerPlugin(useGSAP);

const TestPage = () => {
  return (
    <div>
      {/* <BasicGSAP /> */}
      {/* <ReactFiber />
      <Frame /> */}
      {/* <ReactCamera /> */}

      {/* Scene Test 6 (currently) */}
      {/* <SceneTest /> */}

      {/* <TestCameraZoom /> */}
      {/* <GrabRotateScene /> */}

      {/* Landing Page */}
      {/* <LandingPage /> */}

      {/**Project Landing Page */}
      {/* <LandingPage /> */}
      <ProjectRoot />
    </div>
  );
};

export default TestPage;
