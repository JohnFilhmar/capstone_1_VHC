import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../App";
import useSocket from "../../../../hooks/useSocket";
import { MdOutlineArrowLeft, MdOutlineArrowRight, MdPeople } from "react-icons/md";
import Header from "../../Header";

const PublicQueue = () => {
  const [selectedTheme] = useContext(colorTheme);
  const [waiting, setWaiting] = useState([{}]);
  const displayedData = ['priority', 'emergency', 'serving'];
  const [viewStateIndex, setViewStateIndex] = useState(displayedData.indexOf('serving'));
  
  const { data: queue } = useSocket({ fetchUrl: "getQueue", newDataSocket: "queueSocket", socketError: "queueSocketError", replaceData: false });

  useEffect(() => {
    setWaiting(queue.reduce((acc, curr) => {
      if(Object.values(curr).includes('waiting')) {
        acc.push(curr);
      }
      return acc;
    }, []));
  // eslint-disable-next-line no-use-before-define
  }, [queue]);

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

  const toggleViewState = (direction) => {
    if (direction === 'back') {
      setViewStateIndex(prevIndex => (prevIndex === 0 ? displayedData.length - 1 : prevIndex - 1));
    } else if (direction === 'next') {
      setViewStateIndex(prevIndex => (prevIndex === displayedData.length - 1 ? 0 : prevIndex + 1));
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={ "Queue" } icon={<MdPeople />}/>
        </div>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 place-items-center gap-4 mb-60 md:mb-72 lg:mb-80`}
          >
            <div
              className={`flex md:block lg:hidden flex-col w-full h-full col-span-2 row-span-2 bg-${selectedTheme}-50 rounded-lg text-xs md:text-sm lg:text-base drop-shadow-md`}
            >
              <div
                className={`text-center border-b-[1px] border-${selectedTheme}-800 shadow-md`}
              >
                <p
                  className={`flex items-center justify-center gap-2 p-2 text-base md:text-lg lg:text-xl text-${selectedTheme}-600 font-bold`}
                >
                  <button
                    onClick={() => toggleViewState("back")}
                    className="p-1 rounded-3xl bg-gray-400/30 text-gray-800"
                  >
                    <MdOutlineArrowLeft />
                  </button>
                  <span>
                    {displayedData[viewStateIndex].charAt(0).toUpperCase() +
                      displayedData[viewStateIndex].substring(1)}
                  </span>
                  <button
                    onClick={() => toggleViewState("next")}
                    className="p-1 rounded-3xl bg-gray-400/30 text-gray-800"
                  >
                    <MdOutlineArrowRight />
                  </button>
                </p>
              </div>
              <div className="h-72 min-h-72 overflow-y-auto">
                {queue.length >= 0 &&
                  queue.map((q, i) => {
                    if (Object.values(q).includes(displayedData[viewStateIndex])) {
                      return (
                        <div key={i} className="flex flex-col gap-3 mx-2 my-3">
                          <div
                            className={`flex justify-between items-center border-[1px] bg-${selectedTheme}-100 rounded-lg font-semibold p-2 drop-shadow-md`}
                          >
                            <p>{q["Queue Number"]}</p>
                            <p>{q["Citizen Fullname"]}</p>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
            {displayedData.map((item) => (
              <div
                className={`hidden md:hidden lg:block w-full h-full col-span-2 row-span-2 bg-${selectedTheme}-50 rounded-lg text-xs md:text-sm lg:text-base drop-shadow-md`}
              >
                <div
                  className={`text-center border-b-[1px] border-${selectedTheme}-800 shadow-md`}
                >
                  <p
                    className={`flex items-center justify-center gap-2 p-2 text-base md:text-lg lg:text-xl text-${selectedTheme}-600 font-bold`}
                  >
                    <span>{item.charAt(0).toUpperCase() + item.substring(1)}</span>
                  </p>
                </div>
                <div className="h-72 min-h-72 overflow-y-auto">
                  {queue.length >= 0 &&
                    queue.map((q, i) => {
                      if (Object.values(q).includes(item)) {
                        return (
                          <div key={i} className="flex flex-col gap-3 mx-2 my-3">
                            <div
                              className={`flex justify-between items-center border-[1px] bg-${selectedTheme}-100 rounded-lg font-semibold p-2 drop-shadow-md`}
                            >
                              <p>{q["Queue Number"]}</p>
                              <p className="truncate">{q["Citizen Fullname"]}</p>
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                </div>
              </div>
            ))}
            {waiting.length === 0 ? (
              <div
                className={`relative w-full md:w-full lg:grow flex flex-col col-span-2 md:col-span-4 lg:col-span-6 h-auto bg-red-100 rounded-lg drop-shadow-md text-xs md:text-sm lg:text-base animate-pulse`}
              >
                <div className="flex flex-col gap-2 p-2 my-3">
                  <div
                    className={`flex justify-center items-center text-center gap-2 text-red-800 font-semibold`}
                  >
                    <p>Add a new person to the queue by using the Add button.</p>
                  </div>
                </div>
              </div>
            ) : (
              waiting.map((w, i) => (
                <div
                  key={i}
                  className={`relative w-full md:w-full lg:grow flex flex-col h-auto bg-${selectedTheme}-50 rounded-lg drop-shadow-md text-xs md:text-sm lg:text-base`}
                >
                  <div
                    className={`text-center border-b-[1px] border-${selectedTheme}-800 shadow-md`}
                  >
                    <p
                      className={`text-${selectedTheme}-600 font-bold text-base md:text-lg lg:text-xl`}
                    >
                      NO.{w["Queue Number"]}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 p-2 my-3">
                    <div
                      className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}
                    >
                      <p className="truncate">{w["Citizen Fullname"]}</p>
                    </div>
                    <div
                      className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}
                    >
                      <p>{w["Citizen Barangay"]}</p>
                    </div>
                    <div
                      className={`flex justify-start items-center gap-2 text-${selectedTheme}-800 font-semibold`}
                    >
                      <p>{w["Citizen Gender"]}</p>
                    </div>
                  </div>
                  <p className="absolute bottom-0 right-0 p-1 text-xs md:text-sm lg:text-base font-normal">
                    {getMeridianTime(w["Time Arrived"])}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicQueue;
