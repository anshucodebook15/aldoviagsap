import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAssets } from "../../../../../../app/hooks/useAssets";

/* ---------------- LOGO ---------------- */

const Logo_top = () => {
  return (
    <div className="logo-top relative overflow-hidden w-18 h-18">
      {/* TEXT LOGO */}
      <h1 className="logo-text text-white font-[lust-text-light] text-[1.4rem]">
        Aldovia
      </h1>

      {/* IMAGE LOGO */}
      <img
        src="/assets/logo/aldovialogo.svg"
        alt="Aldovia"
        className="logo-image absolute inset-0 w-full h-full opacity-0"
      />
    </div>
  );
};

/* ---------------- MENU ITEMS ---------------- */

const MenuIcon = ({ icon = "menu", title = "" }) => {
  return (
    <li className="menu-item flex text-[16px] items-center gap-2 cursor-pointer">
      <img src={icon} alt="" className="w-5 h-5" />
      {title}
    </li>
  );
};

const Desktop_menu = () => {
  const { icons } = useAssets();

  return (
    <ul className="desktop-menu flex gap-8">
      <MenuIcon icon={icons.dining} title="Dining" />
      <MenuIcon icon={icons.rooms} title="Events" />
      <MenuIcon icon={icons.activity} title="Activities" />
    </ul>
  );
};

/* ---------------- MENU FRAME ---------------- */

const MenuFrame = ({ masterTl }: any) => {
  const { icons } = useAssets();
  const frameRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   if (!masterTl?.current || !frameRef.current) return;

  //   const ctx = gsap.context(() => {
  //     /* 🔒 Initial states */
  //     gsap.set(".logo-image", {
  //       autoAlpha: 0,
  //       y: 6,
  //       scale: 0.98,
  //     });

  //     gsap.set(".menu-item", {
  //       autoAlpha: 0,
  //       y: 10,
  //     });

  //     /* 🔗 Hook STRICTLY to logo end */
  //     masterTl.current!
  //       .add("menu-start", "logo-reveal-end+=0.15")

  //       /* Logo swap */
  //       .to(
  //         ".logo-text",
  //         {
  //           autoAlpha: 0,
  //           y: -6,
  //           filter: "blur(6px)",
  //           duration: 0.35,
  //           ease: "power2.out",
  //         },
  //         "menu-start"
  //       )

  //       .to(
  //         ".logo-image",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           scale: 1,
  //           filter: "blur(0px)",
  //           duration: 0.45,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.1"
  //       )

  //       /* Menu items reveal */
  //       .to(
  //         ".menu-item",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           stagger: 0.08,
  //           duration: 0.4,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.25"
  //       );
  //   }, frameRef);

  //   return () => ctx.revert();
  // }, []);

  // useLayoutEffect(() => {
  //   if (!masterTl?.current || !frameRef.current) return;

  //   const ctx = gsap.context(() => {
  //     gsap.set(".logo-image", {
  //       autoAlpha: 0,
  //       y: 6,
  //       scale: 0.98,
  //     });

  //     gsap.set(".menu-item", {
  //       autoAlpha: 0,
  //       y: 10,
  //     });

  //     masterTl.current!
  //       // 🚦 STRICTLY AFTER LOGO REVEAL
  //       .add("menu-start", "logo-reveal-end")

  //       .to(
  //         ".logo-text",
  //         {
  //           autoAlpha: 0,
  //           y: -6,
  //           filter: "blur(6px)",
  //           duration: 0.35,
  //           ease: "power2.out",
  //         },
  //         "menu-start"
  //       )

  //       .to(
  //         ".logo-image",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           scale: 1,
  //           filter: "blur(0px)",
  //           duration: 0.45,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.1"
  //       )

  //       .to(
  //         ".menu-item",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           stagger: 0.08,
  //           duration: 0.4,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.25"
  //       );
  //   }, frameRef);

  //   return () => ctx.revert();
  // }, []);

  // useLayoutEffect(() => {
  //   if (!masterTl?.current || !frameRef.current) return;

  //   const ctx = gsap.context(() => {

  //     // 🔒 Initial hidden state
  //     gsap.set(".logo-top", {
  //       autoAlpha: 0,
  //       y: -12,
  //     });

  //     gsap.set(".logo-image", {
  //       autoAlpha: 0,
  //       y: 6,
  //       scale: 0.98,
  //     });

  //     gsap.set(".menu-item", {
  //       autoAlpha: 0,
  //       y: 10,
  //     });

  //     masterTl.current!

  //       // 🚦 STRICTLY after LogoReveal finishes
  //       .add("menu-start", "logo-reveal-end")

  //       // 🔥 MENU LOGO ENTERS FIRST
  //       .to(
  //         ".logo-top",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           duration: 0.45,
  //           ease: "power2.out",
  //         },
  //         "menu-start"
  //       )

  //       // Logo text → image swap
  //       .to(
  //         ".logo-text",
  //         {
  //           autoAlpha: 0,
  //           y: -6,
  //           filter: "blur(6px)",
  //           duration: 0.35,
  //         },
  //         "menu-start+=0.45"
  //       )

  //       .to(
  //         ".logo-image",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           scale: 1,
  //           filter: "blur(0px)",
  //           duration: 0.45,
  //         },
  //         "menu-start+=0.45"
  //       )

  //       // Menu items AFTER logo
  //       .to(
  //         ".menu-item",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           stagger: 0.08,
  //           duration: 0.4,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.45"
  //       );

  //   }, frameRef);

  //   return () => ctx.revert();
  // }, []);

  // useEffect(() => {
  //   if (!masterTl?.current || !frameRef.current) return;

  //   const ctx = gsap.context(() => {
  //     // Initial hidden states
  //     gsap.set(".logo-top", {
  //       autoAlpha: 0,
  //       y: -12,
  //     });

  //     gsap.set(".logo-image", {
  //       autoAlpha: 0,
  //       y: 6,
  //       scale: 0.98,
  //     });

  //     gsap.set(".menu-item", {
  //       autoAlpha: 0,
  //       y: 10,
  //     });

  //     masterTl
  //       .current! // ⏱ 2 SECOND DELAY AFTER LOGO REVEAL
  //       .add("menu-start", "logo-reveal-end+=2")

  //       // Menu logo enters
  //       .to(
  //         ".logo-top",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           duration: 0.45,
  //           ease: "power2.out",
  //         },
  //         "menu-start",
  //       )

  //       // Logo swap
  //       .to(
  //         ".logo-text",
  //         {
  //           autoAlpha: 0,
  //           y: -6,
  //           filter: "blur(6px)",
  //           duration: 0.35,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.15",
  //       )

  //       .to(
  //         ".logo-image",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           scale: 1,
  //           filter: "blur(0px)",
  //           duration: 0.45,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.25",
  //       )

  //       // Menu items
  //       .to(
  //         ".menu-item",
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           stagger: 0.08,
  //           duration: 0.4,
  //           ease: "power2.out",
  //         },
  //         "menu-start+=0.45",
  //       );

  //     masterTl.current!.add("menu-end");
  //   }, frameRef);

  //   return () => ctx.revert();
  // }, []);

  useEffect(() => {
    if (!masterTl?.current || !frameRef.current) return;

    const ctx = gsap.context(() => {
      const menuTl = gsap.timeline();

      // Initial states
      gsap.set(".logo-top", { autoAlpha: 0, y: -12 });
      gsap.set(".logo-image", { autoAlpha: 0, y: 6, scale: 0.98 });
      gsap.set(".menu-item", { autoAlpha: 0, y: 10 });

      menuTl
        .add("menu-start")

        .to(
          ".logo-top",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          "menu-start",
        )

        .to(
          ".logo-text",
          {
            autoAlpha: 0,
            y: -6,
            filter: "blur(6px)",
            duration: 0.35,
            ease: "power2.out",
          },
          "menu-start+=0.15",
        )

        .to(
          ".logo-image",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power2.out",
          },
          "menu-start+=0.25",
        )

        .to(
          ".menu-item",
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.4,
            ease: "power2.out",
          },
          "menu-start+=0.45",
        )

        .add("menu-end");

      // 🔥 Add AFTER logo reveal ends + 2 sec
      // masterTl.current.add(menuTl, "logo-reveal-end+=1");

      // masterTl.current.add(menuTl, "logo-reveal-end+5");

      masterTl.current.add(menuTl, ">");
    }, frameRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={frameRef}
      className="menu-frame fixed inset-0 z-40 pointer-events-none"
    >
      {/* TOP LEFT */}
      <div className="absolute left-8 top-8 pointer-events-auto">
        <Logo_top />
      </div>

      {/* TOP RIGHT */}
      <div className="absolute right-8 top-8 pointer-events-auto">
        <div className="flex items-center gap-20">
          <Desktop_menu />
          <img src={icons.menu} alt="menu" className="w-6 h-6 cursor-pointer" />
        </div>
      </div>

      {/* BOTTOM LEFT */}
      <div className="absolute left-8 bottom-8 pointer-events-auto">
        <MenuIcon icon={icons.sound2} title="Sound" />
      </div>

      {/* BOTTOM RIGHT */}
      <div className="absolute right-8 bottom-8 text-white text-[12px] opacity-60">
        <i>
          A swan moves like silence <br /> given a shape.
        </i>
      </div>
    </div>
  );
};

export default MenuFrame;
