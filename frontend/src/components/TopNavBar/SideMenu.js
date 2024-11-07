import { useContext, useEffect, useState } from "react";
import { MdHome, MdSpaceDashboard, MdFolder, MdAnalytics, MdLocalPharmacy, MdPeople, MdOutlineSmartToy, MdKeyboardArrowDown } from "react-icons/md";
import { FaCode, FaMapMarkedAlt, FaStethoscope, FaStore, FaUsers } from "react-icons/fa";
import { BiSolidDonateBlood, BiSolidLogInCircle } from "react-icons/bi";
import { Link, Outlet, useLocation } from "react-router-dom";
import { colorTheme, isLoggedInContext } from "../../App";
import { IoCalendar } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { GoReport } from "react-icons/go";
import useIndexedDB from "../../hooks/useIndexedDb";

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
      className={`m-1 md:m-2 lg:m-2 px-2 md:px-4 lg:px-10 gap-1 rounded-lg transition-colors hover:text-${selectedTheme}-600 hover:bg-${selectedTheme}-50 hover:drop-shadow-md p-2 first-line duration-300 ease-linear ${
        loc === `/${path}`
          ? `bg-${selectedTheme}-100 drop-shadow-xl`
          : `bg-transparent`
      }`}
    >
      <div
        className={`grid grid-cols1 md:grid-cols-3 lg:grid-cols-3 justify-start items-center ${
          jump[label] && 'animate-jump'
        }`}
        onAnimationEnd={handleClick}
      >
        <Icon className={`w-6 h-6`} />
        <p className={`col-span-2 hidden md:block lg:block`} onAnimationEnd={handleClick}>
          {label}
        </p>
      </div>
    </Link>
  );
};

const SideMenu = () => {
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const location = useLocation();
  const loc = location.pathname;
  const { getAllItems } = useIndexedDB();
  const [idbAccessToken, setIdbAccessToken] = useState(null);
  
  async function getTokens() {
    const tokens = await getAllItems('tokens');
    setIdbAccessToken(tokens.accessToken);
  }
  useEffect(() => {
    getTokens();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const role = idbAccessToken ? jwtDecode(idbAccessToken).role : "";

  const [selectedTheme] = useContext(colorTheme);
  const [isLoggedIn] = useContext(isLoggedInContext);
  
  return (
    <div className={`flex flex-col text-${selectedTheme}-800 font-semibold`}>
      {isLoggedIn ? (
        <>
        <Menu path="home" Icon={MdHome} label="Home" />
        <Menu path="dashboard" Icon={MdSpaceDashboard} label="Dashboard" />
        <Menu path="analytics" Icon={MdAnalytics} label="Analytics" />
        <Menu path="mapping" Icon={FaMapMarkedAlt} label="Mapping" />
        <Menu path="appointments" Icon={IoCalendar} label="Appointments" />
        <Menu path="queue" Icon={MdPeople} label="Queues" />
        <Menu path="records" Icon={MdFolder} label="Records" />
        <Menu path="pharmacy" Icon={MdLocalPharmacy} label="Pharmacy" />
        <Menu path="equipments" Icon={FaStethoscope} label="Equipments" />
        <Menu path="blood_unit" Icon={BiSolidDonateBlood} label="Blood Unit" />
        {role && (role !== 'staff') && (
          <Menu path="accounts" Icon={FaUsers} label="Accounts" />
        )}

        {role && role === 'developer' && (
          <>
            <button onClick={() => setIsDevMenuOpen(prev => !prev)} className={`m-1 px-2 md:px-4 lg:px-10 gap-1 rounded-lg transition-colors bg-${selectedTheme}-300 hover:text-${selectedTheme}-600 hover:bg-${selectedTheme}-50 hover:drop-shadow-md p-2 first-line duration-300 ease-linear ${
              isDevMenuOpen || loc === '/playground-jwt' || loc === '/playground-socket' ? `bg-${selectedTheme}-50 drop-shadow-xl` : `bg-transparent`
            }`}>
              <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-1`}>
                <FaCode className={`w-6 h-6 md:mr-2 lg:mr-2`} />
                <p className={`col-span-1 md:col-span-2 lg:col-span-2 hidden md:block lg:block`}>
                  Developer
                </p>
                <MdKeyboardArrowDown className={`${isDevMenuOpen && 'rotate-180'} w-6 h-6 hidden md:block lg:block md:ml-2 lg:ml-2`} />
              </div>
            </button>
            {isDevMenuOpen && (
              <>
                <Menu path="playground-jwt" Icon={MdOutlineSmartToy} label="JWT" />
                <Menu path="indexed-db" Icon={FaStore} label="IDB" />
                <Menu path="problems" Icon={GoReport} label="Problems" />
              </>
            )}
          </>
        )}
        </>
      ) : (
        <>
        <Menu path="home" Icon={MdHome} label="Home" />
        <Menu path="queue" Icon={MdPeople} label="Queues" />
        <Menu path="dashboard" Icon={MdSpaceDashboard} label="Dashboard" />
        <Menu path="analytics" Icon={MdAnalytics} label="Analytics" />
        </>
      )}
      {!isLoggedIn && (
        <Menu path="login" Icon={BiSolidLogInCircle} label="Login" />
      )}
      <Outlet />
    </div>
  );
};

export default SideMenu;
