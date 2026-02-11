/**
 * Test Key Frames
 * 1. ADD GSAP in Test
 */
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ProjectRoot from "./scene_8/project/ProjectRoot";

gsap.registerPlugin(useGSAP);

const TestPage = () => {
  return (
    <div>
      {/**Project Landing Page */}
      {/* <LandingPage /> */}
      <ProjectRoot />

      {/* ScrollVideo Path */}
      {/* <HeroVideoScroll /> */}
    </div>
  );
};

export default TestPage;
