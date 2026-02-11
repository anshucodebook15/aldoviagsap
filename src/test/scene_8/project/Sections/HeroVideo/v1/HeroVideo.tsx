import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroVideo = ({ masterTl }: any) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // console.log("vedio ref", videoRef.current.duration);


    useEffect(() => {
        if (!masterTl.current || !sectionRef.current || !videoRef.current) return;

        const tl = gsap.timeline();

        // intro
        tl.fromTo(
            sectionRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 1 }
        );

        // wait until video ends
        tl.add(() => {
            videoRef.current?.play();
        });

        tl.to({}, { duration: videoRef.current?.duration || 5 });

        // outro transition
        tl.to(sectionRef.current, {
            autoAlpha: 0,
            y: -100,
            duration: 1.2,
        });

        masterTl.current.add(tl);
    }, []);

    // Trigger timeline when video ends
    useEffect(() => {
        const video = videoRef.current;

        console.log("video Timeline", video?.duration);


        if (!video || !masterTl.current) return;

        video.onended = () => {
            masterTl.current?.play();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-screen h-screen overflow-hidden fixed z-20 flex items-center justify-center bg-black"
        >
            <video
                ref={videoRef}
                src="/assets/video/swarn.webm"
                muted
                playsInline
                className="min-w-full min-h-full object-cover"
                autoPlay
                loop
            ></video>
        </section>
    );
};

export default HeroVideo;
