import { Checkbox, Spinner } from 'flowbite-react';
import { useContext, useEffect, useState } from 'react';
import { colorTheme, notificationMessage } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import useCurrentTime from '../../../../../hooks/useCurrentTime';
import api from '../../../../../axios';
import { socket } from '../../../../../socket';
import axios from 'axios';

const PharmacyForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { isLoading, addData } = useQuery();
  const { mysqlTime } = useCurrentTime();
  const [dontCloseUponSubmission, setDontCloseUponSubmission] = useState(false);
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const [suggestions, setSuggestions] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [apiResults, setApiResults] = useState(null);
  const [payload, setPayload] = useState({
    itemName: '',
    itemStrength: '',
    quantity: '',
    container: '',
    lotNo: '',
    expiry: '',
    stockroom: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value 
    }));
  }
  
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        const newPayload = {
          ...payload,
          dateTime: mysqlTime,
          staff_id: res.data.staff_id
        }
        await addData('/addMedicine', newPayload);
        socket.emit('newDrugSocket', payload);
        setPayload({
          itemName: '',
          itemStrength: '',
          quantity: '',
          container: '',
          lotNo: '',
          expiry: '',
          stockroom: ''
        });
        if (!dontCloseUponSubmission) close();
      }
    } catch (error) {
      console.error(error);
      setNotifMessage(error?.message)
    }
  }

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${query}&ef=STRENGTHS_AND_FORMS`);
      if (response?.data) {
        setApiResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching drug suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    let time;
    if ((!payload.itemStrength || strengths.length === 0)) {
      if (payload.itemName.length > 4) {
        time = setTimeout(() => {
          fetchSuggestions(payload.itemName);
        }, 1000);
      } else {
        setSuggestions([]);
      }
      if (payload.itemName.length === 0) {
        setStrengths([]);
        setPayload(prev => ({ ...prev, itemStrength: '' }));
      }
    }
    return () => clearTimeout(time);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.itemName]);

  useEffect(() => {
    if (apiResults) {
      if (apiResults[3].length > 1) {
        const suggs = apiResults[3];
        setSuggestions(suggs);
      } else if (apiResults[3].length === 1) {
        setPayload(prev => ({ ...prev, itemName: apiResults[3][0][0] }));
        setPayload(prev => ({ ...prev, itemStrength: apiResults[2].STRENGTHS_AND_FORMS[0][0] }));
      } else {
        setSuggestions([]);
        setStrengths([]);
      }
    }
  }, [apiResults]);
  
  function handleSelectMedicine(medicine, i) {
    setPayload(prev => ({ ...prev, itemName: medicine[0] }));
    if (apiResults[2].STRENGTHS_AND_FORMS[i].length > 1) {
      setStrengths(apiResults[2].STRENGTHS_AND_FORMS[i]);
    } else {
      setPayload(prev => ({ ...prev, itemStrength: apiResults[2].STRENGTHS_AND_FORMS[i][0] }))
    }
    setSuggestions([]);
  };

  function handleSelectStrength(strength) {
    setPayload(prev => ({ ...prev, itemStrength: strength}));
    setStrengths([]);
  };
  
  return (
    <>
    {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24 md:w-[80vw] lg:w-[70vw]" onSubmit={handleSubmit}>
        <div className='flex flex-col md:flex-row lg:flex-row justify-start items-start md:items-center lg:items-center gap-2 w-full p-2'>
          <div className="block">
            <label htmlFor="itemName" className='text-xs md:text-sm lg:text-base font-semibold text-nowrap'>Item Name:</label>
          </div>
          <div className="relative w-full basis-1/2">
            <input 
              type="text" 
              id="itemName" 
              name="itemName"
              placeholder="Enter item name. . . . ." 
              className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
              value={payload.itemName}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul 
                className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                style={{ top: '100%' }}
              >
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleSelectMedicine(suggestion, i)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="block">
            <label htmlFor="itemStrength" className='text-xs md:text-sm lg:text-base font-semibold'>Strength:</label>
          </div>
          <div className="relative w-full basis-1/2">
            <input 
              type="text" 
              id="itemStrength" 
              name="itemStrength"
              placeholder="Select or input strength. . . . ." 
              className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
              value={payload.itemStrength}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            {strengths.length > 0 && (
              <ul 
                className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                style={{ top: '100%' }}
              >
                {strengths.map((strength, i) => (
                  <li
                    key={i}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleSelectStrength(strength)}
                  >
                    {strength}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className='p-2 flex gap-1 w-full'>
          <div>
            <div className="mb-2 block">
              <label htmlFor="quantity" className='text-xs md:text-sm lg:text-base font-semibold'>Quantity:</label>
            </div>
            <input 
              type="number" 
              id="quantity" 
              name="quantity"
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              value={payload.quantity}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <label htmlFor="container" className='text-xs md:text-sm lg:text-base font-semibold'>Container Type:</label>
            </div>
            <input 
              type="text" 
              id="container" 
              name="container"
              placeholder="Enter container type. . . . ."
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              value={payload.container}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>
          <div className='grow'>
            <div className="mb-2 block">
              <label htmlFor="lotNo" className='text-xs md:text-sm lg:text-base font-semibold'>Lot. No:</label>
            </div>
            <input 
              type="text" 
              id="lotNo" 
              name="lotNo"
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              value={payload.lotNo}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
        </div>
        <div className="p-2 flex gap-1 w-full">
          <div>
            <div className="mb-2 block">
              <label htmlFor="expiry" className='text-xs md:text-sm lg:text-base font-semibold'>Expiry Date:</label>
            </div>
            <input 
              type="date" 
              id="expiry" 
              name="expiry"
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              value={payload.expiry}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>
          <div className='grow'>
            <div className="mb-2 block">
              <label htmlFor="stockroom" className='text-xs md:text-sm lg:text-base font-semibold'>Quantity Stockroom:</label>
            </div>
            <input 
              type="text" 
              id="stockroom" 
              name="stockroom"
              placeholder="Enter quantity stockroom. . . . ."
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              value={payload.stockroom}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
        </div>
        <button disabled={isLoading} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 ${!isLoading ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner` }`}><p className="drop-shadow-lg">{!isLoading ? (notifMessage ? notifMessage : 'Add New Medicine') : <Spinner/>}</p></button>
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

export default PharmacyForm;
