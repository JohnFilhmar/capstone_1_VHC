import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { LiaHistorySolid } from "react-icons/lia";

const SocialHistory = ({ selectedTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [smokingStatus, setSmokingStatus] = useState('no');
  const [alcoholStatus, setAlcoholStatus] = useState('no');
  const [drugsStatus, setDrugsStatus] = useState('no');
  const [sexActivity, setSexActivity] = useState('no');

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        smoking_status: smokingStatus,
        alcohol_status: alcoholStatus,
        illicit_drug_status: drugsStatus,
        sexually_active: sexActivity
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 1000);
    return () => clearTimeout(time);
  }, [smokingStatus, alcoholStatus, drugsStatus, sexActivity]);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <LiaHistorySolid className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>Social History</span>
        </div>
        <button onClick={() => setIsVisible(prev => !prev)} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {isVisible ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </p>
      <div className={isVisible ? 'block' : 'hidden'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <label htmlFor="smoker" className={`text-${selectedTheme}-600 w-1/3 font-semibold`}>Is patient a Smoker:</label>
            <select 
              id="smoker" 
              className="w-2/3 rounded-lg text-xs md:text-sm lg:text-base"
              value={smokingStatus}
              onChange={(e) => setSmokingStatus(e.target.value)}
            >
              <option value="no">Not a smoker</option>
              <option value="quit">Quitted or Quitting</option>
              <option value="yes">Smoker</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="alcohol" className={`text-${selectedTheme}-600 w-1/3 font-semibold`}>Is an Alcohol Drinker:</label>
            <select 
              id="alcohol" 
              className="w-2/3 rounded-lg text-xs md:text-sm lg:text-base"
              value={alcoholStatus}
              onChange={(e) => setAlcoholStatus(e.target.value)}
            >
              <option value="no">Does not drink alcohol</option>
              <option value="quit">Quitted or Quitting</option>
              <option value="yes">Does drink alcohol</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="drugs" className={`text-${selectedTheme}-600 w-1/3 font-semibold`}>Is patient an Illicit Drug User:</label>
            <select 
              id="drugs" 
              className="w-2/3 rounded-lg text-xs md:text-sm lg:text-base"
              value={drugsStatus}
              onChange={(e) => setDrugsStatus(e.target.value)}
            >
              <option value="no">No</option>
              <option value="quit">Quitted or Quitting</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="sexactivity" className={`text-${selectedTheme}-600 w-1/3 font-semibold`}>Is patient Sexually Active:</label>
            <select 
              id="sexactivity" 
              className="w-2/3 rounded-lg text-xs md:text-sm lg:text-base"
              value={sexActivity}
              onChange={(e) => setSexActivity(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default SocialHistory;