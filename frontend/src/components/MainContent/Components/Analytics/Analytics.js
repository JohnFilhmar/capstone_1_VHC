/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router-dom";
import { MdAnalytics } from "react-icons/md";
import { useContext } from "react";
import { colorTheme } from "../../../../App";
import Header from "../../Header";
import Linechart from "./Linechart";
import MostDiseases from "./MostDiseases";

const Analytics = () => {
  const [selectedTheme] = useContext(colorTheme);
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-col p-2 mt-4 mb-4">
        <Header title={ title } icon={<MdAnalytics />}/>
        <div className="min-h-[80vh] h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col gap-4 justify-start items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 w-full h-full">
              <div className={`flex flex-col w-full h-full bg-${selectedTheme}-50 rounded-lg drop-shadow-md`}>
                <div className="flex justify-start items-center">
                  <p className={`p-4 font-bold text-start text-lg md:text-xl lg:text-2xl text-${selectedTheme}-700`}>Most Diseases and Illness</p>
                </div>
                <MostDiseases/>
              </div>
              <div className={`flex flex-col w-full h-full bg-${selectedTheme}-50 rounded-lg drop-shadow-md`}>
                <div className="flex justify-start items-center">
                  <p className={`p-4 font-bold text-start text-lg md:text-xl lg:text-2xl text-${selectedTheme}-700`}>Barchart</p>
                </div>
                <Linechart/>
              </div>
            </div>
            <div className={`flex w-full h-full p-4 bg-${selectedTheme}-50 rounded-lg`}>
              {/* <Barchart/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
 
export default Analytics;