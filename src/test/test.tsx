/**
 * Test Key Frames
 * 1. ADD GSAP in Test
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SceneTest from "./scene_5/main";
// import GrabRotateScene from "./scene_5/test/GrabTestscene";

gsap.registerPlugin(useGSAP);

const TestPage = () => {
  return (
    <div>
      {/* <BasicGSAP /> */}
      {/* <ReactFiber />
      <Frame /> */}
      {/* <ReactCamera /> */}

      <SceneTest />

      {/* <TestCameraZoom /> */}
      {/* <GrabRotateScene /> */}
    </div>
  );
};

export default TestPage;
