import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLoader } from "../../../context/LoaderProvider";

const HeroVideo = ({ masterTl }: any) => {
    const { assets } = useLoader();

    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!assets?.videos?.hero || !sectionRef.current || !masterTl.current)
            return;

        const video = assets.videos.hero;
        const section = sectionRef.current;
        const duration = video.duration;

        // 🔒 ensure video is reset
        video.pause();
        video.currentTime = 0;

        // attach video to DOM ONCE
        if (!section.contains(video)) {
            video.className = "w-full h-full object-cover";
            section.appendChild(video);
        }

        const tl = gsap.timeline();

        // Intro
        tl.fromTo(section, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

        // Play video
        tl.add(() => {
            video.play();
        });

        // Hold for full video duration
        tl.to({}, { duration });

        // Outro (fade last frame)
        tl.to(section, {
            autoAlpha: 0,
            y: -100,
            duration: 1.2,
            ease: "power2.inOut",
        });

        // Register FIRST section
        masterTl.current.add(tl, "hero");
        masterTl.current.addLabel("after-hero");
    }, [assets]);

    return (
        <section
            ref={sectionRef}
            className="w-screen h-screen fixed inset-0 z-10 bg-black"
        />
    );
};

export default HeroVideo;
