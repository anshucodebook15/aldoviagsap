import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeroVideoScroll from "./HeroVideoScroll/v2/HeroVideoScroll";
import LogoReveal from "./logoReveal/LogoReveal";

gsap.registerPlugin(ScrollTrigger);

const Main = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const masterTl = useRef<gsap.core.Timeline | null>(null);

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            masterTl.current = gsap.timeline({
                defaults: { ease: "none" }, // important for scroll-based timelines
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=6000", // 🔥 controls total scroll distance
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-screen">
            <HeroVideoScroll masterTl={masterTl} />
            <LogoReveal masterTl={masterTl} />
        </div>
    );
};

const ScrollLandingPage = () => {
    return <Main />;
};

export default ScrollLandingPage;
