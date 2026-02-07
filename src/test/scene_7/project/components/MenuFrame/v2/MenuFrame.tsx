import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useAssets } from "../../../../../../app/hooks/useAssets";

const Logo_top = () => {
  return (
    <div className="logo-top relative overflow-hidden w-18 h-18">
      {/* TEXT LOGO */}
      <h1 className="logo-text text-white font-[lust-text-light] text-[1.4rem]">
        Aldovia
      </h1>

      {/* IMAGE LOGO */}
      <img
        src="/assets/logo/aldovialogo.svg" // 👈 your actual logo
        alt="Aldovia"
        className=" w-full h-full logo-image absolute left-0 top-0 opacity-0"
      />
    </div>
  );
};

const MenuIcon = ({ icon = "menu", title = "" }) => {
  return (
    <li className="menu-item flex text-[16px] items-center gap-2 cursor-pointer">
      <span>
        <img src={icon} alt="" className="w-5 h-5" />
      </span>
      {title}
    </li>
  );
};

const Desktop_menu = () => {
  const { icons } = useAssets();

  return (
    <div className="desktop-menu">
      <ul className="flex gap-8">
        <MenuIcon icon={icons.dining} title="Dining" />
        <MenuIcon icon={icons.rooms} title="Events" />
        <MenuIcon icon={icons.activity} title="Activities" />
      </ul>
    </div>
  );
};

const MenuFrame = ({ masterTl }: any) => {
  const { icons } = useAssets();
  const frameRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!masterTl?.current || !frameRef.current) return;

    const ctx = gsap.context(() => {
      // initial states
      gsap.set(".logo-image", {
        autoAlpha: 0,
        y: 6,
        scale: 0.98,
      });

      // 🔥 logo swap after logo reveal
      masterTl.current
        .add("menu-logo-swap", "logo-reveal-end+=0.2")

        // text logo out
        .to(
          ".logo-text",
          {
            autoAlpha: 0,
            y: -6,
            filter: "blur(6px)",
            duration: 0.35,
            ease: "power2.out",
          },
          "menu-logo-swap",
        )

        // svg logo in
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
          "menu-logo-swap+=0.1",
        )  // ✅ ADD THIS
        // .add("menu-complete");

        .add(() => {
          window.dispatchEvent(new Event("menu-complete"));
        });



    }, frameRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={frameRef}
      className="menu-frame w-screen h-screen bg-black-50 fixed overflow-hidden z-40"
    >
      <div className="top-left absolute left-8 top-8">
        <Logo_top />
      </div>

      <div className="top-right absolute right-8 top-8">
        <div className="flex items-center gap-20">
          <Desktop_menu />
          <div id="hamburger" className="cursor-pointer">
            <img src={icons.menu} alt="" />
          </div>
        </div>
      </div>

      <div className="bottom-left absolute left-8 bottom-8">
        <MenuIcon icon={icons.sound2} title="sound" />
      </div>

      <div className="bottom-right absolute right-8 bottom-8">text</div>
    </div>
  );
};

export default MenuFrame;
