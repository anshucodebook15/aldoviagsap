import {useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import MenuFrame from "./components/MenuFrame/v2/MenuFrame";
// import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v7/BubbleFeather_Interaction";
// import { HeroVideo } from "./Sections/HeroVideo";
// import LogoReveal from "./Sections/LogoReveal/LogoReveal";
// import SwanInteraction from "./Sections/SwanInteraction/SwanInteraction";
import { HeroVideo } from "./Sections/HeroVideo";
import LogoReveal from "./Sections/LogoReveal/LogoReveal";
// import BubbleFeather_Interaction_test from "../test/BubbleFeatherTest";
// import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v3/BubbleFeather_Interaction";
// import SwanInteraction from "./Sections/SwanInteraction/SwanInteraction";

const Main = () => {
  const masterTl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    masterTl.current = gsap.timeline({
      paused: false,
      defaults: { ease: "power2.inOut" },
    });
  }, []);

  return (
    <div>


      <div id="landing-page">
        <HeroVideo masterTl={masterTl} />
        <LogoReveal masterTl={masterTl} />
        <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
          <MenuFrame masterTl={masterTl} />
        </div>

        {/* <SwanInteraction masterTl={masterTl} />
        <BubbleFeather_Interaction masterTl={masterTl} /> */}

        {/* Bubble mounts AFTER MenuFrame animation */}
        {/* <BubbleFeather_Interaction_test /> */}
      </div>
    </div>
  );
};

const LandingPage = () => {
  return <Main />;
};

export default LandingPage;
