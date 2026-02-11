import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const LogoReveal = ({ masterTl }: any) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!masterTl?.current || !sectionRef.current || !logoRef.current) return;

    const tl = gsap.timeline();

    gsap.set(sectionRef.current, { autoAlpha: 0 });

    tl.to(sectionRef.current, {
      autoAlpha: 1,
      duration: 0.6,
    });

    tl.fromTo(
      logoRef.current,
      { scale: 0.85, autoAlpha: 0 },
      {
        scale: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power3.out",
      },
    );

    tl.to({}, { duration: 1.5 });

    tl.to(sectionRef.current, {
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
    });

    // 🔑 END MARKER (single source of truth)
    tl.add("logo-reveal-end");

    masterTl.current.add(tl, "after-hero");
  }, []);

  return (
    <div
      ref={sectionRef}
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
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
