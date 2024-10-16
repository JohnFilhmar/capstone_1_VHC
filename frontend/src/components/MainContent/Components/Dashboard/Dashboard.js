import React, { useContext, useEffect, useState } from 'react';
import faker from 'faker';
import Header from "../../Header";
import { useLocation } from "react-router-dom";
import { MdPeopleAlt, MdBloodtype, MdDashboard } from "react-icons/md";
import { RiNurseFill } from "react-icons/ri";
import PatientChart from './PatientChart';
import DonorChart from './DonorChart';
import { colorTheme } from '../../../../App';
import useQuery from '../../../../hooks/useQuery';
import { FaBaby } from 'react-icons/fa';
import MultiLineChart from './MultiLineChart';

const DashIcon = ({ Icon, title, value, isLoading }) => {
  // eslint-disable-next-line no-unused-vars
  const [selectedTheme, setSelectedTheme] = useContext(colorTheme);

  if (isLoading) {
    return (
      <div className={`p-4 bg-${selectedTheme}-400 flex flex-row rounded-md animate-pulse`}>
        <div className="flex flex-col px-2 gap-2">
          <span className={`text-${selectedTheme}-600 w-6 h-6`}> </span>
          <p className="text-normal md:text-lg lg:text-xl font-normal text-slate-600 w-full"> </p>
        </div>
        <div className="flex w-full items-center justify-end">
          <p className="text-3xl font-semibold text-slate-600"> </p>
        </div>
      </div>
    )
  } else {
    return (
      <div className={`p-4 bg-${selectedTheme}-50 flex flex-row rounded-md`}>
        <div className="flex flex-col px-2 gap-2">
          <Icon className={`text-${selectedTheme}-600 w-6 h-6`}/>
          <p className="text-normal md:text-lg lg:text-xl font-normal text-slate-600 w-full">
            { title }
          </p>
        </div>
        <div className="flex w-full items-center justify-end">
          <p className="text-3xl font-semibold text-slate-600">
            { value }
          </p>
        </div>
      </div>
    )
  } 

};

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [selectedTheme, setSelectedTheme] = useContext(colorTheme);
  const { response, isLoading, fetchData } = useQuery();
  const [data, setData] = useState({
    patient_count: 0,
    staff_count: 0,
    deliveries: 0
  });

  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  useEffect(() => {
    fetchData('/getDashBoardData');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (response?.status === 200) {
      localStorage.setItem('dashboardData', JSON.stringify(response.data));
      setData(response.data);
    }
  }, [response]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <Header title={ title } icon={<MdDashboard />}/>
        <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-60 md:mb-72 lg:mb-80">
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 col-span-2 gap-2 justify-between items-start">

              <DashIcon Icon={MdPeopleAlt} isLoading={isLoading} title="Patients" value={data?.patient_count || 0}/>
              <DashIcon Icon={RiNurseFill} isLoading={isLoading} title="Staff" value={data?.staff_count || 0}/>
              <DashIcon Icon={FaBaby} isLoading={isLoading} title="Deliveries" value={data?.total_deliveries || 0}/>
              <DashIcon Icon={MdBloodtype} isLoading={isLoading} title="Donated" value={faker.datatype.number({ min: 0, max: 500 })}/>

            </div>
            
            {isLoading ? (
              <>
                <div className={`animate-pulse bg-${selectedTheme}-400 w-full h-48 md:h-[25rem] lg:h-96 col-span-2 lg:col-span-1 rounded-md`}></div>
                <div className={`animate-pulse bg-${selectedTheme}-400 w-full h-48 md:h-[25rem] lg:h-96 col-span-2 lg:col-span-1 rounded-md`}></div>
                <div className={`animate-pulse bg-${selectedTheme}-400 w-full h-48 md:h-[25rem] lg:h-96 col-span-2  rounded-md`}></div>
              </>
            ) : (
              <>
              <PatientChart title="Patient Frequency" annual_patients={data?.annual_patients} monthly_patients={data?.monthly_patients} daily_patients={data?.daily_patients}/>
              <DonorChart title="Most Frequent Donor"/>
              <MultiLineChart title="Annual Data Changes" data={data.annual_deliveries}/>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Dashboard;