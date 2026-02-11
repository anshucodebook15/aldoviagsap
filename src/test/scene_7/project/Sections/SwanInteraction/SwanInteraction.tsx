import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

type Props = {
  masterTl: React.MutableRefObject<gsap.core.Timeline | null>;
};

const SwanInteraction = ({ masterTl }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const isPlaying = useRef(false);

  /* ---------------- SWAN INTRO (MASTER TIMELINE) ---------------- */

  // useLayoutEffect(() => {
  //   if (!masterTl.current || !containerRef.current) return;

  //   // Initial hidden state
  //   gsap.set(containerRef.current, {
  //     autoAlpha: 0,
  //   });

  //   const tl = gsap.timeline({
  //     paused: true,
  //     onComplete: () => {
  //       // ⛔ STOP master timeline at swan
  //       masterTl.current?.pause();
  //     },
  //   });

  //   // Fade-in ONLY (cinematic)
  //   tl.to(containerRef.current, {
  //     autoAlpha: 1,
  //     duration: 1.2,
  //     ease: "power2.out",
  //   });

  //   // 🔗 Attach strictly after menu
  //   masterTl.current.add(tl, "menu-end");
  // }, []);

  useLayoutEffect(() => {
    if (!masterTl.current || !containerRef.current) return;

    // Initial hidden state
    gsap.set(containerRef.current, { autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        // ⛔ Pause master ONLY after swan fades in
        masterTl.current?.pause();
      },
    });

    tl.to(containerRef.current, {
      autoAlpha: 1,
      duration: 1.2,
      ease: "power2.out",
    });

    // 🔗 Attach after menu animation
    masterTl.current.add(tl, "menu-end");
  }, []);

  /* ---------------- VIDEO INITIAL STATE ---------------- */

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 3; // sitting pose
  }, []);

  /* ---------------- VIDEO SEGMENT PLAYER ---------------- */

  const playSegment = (from: number, to: number, onDone?: () => void) => {
    const video = videoRef.current;
    if (!video) return;

    isPlaying.current = true;
    video.currentTime = from;
    video.play();

    const tick = () => {
      if (video.currentTime >= to) {
        video.pause();
        gsap.ticker.remove(tick);
        isPlaying.current = false;
        onDone?.();
      }
    };

    gsap.ticker.add(tick);
  };

  /* ---------------- USER INTERACTION ---------------- */

  const handleClick = () => {
    if (isPlaying.current) return;

    // 🦢 Ready to fly (3 → 5)
    if (stage === 0) {
      playSegment(3, 5, () => setStage(1));
    }

    // 🦢 Takeoff (5 → 10)
    else if (stage === 1) {
      playSegment(5, 10, () => {
        setStage(2);

        // Exit swan scene
        gsap.to(containerRef.current, {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            // ▶️ Resume master timeline
            masterTl.current?.play();
          },
        });
      });
    }
  };

  /* ---------------- JSX ---------------- */

  return (
    <section
      ref={containerRef}
      onClick={handleClick}
      className="
        relative
        w-screen
        h-screen
        overflow-hidden
        flex
        items-center
        justify-center
        cursor-pointer
        bg-black
      "
    >
      <video
        ref={videoRef}
        src="/assets/video/swanflight.webm"
        muted
        playsInline
        preload="auto"
        className="
          pointer-events-none
          w-full
          max-w-[1400px]
          h-auto
          will-change-transform
        "
      />
    </section>
  );
};

export default SwanInteraction;
