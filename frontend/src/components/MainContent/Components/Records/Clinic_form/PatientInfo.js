import { useState } from "react";
import { BsPersonBoundingBox } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

const PatientInfo = ({ selectedTheme, userData }) => {
  const [isVisible, setIsVisible] = useState(false);
  
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
            <label htmlFor="barangay" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Barangay:<span className="text-red-600 font-bold">*</span></label>
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
            <label htmlFor="age" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Age:<span className="text-red-600 font-bold">*</span></label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="Enter your age. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
            />
          </div>
          <div className="p-2 grow">
            <label htmlFor="sex" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Sex:<span className="text-red-600 font-bold">*</span></label>
            <select id="sex" className="w-full rounded-lg text-xs md:text-sm lg:text-base">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="p-2 grow">
            <label htmlFor="birthdate" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Birthdate:<span className="text-red-600 font-bold">*</span></label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
            />
          </div>
          <div className="p-2 grow col-span-2">
            <label htmlFor="civilstatus" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Civil Status:<span className="text-red-600 font-bold">*</span></label>
            <select id="civilstatus" className="w-full rounded-lg text-xs md:text-sm lg:text-base">
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
          <div className="flex flex-col">
            <div className={`p-2`}>
              <label htmlFor="philhealthnum" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Philhealth Number:</label>
              <input
                type="text"
                id="philhealthnum"
                name="philhealthnum"
                placeholder="Enter your philheath number. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              />
            </div>
            <div className="p-2 flex items-center justify-start gap-3">
              <label htmlFor="philhealthstatustype" className={`block text-${selectedTheme}-600 font-semibold`}>Philhealth Status Type:</label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>Member</span>
              </label>
              <label className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}>
                <input
                  type="checkbox"
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>Dependent</span>
              </label>
            </div>
            <div className={`p-2`}>
              <label htmlFor="dpin" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>DPIN:</label>
              <input
                type="text"
                id="dpin"
                name="dpin"
                placeholder="Enter your Philhealth DPIN. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              />
            </div>
            <div className={`p-2`}>
              <label htmlFor="philhealthcategory" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Philhealth Category:</label>
              <input
                type="text"
                id="philhealthcategory"
                name="philhealthcategory"
                placeholder="Enter your Philhealth category. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              />
            </div>
            <div className={`p-2`}>
              <label htmlFor="contactnumber" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Contact Number:</label>
              <input
                type="text"
                id="contactnumber"
                name="contactnumber"
                placeholder="Enter your contact number. . . . ."
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-2 p-1 pt-3">
              <p className={`block text-${selectedTheme}-600 font-semibold col-span-4 justify-self-start self-start`}>Vital Signs:</p>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="bloodpressure"
                  name="bloodpressure"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="bloodpressure" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>BP</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="temperature"
                  name="temperature"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="temperature" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>TMP</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="heartrate"
                  name="heartrate"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="heartrate" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>HR</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="weight" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>WT</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="height"
                  name="height"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="height" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>HT</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="pulserate"
                  name="pulserate"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="pulserate" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>PR</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="respiratoryrate"
                  name="respiratoryrate"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="respiratoryrate" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>RR</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="bmi"
                  name="bmi"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="bmi" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>BMI</label>
              </div>
              <div className="flex gap-1 items-center justify-between">
                <input
                  type="text"
                  id="oxygensaturation"
                  name="oxygensaturation"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base grow"
                />
                <label htmlFor="oxygensaturation" className={`block text-${selectedTheme}-600 font-semibold col-span-2 justify-self-center`}>O2Sat</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <p className={`block text-${selectedTheme}-600 font-semibold col-span-4 p-3 justify-self-start self-start`}>Pediatric Client(1-2 years old):</p>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="length" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Lenght:</label>
                <input
                  type="text"
                  id="length"
                  name="length"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="waist" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Waist:</label>
                <input
                  type="text"
                  id="waist"
                  name="waist"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="head" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Head:</label>
                <input
                  type="text"
                  id="head"
                  name="head"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="hip" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Hip:</label>
                <input
                  type="text"
                  id="hip"
                  name="hip"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="limb" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Limb:</label>
                <input
                  type="text"
                  id="limb"
                  name="limb"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="muac" className={`block text-${selectedTheme}-600 font-semibold self-center`}>MUAC:</label>
                <input
                  type="text"
                  id="muac"
                  name="muac"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                <label htmlFor="skinfold" className={`block text-${selectedTheme}-600 font-semibold self-center`}>Skinfold:</label>
                <input
                  type="text"
                  id="skinfold"
                  name="skinfold"
                  className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  maxLength={60}
                  minLength={3}
                  required
                  autoComplete="off"
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