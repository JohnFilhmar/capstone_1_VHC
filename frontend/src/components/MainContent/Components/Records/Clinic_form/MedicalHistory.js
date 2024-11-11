import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdHistoryEdu } from "react-icons/md";
import { formDataContext } from "../RecordAudit";

const MedicalHistory = ({ selectedTheme, isVisible, setIsVisible }) => {
  const [visibility, setVisibility] = useState('health_history');
  const {medicalHistory, setMedicalHistory} = useContext(formDataContext);

  const resetMedicalHistory = () => {
    setMedicalHistory({
      allergy: false,
      cerebrovascular_disease: false,
      emphysema: false,
      hepatitis: false,
      mental_illness: false,
      peptic_ulcer: false,
      thyroid_disease: false,
      asthma: false,
      coronary_artery_disease: false,
      epilepsy_seizure_disorder: false,
      hyperlipidemia: false,
      pneumonia: false,
      urinary_tract_infection: false,
      cancer: false,
      diabetes_mellitus: false,
      extrapulmonary_tuberculosis: false,
      pulmonary_tuberculosis: false,
      others: "",
      none: true,
    });
  };

  const handleNoneChange = () => {
    if (!medicalHistory.none) {
      resetMedicalHistory();
    } else {
      setMedicalHistory(prev => ({ ...prev, none: false }));
    }
  };

  const handleCheckboxChange = (name) => {
    setMedicalHistory(prev => ({
      ...prev,
      [name]: !prev[name],
      none: false,
    }));
  };

  useEffect(() => {
    setVisibility(isVisible);
  }, [isVisible]);

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        past_medical_history: medicalHistory
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 425);
    return () => clearTimeout(time);
  }, [medicalHistory]);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg lg:w-full`}>
      <div className={`flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <MdHistoryEdu className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <p className={`text-${selectedTheme}-500 font-bold`}>Past Medical History</p>
        </div>
        <button onClick={() => setIsVisible(prev => !prev)} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {visibility === 'health_history' ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </div>
      <div className={visibility === 'health_history' ? 'block' : 'hidden'}>
        <div className="grid grid-cols-2 gap-2 lg:mx-8">
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="allergy"
              checked={medicalHistory['allergy']}
              onChange={() => handleCheckboxChange('allergy')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Allergy</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="cerebrovascular_disease"
              checked={medicalHistory['cerebrovascular_disease']}
              onChange={() => handleCheckboxChange('cerebrovascular_disease')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Cerebrovascular disease</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="emphysema"
              checked={medicalHistory['emphysema']}
              onChange={() => handleCheckboxChange('emphysema')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Emphysema</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="hepatitis"
              checked={medicalHistory['hepatitis']}
              onChange={() => handleCheckboxChange('hepatitis')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Hepatitis</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="mental_illness"
              checked={medicalHistory['mental_illness']}
              onChange={() => handleCheckboxChange('mental_illness')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Mental illness</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="peptic_ulcer"
              checked={medicalHistory['peptic_ulcer']}
              onChange={() => handleCheckboxChange('peptic_ulcer')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Peptic ulcer</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="thyroid_disease"
              checked={medicalHistory['thyroid_disease']}
              onChange={() => handleCheckboxChange('thyroid_disease')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Thyroid disease</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="asthma"
              checked={medicalHistory['asthma']}
              onChange={() => handleCheckboxChange('asthma')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Asthma</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="coronary_artery_disease"
              checked={medicalHistory['coronary_artery_disease']}
              onChange={() => handleCheckboxChange('coronary_artery_disease')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Coronary Artery Disease</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="epilepsy_seizure_disorder"
              checked={medicalHistory['epilepsy_seizure_disorder']}
              onChange={() => handleCheckboxChange('epilepsy_seizure_disorder')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Epilepsy/seizure disorder</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="hyperlipidemia"
              checked={medicalHistory['hyperlipidemia']}
              onChange={() => handleCheckboxChange('hyperlipidemia')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Hyperlipidemia</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="pneumonia"
              checked={medicalHistory['pneumonia']}
              onChange={() => handleCheckboxChange('pneumonia')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Pneumonia</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="urinary_tract_infection"
              checked={medicalHistory['urinary_tract_infection']}
              onChange={() => handleCheckboxChange('urinary_tract_infection')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Urinary tract infection</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="cancer"
              checked={medicalHistory['cancer']}
              onChange={() => handleCheckboxChange('cancer')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Cancer</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="diabetes_mellitus"
              checked={medicalHistory['diabetes_mellitus']}
              onChange={() => handleCheckboxChange('diabetes_mellitus')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Diabetes Mellitus</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="extrapulmonary_tuberculosis"
              checked={medicalHistory['extrapulmonary_tuberculosis']}
              onChange={() => handleCheckboxChange('extrapulmonary_tuberculosis')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Extrapulmonary Tuberculosis</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="pulmonary_tuberculosis"
              checked={medicalHistory['pulmonary_tuberculosis']}
              onChange={() => handleCheckboxChange('pulmonary_tuberculosis')}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
              disabled={medicalHistory.none}
            />
            <span className={`text-${selectedTheme}-600`}>Pulmonary Tuberculosis</span>
          </label>
          <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
            <input
              type="checkbox"
              name="none"
              checked={medicalHistory.none}
              onChange={handleNoneChange}
              className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
            />
            <span className={`text-${selectedTheme}-600`}>None</span>
          </label>
          <div className="flex items-center col-span-2">
            <label htmlFor="others" className={`p-1 text-${selectedTheme}-600`}>Others</label>
            <textarea
              id="others"
              name="others"
              value={medicalHistory.others}
              onChange={(e) => setMedicalHistory(prev => ({ ...prev, others: e.target.value}))}
              className={`text-${selectedTheme}-600 grow rounded-md`}
              disabled={medicalHistory.none}
              rows={1}
              maxLength={255}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicalHistory;