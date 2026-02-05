import { useAssets } from "../../../app/hooks/useAssets";


const Logo_top = () => {
    return (
        <div>
            <h1 className="text-white font-[lust-text-light] text-[1.4rem]">
                Aldovia
            </h1>
        </div>
    );
};

const MenuIcon = ({ icon = "menu", title = "" }) => {
    return (
        <li className="flex text-[16px] items-center gap-2 cursor-pointer">
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
        <div className="flex">
            <ul className="flex gap-8">
                <MenuIcon icon={icons.dining} title="Dining" />
                <MenuIcon icon={icons.rooms} title="Events" />
                <MenuIcon icon={icons.activity} title="Activities" />
            </ul>
            {/* <h1 className="text-white font-[lust-text-light] text-[1.2rem]">Menu</h1> */}
        </div>
    );
};

const MenuFrame = () => {
    const { icons } = useAssets();
    return (
        <div>
            <div className="w-screen h-screen bg-black-50 fixed overflow-hidden">
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

                <div className="bottom-right absolute right-8 bottom-8"> text</div>
            </div>
        </div>
    );
};

export default MenuFrame;
