import { createContext, useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../../App";
import PatientInfo from "./PatientInfo";
import ChiefCompaint from "./ChiefComplaint";
import MedicalHistory from "./MedicalHistory";
import FamilyHistory from "./FamilyHistory";
import SocialHistory from "./SocialHistory";
import PhysicalExamination from "./PhysicalExamination";
import MenstrualHistory from "./MenstrualHistory";
import PregnancyHistory from "./PregnancyHistory";
import DiagnosisPlan from "./DiagnosisPlan";
import Prescriptions from "./Prescriptions";

export const genderContext = createContext();

const CitizenForm = ({ userData }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [historyVisibility, setHistoryVisibility] = useState(false);
  
  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        citizen_family_id: userData?.citizen_family_id,
        ...oldClinicForm,
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 1000);
    return () => clearTimeout(time);
  }, [userData]);
  
  return (
    <div className={`flex flex-col gap-0 p-2 m-1 border-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <PatientInfo selectedTheme={selectedTheme} userData={userData}/>
      <ChiefCompaint selectedTheme={selectedTheme}/>
      <div className="flex gap-3 justify-between">
        <MedicalHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility(prev => !prev)}/>
        <FamilyHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility(prev => !prev)}/>
      </div>
      <SocialHistory selectedTheme={selectedTheme}/>
      <PhysicalExamination selectedTheme={selectedTheme}/>
      <MenstrualHistory selectedTheme={selectedTheme} gender={userData?.citizen_gender}/>
      <PregnancyHistory selectedTheme={selectedTheme} gender={userData?.citizen_gender}/>
      <DiagnosisPlan selectedTheme={selectedTheme}/>
      <Prescriptions selectedTheme={selectedTheme}/>
    </div>
  );
}
 
export default CitizenForm;