import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

type Props = {
    target: THREE.Vector3 | null;
    enabled: boolean;
};

const CameraFocusController = ({ target, enabled }: Props) => {
    const { camera } = useThree();

    // 👇 this vector will be animated smoothly
    const lookAtRef = useRef(new THREE.Vector3());


    console.log("Camera Direction", lookAtRef);
    

    useEffect(() => {
        if (!enabled || !target) return;

        // Starting lookAt = where camera is currently facing
        camera.getWorldDirection(lookAtRef.current);
        lookAtRef.current.multiplyScalar(10).add(camera.position);

        // Direction for zoom
        const dir = new THREE.Vector3()
            .subVectors(camera.position, target)
            .normalize();

        const distance = 12;
        const newPos = target.clone().add(dir.multiplyScalar(distance));

        const tl = gsap.timeline({
            defaults: { ease: "power3.inOut", duration: 1.2 },
        });

        // 1️⃣ Move camera
        tl.to(
            camera.position,
            {
                x: newPos.x,
                y: newPos.y,
                z: newPos.z,
            },
            0,
        );

        // 2️⃣ Move lookAt target smoothly
        tl.to(
            lookAtRef.current,
            {
                x: target.x,
                y: target.y,
                z: target.z,
                onUpdate: () => {
                    camera.lookAt(lookAtRef.current);
                },
            },
            0,
        );

        return () => {
            tl.kill();
        };
    }, [target, enabled]);

    return null;
};

export default CameraFocusController;
