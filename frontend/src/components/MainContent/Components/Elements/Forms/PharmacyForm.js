import { Checkbox, Spinner } from 'flowbite-react';
import { useContext, useState } from 'react';
import { colorTheme, notificationMessage } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import useCurrentTime from '../../../../../hooks/useCurrentTime';
import api from '../../../../../axios';
import { socket } from '../../../../../socket';

const PharmacyForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { isLoading, addData } = useQuery();
  const { mysqlTime } = useCurrentTime();
  const [dontCloseUponSubmission, setDontCloseUponSubmission] = useState(false);
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const [payload, setPayload] = useState({
    itemName: '',
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
        console.log(newPayload);
        await addData('/addMedicine', newPayload);
        setPayload({
          itemName: '',
          quantity: '',
          container: '',
          lotNo: '',
          expiry: '',
          stockroom: ''
        });
        if (!dontCloseUponSubmission) close();
        const time = setTimeout(() => {
          socket.emit('updatePharmacy');
        }, 1000);
        return () => clearTimeout(time);
      }
    } catch (error) {
      console.error(error);
      setNotifMessage(error?.message)
    }
  }
  
  return (
    <>
    {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24 w-[30vw]" onSubmit={handleSubmit}>
        <div className='p-2'>
          <div className="mb-2 block">
            <label htmlFor="itemName" className='text-xs md:text-sm lg:text-base font-semibold'>Item Name:</label>
          </div>
          <input 
            type="text" 
            id="itemName" 
            name="itemName"
            placeholder="Enter item name. . . . ." 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            value={payload.itemName}
            onChange={handleChange}
            required
            maxLength={100}
          />
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
              required
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
