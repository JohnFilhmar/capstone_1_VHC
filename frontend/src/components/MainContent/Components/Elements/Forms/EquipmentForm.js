import { useContext, useEffect, useState } from "react";
import useQuery from "../../../../../hooks/useQuery";
import { colorTheme, notificationMessage } from "../../../../../App";
import { Checkbox, Spinner } from "flowbite-react";
import { socket } from "../../../../../socket";

const EquipmentForm = ( { close, children } ) => {
  const [selectedTheme] = useContext(colorTheme);
  const [notifMessage] = useContext(notificationMessage);

  const [dontCloseUponSubmission, setDontCloseUponSubmission] = useState(false);
  const [payload, setPayload] = useState(null);
  
  const { response, isLoading, addData } = useQuery();

  function handleChange(e) {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    await addData('/addEquipment', payload);
    if (!dontCloseUponSubmission) close();
    setPayload(null);
  };

  useEffect(() => {
    if (response?.status === 200) {
      socket.emit('newEquipmentSocket', response.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);
  
  return (
    <>
    {children}
    <div className="w-[30rem] md:w-[40rem] lg:w-[50rem]"/>
    <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24" onSubmit={handleSubmit}>
      {/* NAME AND TYPE */}
      <div className="grid grid-cols-2 gap-1 items-center w-full">
        {/* NAME */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="equipmentname" className='text-xs md:text-sm lg:text-base font-semibold'>Equipment Name</label>
          </div>
          <input 
            type="text" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={100} 
            id="equipmentname" 
            name="equipmentname"
            placeholder="Enter the equipment's name. . . . ." 
            value={payload?.equipmentname || ''}
            onChange={handleChange}
          />
        </div>
        {/* TYPE */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="equipmenttype" className="text-xs md:text-sm lg:text-base font-semibold">
              Equipment Type
            </label>
          </div>
          <select 
            required 
            id="equipmenttype" 
            name="equipmenttype"
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            value={payload?.equipmenttype || ''}
            onChange={handleChange}
          >
            <option value="">Select an equipment type. . . . .</option>
            <option value="Diagnostic">Diagnostic</option>
            <option value="Therapeutic">Therapeutic</option>
            <option value="Surgical">Surgical</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Imaging">Imaging</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Sterilization">Sterilization</option>
            <option value="Furniture">Furniture</option>
            <option value="Personal Protective Equipment (PPE)">Personal Protective Equipment (PPE)</option>
            <option value="Mobility Aid">Mobility Aid</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      {/* STATUS AND LOCATION */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-1 items-center w-full">
        {/* STATUS */}
        <div>
          <div className="mb-2 block">
            <label className="text-xs md:text-sm lg:text-base font-semibold">
              Status
            </label>
          </div>
          <div className="flex flex-wrap gap-4 p-2 rounded-md border-2">
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="status" 
                value="available" 
                className="mr-2"
                required
                checked={payload?.status === 'available'}
                onChange={handleChange}
              />
              Available
            </label>
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="status" 
                value="in use" 
                className="mr-2"
                checked={payload?.status === 'in use'}
                onChange={handleChange}
              />
              In Use
            </label>
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="status" 
                value="under maintenance" 
                className="mr-2"
                checked={payload?.status === 'under maintenance'}
                onChange={handleChange}
              />
              Under Maintenance
            </label>
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="status" 
                value="retired" 
                className="mr-2"
                checked={payload?.status === 'retired'}
                onChange={handleChange}
              />
              Retired
            </label>
          </div>
        </div>
        {/* LOCATION */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="equipmentlocation" className='text-xs md:text-sm lg:text-base font-semibold'>Equipment Location</label>
          </div>
          <input 
            type="text" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={50} 
            id="equipmentlocation"
            name="equipmentlocation" 
            placeholder="Enter the equipment's location. . . . ." 
            value={payload?.equipmentlocation || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* DATES */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-1 items-center w-full">
        {/* PURCHASE DATE */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="purchasedate" className='text-xs md:text-sm lg:text-base font-semibold'>Purchase Date</label>
          </div>
          <input 
            type="date" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            id="purchasedate" 
            name="purchasedate"
            value={payload?.purchasedate || ''}
            onChange={handleChange}
          />
        </div>
        {/* LAST MAINTENANCE DATE */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="maintenancedate" className='text-xs md:text-sm lg:text-base font-semibold'>Last Maintenance Date</label>
          </div>
          <input 
            type="date" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            id="maintenancedate" 
            name="maintenancedate"
            value={payload?.maintenancedate || ''}
            onChange={handleChange}
          />
        </div>
        {/* NEXT MAINTENANCE DATE */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="nextmaintenance" className='text-xs md:text-sm lg:text-base font-semibold'>Next Maintenance Date</label>
          </div>
          <input 
            type="date" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            id="nextmaintenance" 
            name="nextmaintenance"
            value={payload?.nextmaintenance || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-1 items-center w-full">
        {/* CONDITION */}
        <div>
          <div className="mb-2 block">
            <label className="text-xs md:text-sm lg:text-base font-semibold">
              Condition
            </label>
          </div>
          <div className="flex flex-wrap gap-4 p-2 rounded-md border-2">
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="condition" 
                value="excellent" 
                className="mr-2"
                required
                checked={payload?.condition === 'excellent'}
                onChange={handleChange}
              />
              Excellent
            </label>
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="condition" 
                value="good" 
                className="mr-2"
                checked={payload?.condition === 'good'}
                onChange={handleChange}
              />
              Good
            </label>
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="condition" 
                value="fair" 
                className="mr-2"
                checked={payload?.condition === 'fair'}
                onChange={handleChange}
              />
              Fair
            </label>
            <label className="flex items-center text-xs md:text-sm lg:text-base">
              <input 
                type="radio" 
                name="condition" 
                value="poor" 
                className="mr-2"
                checked={payload?.condition === 'poor'}
                onChange={handleChange}
              />
              Poor
            </label>
          </div>
        </div>
        {/* SERIAL NUMBER */}
        <div>
          <div className="mb-2 block">
            <label htmlFor="serialnumber" className='text-xs md:text-sm lg:text-base font-semibold'>Serial Number</label>
          </div>
          <input 
            type="text"
            required
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={50} 
            id="serialnumber" 
            name="serialnumber"
            placeholder="Enter the equipment's serial #. . . . ." 
            value={payload?.serialnumber || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* NOTES */}
      <div>
        <div className="mb-2 block">
          <label htmlFor="notes" className='text-xs md:text-sm lg:text-base font-semibold'>Notes</label>
        </div>
        <textarea 
          rows={2}
          required
          className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
          maxLength={255}
          id="notes" 
          name="notes"
          placeholder="Enter some notes. . . . ." 
          value={payload?.notes || ''}
          onChange={handleChange}
        />
      </div>
      <button disabled={isLoading} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 ${!isLoading ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner` }`}><p className="drop-shadow-lg">{!isLoading ? (notifMessage ? notifMessage : 'Add New Equipment') : <Spinner/>}</p></button>
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
 
export default EquipmentForm;