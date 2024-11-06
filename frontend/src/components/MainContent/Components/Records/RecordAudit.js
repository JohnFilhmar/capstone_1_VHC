/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import { colorTheme, notificationMessage } from "../../../../App";
import { MdClose, MdPerson } from "react-icons/md";
import useQuery from "../../../../hooks/useQuery";
import CitizenForm from "./Clinic_form/CitizenForm";
import DataTable from "../Elements/DataTable";
import api from "../../../../axios";
import useCurrentTime from "../../../../hooks/useCurrentTime";
import { Label, Radio, Spinner } from "flowbite-react";

export const prescriptionContext = createContext();

const RecordAudit = ({ recordAudit, toggle, family_id }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [notifMessage] = useContext(notificationMessage);
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [warningMessage, setWarningMessage] = useState(null);
  const { mysqlTime } = useCurrentTime();

  const { searchResults, isLoading, error, searchData, addData, postData } = useQuery();
  const [formVisibility, setFormVisibility] = useState(false);
  const [medicinePrescriptions, setMedicinePrescriptions] = useState([]);

  const [payload, setPayload] = useState({ 
    firstname: '',
    middlename: '',
    lastname: '',
    gender: 'male',
    birthdate: '',
    bloodtype: 'N/A',
    barangay: '',
    phoneNumber: '',
  });
  const barangays = [
    'Alcate',
    'Antonino',
    'Babangonan',
    'Bagong Buhay',
    'Bagong Silang',
    'Bambanin',
    'Bethel',
    'Canaan',
    'Concepcion',
    'Duongan',
    'Leido',
    'Loyal',
    'Mabini',
    'Macatoc',
    'Malabo',
    'Merit',
    'Ordovilla',
    'Pakyas',
    'Poblacion I',
    'Poblacion II',
    'Poblacion III',
    'Poblacion IV',
    'Sampaguita',
    'San Antonio',
    'San Cristobal',
    'San Gabriel',
    'San Gelacio',
    'San Isidro',
    'San Juan',
    'San Narciso',
    'Urdaneta',
    'Villa Cerveza',
  ];

  const [toEdit, setToEdit] = useState(false);

  useEffect(() => {
    async function searchRecord() {
      await searchData(`findRecord`, family_id);
    }
    if (family_id) {
      searchRecord();
    }
  },[family_id]);

  useEffect(() => {
    if (searchResults) {
      setData(searchResults.data);
      const receivedData = searchResults.data[0];
      const date = new Date(receivedData.citizen_birthdate);
      const newBDate = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      setPayload({
        firstname: receivedData.citizen_firstname,
        middlename: receivedData.citizen_middlename,
        lastname: receivedData.citizen_lastname,
        gender: String(receivedData.citizen_gender).toLowerCase(),
        birthdate: newBDate,
        bloodtype: receivedData.citizen_bloodtype,
        barangay: receivedData.citizen_barangay,
        phoneNumber: receivedData.citizen_phone_number,
      });
      const data = () => {
        return searchResults.data.map(({ history_id, action, action_details, action_datetime, username }) => {
          const formattedDatetime = new Date(action_datetime).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }) + " " + new Date(action_datetime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }).toLowerCase();
          return {
            history_id,
            action,
            action_details,
            action_datetime: formattedDatetime,
            username}
        });
      };
      setHistory(searchResults.data && data());
      convertData(searchResults.data && data());
    }
  }, [error, searchResults]);
  
  function convertKey(word) {
    const data = word.split('_');
    const newKey = data.map(dat => dat.charAt(0).toUpperCase() + dat.slice(1).toLowerCase());
    return newKey.join(' ');
  };
  
  function convertData(data) {
    const newData = data && data.map(obj => {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        const newKey = convertKey(key);
        newObj[newKey] = obj[key];
      });
      return newObj;
    });
    return newData;
  };

  function closeAudit() {
    toggle();
    setData([]);
    sessionStorage.removeItem('clinicForm');
    setToEdit(false);
    setPayload({
      firstname: '',
      middlename: '',
      lastname: '',
      gender: 'male',
      birthdate: '',
      bloodtype: 'N/A',
      barangay: '',
      phoneNumber: '',
    });
  };

  function testForm() {
    const storedData = sessionStorage.getItem('clinicForm');
    const clinicForm = storedData && JSON.parse(storedData);
    if (!clinicForm) {
      return { valid: false, message: "No form data available." };
    }
    const {
      chief_of_complaint,
      history_of_present_illness,
      past_medical_history,
      family_medical_history,
      physical_examination,
      vital_signs
    } = clinicForm;
    if (!chief_of_complaint) {
      return { valid: false, message: "Chief of complaint must be filled in." };
    }
    if (!history_of_present_illness) {
      return { valid: false, message: "History of present illness must be filled in." };
    }
    const pastMedicalHistoryValues = Object.values(past_medical_history);
    const familyMedicalHistoryValues = Object.values(family_medical_history);
    const hasAnyPastOrFamilyHistory = pastMedicalHistoryValues.includes(true) || familyMedicalHistoryValues.includes(true);
    if (!hasAnyPastOrFamilyHistory) {
      return { valid: false, message: "At least one item from past or family medical history should be true." };
    }
    const skinDescriptionsValues = Object.values(physical_examination.skin_descriptions);
    const heentDescriptionsValues = Object.values(physical_examination.heent_descriptions);
    const hasAnySkinOrHeentIssue = skinDescriptionsValues.includes(true) && heentDescriptionsValues.includes(true);
    if (!hasAnySkinOrHeentIssue) {
      return { valid: false, message: "At least one item from skin and HEENT descriptions should be true." };
    }
    if (!vital_signs.height || !vital_signs.weight) {
      return { valid: false, message: "Both height and weight must have a value." };
    }
    // const { primary_diagnosis, secondary_diagnosis, cases, symptoms, severity } = diagnosis_plan;
    // if (!primary_diagnosis || !secondary_diagnosis || !cases || !symptoms || !severity) {
    //   return { valid: false, message: "Diagnosis plan requires primary diagnosis, secondary diagnosis, cases, symptoms, and severity." };
    // }
    return null
  };

  async function handleSubmitClinicForm(e) {
    e.preventDefault();
    if (!testForm()) {
      try {
        const payload = sessionStorage.getItem('clinicForm') 
          ? JSON.parse(sessionStorage.getItem('clinicForm')) 
          : {};
        const res = await api.get('/getStaffId');
        if (res?.status === 200) {
          const newPayload = {
            ...payload,
            staff_id: res.data.staff_id,
            dateTime: mysqlTime
          }
          await addData('/addClinicRecord', newPayload);
          setMedicinePrescriptions([]);
          closeAudit();
          sessionStorage.removeItem('clinicForm');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setWarningMessage(testForm().message);
      const time = setTimeout(() => {
        setWarningMessage(null);
      }, 3000);
      return () => clearTimeout(time);
    }
  }

  const parsePhoneNumber = (e) => {
    const userInput = e.target.value;
    const onlyNumbers = userInput.replace(/\D/g, '');
    setPayload(prev => ({ ...prev, phoneNumber: onlyNumbers }));
  };

  async function handleUpdateRecord(e) {
    e.preventDefault();
    const res = await api.get('/getStaffId');
    if (res?.status === 200) {
      const newPayload = {
        ...payload,
        family_id,
        dateTime: mysqlTime,
        staff_id: res.data.staff_id
      };
      await postData('updateRecord', newPayload);
      closeAudit();
    }
  }
  
  // async function handelDeleteRecord() {
  //   const res = await api.get('/getStaffId');
  //   if (res?.status === 200) {
  //     await deleteData('deleteRecord', family_id, { staff_id: res.data.staff_id, dateTime: mysqlTime });
  //   }
  //   closeAudit();
  // };
  
  return (
    <dialog ref={recordAudit} className={`rounded-lg bg-${selectedTheme}-100 drop-shadow-lg w-[90vw] h-full`}>
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}>
          <div className="flex items-center p-1 gap-1">
            <MdPerson className='w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8' />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">Record Options</strong>
          </div>
          <button 
            onClick={() => closeAudit()}
            className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}>
            <MdClose className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' />
          </button>
        </div>
        <div className="flex flex-col gap-3 h-full min-h-full overflow-y-auto">
          <div className="flex justify-between items-center p-1 md:p-2 lg:p-3">

            <div className={`flex flex-col gap-3 text-${selectedTheme}-600 font-semibold`}>
              <div className={`flex gap-2`}>
                <p>Patient:</p>
                <p>
                  {!data ? (
                    <span className="drop-shadow-lg animate-pulse animate-infinite animate-duration-[800ms] animate-ease-linear font-bold">
                      { error ? String(error) : '. . . . . . . . .' }
                    </span>
                  ) : (
                    <span className="underline underline-offset-4">
                      {data[0]?.citizen_firstname} {data[0]?.citizen_middlename} {data[0]?.citizen_lastname}
                    </span>
                  )}
                </p>
              </div>
              <div className={`flex gap-2`}>
                <p>Family ID:</p>
                <p>
                  {!data ? (
                    <span className="drop-shadow-lg animate-pulse animate-infinite animate-duration-[800ms] animate-ease-linear font-bold">
                      { error ? String(error) : '. . . . . . . . .' }
                    </span>
                  ) : (
                    <span className="underline underline-offset-4">
                      {family_id}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center gap-1 md:gap-2 lg:gap-3">
              <button 
                onClick={() => setToEdit(prev => !prev)}
                className={`font-semibold p-1 md:p-2 lg:p-2 rounded-md transition-colors duration-200 ${!toEdit ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-red-200 bg-red-800 shadow-inner` }`}
              >
                {toEdit ? 'Cancel Edit' : 'Edit Record'}
              </button>
              {/* <button 
                onClick={() => handelDeleteRecord()}
                className={`font-semibold p-1 md:p-2 lg:p-2 rounded-md transition-colors duration-200 text-red-100 bg-red-700 hover:drop-shadow-md hover:bg-red-800 focus:bg-red-600 active:bg-red-300 active:text-red-600 active:shadow-inner active:ring-2 active:ring-red-600`}>
                <BiSolidTrashAlt className="size-4 md:size-5 lg:size-6" />
              </button> */}
            </div>

          </div>

          <form onSubmit={handleUpdateRecord} className={`${toEdit ? 'block' : 'hidden'} p-2 md:p-3 lg:p-4 border-2 border-${selectedTheme}-950 flex flex-col justify-start items-start gap-2 m-4 rounded-md drop-shadow-md bg-${selectedTheme}-200`}>
            <p className={`text-${selectedTheme}-800 text-base md:text-lg lg:text-xl font-bold text-nowrap p-1 md:p-2 lg:p-2`}>Update Record</p>
            <div className="w-full">
              <div className="mb-2 block">
                <label htmlFor="firstname" className='text-xs md:text-sm lg:text-base font-semibold'>First Name</label>
              </div>
              <input 
                type="text" 
                required 
                className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
                maxLength={50} 
                id="firstname" 
                placeholder="Enter first name. . . . ." 
                value={payload.firstname} 
                onChange={(e) => setPayload(prev => ({ ...prev, firstname: e.target.value }))} 
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <label htmlFor="middlename" className='text-xs md:text-sm lg:text-base font-semibold'>Middle Name</label>
              </div>
              <input 
                required 
                className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
                maxLength={50} 
                id="middlename"
                type="text" 
                placeholder="Enter middle name. . . . ."
                value={payload.middlename} 
                onChange={(e) => setPayload(prev => ({ ...prev, middlename: e.target.value }))} 
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <label htmlFor="lastname" className='text-xs md:text-sm lg:text-base font-semibold'>Last Name</label>
              </div>
              <input 
                required 
                className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
                maxLength={50} 
                id="lastname" 
                type="text" 
                placeholder="Enter last name. . . . ." 
                value={payload.lastname} 
                onChange={(e) => setPayload(prev => ({ ...prev, lastname: e.target.value }))}
              />
            </div>
            <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-between items-start w-full">
              <fieldset className="flex flex-row gap-3 p-2">
                <legend className="mr-4 text-xs md:text-sm lg:text-base">Choose a gender</legend>
                <div className="flex items-center gap-2">
                  <Radio
                    id="male"
                    name="gender"
                    value="male"
                    className='text-xs md:text-sm lg:text-base'
                    checked={payload.gender === 'male'}
                    onChange={() => setPayload(prev => ({ ...prev, gender: 'male' }))}
                  />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="female"
                    name="gender"
                    value="female"
                    className='text-xs md:text-sm lg:text-base'
                    checked={payload.gender === 'female'}
                    onChange={() => setPayload(prev => ({ ...prev, gender: 'female' }))}
                  />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="others"
                    name="gender"
                    value="others"
                    className='text-xs md:text-sm lg:text-base'
                    checked={payload.gender === 'others'}
                    onChange={() => setPayload(prev => ({ ...prev, gender: 'others' }))}
                  />
                  <Label htmlFor="others">Others</Label>
                </div>
              </fieldset>
              <div className="w-full">
                <label htmlFor="birthdate" className='text-xs md:text-sm lg:text-base font-semibold'>Birthdate: </label>
                <input 
                  type="date" 
                  className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`} 
                  value={payload.birthdate}
                  onChange={(e) => setPayload(prev => ({ ...prev, birthdate: e.target.value }))}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="bloodtype"
                  className='text-xs md:text-sm lg:text-base font-semibold'
                >
                  BloodType:
                </label>
                <select
                  name="bloodtype"
                  id="bloodtype"
                  className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`} 
                  required
                  value={payload.bloodtype}
                  onChange={(e) => {
                    setPayload(prev => ({ ...prev, bloodtype: e.target.value }));
                  }}
                >
                  <option
                    value="N/A"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    N/A
                  </option>
                  <option
                    value="O+"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    O+
                  </option>
                  <option
                    value="O-"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    O-
                  </option>
                  <option
                    value="A+"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    A+
                  </option>
                  <option
                    value="A-"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    A-
                  </option>
                  <option
                    value="B+"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    B+
                  </option>
                  <option
                    value="B-"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    B-
                  </option>
                  <option
                    value="AB+"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    AB+
                  </option>
                  <option
                    value="AB-"
                    className="w-full rounded-lg text-xs md:text-sm lg:text-base"
                  >
                    AB-
                  </option>
                </select>
              </div>
              <div className='w-full'>
                <label htmlFor="barangay" className='text-xs md:text-sm lg:text-base font-semibold'>Barangay: </label>
                <input 
                  required 
                  className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
                  id="barangay" 
                  type="text"
                  placeholder="Enter barangay. . . . ." 
                  value={payload.barangay} 
                  onChange={(e) => setPayload(prev => ({ ...prev, barangay: e.target.value }))} 
                  list='barangaySuggestions'
                  autoComplete='off'
                />
                <datalist id="barangaySuggestions">
                  {payload.barangay?.length >= 2 && barangays.map((barangay, index) => (
                    <option 
                      key={index} 
                      value={barangay} 
                      onClick={() => setPayload(prev => ({ ...prev, barangay: barangay }))} 
                    />
                  ))}
                </datalist>
              </div>
              <div className='w-full'>
                <label htmlFor="phoneNumber" className='text-xs md:text-sm lg:text-base font-semibold'>Phone Number: </label>
                <input 
                  className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
                  id="phoneNumber" 
                  type="text" 
                  placeholder="Enter phone number. . . . ." 
                  value={payload.phoneNumber} 
                  onChange={parsePhoneNumber}
                  maxLength={12} 
                  minLength={10}
                  autoComplete='off'
                />
              </div>
            </div>
            <button disabled={!toEdit || isLoading} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 
              ${!isLoading || toEdit ? 
                `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600 disabled:cursor-not-allowed disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-700 ` : 
                `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner`}`}>
                <p className="drop-shadow-lg">
                  {!isLoading ? (notifMessage ? notifMessage : 'Update Record') : <Spinner/>}
                </p>
            </button>
          </form>
          
          <button disabled={!data || data.length === 0} onClick={() => setFormVisibility(prev => !prev)} className={`m-1 mx-5 p-2 block rounded-lg font-semibold text-${selectedTheme}-800 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-600 active:text-${selectedTheme}-200 flex items-center justify-center`}>
            <span>{formVisibility ? 'Open History Table' : 'Open Prescription Form'}</span>
          </button>
          <div className="mx-4 flex justify-between items-center">
            <p className={`text-left text-${selectedTheme}-700 font-bold text-base md:text-lg lg:text-xl`}>{formVisibility ? 'Clinic Form' : 'Patient History'}</p>
            {formVisibility && (
              <div className="relative">
                <button onClick={handleSubmitClinicForm} className={`m-1 mx-5 p-2 block rounded-lg font-semibold text-${selectedTheme}-800 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-600 active:text-${selectedTheme}-200 flex items-center justify-center`}>Submit Clinic Form</button>
                {warningMessage && <p className={`absolute bottom-0 right-0 bg-red-100 text-red-700 p-1 px-2`}>
                  {warningMessage}
                </p>}
              </div>
            )}
          </div>
          <div className="m-3 overflow-y-auto min-h-full rounded-lg">
            {!formVisibility ? (
              <DataTable data={convertData(history)}  enAdd={false} enExport={true} enOptions={false} enImport={false} isLoading={isLoading} error={error} />
            ):(
              <prescriptionContext.Provider value={[ medicinePrescriptions, setMedicinePrescriptions ]}>
                <CitizenForm userData={data[0]} />
              </prescriptionContext.Provider>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
 
export default RecordAudit;