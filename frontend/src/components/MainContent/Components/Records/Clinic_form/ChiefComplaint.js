import { useContext, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiFileHistoryFill } from "react-icons/ri";
import { formDataContext } from "../RecordAudit";

const ChiefCompaint = ({ selectedTheme }) => {
  const {
    visibleForm,
    setVisibleForm,
    chiefOfComplaint, 
    setChiefOfComplaint,
    presentIllnessHistory, 
    setPresentIllnessHistory
  } = useContext(formDataContext);
  
  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        chief_of_complaint: chiefOfComplaint,
        history_of_present_illness: presentIllnessHistory,
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 425);
    return () => clearTimeout(time);
  }, [chiefOfComplaint, presentIllnessHistory]);
  

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <div className={`flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <RiFileHistoryFill className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <p className={`text-${selectedTheme}-500 font-bold`}>Chief of Complaint and History</p>
        </div>
        <button onClick={() => setVisibleForm('chief_complaint')} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {visibleForm === 'chief_complaint' ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </div>
      <div className={visibleForm === 'chief_complaint' ? 'block' : 'hidden'}>
        <div className="flex flex-col gap-2">
          <div className={`p-2`}>
            <label htmlFor="chiefofcomplaint" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>CHIEF OF COMPLAINT:</label>
            <textarea
              id="chiefofcomplaint"
              name="chiefofcomplaint"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              autoComplete="off"
              value={chiefOfComplaint}
              onChange={(e) => setChiefOfComplaint(e.target.value)}
            />
          </div>
          <div className={`p-2`}>
            <label htmlFor="presentillnesshistory" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>History of Present Illness:</label>
            <textarea
              id="presentillnesshistory"
              name="presentillnesshistory"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              autoComplete="off"
              value={presentIllnessHistory}
              onChange={(e) => setPresentIllnessHistory(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default ChiefCompaint;