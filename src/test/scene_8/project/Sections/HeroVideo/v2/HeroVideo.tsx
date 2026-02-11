import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoader } from "../../../context/LoaderProvider";

const HeroVideo = ({ masterTl }: any) => {
  const { assets } = useLoader();

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log("Assets In loader page", assets);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section || !masterTl.current) return;

    const onMetaLoaded = () => {
      const duration = video.duration;

      const tl = gsap.timeline(); // 🔒 NOT auto-playing

      // Intro
      tl.fromTo(section, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

      // Start video
      tl.add(() => {
        video.currentTime = 0;
        video.play();
      });

      // Hold for video duration
      tl.to({}, { duration });

      // Outro
      tl.to(section, {
        autoAlpha: 0,
        y: -100,
        duration: 1.2,
        ease: "power2.inOut",
      });

      // 🔑 Register hero FIRST
      masterTl.current.add(tl, "hero");

      // 🔑 Define handoff point
      masterTl.current.addLabel("after-hero");
    };

    video.addEventListener("loadedmetadata", onMetaLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", onMetaLoaded);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-screen h-screen fixed inset-0 z-20 bg-black"
    >
      <video
        ref={videoRef}
        src="/assets/video/swarn.webm"
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
    </section>
  );
};

export default HeroVideo;
