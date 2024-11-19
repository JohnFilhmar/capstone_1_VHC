/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from 'react-router-dom';
import { MdAnalytics } from 'react-icons/md';
import { useContext } from 'react';
import { colorTheme } from '../../../../App';
import Header from '../../Header';
import MostDiseases from './MostDiseases';
import CasesRate from './CasesRate';
import BarangayCasesRate from './BarangayCasesRate';

const Analytics = () => {
  const [selectedTheme] = useContext(colorTheme);
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const dd = localStorage.getItem('dashboardData');
  const storedData = dd ? JSON.parse(dd) : [];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <Header title={title} icon={<MdAnalytics />} />
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col gap-4 justify-start items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 w-full h-full">
              <div
                className={`flex flex-col w-full h-full bg-${selectedTheme}-50 rounded-lg drop-shadow-md p-2`}
              >
                <div className="flex justify-start items-center">
                  <p
                    className={`p-4 font-bold text-start text-lg md:text-xl lg:text-2xl text-${selectedTheme}-700`}
                  >
                    Most Cases Reported
                  </p>
                </div>
                <MostDiseases data={storedData.cases_count} />
              </div>
              <div
                className={`flex flex-col w-full h-full bg-${selectedTheme}-50 rounded-lg drop-shadow-md p-2`}
              >
                <div className="flex justify-start items-center">
                  <p
                    className={`p-4 font-bold text-start text-lg md:text-xl lg:text-2xl text-${selectedTheme}-700`}
                  >
                    Top Annual Cases Rate
                  </p>
                </div>
                <CasesRate data={storedData.cases_rate} />
              </div>
            </div>
            <div
              className={`flex flex-col w-full h-full p-4 bg-${selectedTheme}-50 rounded-lg`}
            >
              <div className="flex justify-start items-center">
                <p
                  className={`p-4 font-bold text-start text-lg md:text-xl lg:text-2xl text-${selectedTheme}-700`}
                >
                  Barangay Cases Rate
                </p>
              </div>
              <BarangayCasesRate dataset={storedData.barangay_cases_rate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
