import { Checkbox, Spinner } from 'flowbite-react';
import { useContext, useState } from 'react';
import { colorTheme, notificationMessage } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import useCurrentTime from '../../../../../hooks/useCurrentTime';

const PharmacyForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { isLoading, error, addData } = useQuery();
  const { mysqlTime } = useCurrentTime();
  const [dontCloseUponSubmission, setDontCloseUponSubmission] = useState(false);
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);

  function handleSubmit(e) {
    e.preventDefault();
    if(!dontCloseUponSubmission) {
      close();
    }
  }
  
  return (
    <>
    {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24 w-[50vw]" onSubmit={handleSubmit}>
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
          />
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

export default PharmacyForm;
