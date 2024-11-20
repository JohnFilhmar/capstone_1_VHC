import React, { useContext, useEffect, useState } from "react";
import Header from "../../Header";
import { useLocation } from "react-router-dom";
import { MdPeopleAlt, MdBloodtype, MdDashboard } from "react-icons/md";
import DonorChart from "./DonorChart";
import { colorTheme } from "../../../../App";
import useQuery from "../../../../hooks/useQuery";
import AnnualPatientChart from "./AnnualPatientChart";
import WeeklyPatientChart from "./WeeklyPatientChart";
import MonthlyPatientChart from "./MonthlyPatientChart";
import DashIcon from "./DashIcon";
// import MultiLineChart from './MultiLineChart';

const Dashboard = () => {
  const [selectedTheme] = useContext(colorTheme);
  const { response, isLoading, fetchData } = useQuery();
  const [data, setData] = useState(null);
  const [patientPeriods, setPatientPeriods] = useState(null);

  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  useEffect(() => {
    const storedData = localStorage.getItem("dashboardData");
    if (storedData) {
      setData(JSON.parse(storedData));
      const parsedData = storedData && JSON.parse(storedData);
      if (!parsedData) {
        fetchData("/getDashBoardData");
      } else {
        fetchData("/getDashBoardData");
        setData(JSON.parse(storedData));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (response?.status === 200) {
      localStorage.setItem("dashboardData", JSON.stringify(response.data));
      const thisMonth = String(new Date().toLocaleDateString("en-US", {month: 'long'}))
      let monthlyPatients;
      response.data.monthly_patients.forEach(item => {
        if (item.month === thisMonth) {
          monthlyPatients = item.patient_count;
        }
      });
      let weeklyPatients = 0;
      response.data.daily_patients.forEach(item => {
        weeklyPatients += item.patient_count;
      });
      const periods = {
        "Today's Patients": response.data.patient_count,
        "This Week's Patients": weeklyPatients,
        "This Month's Patients": monthlyPatients
      };
      let count = 0;
      setPatientPeriods([Object.keys(periods)[count], Object.values(periods)[count]]);
      const interval = setInterval(() => {
        if (count > 2) count = 0;
        setPatientPeriods([Object.keys(periods)[count], Object.values(periods)[count]]);
        count++;
      }, 5000);
      setData(response.data);
      return () => clearInterval(interval);
    }
  }, [response]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <Header title={title} icon={<MdDashboard />} />
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-60 md:mb-72 lg:mb-80">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 col-span-2 gap-4 justify-between items-start text-nowrap">
              <DashIcon
                Icon={MdPeopleAlt}
                isLoading={isLoading}
                title={patientPeriods ? patientPeriods[0] : ''}
                value={patientPeriods ? patientPeriods[1] : ''}
              />
              {/* <DashIcon Icon={RiNurseFill} isLoading={isLoading} title="Staff" value={data?.staff_count || 0}/>
              <DashIcon Icon={FaBaby} isLoading={isLoading} title="Deliveries" value={data?.total_deliveries || 0}/> */}
              <DashIcon
                Icon={MdBloodtype}
                isLoading={isLoading}
                title="All Time Donated Blood"
                value={data?.blood_count || 0}
              />
            </div>

            {isLoading ? (
              <>
                <div
                  className={`animate-pulse bg-${selectedTheme}-400 w-full h-48 md:h-[25rem] lg:h-96 col-span-2 lg:col-span-1 rounded-md`}
                ></div>
                <div
                  className={`animate-pulse bg-${selectedTheme}-400 w-full h-48 md:h-[25rem] lg:h-96 col-span-2 lg:col-span-1 rounded-md`}
                ></div>
                <div
                  className={`animate-pulse bg-${selectedTheme}-400 w-full h-48 md:h-[25rem] lg:h-96 col-span-2  rounded-md`}
                ></div>
              </>
            ) : (
              <>
                <DonorChart
                  title="Most Frequent Donor"
                  annual_blood={data?.annual_blood}
                />
                <AnnualPatientChart
                  title="Predictive Annual Patient Flow"
                  annual_patients={data?.annual_patients}
                />
                <WeeklyPatientChart
                  title="Predictive Weekly Patient Flow"
                  weekly_patients={data?.daily_patients}
                />
                <MonthlyPatientChart
                  title="Predictive Monthly Patient Flow"
                  monthly_patients={data?.monthly_patients}
                />
                {/* <MultiLineChart title="Annual Data Changes" data={data?.annual_deliveries}/> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
