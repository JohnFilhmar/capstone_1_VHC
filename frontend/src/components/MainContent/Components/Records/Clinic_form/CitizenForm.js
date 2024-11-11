import { createContext, useContext, useEffect } from "react";
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
import { formDataContext } from "../RecordAudit";

export const genderContext = createContext();

const CitizenForm = ({ userData }) => {
  const [selectedTheme] = useContext(colorTheme);
  const {visibleForm: historyVisibility, setVisibleForm: setHistoryVisibility} = useContext(formDataContext);

  useEffect(() => {
    const toStore = {
      "citizen_family_id": userData?.citizen_family_id,
      "civil_status": "",
      "philhealth_number": "",
      "philhealth_dpin": "",
      "philhealth_category": "",
      "vital_signs": {
          "blood_pressure": "120/80 mmHg",
          "temperature": "98.6°F",
          "heart_rate": "75 bpm",
          "weight": "",
          "height": "",
          "pulse_rate": "75 bpm",
          "respiratory_rate": "14 breaths/min",
          "bmi": "29.14",
          "oxygen_saturation": "98%"
      },
      "pediatric_client": {
          "length": "",
          "waist": "",
          "head": "",
          "hip": "",
          "limb": "",
          "muac": "",
          "skinfold": ""
      },
      "isPediatric": false,
      "contact_number": "111111111111",
      "chief_of_complaint": "",
      "history_of_present_illness": "",
      "past_medical_history": {
          "allergy": false,
          "cerebrovascular_disease": false,
          "emphysema": false,
          "hepatitis": false,
          "mental_illness": false,
          "peptic_ulcer": false,
          "thyroid_disease": false,
          "asthma": false,
          "coronary_artery_disease": false,
          "epilepsy_seizure_disorder": false,
          "hyperlipidemia": false,
          "pneumonia": false,
          "urinary_tract_infection": false,
          "cancer": false,
          "diabetes_mellitus": false,
          "extrapulmonary_tuberculosis": false,
          "pulmonary_tuberculosis": false,
          "others": "",
          "none": false
      },
      "family_medical_history": {
          "allergy": false,
          "cerebrovascular_disease": false,
          "emphysema": false,
          "hepatitis": false,
          "mental_illness": false,
          "peptic_ulcer": false,
          "thyroid_disease": false,
          "asthma": false,
          "coronary_artery_disease": false,
          "epilepsy_seizure_disorder": false,
          "hyperlipidemia": false,
          "pneumonia": false,
          "urinary_tract_infection": false,
          "cancer": false,
          "diabetes_mellitus": false,
          "extrapulmonary_tuberculosis": false,
          "pulmonary_tuberculosis": false,
          "others": "",
          "none": false
      },
      "smoking_status": "no",
      "alcohol_status": "no",
      "illicit_drug_status": "no",
      "sexually_active": "no",
      "physical_examination": {
          "skin_descriptions": {
              "clubbing": false,
              "decreased_mobility": false,
              "pale_nailbeds": false,
              "weak_pulses": false,
              "cold_clammy": false,
              "edema_swelling": false,
              "poor_skin_turgor": false,
              "cyanosis_mottled_skin": false,
              "essentially_normal": false,
              "rash_or_itching": false,
              "other_skin_description": ""
          },
          "heent_descriptions": {
              "abnormal_pupillary_reaction": false,
              "essentially_normal": false,
              "sunken_eyeballs": false,
              "cervical_lymphadenopathy": false,
              "icteric_sclerae": false,
              "sunken_fontanelle": false,
              "dry_mucous_membrane": false,
              "pale_conjunctivae": false,
              "other_heent_description": ""
          }
      },
      "diagnosis_plan": {
          "primary_diagnosis": "",
          "secondary_diagnosis": "",
          "cases": "",
          "severity": "moderate",
          "symptoms": "",
          "tests_conducted": "",
          "diagnosis_details": "",
          "follow_up_recommendations": ""
      }
  };
    sessionStorage.setItem('clinicForm', JSON.stringify(toStore));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
    }, 425);
    return () => clearTimeout(time);
  }, [userData]);
  
  return (
    <div className={`flex flex-col gap-0 p-2 m-1 border-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <PatientInfo selectedTheme={selectedTheme} userData={userData}/>
      <ChiefCompaint selectedTheme={selectedTheme}/>
      <div className="grid lg:flex grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-3">
        <MedicalHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility('health_history')}/>
        <FamilyHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility('health_history')}/>
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