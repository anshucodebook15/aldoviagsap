/**
 * Test Key Frames
 * 1. ADD GSAP in Test
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SceneTest from "./scene_4/main";

gsap.registerPlugin(useGSAP);

const TestPage = () => {
  return (
    <div>
      {/* <BasicGSAP /> */}
      {/* <ReactFiber />
      <Frame /> */}
      {/* <ReactCamera /> */}

      <SceneTest />


      {/* <CrystalBubbleCanvas /> */}
    </div>
  );
};

export default TestPage;
