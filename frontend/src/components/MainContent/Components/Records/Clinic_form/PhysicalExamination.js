import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdHealthAndSafety } from 'react-icons/md';

const PhysicalExamination = ({ selectedTheme }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [skinDescriptions, setSkinDescriptions] = useState({
    clubbing: false,
    decreased_mobility: false,
    pale_nailbeds: false,
    weak_pulses: false,
    cold_clammy: false,
    edema_swelling: false,
    poor_skin_turgor: false,
    cyanosis_mottled_skin: false,
    essentially_normal: false,
    rash_or_itching: false,
  });
  const [heentDescriptions, setHeentDescriptions] = useState({
    abnormal_pupillary_reaction: false,
    essentially_normal: false,
    sunken_eyeballs: false,
    cervical_lymphadenopathy: false,
    icteric_sclerae: false,
    sunken_fontanelle: false,
    dry_mucous_membrane: false,
    pale_conjunctivae: false,
  });

  function makeReadable(word) {
    const data = word.split('_');
    const newKey = data.map(dat => dat.charAt(0).toUpperCase() + dat.slice(1).toLowerCase());
    return newKey.join(' ');
  }

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        physical_examination: {
          skin_descriptions: skinDescriptions,
          heent_descriptions: heentDescriptions
        }
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 1000);
    return () => clearTimeout(time);
  }, [heentDescriptions, skinDescriptions]);
  
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
      <div className={`${isVisible ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-1 p-2">
            <p className={`text-${selectedTheme}-600 font-bold`}>Skin or extremities description:</p>
            <div className="grid grid-cols-2">
            {Object.entries(skinDescriptions).map(([skin, value], i) => (
            <div key={i} className="p-2 flex justify-between items-center">
              <label htmlFor="philhealthstatustype" className={`block text-${selectedTheme}-600 font-semibold`}>{makeReadable(skin)}:</label>
              <label className={`flex items-center space-x-2`}>
                <input
                  type="checkbox"
                  checked={skinDescriptions.skin}
                  onChange={() => setSkinDescriptions(prev => ({ ...prev, [skin]: !prev[skin] }))}
                  className={`form-checkbox size-5 text-${selectedTheme}-600`}
                />
              </label>
            </div>
            ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <p className={`text-${selectedTheme}-600 font-bold`}>Heent description:</p>
            <div className="grid grid-cols-2">
            {Object.entries(heentDescriptions).map(([skin, value], i) => (
            <div key={i} className="p-2 flex justify-between items-center">
              <label htmlFor="philhealthstatustype" className={`block text-${selectedTheme}-600 font-semibold`}>{makeReadable(skin)}:</label>
              <label className={`flex items-center space-x-2`}>
                <input
                  type="checkbox"
                  checked={heentDescriptions.skin}
                  onChange={() => setHeentDescriptions(prev => ({ ...prev, [skin]: !prev[skin] }))}
                  className={`form-checkbox size-5 text-${selectedTheme}-600`}
                />
              </label>
            </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PhysicalExamination;