import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdHistoryEdu } from "react-icons/md";

const MedicalHistory = ({ selectedTheme, isVisible, setIsVisible }) => {
  const [visibility, setVisibility] = useState(false);
  const medicalConditions = [
    "Allergy",
    "Cerebrovascular disease",
    "Emphysema",
    "Hepatitis",
    "Mental illness",
    "Peptic ulcer",
    "Thyroid disease",
    "Asthma",
    "Coronary Artery Disease",
    "Epilepsy/seizure disorder",
    "Hyperlipidemia",
    "Pneumonia",
    "Urinary tract infection",
    "Cancer",
    "Diabetes Mellitus",
    "Extrapulmonary Tuberculosis",
    "Pulmonary Tuberculosis",
    "None",
    "Others"
  ];
  
  useEffect(() => {
    setVisibility(isVisible);
  }, [isVisible]);
  
  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg w-full`}>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <MdHistoryEdu className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>Medical History</span>
        </div>
        <button onClick={() => setIsVisible(prev => !prev)} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {visibility ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </p>
      <div className={visibility ? 'block' : 'hidden'}>
        <div className="grid grid-cols-2 gap-2 mx-8">
          {medicalConditions.map((val, i) => (
            <label key={i} className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
              <input
                type="checkbox"
                className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              />
              <span className={`text-${selectedTheme}-600`}>{val}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default MedicalHistory;