import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../../App";
import { Spinner } from "flowbite-react";
import useQuery from "../../../../../hooks/useQuery";
import useCurrentTime from "../../../../../hooks/useCurrentTime";
import { socket } from "../../../../../socket";
import api from "../../../../../axios";

const NewAppointmentForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [appointment, setAppointment] = useState("");
  const [errorPrompt, setErrorPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [famId, setFamId] = useState('');
  const [errMessage, setErrMessage] = useState(null);
  const { mysqlTime } = useCurrentTime();
  const { response, isLoading, addData, postData } = useQuery();

  function cleanUp() {
    setFullname("");
    setDescription("");
    setAppointment("");
    setPhoneNumber("");
  };

  const convertToMySQLDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      appointedTime: appointment,
      description: description,
      dateTime: mysqlTime,
    };
    try {
      if (!famId) {
        setErrMessage("No name exists on the record.");
        const time = setTimeout(() => {
          setErrMessage(null);
        }, 3000);
        return () => clearTimeout(time);
      }
      if (new Date(appointment) < new Date()) {
        if (!errMessage) {
          setErrorPrompt("Appointment must be after this day or any other day!");
          const time = setTimeout(() => {
            setErrorPrompt();
          }, 3000);
          return () => clearTimeout(time);
        }
      }
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        const convertedPayload = {
            ...payload,
            staff_id: res.data.staff_id,
            appointedTime: convertToMySQLDateTime(payload.appointedTime),
            citizen_family_id: famId,
            phone_number: phoneNumber
        };
        await addData("newAppointment", convertedPayload);
        const time = setTimeout(() => {
          socket.emit('updateAppointmentSocket', convertedPayload);
        }, 500);
        cleanUp();
        close();
        return () => clearTimeout(time);
      }
    } catch (error) {
      setErrorPrompt(error.message);
      const time = setTimeout(() => {
        setErrorPrompt("");
      }, 3000);
      return () => clearTimeout(time);
    }
  };

  const handleNameChange = (e) => {
    const specialCharacterPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?0123456789]/g;
    if (!specialCharacterPattern.test(e.target.value)) {
      setFullname(e.target.value);
    } else {
      e.preventDefault();
    }
  };

  const handleNumberChange = (e) => {
    const numberPattern = /^[0-9]*$/;
    if (numberPattern.test(e.target.value) || e.target.value === "") {
      setPhoneNumber(e.target.value);
    } else {
      e.preventDefault();
    }
  };

  async function fetchCitizen() {
    await postData('/findCitizen', {name: fullname});
  };

  useEffect(() => {
    if (fullname.length > 3) {
      const time = setTimeout(() => {
        fetchCitizen();
      }, 1000);
      return () => clearTimeout(time);
    }
    if (fullname.length === 0) {
      setPhoneNumber('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullname]);

  async function handleSelectSuggestions(e, i) {
    e.preventDefault();
    if (fullname.length > 3) {
      setFamId(suggestions[i].citizen_family_id);
      setFullname(suggestions[i].full_name);
      setSuggestions([]);
    }
  };
  
  useEffect(() => {
    if (response?.status === 200) {
      if (response && response?.citizen?.length === 1) {
        const citizen = response.citizen[0];
        setFullname(citizen.full_name);
        setPhoneNumber(citizen.citizen_number);
        setFamId(citizen.citizen_family_id);
      } else if (response?.citizen?.length > 1) {
        setSuggestions(response.citizen);
      } else {
        setSuggestions([]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  
  return (
    <>
      {children}
      <div className="relative flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24">
        <form className="flex flex-col gap-4 max-h-[450px] min-h-[450px] overflow-y-auto" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor={'fullname'} className='mb-2 text-xs md:text-sm lg:text-base font-semibold'>{'Name'}:<span className="text-red-600 font-bold">*</span></label>
            <input
              type="text"
              name={'fullname'}
              id={'fullname'}
              required
              value={fullname}
              onChange={handleNameChange}
              autoComplete="off"
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              placeholder="Type your name then press ENTER to search the records"
              maxLength={100}
            />
            {suggestions && suggestions.length > 0 && (
              <ul
                className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                style={{ top: '100%' }}
              >
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={(e) => handleSelectSuggestions(e, i)}
                  >
                    {suggestion.full_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className='mb-2 text-xs md:text-sm lg:text-base font-semibold'>Contact Number:</label>
            <div className="flex gap-1 flex-row justify-start items-center">
              <input 
                type="text" 
                name="phoneNumber" 
                id="phoneNumber"
                autoComplete="off"
                value={phoneNumber}
                onChange={handleNumberChange}
                placeholder="Enter patient's number to contact..."
                className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
                maxLength={12}
                minLength={11}
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className='text-xs md:text-sm lg:text-base font-semibold'>Description & Reason:<span className="text-red-600 font-bold">*</span></label>
            <textarea 
              name="description"
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              placeholder="Reason for appointment. . . . ."
              rows={4}
              maxLength={255}
            />
          </div>
          <div className="relative">
            <label htmlFor="appointmentdatetime" className='relative text-xs md:text-sm lg:text-base font-semibold'>
              Appointed Date & Time:<span className="text-red-600 font-bold">*</span>
              {errorPrompt && 
                <p className="absolute top-0 left-0 border-[1px] border-red bg-red-100 rounded-lg p-1 text-red font-thin text-red text-nowrap w-min">{errorPrompt && errorPrompt}</p>
              }
            </label>
            <input 
              type="datetime-local"
              name="appointmentdatetime"
              id="appointmentdatetime"
              required
              value={appointment}
              onChange={(e) => setAppointment(e.target.value)}
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            />
          </div>
          <button disabled={isLoading} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 ${errMessage ? 'bg-red-800 text-red-200 font-bold' :!isLoading ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner` }`}><p className="drop-shadow-lg">{errMessage ? errMessage : !isLoading ? 'Create new appointment' : <Spinner/>}</p></button>
        </form>
      </div>
    </>
  )
}
 
export default NewAppointmentForm;