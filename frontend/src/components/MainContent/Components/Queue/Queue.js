import { useLocation } from "react-router-dom";
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdPeople } from "react-icons/md";
import Header from "../../Header";
import { colorTheme } from "../../../../App";
import { useContext, useEffect, useRef, useState } from "react";
import useQuery from "../../../../hooks/useQuery";
import AddToQueue from "./AddToQueue";
import Attended from "./Attended";
import { socket } from "../../../../socket";
import useSocket from "../../../../hooks/useSocket";
import { jwtDecode } from "jwt-decode";
import useCurrentTime from "../../../../hooks/useCurrentTime";
import useIndexedDB from "../../../../hooks/useIndexedDb";
import api from "../../../../axios";

const Queue = () => {
  const [selectedTheme] = useContext(colorTheme);
  const formRef = useRef(null);
  const attendedRef = useRef(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isAttendedOpen, setIsAttendedOpen] = useState(false);
  const { addData, editData } = useQuery();
  const [waiting, setWaiting] = useState([{}]);
  const displayedData = ['priority', 'emergency', 'serving'];
  const [viewStateIndex, setViewStateIndex] = useState(displayedData.indexOf('serving'));

  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const { mysqlTime } = useCurrentTime();
  const [accessToken, setAccessToken] = useState(null);
  const { getAllItems } = useIndexedDB();
  
  const { data: queue } = useSocket({ fetchUrl: "getQueue", socketUrl: "newQueue", socketEmit: "updateQueue", socketError: "newQueueError" });
  
  useEffect(() => {
    const setToken = async () => {
      const token = await getAllItems('tokens');
      setAccessToken(token?.accessToken);
    }
    setToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const role = accessToken ? jwtDecode(accessToken).role : "";
  
  useEffect(() => {
    setWaiting(queue.reduce((acc, curr) => {
      if(Object.values(curr).includes('waiting')) {
        acc.push(curr);
      }
      return acc;
    }, []))
  }, [queue]);

  const toggleForm = () => {
    if (isFormDialogOpen) {
      setIsFormDialogOpen(false);
      formRef.current.close();
    } else {
      setIsFormDialogOpen(true);
      formRef.current.showModal();
    }
  };

  const toggleAttended = () => {
    if (isAttendedOpen) {
      setIsAttendedOpen(false);
      attendedRef.current.close();
    } else {
      setIsAttendedOpen(true);
      attendedRef.current.showModal();
    }
  };

  const handleNext = async () => {
    const res = await api.get('/getStaffId');
    if (res?.status === 200) {
      const payload = {
        dateTime: String(mysqlTime),
        staff_id: res.data.staff_id
      }
      addData('nextQueue', payload);
      setTimeout(() => {
        socket.emit('updateQueue', {dateTime: String(mysqlTime)});
      },[500])
    }
  };

  const handleDismiss = async (i) => {
    const family_id = queue.find(prev => parseInt(prev["Queue Number"]) === i )["Family Id"];
    const res = await api.get('/getStaffId');
    if (res?.status === 200) {
      const payload = {
        dateTime: String(mysqlTime), 
        family_id: family_id, 
        staff_id: res.data.staff_id
      }
      editData('dismissQueue', i, payload);
      setTimeout(() => {
        socket.emit('updateQueue', {dateTime: String(mysqlTime)});
        socket.emit('updateAttended');
      },[500])
    }
  }

  const toggleViewState = (direction) => {
    if (direction === 'back') {
      setViewStateIndex(prevIndex => (prevIndex === 0 ? displayedData.length - 1 : prevIndex - 1));
    } else if (direction === 'next') {
      setViewStateIndex(prevIndex => (prevIndex === displayedData.length - 1 ? 0 : prevIndex + 1));
    }
  };

  function getMeridianTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const meridianHours = hours % 12 || 12;
    const meridian = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const time12Hour = `${meridianHours}:${formattedMinutes} ${meridian}`;
    return time12Hour;
  };
  
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div onClick={() => socket.emit("updateQueue", {dateTime: String(mysqlTime)})}>
          <Header title={ title } icon={<MdPeople />}/>
        </div>
        <div className="min-h-screen h-screen overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex items-center justify-end gap-3 m-1 my-2">
            {role && (role !== 'user') && (
              <button onClick={toggleAttended} className={`p-[0.15rem] md:p-1 lg:p-[0.35rem] rounded-lg bg-${selectedTheme}-600 text-${selectedTheme}-200 transition-colors text-xs md:text-sm lg:text-base font-semibold px-4 hover:text-${selectedTheme}-300 hover:bg-${selectedTheme}-700 focus:bg-${selectedTheme}-800 focus:text-${selectedTheme}-400 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 border-[1px] border-${selectedTheme}-600`}>
                Attended
              </button>
            )}
            <button onClick={toggleForm} className={`p-[0.15rem] md:p-1 lg:p-[0.35rem] rounded-lg bg-${selectedTheme}-200 text-${selectedTheme}-600 transition-colors text-xs md:text-sm lg:text-base font-semibold px-4 hover:text-${selectedTheme}-700 hover:bg-${selectedTheme}-300 focus:bg-${selectedTheme}-400 focus:text-${selectedTheme}-800 active:bg-${selectedTheme}-600 active:text-${selectedTheme}-300 border-[1px] border-${selectedTheme}-600`}>
              Add
            </button>
            {role && (role !== 'user') && (
              <button disabled={!waiting[0]} onClick={handleNext} className={`p-[0.15rem] md:p-1 lg:p-[0.35rem] rounded-lg bg-${selectedTheme}-600 text-${selectedTheme}-200 transition-colors text-xs md:text-sm lg:text-base font-semibold px-4 hover:text-${selectedTheme}-300 hover:bg-${selectedTheme}-700 focus:bg-${selectedTheme}-800 focus:text-${selectedTheme}-400 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 border-[1px] border-${selectedTheme}-600`}>
                Next
              </button>
            )}
          </div>
          <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 place-items-center gap-4 mb-60 md:mb-72 lg:mb-80`}>
          
            <div className={`flex md:block lg:hidden flex-col w-full h-full col-span-2 row-span-2 bg-${selectedTheme}-50 rounded-lg text-xs md:text-sm lg:text-base drop-shadow-md`}>
              <div className={`text-center border-b-[1px] border-${selectedTheme}-800 shadow-md`}>
                <p className={`flex items-center justify-center gap-2 p-2 text-base md:text-lg lg:text-xl text-${selectedTheme}-600 font-bold`}>
                  <button onClick={() => toggleViewState('back')} className="p-1 rounded-3xl bg-gray-400/30 text-gray-800"><MdOutlineArrowLeft /></button>
                  <span>{displayedData[viewStateIndex].charAt(0).toUpperCase() + displayedData[viewStateIndex].substring(1)}</span>
                  <button onClick={() => toggleViewState('next')} className="p-1 rounded-3xl bg-gray-400/30 text-gray-800"><MdOutlineArrowRight /></button>
                </p>
              </div>
              <div className="h-72 min-h-72 overflow-y-auto">
              {queue.length >= 0 && queue.map((q, i) => {
                if (Object.values(q).includes(displayedData[viewStateIndex])) {
                  return (
                      <div key={i} className="flex flex-col gap-3 mx-2 my-3">
                        <div className={`flex justify-between items-center px-10 border-[1px] bg-${selectedTheme}-100 rounded-lg font-semibold p-2 drop-shadow-md`}>
                          <p>{q["Queue Number"]}</p>
                          <p>{q["Citizen Fullname"]}</p>
                          <button onClick={() => handleDismiss(parseInt(q["Queue Number"]))} className={`p-1 rounded-lg bg-${selectedTheme}-600 text-${selectedTheme}-200 font-semibold text-xs md:text-sm lg:text-base`}>Dismiss</button>
                        </div>
                      </div>
                  )
                } else {
                  return null;
                }
              })}
              </div>
            </div>
            
            {displayedData.map(item => (
              <div className={`hidden md:hidden lg:block w-full h-full col-span-2 row-span-2 bg-${selectedTheme}-50 rounded-lg text-xs md:text-sm lg:text-base drop-shadow-md`}>
                <div className={`text-center border-b-[1px] border-${selectedTheme}-800 shadow-md`}>
                  <p className={`flex items-center justify-center gap-2 p-2 text-base md:text-lg lg:text-xl text-${selectedTheme}-600 font-bold`}>
                    <span>{item.charAt(0).toUpperCase() + item.substring(1)}</span>
                  </p>
                </div>
                <div className="h-72 min-h-72 overflow-y-auto">
                {queue.length >= 0 && queue.map((q, i) => {
                  if (Object.values(q).includes(item)) {
                    return (
                      <div key={i} className="flex flex-col gap-3 mx-2 my-3">
                        <div className={`flex justify-between items-center px-10 border-[1px] bg-${selectedTheme}-100 rounded-lg font-semibold p-2 drop-shadow-md`}>
                          <p>{q["Queue Number"]}</p>
                          <p className="truncate">{q["Citizen Fullname"]}</p>
                          <button onClick={() => handleDismiss(parseInt(q["Queue Number"]))} className={`p-1 rounded-lg bg-${selectedTheme}-600 text-${selectedTheme}-200 font-semibold text-xs md:text-sm lg:text-base`}>Dismiss</button>
                        </div>
                      </div>
                    )
                  } else {
                    return null
                  }
                })}
                </div>
              </div>
            ))}
            
            {/* {queue && queue.length > 0 && queue.map((q, i) => {
              if (q.patient_status_history === 'emergency') {
                return (
                  <div key={i} className={`relative w-full md:w-full lg:grow flex flex-col h-auto bg-red-300 animate-pulse rounded-lg drop-shadow-md text-xs md:text-sm lg:text-base`}>
                    <div className={`text-center border-b-[1px] border-red-800 shadow-md`}>
                      <p className={`flex items-center justify-center gap-2 text-${selectedTheme}-600 font-bold text-base md:text-lg lg:text-xl`}>NO.{q["Queue Number"]}<IoMdAlert /></p>
                    </div>
                    <div className="flex flex-col gap-2 p-2 my-3">
                      <div className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}>
                        <p className="truncate">{q["Citizen Fullname"]}</p>
                      </div>
                      <div className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}>
                        <p>{q["Citizen Barangay"]}</p>
                      </div>  
                      <div className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}>
                        <p>{q["Citizen Gender"]}</p>
                      </div>
                    </div>
                    <p className="absolute bottom-0 right-0 p-1 text-xs md:text-sm lg:text-base font-thin">{getMeridianTime(q.time_arrived)}</p>
                  </div>
                )
              } else {
                return null;
              }
            })} */}
            
            {waiting.length === 0 ? (
              <div className={`relative w-full md:w-full lg:grow flex flex-col col-span-2 md:col-span-4 lg:col-span-6 h-auto bg-red-100 rounded-lg drop-shadow-md text-xs md:text-sm lg:text-base animate-pulse`}>
                <div className="flex flex-col gap-2 p-2 my-3">
                  <div className={`flex justify-center items-center text-center gap-2 text-red-800 font-semibold`}>
                    <p>Add a new person to the queue by using the Add button.</p>
                  </div>
                </div>
              </div>
            ) : (waiting.map((w, i) => (
              <div key={i} className={`relative w-full md:w-full lg:grow flex flex-col h-auto bg-${selectedTheme}-50 rounded-lg drop-shadow-md text-xs md:text-sm lg:text-base`}>
                <div className={`text-center border-b-[1px] border-${selectedTheme}-800 shadow-md`}>
                  <p className={`text-${selectedTheme}-600 font-bold text-base md:text-lg lg:text-xl`}>NO.{w["Queue Number"]}</p>
                </div>
                <div className="flex flex-col gap-2 p-2 my-3">
                  <div className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}>
                    <p className="truncate">{w["Citizen Fullname"]}</p>
                  </div>
                  <div className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}>
                    <p>{w["Citizen Barangay"]}</p>
                  </div>
                  <div className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}>
                    <p>{w["Citizen Gender"]}</p>
                  </div>
                </div>
                <p className="absolute bottom-0 right-0 p-1 text-xs md:text-sm lg:text-base font-thin">{getMeridianTime(w["Time Arrived"])}</p>
              </div>
            )))}

          </div>

          <AddToQueue ATref={formRef} ATonClick={toggleForm} />
          <Attended ATref={attendedRef} ATonClick={toggleAttended} queue={queue}/>

        </div>
      </div>
    </div>
  );
}

export default Queue;