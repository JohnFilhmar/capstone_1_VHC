import { Avatar } from "flowbite-react";
import { IoMdSettings } from "react-icons/io";
import { MdHelp, MdKeyboardArrowRight } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { useContext, useState } from "react";
import { colorTheme } from "../../App";
import useWindowSize from "../../hooks/useWindowSize";
import OptionButton from "./OptionButton";

const Profile = ({ prof, toggle, toggleOptions, toggleHelp }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [rotateSetting, setRotateSetting] = useState(false);
  const {avatarSize} = useWindowSize();

  return (
    <dialog ref={prof} className={`rounded-lg mr-0 fixed right-4 md:right-10 lg:right-14 top-20 bg-${selectedTheme}-100 drop-shadow-lg`}>
        <div className="flex flex-col m-2">
          <button onClick={() => toggle()} className={`hover:drop-shadow-lg flex justify-start items-center mb-2 text-${selectedTheme}-600 p-1 m-2 drop-shadow-lg rounded-lg bg-${selectedTheme}-100 transition-colors duration-200 hover:bg-${selectedTheme}-50`}>
            <div className="flex justify-between items-center m-2">
              <Avatar img="default_profile.svg" rounded status="online" size={avatarSize} statusPosition="bottom-right" />
              <p className="font-semibold p-1 text-xs md:text-sm lg:text-base">User Name</p>
            </div>
          </button>
          <div className="w-60 md:w-70 lg:w-80 flex flex-col gap-2">
            <button onMouseEnter={() => setRotateSetting(true)} onMouseLeave={() => setRotateSetting(false)} className={`hover:drop-shadow-lg rounded-lg transition-colors duration-200 hover:bg-${selectedTheme}-100 focus:ring-${selectedTheme}-500 focus:bg-${selectedTheme}-50`} onClick={() => { toggleOptions(); toggle(); }}>
              <div className="flex items-center justify-between mx-2 p-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 md:w-8 lg:w-9 h-7 md:h-8 lg:h-9 bg-${selectedTheme}-700 text-${selectedTheme}-50 rounded-3xl flex items-center justify-center p-1`}>
                    <IoMdSettings className={`w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 transition-transform duration-200 ${rotateSetting && 'rotate-180'}`}/>
                  </div>
                  <p className={`text-xs md:text-sm lg:text-base font-semibold text-${selectedTheme}-900`}>Settings</p>
                </div>
                <MdKeyboardArrowRight className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
              </div>
            </button>
            <OptionButton Icon={MdHelp} label={'Help & Support'} isExtending={true} buttonClick={() => {toggleHelp(); toggle();}} />
            <OptionButton Icon={ImExit} label={'Logout'} isExtending={false} buttonClick={() => console.log('clicked')} />
          </div>
        </div>
    </dialog>
  );
}
 
export default Profile;