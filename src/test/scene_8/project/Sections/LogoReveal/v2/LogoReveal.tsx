import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoader } from "../../../context/LoaderProvider";

const LogoReveal = ({ masterTl }: any) => {
    const { assets } = useLoader();
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!masterTl?.current || !sectionRef.current || !assets?.images?.logo)
            return;

        const section = sectionRef.current;
        const logo = assets.images.logo;

        // overlay setup
        gsap.set(section, {
            autoAlpha: 1,
            pointerEvents: "none",
        });

        // logo initial state
        gsap.set(logo, {
            autoAlpha: 0,
            scale: 0.97,
            transformOrigin: "50% 50%",
        });

        if (!section.contains(logo)) {
            logo.className = "w-90";
            section.appendChild(logo);
        }

        // 🔥 local timeline
        const tl = gsap.timeline();

        tl.add("logo-start");

        // ultra-soft logo emergence
        tl.to(logo, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.2,
            ease: "power1.out",
        });

        // hold
        tl.to({}, { duration: 4 });

        // fade overlay (logo disappears with it)
        tl.to(section, {
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.inOut",
        });

        tl.add("logo-end");

        // 👇 inject into MASTER timeline
        masterTl.current
            .add(tl, "after-hero")
            .add("logo-reveal-end"); // ⭐ global hook point

    }, [assets]);

    return (
        <div
            ref={sectionRef}
            className="fixed inset-0 z-30 flex items-center justify-center"
        />
    );
};

export default LogoReveal;
