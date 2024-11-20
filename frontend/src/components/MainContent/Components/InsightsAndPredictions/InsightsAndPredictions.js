import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { MdInsights, MdKeyboardArrowDown } from "react-icons/md";
import BarangayMetrics from "./BarangayMetrics";
import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../App";
import { IoIosPeople } from "react-icons/io";
import BarangayPopulationChart from "./Population/BarangayPopulationChart";
import useQuery from "../../../../hooks/useQuery";

const InsightsAndPredictions = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = (pathname.charAt(0).toUpperCase() + pathname.slice(1)).split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  const { response, isLoading, fetchData } = useQuery();
  const [selectedTheme] = useContext(colorTheme);
  const [isChartsOpen, setIsChartsOpen] = useState(true);
  const [barangayPopulations, setBarangayPopulations] = useState(null);
  // const [isGraphsOpen, setIsGraphsOpen] = useState(false);
  // const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    fetchData("getBarangaysPopulation");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (response?.status === 200 && response?.data) {
      setBarangayPopulations(response.data.filter(prev => prev.Male > 1 && prev.Female > 1));
    }
  }, [response]);
  
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <Header title={ title } icon={<MdInsights />}/>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[80vh] h-[70vh] md:h-[80vh] lg:h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col gap-2 items-start justify-start w-full">
            
            <div
              className={`flex flex-col gap-1 p-2 w-full shadow-md rounded-md`}
            >
              <div className={`flex justify-between items-center w-full`}>
                <div className="flex gap-1">
                  <IoIosPeople className={`size-5 md:size-6 lg:size-7 text-${selectedTheme}-800`}/>
                  <p
                    className={`font-bold text-base md:text-lg lg:text-xl text-${selectedTheme}-800`}
                  >
                    Recorded Population
                  </p>
                </div>
                <button
                  onClick={() => setIsChartsOpen((prev) => !prev)}
                  className={`justify-self-end transition-colors p-1 bg-${selectedTheme}-${
                    isChartsOpen ? "200" : "800"
                  } hover:bg-${selectedTheme}-${
                    isChartsOpen ? "100" : "700"
                  } active:bg-${selectedTheme}-${
                    isChartsOpen ? "300" : "900"
                  } text-${selectedTheme}-${
                    isChartsOpen ? "800" : "200"
                  } hover:text-${selectedTheme}-${
                    isChartsOpen ? "700" : "100"
                  } active:text-${selectedTheme}-${
                    isChartsOpen ? "900" : "300"
                  } drop-shadow-md hover:shadow-inner rounded-md font-semibold`}
                >
                  <MdKeyboardArrowDown className={`size-5 md:size-6 lg:size-7 ${isChartsOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {isChartsOpen && (
                <div className="relative overflow-hidden">
                  <div
                    className="flex flex-nowrap animate-marquee"
                    style={{ "--duration": "28s" }}
                  >
                    {barangayPopulations?.map((dat, i) => (
                      <BarangayPopulationChart data={dat} key={i}/>
                    ))}
                    {barangayPopulations?.map((dat, i) => (
                      <BarangayPopulationChart data={dat} key={`clone-${i}`}/>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <BarangayMetrics />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightsAndPredictions;