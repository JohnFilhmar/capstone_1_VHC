import { useContext, useState } from "react";
import { FaFilePrescription } from "react-icons/fa";
import { colorTheme } from "../../../../../App";
import { MdClose } from "react-icons/md";
import PatientInfo from "./PatientInfo";
import ChiefCompaint from "./ChiefComplaint";
import MedicalHistory from "./MedicalHistory";
import FamilyHistory from "./FamilyHistory";
import SocialHistory from "./SocialHistory";
import PhysicalExamination from "./PhysicalExamination";

const CitizenForm = () => {
  const [selectedTheme] = useContext(colorTheme);
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [doctorsNotes, setDoctorsNotes] = useState('');
  const [historyVisibility, setHistoryVisibility] = useState(false);

  const handleRemoveMedicine = (e, i) => {
    e.preventDefault();
    setPrescribedMedicines(prev => prev.splice(i, 1));
  }

  const handleAddMedicine = (e, i) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const { value } = e.target;
      setPrescribedMedicines(prev => ({
        ...prev,
        value
      }));
    }
  }
  
  return (
    <div className={`flex flex-col gap-0 p-2 m-1 border-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <PatientInfo selectedTheme={selectedTheme}/>
      <ChiefCompaint selectedTheme={selectedTheme}/>
      <div className="flex gap-3 justify-between">
        <MedicalHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility(prev => !prev)}/>
        <FamilyHistory selectedTheme={selectedTheme} isVisible={historyVisibility} setIsVisible={() => setHistoryVisibility(prev => !prev)}/>
      </div>
      <SocialHistory selectedTheme={selectedTheme}/>
      <PhysicalExamination selectedTheme={selectedTheme}/>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 mb-2`}>
        <FaFilePrescription className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
        <span>Create new prescription</span>
      </p>
      <div className={`p-2`}>
        <label htmlFor="medicines" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Prescribed Medicines:</label>
        <input
          type="text"
          id="medicines"
          name="medicines"
          placeholder="Search and press enter. . . . ."
          className="w-full rounded-lg text-xs md:text-sm lg:text-base"
          maxLength={100}
          minLength={3}
          onKeyDown={handleAddMedicine}
        />
      </div>
      <div className={`${prescribedMedicines.length !== 0 && `max-h-20 overflow-y-auto m-2 p-2 border-solid border-[1px] shadow-inner rounded-md border-${selectedTheme}-600 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2`}`}>
        {
          prescribedMedicines.map((med, i) => (
            <div key={i} className={`rounded-lg bg-${selectedTheme}-200 flex justify-between items-center text-xs md:text-sm lg:text-base text-${selectedTheme}-600`}>
              <p className="truncate p-1 font-semibold">{med}</p>
              <button onClick={(e) => handleRemoveMedicine(e,i)} className={`p-1 rounded-3xl bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 focus:bg-${selectedTheme}-200 hover:text-${selectedTheme}-700 active:text-${selectedTheme}-300 active:bg-${selectedTheme}-600`}>
                <MdClose className="size-3 md:size-4 lg:size-5"/>
              </button>
            </div>
          ))
        }
      </div>
      <div className={`p-2`}>
        <label htmlFor="notes" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Additional Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={doctorsNotes}
          onChange={(e) => setDoctorsNotes(e.target.value)}
          placeholder="Additional relevant instructions given to the patient's care. . . . ."
          className="w-full rounded-lg text-xs md:text-sm lg:text-base"
          rows={4}
          maxLength={255}
        />
      </div>
    </div>
  );
}
 
export default CitizenForm;