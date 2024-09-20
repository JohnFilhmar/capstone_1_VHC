import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdHealthAndSafety } from 'react-icons/md';

const PhysicalExamination = ({ selectedTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const skinDescriptions = [
    "clubbing",
    "decreased mobility",
    "pale nailbeds",
    "weak pulses",
    "cold clammy",
    "edema/swelling",
    "poor skin turgor",
    "cyanosis/mottled skin",
    "essentially normal",
    "rash or itching"
  ];
  const heentDescriptions = [
    "abnormal pupillary reaction",
    "essentially normal",
    "sunken eyeballs",
    "cervical lymphadenopathy",
    "icteric sclerae",
    "sunken fontanelle",
    "dry mucous membrane",
    "pale conjunctivae"
  ];
  
  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <MdHealthAndSafety className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>Physical Examination</span>
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
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-1 p-2">
            <p className={`text-${selectedTheme}-600 font-bold`}>Skin or extremities description:</p>
            {skinDescriptions.map((skin, i) => (
            <div key={i} className="p-2 grid grid-cols-5 gap-1">
              <label htmlFor="philhealthstatustype" className={`col-span-4 block text-${selectedTheme}-600 font-semibold`}>{skin}:</label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm`}>
                <input
                  type="checkbox"
                  className={`form-checkbox size-5 text-${selectedTheme}-600`}
                />
              </label>
            </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 p-2">

          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PhysicalExamination;