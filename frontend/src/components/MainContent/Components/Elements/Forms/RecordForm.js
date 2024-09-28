import { Checkbox, Label, Radio, Spinner } from 'flowbite-react';
import { useState, useEffect, useContext } from 'react';
import jsonData from '../../../../../common_names_by_gender.json';
import { colorTheme, notificationMessage } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import useCurrentTime from '../../../../../hooks/useCurrentTime';
import { socket } from '../../../../../socket';
import { GiDiceSixFacesFive, GiDiceSixFacesFour, GiDiceSixFacesOne, GiDiceSixFacesSix, GiDiceSixFacesThree, GiDiceSixFacesTwo } from "react-icons/gi";
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
  const [diceNumber, setDiceNumber] = useState(1);
  const { mysqlTime } = useCurrentTime();
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
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

  const { isLoading, addData } = useQuery();

  useEffect(() => {
    setFamilyId(barangay.substring(0,3).toUpperCase() + "-");
  }, [barangay]);

  const GenerateFamId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

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
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        // if (!barangays.includes(barangay)) {
        //   setNotifMessage('Barangay must be inside the municipality of Victoria only!');
        //   const time = setTimeout(() => {
        //     setNotifMessage(null);
        //   }, 5000);
        //   return () => clearTimeout(time);
        // }
        const payload = {
          firstName: firstname,
          middleName: middlename,
          lastName: lastname,
          gender: gender,
          birthdate: birthdate,
          barangay: barangay,
          family_id: `${barangay.substring(0,2).toUpperCase()}-${familyId}`,
          phone_number: phoneNumber,
          dateTime: mysqlTime,
          staff_id: res.data.staff_id
        };
        if(dontCloseUponSubmission) {
          addData('/addRecord',payload);
          cleanUp();
        } else {
          close();
          addData('/addRecord',payload);
          cleanUp();
        }
        const time = setTimeout(() => {
          socket.emit('updateRecords');
        },[500])
        return () => clearTimeout(time);
      }
    } catch (error) {
      setNotifMessage(error.message);
    }
  }

  const randomizeFamilyId = (e) => {
    e.preventDefault();
    setDiceNumber(Math.floor(Math.random() * 6) + 1);
    setFamilyId(GenerateFamId(8).toUpperCase());
  };


  // THIS FORM SHOULD AUTO COMPLETE THE BARANGAY DEPENDING ON THE FAMILY NAME THAT IS ALSO WITHIN WHAT BARANGAY THE FAMILY NAME IS IN
  // SHOULD CHECK FAMILY ID FIRST BEFORE PASSING WHETHER IT ALREADY EXISTS OR NOT
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
              onChange={(e) => setFamilyId(e.target.value)}
              maxLength={18}
              required
            />
            <button className="p-1 text-blue-800" onClick={randomizeFamilyId}>
              {diceNumber === 1 ? <GiDiceSixFacesOne className="size-6 md:size-8 lg:size-9" color={selectedTheme} /> :
              diceNumber === 2 ? <GiDiceSixFacesTwo className="size-6 md:size-8 lg:size-9" color={selectedTheme} /> :
              diceNumber === 3 ? <GiDiceSixFacesThree className="size-6 md:size-8 lg:size-9" color={selectedTheme} /> :
              diceNumber === 4 ? <GiDiceSixFacesFour className="size-6 md:size-8 lg:size-9" color={selectedTheme} /> :
              diceNumber === 5 ? <GiDiceSixFacesFive className="size-6 md:size-8 lg:size-9" color={selectedTheme} /> :
              diceNumber === 6 ? <GiDiceSixFacesSix className="size-6 md:size-8 lg:size-9" color={selectedTheme} /> :
              <GiDiceSixFacesOne className="size-6 md:size-8 lg:size-9" color={selectedTheme} />
              }
            </button>
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
    </>
  );
}

export default RecordForm;
