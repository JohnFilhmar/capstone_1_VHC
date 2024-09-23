import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiFileHistoryFill } from "react-icons/ri";

const MenstrualHistory = ({ selectedTheme, gender }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mensApplicable, setMensApplicable] = useState(false);
  const date = new Date();
  const firstDayOfTheMonth = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,0)}-01`;
  const [menstrualHistory, setMenstrualHistory] = useState({
    menarchy: '',
    last_menstrual_date: firstDayOfTheMonth,
    menstrual_duration: '',
    cycle_length: '',
    pads_per_day: '',
    sexual_intercourse_age: '',
    birth_control_method: '',
    is_menopause: '',
  });

  const contraceptiveMethods = [
    "Oral contraceptives (pills)",
    "Combination pills (estrogen and progesterone)",
    "Progestin-only pills",
    "Injections (Depo-Provera)",
    "Vaginal rings (NuvaRing)",
    "Transdermal patches (Ortho Evra)",
    "Intrauterine Devices (IUDs)",
    "Copper IUDs (ParaGard)",
    "Hormonal IUDs (Mirena, Skyla, Liletta)",
    "Permanent sterilization (Essure)",
    "Barrier Methods",
    "Condoms (male and female)",
    "Diaphragms",
    "Cervical caps",
    "Spermicides (foam, jelly, cream, or film)",
    "Sponges (Today)",
    "Natural Family Planning (NFP) Methods",
    "Fertility awareness-based methods (tracking basal body temperature, cervical mucus, and menstrual cycles)",
    "Lactational amenorrhea method (breastfeeding-only method)",
    "Surgical Sterilization",
    "Tubal ligation (female)",
    "Vasectomy (male)",
    "Emergency Contraception",
    "Levonorgestrel (Plan B, Ella)",
    "Ulipristal acetate (Ella)",
    "Long-Acting Reversible Contraceptives (LARCs)",
    "Hormonal implants (Nexplanon)"
  ];  

  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenstrualHistory((prev) => ({
      ...prev,
      [name]: value
    }));
    if (value.length >= 3) {
      const filteredSuggestions = contraceptiveMethods.filter((method) =>
        method.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        menstrual_history: menstrualHistory
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 1000);
    return () => clearTimeout(time);
  }, [menstrualHistory]);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <RiFileHistoryFill className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>Menstrual History</span>
        </div>
        <button disabled={gender === 'male'} onClick={() => setIsVisible(prev => !prev)} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {isVisible ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </p>
      <div className={isVisible ? 'block' : 'hidden'}>
        <div className="grid grid-cols-4 gap-2 w-full">
          <div className="p-2 col-span-4 grid grid-cols-3 gap-2">
            <div className={`flex flex-col items-center justify-start gap-3 bg-${selectedTheme}-100 rounded-sm drop-shadow-md p-1`}>
              <label htmlFor="philhealthstatustype" className={`block text-${selectedTheme}-600 font-semibold`}>
                If Patient Menstrual History Applicable:
              </label>
              <div className="flex items-center space-x-4">
                <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                  <input
                    type="checkbox"
                    checked={mensApplicable}
                    onChange={() => setMensApplicable(prev => !prev)}
                    className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  />
                  <span className={`text-${selectedTheme}-600`}>
                    Yes
                  </span>
                </label>
                <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                  <input
                    type="checkbox"
                    checked={!mensApplicable}
                    onChange={() => setMensApplicable(prev => !prev)}
                    className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  />
                  <span className={`text-${selectedTheme}-600`}>
                    No
                  </span>
                </label>
              </div>
            </div>
            <div className="p-2">
              <label htmlFor="menarche" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Menarche:</label>
              <input
                type="text"
                id="menarche"
                name="menarche"
                value={menstrualHistory.menarchy}
                onChange={(e) => setMenstrualHistory(prev => ({ ...prev, menarchy: e.target.value }))}
                className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
                disabled={!mensApplicable}
              />
            </div>
            <div className="p-2">
              <label htmlFor="last_menstrual_date" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Last Menstrual Date:</label>
              <input
                type="date"
                id="last_menstrual_date"
                name="last_menstrual_date"
                value={menstrualHistory.last_menstrual_date}
                onChange={(e) => setMenstrualHistory(prev => ({ ...prev, last_menstrual_date: e.target.value }))}
                className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
                disabled={!mensApplicable}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 w-full gap-2">
          <div className="p-2">
            <label htmlFor="menstrual_duration" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Menstrual Duration:</label>
            <input
              type="number"
              id="menstrual_duration"
              name="menstrual_duration"
              value={menstrualHistory.menstrual_duration}
              onChange={(e) => setMenstrualHistory(prev => ({ ...prev, menstrual_duration: e.target.value }))}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              disabled={!mensApplicable}
            />
          </div>
          <div className="p-2">
            <label htmlFor="cycle_length" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Cycle Length:</label>
            <input
              type="number"
              id="cycle_length"
              name="cycle_length"
              value={menstrualHistory.cycle_length}
              onChange={(e) => setMenstrualHistory(prev => ({ ...prev, cycle_length: e.target.value }))}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              disabled={!mensApplicable}
            />
          </div>
          <div className="p-2">
            <label htmlFor="pads_per_day" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Pads Per Day:</label>
            <input
              type="number"
              id="pads_per_day"
              name="pads_per_day"
              value={menstrualHistory.pads_per_day}
              onChange={(e) => setMenstrualHistory(prev => ({ ...prev, pads_per_day: e.target.value }))}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              disabled={!mensApplicable}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 w-full gap-2">
          <div className="p-2">
            <label htmlFor="onset_sexual_intercourse" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Onset Sexual Intercourse:</label>
            <input
              type="number"
              id="onset_sexual_intercourse"
              name="onset_sexual_intercourse"
              value={menstrualHistory.onset_sexual_intercourse}
              onChange={(e) => setMenstrualHistory(prev => ({ ...prev, onset_sexual_intercourse: e.target.value }))}
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              disabled={!mensApplicable}
            />
          </div>
          <div className="p-2">
            <label htmlFor="birth_control_method" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Birth Control Method: (Leave out if none):</label>
            <input
              type="text"
              id="birth_control_method"
              name="birth_control_method"
              value={menstrualHistory.birth_control_method}
              onChange={handleInputChange}
              list="contraceptiveSuggestions"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              disabled={!mensApplicable}
            />
            <datalist id="contraceptiveSuggestions">
              {suggestions.map((method, index) => (
                <option key={index} value={method} />
              ))}
            </datalist>
          </div>
          <div className={`flex flex-col items-center justify-start gap-3 bg-${selectedTheme}-100 rounded-sm drop-shadow-md p-1`}>
            <label htmlFor="is_menopause" className={`block text-${selectedTheme}-600 font-semibold`}>
              Is On Menopause:
            </label>
            <div className="flex items-center space-x-4">
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={menstrualHistory.is_menopause}
                  onChange={() => setMenstrualHistory(prev => ({ ...prev, is_menopause: !prev.is_menopause }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  disabled={!mensApplicable}
                />
                <span className={`text-${selectedTheme}-600`}>
                  Yes
                </span>
              </label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={!menstrualHistory.is_menopause}
                  onChange={() => setMenstrualHistory(prev => ({ ...prev, is_menopause: !prev.is_menopause }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  disabled={!mensApplicable}
                />
                <span className={`text-${selectedTheme}-600`}>
                  No
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default MenstrualHistory;