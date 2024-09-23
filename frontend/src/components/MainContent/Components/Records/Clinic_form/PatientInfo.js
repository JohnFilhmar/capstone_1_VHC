import { useEffect, useState } from "react";
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

const PatientInfo = ({ selectedTheme, userData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [civilStatus, setCivilStatus] = useState('');
  const [phNumber, setPhNumber] = useState('');
  const [philhealthStatusType, setPhilhealthStatusType] = useState('dependent');
  const [dpin, setDpin] = useState('');
  const [phCategory, setPhCategory] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    blood_pressure: '120/80 mmHg',      // Normal BP
    temperature: '98.6°F',              // Normal Temperature
    heart_rate: '75 bpm',               // Normal Heart Rate
    weight: '',                         // Variable based on individual, no fixed range
    height: '',                         // Variable based on individual, no fixed range
    pulse_rate: '75 bpm',               // Same as heart rate
    respiratory_rate: '14 breaths/min', // Normal Respiratory Rate
    bmi: '22',                          // Normal BMI (18.5 - 24.9)
    oxygen_saturation: '98%'            // Normal O2 Saturation
  }); 
  const [isPediatric, setIsPediatric] = useState(false);
  const [pediatricClient, setPediatricClient] = useState({
    length: '70-90 cm',     // Length range for 1–2 years old
    waist: '18-19 inches',  // Waist range for 1–2 years old
    head: '18-19 inches',   // Head circumference for 1–2 years old
    hip: 'n/a',             // No fixed value for hip
    limb: 'n/a',            // Varies with growth
    muac: '12.5-13.5 cm',   // Mid-upper arm circumference
    skinfold: '6-10 mm'     // Skinfold thickness at triceps
  });

  const getAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate)) {
      console.error("Invalid birthdate format");
      return "Invalid date";
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const formatBirthdate = () => {
    if (!userData?.citizen_birthdate) return '';
    const date = new Date(userData.citizen_birthdate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  function handleVitalSignsChange(e) {
    const { name, value } = e.target;
    setVitalSigns(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handlePediatricChange(e) {
    const { name, value } = e.target;
    setPediatricClient(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  useEffect(() => {
    if (phNumber.length === 0) {
      setPhilhealthStatusType('dependent');
      setDpin('');
      setPhCategory('');
    }
  }, [phNumber]);

  useEffect(() => {
    const age = getAge(userData.citizen_birthdate);
    if (age < 2) {
      setPediatricClient({
        length: '70-90 cm',     // Length range for 1–2 years old
        waist: '18-19 inches',  // Waist range for 1–2 years old
        head: '18-19 inches',   // Head circumference for 1–2 years old
        hip: 'n/a',             // No fixed value for hip
        limb: 'n/a',            // Varies with growth
        muac: '12.5-13.5 cm',   // Mid-upper arm circumference
        skinfold: '6-10 mm'     // Skinfold thickness at triceps
      })
      setIsPediatric(true);
    } else {
      setPediatricClient({
        length: '',
        waist: '',
        head: '',
        hip: '',
        limb: '',
        muac: '',
        skinfold: ''
      })
      setIsPediatric(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem('clinicForm') 
        ? JSON.parse(sessionStorage.getItem('clinicForm')) 
        : {};
      const updatedClinicForm = {
        ...oldClinicForm,
        civil_status: civilStatus,
        philhealth_number: phNumber,
        philhealth_dpin: dpin,
        philhealth_category: phCategory,
        vital_signs: vitalSigns,
        pediatric_client: pediatricClient,
        isPediatric: isPediatric
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 1000);
    return () => clearTimeout(time);
  }, [
    civilStatus,
    phNumber,
    philhealthStatusType,
    dpin,
    phCategory,
    vitalSigns,
    pediatricClient,
    isPediatric
  ]);

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <p className={`text-${selectedTheme}-500 font-bold flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <BsPersonBoundingBox className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>
          <span>Patient Information</span>
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
        {/* CITIZEN INFORMATION */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div className={`p-2 col-span-2`}>
            <label htmlFor="fullname" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Fulll Name:</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              required
              value={userData.full_name}
              disabled
            />
          </div>
          <div className={`p-2 col-span-2`}>
            <label htmlFor="barangay" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Barangay:</label>
            <input
              type="text"
              id="barangay"
              name="barangay"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              required
              value={userData.citizen_barangay}
              disabled
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className={`p-2 grow`}>
            <label htmlFor="age" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Age:</label>
            <input
              type="text"
              id="age"
              name="age"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
              value={getAge(userData.citizen_birthdate)}
              disabled
            />
          </div>
          <div className="p-2 grow">
            <label htmlFor="sex" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Sex:</label>
            <input
              type="text"
              id="sex"
              name="sex"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
              value={(userData.citizen_gender).charAt(0).toUpperCase() + (userData.citizen_gender).slice(1)}
              disabled
            />
          </div>
          <div className="p-2 grow">
            <label htmlFor="birthdate" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Birthdate:</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              value={formatBirthdate()}
              required
              disabled
            />
          </div>
          <div className="p-2 grow col-span-2">
            <label htmlFor="civilstatus" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Civil Status:<span className="text-red-600 font-bold">*</span></label>
            <select id="civilstatus" value={civilStatus} onChange={(e) => setCivilStatus(e.target.value)} className="w-full rounded-lg text-xs md:text-sm lg:text-base">
              <option value="married" className="w-full rounded-lg text-xs md:text-sm lg:text-base">Married</option>
              <option value="single" className="w-full rounded-lg text-xs md:text-sm lg:text-base">Single</option>
              <option value="divorced" className="w-full rounded-lg text-xs md:text-sm lg:text-base">Divorced</option>
              <option value="widowed" className="w-full rounded-lg text-xs md:text-sm lg:text-base">Widowed</option>
              <option value="in_a_civilpartnership" className="w-full rounded-lg text-xs md:text-sm lg:text-base">In a civil partnership</option>
              <option value="former_civilpartnership" className="w-full rounded-lg text-xs md:text-sm lg:text-base">Former civil partner</option>
              <option value="other" className="w-full rounded-lg text-xs md:text-sm lg:text-base">Others</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2">
          {/* PHILHEALTH STATUS */}
          <div className="flex flex-col">
            <div className={`p-2`}>
              <label htmlFor="philhealthnum" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Philhealth Number:</label>
              <input
                type="text"
                id="philhealthnum"
                name="philhealthnum"
                placeholder="Enter your philheath number. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                value={phNumber}
                onChange={(e) => setPhNumber(e.target.value)}
              />
            </div>
            <div className="p-2 flex items-center justify-start gap-3">
              <label htmlFor="philhealthstatustype" className={`block text-${selectedTheme}-600 font-semibold`}>
                Philhealth Status Type:
              </label>
              <div className="flex items-center space-x-4">
                <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                  <input
                    disabled={!phNumber}
                    type="checkbox"
                    checked={philhealthStatusType === 'member'}
                    onChange={() => setPhilhealthStatusType(prev => (prev === 'member' ? 'dependent' : 'member'))}
                    className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  />
                  <span className={`text-${selectedTheme}-600 ${philhealthStatusType === 'member' ? 'font-bold' : ''}`}>
                    Member
                  </span>
                </label>

                <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                  <input
                    disabled={!phNumber}
                    type="checkbox"
                    checked={philhealthStatusType === 'dependent'}
                    onChange={() => (prev => (prev === 'member' ? 'dependent' : 'member'))}
                    className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                  />
                  <span className={`text-${selectedTheme}-600 ${philhealthStatusType === 'dependent' ? 'font-bold' : ''}`}>
                    Dependent
                  </span>
                </label>
              </div>
            </div>
            <div className={`p-2`}>
              <label htmlFor="dpin" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>DPIN:</label>
              <input
                disabled={!phNumber}
                type="text"
                id="dpin"
                name="dpin"
                placeholder="Enter your Philhealth DPIN. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                maxLength={50}
                value={dpin}
                onChange={(e) => setDpin(e.target.value)}
                required={phNumber}
              />
            </div>
            <div className={`p-2`}>
              <label htmlFor="philhealth_category" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Philhealth Category:</label>
              <input
                disabled={!phNumber}
                type="text"
                id="philhealth_category"
                name="philhealth_category"
                placeholder="Enter your Philhealth category. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                value={phCategory}
                onChange={(e) => setPhCategory(e.target.value)}
                required={phNumber}
              />
            </div>
            <div className={`p-2`}>
              <label htmlFor="contactnumber" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Contact Number:</label>
              <input
                type="text"
                id="contactnumber"
                name="contactnumber"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
                value={userData.citizen_number}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-col">
            {/* VITAL SIGNS */}
            <div className="grid grid-cols-4 gap-2 p-1 pt-3">
              <p className={`block text-${selectedTheme}-600 font-semibold col-span-4 justify-self-start self-start`}>Vital Signs:</p>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="blood_pressure" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>BP</label>
                <input
                  type="text"
                  id="blood_pressure"
                  name="blood_pressure"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.blood_pressure}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="temperature" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>TMP</label>
                <input
                  type="text"
                  id="temperature"
                  name="temperature"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.temperature}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="heart_rate" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>HR</label>
                <input
                  type="text"
                  id="heart_rate"
                  name="heart_rate"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.heart_rate}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="weight" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>WT</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.weight}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="height" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>HT</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.height}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="pulse_rate" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>PR</label>
                <input
                  type="text"
                  id="pulse_rate"
                  name="pulse_rate"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.pulse_rate}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="respiratory_rate" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>RR</label>
                <input
                  type="text"
                  id="respiratory_rate"
                  name="respiratory_rate"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.respiratory_rate}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="bmi" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>BMI</label>
                <input
                  type="text"
                  id="bmi"
                  name="bmi"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.bmi}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="oxygen_saturation" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>O2Sat</label>
                <input
                  type="text"
                  id="oxygen_saturation"
                  name="oxygen_saturation"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns.oxygen_saturation}
                  onChange={handleVitalSignsChange}
                />
              </div>
            </div>
            {/* PEDIATRIC CLIENT */}
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-4 flex p-3 justify-self-start self-start gap-1">
                <label htmlFor="isPediatric" className={`text-${selectedTheme}-600 font-semibold`}>Pediatric Client(1-2 years old):</label>
                {/* <input type="checkbox" name="isPediatric" id="isPediatric" checked={isPediatric} onChange={() => setIsPediatric(prev => !prev)}/> */}
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="length" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Lenght:</label>
                <input
                  type="text"
                  id="length"
                  name="length"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.length}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="waist" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Waist:</label>
                <input
                  type="text"
                  id="waist"
                  name="waist"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.waist}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="head" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Head:</label>
                <input
                  type="text"
                  id="head"
                  name="head"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.head}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="hip" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Hip:</label>
                <input
                  type="text"
                  id="hip"
                  name="hip"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.hip}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="limb" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Limb:</label>
                <input
                  type="text"
                  id="limb"
                  name="limb"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.limb}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="muac" className={`block text-${selectedTheme}-600 font-semibold self-center`}>MUAC:</label>
                <input
                  type="text"
                  id="muac"
                  name="muac"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.muac}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="skinfold" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Skinfold:</label>
                <input
                  type="text"
                  id="skinfold"
                  name="skinfold"
                  className="w-full rounded-lg text-xxs md:text-xs lg:text-sm"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                  disabled={!isPediatric}
                  value={pediatricClient.skinfold}
                  onChange={handlePediatricChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default PatientInfo;