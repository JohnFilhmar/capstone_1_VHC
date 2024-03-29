import { useContext, useState } from "react";
import { MdHome, MdSpaceDashboard, MdFolder, MdAnalytics, MdLocalPharmacy, MdPeople } from "react-icons/md";
import { BiSolidDonateBlood } from "react-icons/bi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { colorTheme } from "../../App";

const Menu = ({ path, Icon, label }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [jump, setJump] = useState({
    Home: false,
    Dashboard: false,
    Analytics: false,
    Records: false,
    Pharmacy: false,
    BloodUnit: false,
  });
  const location = useLocation();
  const loc = location.pathname;

  const handleClick = () => {
    setJump((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Link
      to={path}
      onClick={handleClick}
      className={`m-2 px-2 md:px-8 lg:px-14 gap-2 rounded-lg transition-colors hover:text-${selectedTheme}-600 hover:bg-${selectedTheme}-50 hover:drop-shadow-md p-2 first-line duration-300 ease-linear ${
        loc === `/${path}`
          ? `bg-${selectedTheme}-100 drop-shadow-xl`
          : `bg-transparent`
      }`}
    >
      <div
        className={`flex flex-row justify-start items-center ${
          jump[label] && 'animate-jump'
        }`}
        onAnimationEnd={handleClick}
      >
        <Icon className={`w-6 h-6 md:mr-2 lg:mr-2`} />
        <p className={`hidden md:block lg:block`} onAnimationEnd={handleClick}>
          {label}
        </p>
      </div>
    </Link>
  );
};

const SideMenu = () => {

  const [selectedTheme] = useContext(colorTheme);
  return (
    <div className={`flex flex-col text-${selectedTheme}-700 font-semibold mt-24 md:mt-24 lg:mt-28`}>
      <Menu path="home" Icon={MdHome} label="Home" />
      <Menu path="queue" Icon={MdPeople} label="Queues" />
      <Menu path="dashboard" Icon={MdSpaceDashboard} label="Dashboard" />
      <Menu path="analytics" Icon={MdAnalytics} label="Analytics" />
      <Menu path="records" Icon={MdFolder} label="Records" />
      <Menu path="pharmacy" Icon={MdLocalPharmacy} label="Pharmacy" />
      <Menu path="blood_unit" Icon={BiSolidDonateBlood} label="Blood Unit" />
      <Outlet />
    </div>
  );
};

export default SideMenu;
