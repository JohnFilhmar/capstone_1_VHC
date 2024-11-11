import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiMedicineBottleFill } from "react-icons/ri";
import api from "../../../../../axios";
import { formDataContext } from "../RecordAudit";

const Prescriptions = ({ selectedTheme }) => {
  const [medicine, setMedicine] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [itemName, setItemName] = useState('');
  const [itemId, setItemId] = useState(null);
  const [contType, setContType] = useState('bxs');
  const {visibleForm, setVisibleForm, medicinePrescriptions, setMedicinePrescriptions} = useContext(formDataContext);
  const [prescriptions, setPrescriptions] = useState({
    dosage: '',
    intake_method: 'oral',
    frequency: '',
    duration: '',
    instructions: '',
    refill_allowed: false,
    quantity_prescribed: ''
  });

  useEffect(() => {
    if (medicine.length > 3) {
      const time = setTimeout(() => {
        handleFindMedicine(medicine);
      }, 1000);
      return () => clearTimeout(time);
    }
  }, [medicine]);

  async function handleFindMedicine(medicine) {
    try {
      const res = await api.post(`/findMedicine`, { medicine });
      if (res?.status === 200) {
        if ((res.data.medicine).length === 1) {
          setMedicine(res.data?.medicine[0].item_name);
          setItemId(res.data?.medicine[0].item_id);
        } else {
          setSuggestions(res.data.medicine);
        }
      }
    } catch (error) {
      console.error(error)
    }
  };

  function handleAddToPrescribedMedicines() {
    const newPrescriptions = {
      item_id: itemId,
      item_name: medicine,
      ...prescriptions
    };
    setMedicinePrescriptions(prev => [...prev, newPrescriptions]);
    setItemName('');
    setItemId(null);
    setMedicine('');
    setPrescriptions({
      dosage: '',
      intake_method: 'oral',
      frequency: '',
      duration: '',
      instructions: '',
      refill_allowed: false,
      quantity_prescribed: ''
    });
  };
  
  function handleDeleteMedicinePrescription(index) {
    setMedicinePrescriptions(medicinePrescriptions.filter((_, i) => i !== index));
  }

  useEffect(() => {
    if (suggestions.filter(prev => prev.item_name === medicine).length === 1) {
      // console.log(suggestions.filter(prev => prev.item_name === medicine)[0].item_id);
      setItemId(suggestions.filter(prev => prev.item_name === medicine)[0].item_id);
      setItemName(suggestions.filter(prev => prev.item_name === medicine)[0].item_name);
      setContType(suggestions.filter(prev => prev.item_name === medicine)[0].container_type);
      setSuggestions([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicine]);
  
  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        prescriptions: medicinePrescriptions
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 425);
    return () => clearTimeout(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicinePrescriptions]);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <div className={`flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <RiMedicineBottleFill className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <p className={`text-${selectedTheme}-500 font-bold`}>Prescriptions</p>
        </div>
        <button onClick={() => setVisibleForm('prescriptions')} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {visibleForm === 'prescriptions' ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </div>
      <div className={visibleForm === 'prescriptions' ? 'block' : 'hidden'}>
        <div className="flex flex-col justify-start items-start">
          <p className={`text-${selectedTheme}-600 font-bold p-2`}>Prescribed Medicines:</p>
          {medicinePrescriptions.length === 0 && (
            <div className={`flex justify-between items-center divide-x-[1px] bg-${selectedTheme}-200 animate-pulse text-${selectedTheme}-600 drop-shadow-md rounded-md`}>
              <p className="grow p-1 px-2 font-bold">Add new prescribed medicine...</p>
            </div>
          )}
          <div className="max-w-full overflow-x-auto overflow-y-hidden flex gap-1">
            {medicinePrescriptions.map((mp, i) => (
              <div key={i} className={`flex justify-between items-center divide-x-[1px] bg-${selectedTheme}-800 text-${selectedTheme}-200 drop-shadow-md rounded-md`}>
                <p className="grow p-1 px-2 whitespace-nowrap">{mp.item_name}</p>
                <button onClick={() => handleDeleteMedicinePrescription(i)} className={`font-bold p-1 text-lg`}>&times;</button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="p-2">
            <label htmlFor="medicine" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Medicine:</label>
            <input
              type="text"
              id="medicine"
              name="medicine"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              placeholder="Type the medicine and press 'Enter'. . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleFindMedicine(e.target.value);
                }
              }}
              list="suggestedMedicines"
              autoComplete="off"
            />
            <datalist id="suggestedMedicines">
              {suggestions.slice(0,5).map((medicine, index) => (
                <option key={index} value={medicine.item_name} />
              ))}
            </datalist>
          </div>
          <div className="p-2">
            <label htmlFor="dosage" className={`block mb-2 text-${selectedTheme}-600 font-semibold flex`}>
              Dosage:
            </label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={prescriptions.dosage}
              onChange={(e) => setPrescriptions(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="Enter the dosage instructions for the medicine. . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className="flex flex-col justify-between items-start p-2">
            <label htmlFor="intake_method" className={`text-${selectedTheme}-600 w-1/3 font-semibold`}>Intake Method:</label>
            <select 
              id="intake_method" 
              className="rounded-lg text-xs md:text-sm lg:text-base w-full"
              value={prescriptions.intake_method}
              onChange={(e) => setPrescriptions(prev => ({ ...prev, intake_method: e.target.value }))}
            >
              <option value="oral">Oral</option>
              <option value="injection">Injection</option>
              <option value="topical">Topical</option>
              <option value="iv">IV</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:p-2">
          <div className="p-2">
            <label htmlFor="frequency" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Frequency:</label>
            <input
              type="text"
              id="frequency"
              name="frequency"
              value={prescriptions.frequency}
              onChange={(e) => setPrescriptions(prev => ({ ...prev, frequency: e.target.value }))}
              placeholder="Describe frequency intake of medicine. . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
          <div className="p-2">
            <label htmlFor="duration" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Duration:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={prescriptions.duration}
              onChange={(e) => setPrescriptions(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="Duration, length or span of medicine intake. . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
            />
          </div>
        </div>
        <div className="p-2">
          <label htmlFor="instructions" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Instructions:</label>
          <textarea
            name="instructions" 
            id="instructions" 
            value={prescriptions.instructions}
            onChange={(e) => setPrescriptions(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder="Enter specific instructions for this specific medicine. . . . ."
            className="w-full rounded-lg text-xs md:text-sm lg:text-base"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 my-2">
          <div className={`flex flex-col items-center justify-start gap-3`}>
            <label htmlFor="is_applicable_pregnancy" className={`block text-${selectedTheme}-600 font-semibold`}>
              Is Medicine Refillable:
            </label>
            <div className="flex items-center space-x-4">
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={prescriptions.refill_allowed}
                  onChange={() => setPrescriptions(prev => ({ ...prev, refill_allowed: !prev.refill_allowed }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>
                  Yes
                </span>
              </label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  checked={!prescriptions.refill_allowed}
                  onChange={() => setPrescriptions(prev => ({ ...prev, refill_allowed: !prev.refill_allowed }))}
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>
                  No
                </span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="quantity_prescribed" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Quantity Prescribed:</label>
            <div className="flex gap-1 items-center justify-between">
              <input
                type="text"
                id="quantity_prescribed"
                name="quantity_prescribed"
                value={prescriptions.quantity_prescribed}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input)) {
                    setPrescriptions(prev => ({ ...prev, quantity_prescribed: `${input}` }));
                  }
                }}
                placeholder={`Quantity of the prescribed medicine (${contType}) . . .`}
                className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              />
              <p className="p-1 font-bold">{contType}</p>
            </div>
          </div>
        </div>
        <button
          disabled={!prescriptions.dosage || !prescriptions.intake_method || !prescriptions.frequency || !prescriptions.duration || !prescriptions.instructions || !prescriptions.quantity_prescribed} onClick={() => handleAddToPrescribedMedicines()} className={`p-2 rounded-md bg-${selectedTheme}-600 font-bold m-2 text-${selectedTheme}-200 ${!itemId && 'hover:cursor-not-allowed'}`}>Add to Prescribed Medicines</button>
      </div>
    </div>
  );
}
 
export default Prescriptions;