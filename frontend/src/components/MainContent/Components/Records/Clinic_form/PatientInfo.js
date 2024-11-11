import { useContext, useEffect } from "react";
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { formDataContext } from "../RecordAudit";

const PatientInfo = ({ selectedTheme, userData }) => {
  const {
    civilStatus,
    setCivilStatus,
    age, 
    setAge,
    phNumber, 
    setPhNumber,
    philhealthStatusType, 
    setPhilhealthStatusType,
    dpin, 
    setDpin,
    phCategory, 
    setPhCategory,
    contactNumber, 
    setContactNumber,
    visibleForm,
    setVisibleForm,
    vitalSigns,
    setVitalSigns,
    isPediatric, 
    setIsPediatric,
    pediatricClient, 
    setPediatricClient
  } = useContext(formDataContext);

  const getAge = (birthdate) => {
    if (!birthdate) return null;
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
    const date = new Date(userData?.citizen_birthdate);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (userData?.citizen_birthdate) {
      const formattedDate = formatBirthdate();
      const calculatedAge = getAge(formattedDate);
      setAge(calculatedAge);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.citizen_birthdate]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phNumber]);

  useEffect(() => {
    const date = userData?.citizen_birthdate && new Date(userData?.citizen_birthdate);
    const newBirthDateFormat = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const age = getAge(newBirthDateFormat);
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
        isPediatric: isPediatric,
        contact_number: contactNumber
      };
      sessionStorage.setItem('clinicForm', JSON.stringify(updatedClinicForm));
    }, 425);
    return () => clearTimeout(time);
  }, [
    civilStatus,
    phNumber,
    philhealthStatusType,
    dpin,
    phCategory,
    vitalSigns,
    pediatricClient,
    isPediatric,
    contactNumber
  ]);

  const convertHeightToMeters = (height) => {
    if (height.includes('cm')) {
      const cm = parseFloat(height.replace('cm', ''));
      return cm / 100;
    } else if (height.includes('ft') || height.includes("'")) {
      const [feet, inches] = height.includes("'")
        ? height.split("'").map(Number)
        : height.replace('ft', '').split('.').map(Number);
      const totalInches = feet * 12 + (inches || 0);
      return totalInches * 0.0254;
    }
    return null;
  };
  
  const convertWeightToKg = (weight) => {
    if (weight.includes('lbs')) {
      const lbs = parseFloat(weight.replace('lbs', ''));
      return lbs * 0.453592; 
    } else {
      return parseFloat(weight.replace('kg', ''));
    }
  };
  
  useEffect(() => {
    const weightInKg = convertWeightToKg(vitalSigns.weight);
    const heightInMeters = convertHeightToMeters(vitalSigns.height);
    if (weightInKg && heightInMeters) {
      const bmi = weightInKg / (heightInMeters ** 2);
      setVitalSigns(prev => ({ ...prev, bmi: bmi.toFixed(2) })); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vitalSigns.weight, vitalSigns.height]);
 
  const handleChange = (e) => {
    const input = e.target.value; 
    const cleanedValue = input.replace(/\D/g, '').slice(0, 11); 
    const formattedValue = cleanedValue
      .replace(/(\d{0,2})(\d{0,8})(\d{0,1})/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join('-')
      ); 
    setPhNumber(formattedValue);
  }; 

  return (
    <div className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}>
      <div className={`flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <BsPersonBoundingBox className="size-4 md:size-5 lg:size-6"/>
          <p className={`text-${selectedTheme}-500 font-bold`}>Patient Information</p>
        </div>
        <button onClick={() => setVisibleForm('patient_info')} className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}>
          {visibleForm === 'patient_info' ? (
            <FaMinus className="size-4 md:size-5 lg:size-6"/>
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6"/>
          )}
        </button>
      </div>
      <div className={visibleForm === 'patient_info' ? 'block' : 'hidden'}>
        {/* CITIZEN INFORMATION */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          <div className={`p-2 col-span-2`}>
            <label htmlFor="fullname" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Full Name:</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base text-gray-600"
              required
              value={userData?.citizen_firstname + ' ' + userData?.citizen_lastname || ''}
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
              value={userData?.citizen_barangay || ''}
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className={`p-2 grow`}>
            <label htmlFor="age" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Age:</label>
            <input
              type="text"
              id="age"
              name="age"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
              value={age !== null ? age : ''}
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
              value={userData && (userData?.citizen_gender).charAt(0).toUpperCase() + (userData?.citizen_gender).slice(1)}
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
          <div className="p-2 grow">
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
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
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
                value={phNumber || ''}
                onChange={handleChange}
              />
            </div>
            <div className={`${phNumber.length > 0 ? 'block': 'hidden'} flex flex-col`}>
              <div className="p-2 flex items-center justify-start gap-3">
                <label htmlFor="philhealthstatustype" className={`block text-${selectedTheme}-600 font-semibold`}>
                  Philhealth Status Type:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2">

                  <label className={`flex items-center gap-2 p-1`}>
                    <input
                      disabled={!phNumber}
                      type="checkbox"
                      checked={philhealthStatusType === 'member'}
                      onChange={() => setPhilhealthStatusType(prev => (prev === 'member' ? 'dependent' : 'member'))}
                      className={`form-checkbox h-5 w-5`}
                    />
                    <span className={`text-${selectedTheme}-600 ${philhealthStatusType === 'member' ? 'font-bold' : ''}`}>
                      Member
                    </span>
                  </label>

                  <label className={`flex items-center gap-2 p-1`}>
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
                  value={contactNumber || ''}
                  onChange={(e) => setContactNumber(e.target.value)}
                  disabled={userData?.citizen_number}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            {/* VITAL SIGNS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-1 pt-3">
              <p className={`block text-${selectedTheme}-600 col-span-2 md:col-span-3 lg:col-span-4 justify-self-start self-start font-bold`}>Vital Signs:</p>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="blood_pressure" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>BP</label>
                <input
                  type="text"
                  id="blood_pressure"
                  name="blood_pressure"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.blood_pressure || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="temperature" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>TMP</label>
                <input
                  type="text"
                  id="temperature"
                  name="temperature"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.temperature || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="heart_rate" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>HR</label>
                <input
                  type="text"
                  id="heart_rate"
                  name="heart_rate"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.heart_rate || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="weight" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>WT(kg/lbs)</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.weight || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="height" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>HT(ft/cm)</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.height || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="pulse_rate" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>PR</label>
                <input
                  type="text"
                  id="pulse_rate"
                  name="pulse_rate"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.pulse_rate || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="respiratory_rate" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>RR</label>
                <input
                  type="text"
                  id="respiratory_rate"
                  name="respiratory_rate"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.respiratory_rate || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="bmi" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>BMI</label>
                <input
                  type="text"
                  id="bmi"
                  name="bmi"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.bmi || ''}
                  onChange={handleVitalSignsChange}
                  disabled
                />
              </div>
              <div className="grid md:grid-cols-2 gap-1">
                <label htmlFor="oxygen_saturation" className={`block text-${selectedTheme}-600 font-semibold self-center justify-self-center`}>O2Sat</label>
                <input
                  type="text"
                  id="oxygen_saturation"
                  name="oxygen_saturation"
                  className="rounded-lg text-xxs md:text-xs lg:text-sm w-full"
                  value={vitalSigns?.oxygen_saturation || ''}
                  onChange={handleVitalSignsChange}
                />
              </div>
            </div>
            {/* PEDIATRIC CLIENT */}
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ${isPediatric ? 'block' : 'hidden'}`}>
              <div className="col-span-2 md:col-span-3 lg:col-span-4 flex p-3 justify-self-start self-start gap-1">
                <p htmlFor="isPediatric" className={`text-${selectedTheme}-600 font-bold`}>Pediatric Client(1-2 years old):</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.length || ''}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.waist || ''}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.head || ''}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.hip || ''}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.limb || ''}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.muac || ''}
                  onChange={handlePediatricChange}
                />
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-1">
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
                  value={pediatricClient?.skinfold || ''}
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