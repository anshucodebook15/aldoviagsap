import { useEffect, useRef } from "react";
import gsap from "gsap";

const LogoReveal = ({ masterTl }: any) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!masterTl?.current || !sectionRef.current || !logoRef.current) return;

    const tl = gsap.timeline();

    masterTl.current.add(tl, "after-hero");

    // Make sure section is hidden initially
    gsap.set(sectionRef.current, { autoAlpha: 0 });

    // Section fade in
    tl.to(sectionRef.current, {
      autoAlpha: 1,
      duration: 0.6,
    });

    // Logo reveal animation
    tl.fromTo(
      logoRef.current,
      {
        scale: 0.85,
        autoAlpha: 0,
      },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power3.out",
      },
    );

    // Hold logo on screen
    tl.to({}, { duration: 1.5 });

    // Optional: fade out logo before next section
    tl.to(sectionRef.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // 🔥 Register into master timeline
    masterTl.current.add(tl);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="w-screen h-screen fixed z-30 flex items-center justify-center pointer-events-none"
    >
      <img
        ref={logoRef}
        src="/assets/logo/aldovialogo.svg"
        alt="Logo"
        className="w-90"
      />
    </div>
  );
};

export default LogoReveal;
