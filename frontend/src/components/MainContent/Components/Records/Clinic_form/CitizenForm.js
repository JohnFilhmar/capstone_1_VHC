import { createContext, useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../../App";
import PatientInfo from "./PatientInfo";
import ChiefCompaint from "./ChiefComplaint";
import MedicalHistory from "./MedicalHistory";
import FamilyHistory from "./FamilyHistory";
import SocialHistory from "./SocialHistory";
import PhysicalExamination from "./PhysicalExamination";

export const genderContext = createContext();

const CitizenForm = ({ userData }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [historyVisibility, setHistoryVisibility] = useState(false);
  const [sex, setSex] = useState('male');
  
  return (
    <div className={`flex flex-col gap-0 p-2 m-1 border-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <genderContext.Provider value={[sex, setSex]}>
        <PatientInfo selectedTheme={selectedTheme} userData={userData}/>
        <ChiefCompaint selectedTheme={selectedTheme}/>
        <div className="flex gap-3 justify-between">
          <MedicalHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility(prev => !prev)}/>
          <FamilyHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility(prev => !prev)}/>
        </div>
        <SocialHistory selectedTheme={selectedTheme}/>
        <PhysicalExamination selectedTheme={selectedTheme}/>
      </genderContext.Provider>
    </div>
  );
}
 
export default CitizenForm;