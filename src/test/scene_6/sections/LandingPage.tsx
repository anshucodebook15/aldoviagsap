import { useLayoutEffect, useRef } from "react";
// import BubbleFeatherDrops from "./BubbleFeathersDrops/BubbleFeatherDrops";
// import HeroVideo from "./HeroVideo/v1/HeroVideo";
// import LogoReveal from "./LogoReveal/LogoReveal";
// import Reflection from "./Reflection/Reflection";
// import SwanInteraction from "./SwanInteraction/SwanInteraction";


import gsap from "gsap";
import MenuFrame from "../components/menuframe";
import LogoReveal from "./LogoReveal/LogoReveal";
import { HeroVideo } from "./HeroVideo";

const LandingPage = () => {
  const masterTl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    masterTl.current = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
    });
  }, []);

  return (
    <div>
      <div id="frame">
        <MenuFrame />
      </div>

      <div id="landing-page">
        <HeroVideo masterTl={masterTl} />
        <LogoReveal masterTl={masterTl} />
        {/* <SwanInteraction />
                <BubbleFeatherDrops />
                <Reflection /> */}
      </div>
    </div>
  );
};

export default LandingPage;
