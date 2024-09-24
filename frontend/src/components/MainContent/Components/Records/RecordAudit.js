/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../App";
import { MdClose, MdPerson } from "react-icons/md";
import useQuery from "../../../../hooks/useQuery";
import CitizenForm from "./Clinic_form/CitizenForm";
import DataTable from "../Elements/DataTable";
import api from "../../../../axios";
import useCurrentTime from "../../../../hooks/useCurrentTime";

const RecordAudit = ({ recordAudit, toggle, family_id }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const { mysqlTime } = useCurrentTime();
  
  const { searchResults, isLoading, error, searchData, addData } = useQuery();
  const [formVisibility, setFormVisibility] = useState(false);

  useEffect(() => {
    if (family_id) {
      searchData(`findRecord`, family_id);
    }
  },[family_id]);

  useEffect(() => {
    if (searchResults) {
      console.log(searchResults.data);
      setData(searchResults.data);
      const data = () => {
        return searchResults.data.map(({ history_id, action, action_details, action_datetime, username }) => {
          const formattedDatetime = new Date(action_datetime).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }) + " " + new Date(action_datetime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }).toLowerCase();
          return {
            history_id,
            action,
            action_details,
            action_datetime: formattedDatetime,
            username}
        });
      };
      setHistory(searchResults.data && data());
      convertData(searchResults.data && data());
    }
    if (error) {
      console.log(error);
    }
  }, [error, searchResults]);
  
  function convertKey(word) {
    const data = word.split('_');
    const newKey = data.map(dat => dat.charAt(0).toUpperCase() + dat.slice(1).toLowerCase());
    return newKey.join(' ');
  };
  
  function convertData(data) {
    const newData = data && data.map(obj => {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        const newKey = convertKey(key);
        newObj[newKey] = obj[key];
      });
      return newObj;
    });
    return newData;
  };

  function closeAudit() {
    toggle();
    sessionStorage.removeItem('clinicForm');
  };

  async function handleSubmitClinicForm(e) {
    e.preventDefault();
    try {
      const payload = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        const newPayload = {
          ...payload,
          staff_id: res.data.staff_id,
          dateTime: mysqlTime
        }
        addData('/addClinicRecord', newPayload);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <dialog ref={recordAudit} className={`rounded-lg bg-${selectedTheme}-100 drop-shadow-lg w-[90vw] h-full`}>
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}>
          <div className="flex items-center p-1 gap-1">
            <MdPerson className='w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8' />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">Health Assessment</strong>
          </div>
          <button 
            onClick={() => closeAudit()}
            className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}>
            <MdClose className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' />
          </button>
        </div>
        <div className="flex flex-col gap-3 h-full min-h-full overflow-y-auto">
          <div className={`flex gap-2 mx-5 my-2 text-${selectedTheme}-600 font-semibold`}>
            <p>Patient:</p>
            <p>
              {!data ? (
                <span className="drop-shadow-lg animate-pulse animate-infinite animate-duration-[800ms] animate-ease-linear font-bold">
                  { error ? String(error) : '. . . . . . . . .' }
                </span>
              ) : (
                <span className="underline underline-offset-4">
                  {data[0]?.full_name}
                </span>
              )}
            </p>
          </div>
          <div className={`flex gap-2 mx-5 my-2 text-${selectedTheme}-600 font-semibold`}>
            <p>Family ID:</p>
            <p>
              {!data ? (
                <span className="drop-shadow-lg animate-pulse animate-infinite animate-duration-[800ms] animate-ease-linear font-bold">
                  { error ? String(error) : '. . . . . . . . .' }
                </span>
              ) : (
                <span className="underline underline-offset-4">
                  {family_id}
                </span>
              )}
            </p>
          </div>
          <button onClick={() => setFormVisibility(prev => !prev)} className={`m-1 mx-5 p-2 block rounded-lg font-semibold text-${selectedTheme}-800 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-600 active:text-${selectedTheme}-200 flex items-center justify-center`}>
            <span>{formVisibility ? 'Open History Table' : 'Open Prescription Form'}</span>
          </button>
          <div className="mx-4 flex justify-between items-center">
            <p className={`text-left text-${selectedTheme}-700 font-bold text-base md:text-lg lg:text-xl`}>{formVisibility ? 'Clinic Form' : 'Patient History'}</p>
            {formVisibility && (
              <button onClick={handleSubmitClinicForm} className={`m-1 mx-5 p-2 block rounded-lg font-semibold text-${selectedTheme}-800 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-600 active:text-${selectedTheme}-200 flex items-center justify-center`}>Submit Clinic Form</button>
            )}
          </div>
          <div className="m-3 overflow-y-auto min-h-full rounded-lg">
            {!formVisibility ? (
              <DataTable data={convertData(history)}  enAdd={false} enExport={true} enOptions={false} enImport={false} isLoading={isLoading} error={error} />
            ):(
              <CitizenForm userData={data[0]} />
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
 
export default RecordAudit;