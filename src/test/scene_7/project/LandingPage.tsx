import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
// import MenuFrame from "./components/MenuFrame/MenuFrame";
import { HeroVideo } from "./Sections/HeroVideo";
import LogoReveal from "./Sections/LogoReveal/v2/LogoReveal";
import MenuFrame from "./components/MenuFrame/v2/MenuFrame";
import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/v3/BubbleFeather_Interaction";
// import BubbleFeather_Interaction from "./Sections/BubbleFeathersInteraction/BubbleFeather_Interaction";
// import { HeroVideo } from "./Sections/HeroVideo";

const Main = () => {
  const masterTl = useRef<gsap.core.Timeline | null>(null);
  const [showBubbles, setShowBubbles] = useState(false);

  useLayoutEffect(() => {
    masterTl.current = gsap.timeline({
      paused: false,
      defaults: { ease: "power2.inOut" },
    });
  }, []);

  useEffect(() => {
    const onMenuComplete = () => {
      setShowBubbles(true);
    };

    window.addEventListener("menu-complete", onMenuComplete);
    return () => window.removeEventListener("menu-complete", onMenuComplete);
  }, []);

  return (
    // <div>
    //   <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
    //     <MenuFrame masterTl={masterTl} />
    //   </div>

    //   <div id="landing-page">
    //     <HeroVideo masterTl={masterTl} />
    //     <LogoReveal masterTl={masterTl} />
    //     <BubbleFeather_Interaction masterTl={masterTl} />
    //     {/* <SwanInteraction />
    //             <BubbleFeatherDrops />
    //             <Reflection /> */}
    //   </div>
    // </div>




    <div>
      {/* MENU ALWAYS EXISTS */}
      {/* <MenuFrame masterTl={masterTl} /> */}
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <MenuFrame masterTl={masterTl} />
      </div>

      {/* ❌ NOT MOUNTED BEFORE MENU FINISHES */}
      {!showBubbles && <HeroVideo masterTl={masterTl} />}
      {!showBubbles && <LogoReveal masterTl={masterTl} />}

      {/* ✅ MOUNTS ONLY AFTER MENU COMPLETES */}
      {showBubbles && <BubbleFeather_Interaction />}
    </div>

  );
};

const LandingPage = () => {
  return <Main />;
};

export default LandingPage;
