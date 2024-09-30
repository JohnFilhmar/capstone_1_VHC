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
  const [otherSkinDescription, setOtherSkinDescription] = useState('');
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
  const [otherHeentDescription, setOtherHeentDescription] = useState('');

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
          skin_descriptions: {
            ...skinDescriptions,
            other_skin_description: otherSkinDescription
          },
          heent_descriptions: {
            ...heentDescriptions,
            other_heent_description: otherHeentDescription
          }
        }
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 1000);
    return () => clearTimeout(time);
  }, [heentDescriptions, skinDescriptions, otherHeentDescription, otherSkinDescription]);
  
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
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col justify-between gap-1 p-2">
            <p className={`text-${selectedTheme}-600 font-bold`}>Skin or extremities description:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(skinDescriptions).map(([skin, _], i) => (
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  name="allergy"
                  checked={skinDescriptions.skin}
                  onChange={() => setSkinDescriptions(prev => ({ ...prev, [skin]: !prev[skin] }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600 block md:hidden lg:hidden`}>{String(makeReadable(skin)).substring(0,17) + '...'}</span>
                <span className={`text-${selectedTheme}-600 hidden md:block lg:block`}>{makeReadable(skin)}</span>
              </label>
              ))}
            </div>
            <div className="flex flex-col justify-start gap-2 col-span-2">
              <label htmlFor="other_skin_description" className={`font-bold text-${selectedTheme}-800`}>Other Skin Extremity:</label>
              <input 
                type="text" 
                name="other_skin_description" 
                id="other_skin_description" 
                value={otherSkinDescription}
                onChange={(e) => setOtherSkinDescription(e.target.value)}
                className={`grow text-sm text-${selectedTheme}-800 font-semibold rounded-md`}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-1 p-2">
            <p className={`text-${selectedTheme}-600 font-bold`}>Heent description:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(heentDescriptions).map(([skin, _], i) => (
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  name="allergy"
                  checked={heentDescriptions.skin}
                  onChange={() => setHeentDescriptions(prev => ({ ...prev, [skin]: !prev[skin] }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600 block md:hidden lg:hidden`}>{String(makeReadable(skin)).substring(0,17) + '...'}</span>
                <span className={`text-${selectedTheme}-600 hidden md:block lg:block`}>{makeReadable(skin)}</span>
              </label>
              ))}
            </div>
            <div className="flex flex-col justify-start gap-2 col-span-2">
              <label htmlFor="other_heent_description" className={`font-bold text-${selectedTheme}-800`}>Other HEENT Description:</label>
              <input 
                type="text" 
                name="other_heent_description" 
                id="other_heent_description" 
                value={otherHeentDescription}
                onChange={(e) => setOtherHeentDescription(e.target.value)}
                className={`grow text-sm text-${selectedTheme}-800 font-semibold rounded-md`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PhysicalExamination;