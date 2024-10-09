import { Checkbox, Label, Radio, Spinner } from 'flowbite-react';
import { useState, useEffect, useContext, useRef } from 'react';
import jsonData from '../../../../../common_names_by_gender.json';
import { colorTheme, notificationMessage } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import useCurrentTime from '../../../../../hooks/useCurrentTime';
import { socket } from '../../../../../socket';
import api from '../../../../../axios';

const RecordForm = ( { close, children } ) => {
  const [selectedTheme] = useContext(colorTheme);
  const [firstname, setFirstName] = useState('');
  const [middlename, setMiddleName] = useState('');
  const [lastname, setLastName] = useState('');
  const [barangay, setBarangay] = useState('');
  const [gender, setGender] = useState('male');
  const [birthdate, setBirthdate] = useState("2001-01-01")
  const [familyId, setFamilyId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dontCloseUponSubmission, setDontCloseUponSubmission] = useState(false);
  const { mysqlTime } = useCurrentTime();
  const [staffId, setStaffId] = useState(null);
  const alreadyExistsRef = useRef(null);
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const [isMessageShown, setIsMessageShown] = useState(false);
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

  const { response, isLoading, addData } = useQuery();

  useEffect(() => {
    setFamilyId(barangay.substring(0,3).toUpperCase() + "-");
  }, [barangay]);

  const parsePhoneNumber = (e) => {
    const userInput = e.target.value;
    const onlyNumbers = userInput.replace(/\D/g, '');
    setPhoneNumber(onlyNumbers);
  }

  useEffect(() => {
    const lowerCaseName = firstname.toLowerCase();
    const capitalizedName = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);  
    if (jsonData.female.includes(capitalizedName)) {
      setGender('female');
    } else if (jsonData.male.includes(capitalizedName)) {
      setGender('male');
    }
  }, [firstname]);

  const cleanUp = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setGender('male');
    setBirthdate("2001-01-01");
    setBarangay('');
    setPhoneNumber('');
    setFamilyId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (familyId.length !== 19) return;
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        setStaffId(res.data.staff_id);
        const payload = {
          firstName: firstname,
          middleName: middlename,
          lastName: lastname,
          gender: gender,
          birthdate: birthdate,
          barangay: barangay,
          family_id: familyId,
          phone_number: phoneNumber,
          dateTime: mysqlTime,
          staff_id: res.data.staff_id
        };
        if(dontCloseUponSubmission) {
          await addData('/addRecord',payload);
          cleanUp();
        } else {
          await addData('/addRecord',payload);
          // close();
          // cleanUp();
        }
        socket.emit("newRecordSocket", {citizen_family_id: familyId, citizen_firstname: firstname, citizen_birthdate: birthdate});
      }
    } catch (error) {
      setNotifMessage(error.message);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value; 
    let prefix = barangay.slice(0, 3).toUpperCase(); 
    const cleanedValue = input.replace(/\D/g, '').slice(0, 13); 
    const formattedValue = cleanedValue
      .replace(/(\d{4})(\d{0,4})(\d{0,5})/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join('-')
      ); 
    setFamilyId(`${prefix}-${formattedValue}`);
  }; 

  function handleCloseMessage(e) {
    e.preventDefault();
    console.log(isMessageShown);
    if (isMessageShown) {
      setIsMessageShown(false);
      alreadyExistsRef.current.close();
    }
  }

  async function handleContinue(e) {
    e.preventDefault();
    const payload = {
      firstName: firstname,
      middleName: middlename,
      lastName: lastname,
      gender: gender,
      birthdate: birthdate,
      barangay: barangay,
      family_id: familyId,
      phone_number: phoneNumber,
      dateTime: mysqlTime,
      staff_id: staffId
    };
    await addData('/proceedAddRecord',payload);
  }

  useEffect(() => {
    function doneWithThisShit() {
      setFamilyId(null);
      setStaffId(null);
      cleanUp();
      close();
      if (isMessageShown) {
        setIsMessageShown(false);
        alreadyExistsRef.current.close();
      }
    }
    if (response?.status === 208) {
      alreadyExistsRef.current.showModal();
      setIsMessageShown(true);
    }
    if (response?.status === 200) {
      socket.emit("newRecordSocket", {citizen_family_id: familyId, citizen_firstname: firstname, citizen_birthdate: birthdate});
      doneWithThisShit();
    }
    if (response?.status === 226) {
      setNotifMessage(response?.message);
      doneWithThisShit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <>
      {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24" onSubmit={handleSubmit}>
        <div>
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
            value={firstname} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        <div>
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
            value={middlename} onChange={(e) => setMiddleName(e.target.value)} 
          />
        </div>
        <div>
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
            value={lastname} onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-between items-start">
          <fieldset className="flex flex-row gap-3 p-2">
            <legend className="mr-4 text-xs md:text-sm lg:text-base">Choose a gender</legend>
            <div className="flex items-center gap-2">
              <Radio
                id="male"
                name="gender"
                value="male"
                className='text-xs md:text-sm lg:text-base'
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="female"
                name="gender"
                value="female"
                className='text-xs md:text-sm lg:text-base'
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="others"
                name="gender"
                value="others"
                className='text-xs md:text-sm lg:text-base'
                checked={gender === 'others'}
                onChange={() => setGender('others')}
              />
              <Label htmlFor="others">Others</Label>
            </div>
          </fieldset>
          <div className="grow">
            <label htmlFor="birthdate" className='text-xs md:text-sm lg:text-base font-semibold'>Birthdate: </label>
            <input 
              type="date" 
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`} 
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-col md:flex-row lg:flex-row gap-3'>
          <div className='basis-1/2'>
            <label htmlFor="barangay" className='text-xs md:text-sm lg:text-base font-semibold'>Barangay: </label>
            <input 
              required 
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              id="barangay" 
              type="text"
              placeholder="Enter barangay. . . . ." 
              value={barangay} onChange={(e) => setBarangay(e.target.value)} 
              list='barangaySuggestions'
              autoComplete='off'
            />
            <datalist id="barangaySuggestions">
              {barangay.length >= 4 && barangays.map((bangay, index) => (
                <option key={index} value={bangay} onClick={() => setBarangay(bangay)} />
              ))}
            </datalist>
          </div>
          <div className='basis-1/2'>
            <label htmlFor="phoneNumber" className='text-xs md:text-sm lg:text-base font-semibold'>Phone Number: </label>
            <input 
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              id="phoneNumber" 
              type="text" 
              placeholder="Enter phone number. . . . ." 
              value={phoneNumber} 
              onChange={parsePhoneNumber} 
              maxLength={12} 
              minLength={10}
              autoComplete='off'
            />
          </div>
        </div>
        <div className='block'>
          <div className="mb-2 block">
            <label htmlFor="familyId" className='text-xs md:text-sm lg:text-base font-semibold'>Family ID</label>
          </div>
          <div className="flex gap-2">
            <input 
              id="familyId" 
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent text-slate-500 border-[1px] border-${selectedTheme}-800`}
              type="text" 
              value={familyId}
              onChange={handleChange}
              maxLength={19}
              minLength={19}
              autoComplete='off'
              required
            />
          </div>
        </div>
        <button disabled={isLoading} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 ${!isLoading ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner` }`}><p className="drop-shadow-lg">{!isLoading ? (notifMessage ? notifMessage : 'Add New Record') : <Spinner/>}</p></button>
        <div className="flex items-center justify-end gap-2">
          <Checkbox
            id="accept"
            checked={dontCloseUponSubmission}
            onChange={() => setDontCloseUponSubmission((prev) => !prev)}
          />
          <label htmlFor="accept" className="flex text-xs md:text-sm lg:text-base font-semibold">
            Don't Close Upon Submition
          </label>
        </div>

      </form>

      <dialog ref={alreadyExistsRef} className='drop-shadow-md rounded-md'>

        <div className={`flex flex-col justify-start items-center w-full max-w-[90vw] h-fit max-h-[90vh] bg-${selectedTheme}-200 rounded-md drop-shadow-md overflow-auto`}>

          <p className={`p-4 w-full bg-${selectedTheme}-600 font-bold text-base md:text-lg lg:text-xl text-${selectedTheme}-200`}>{response?.message}</p>

          <div className={`text-${selectedTheme}-800 font-medium p-2`}>

            <p className={`font-bold text-sm md:text-base lg:text-lg`}>Do you still wish to continue and consider this person a family member or relative of <span className="text-red-800 font-bold underline">{response?.lastname}</span>?</p>

            <div className="flex justify-end items-center p-2 gap-4">
              <button onClick={(e) => handleCloseMessage(e)} className={`font-bold p-2 rounded-sm drop-shadow-md bg-${selectedTheme}-200 text-${selectedTheme}-600 hover:bg-${selectedTheme}-400 hover:text-${selectedTheme}-600`}>Cancel</button>
              <button onClick={(e) => handleContinue(e)} className={`font-bold p-2 rounded-sm drop-shadow-md bg-${selectedTheme}-600 text-${selectedTheme}-200 hover:bg-${selectedTheme}-400 hover:text-${selectedTheme}-600`}>Continue</button>
            </div>

          </div>

        </div>

      </dialog>
    </>
  );
}

export default RecordForm;
