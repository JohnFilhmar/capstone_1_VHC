import { useContext, useState } from "react";
import { MdClose } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { colorTheme } from "../../../../App";
import DataTable from "../Elements/DataTable";
import useQuery from "../../../../hooks/useQuery";
import useCurrentTime from "../../../../hooks/useCurrentTime";
import { Spinner } from "flowbite-react";

const AccountOptions = ({ AOref, close, id, payload, setPayload }) => {
  const [accessibilityOptionsVisibility, setAccessibilityOptionsVisibility] = useState(true);
  const { editData, isLoading } = useQuery();
  const {mysqlTime} = useCurrentTime();

  async function handleSubmit() {
    if (id) {
      await editData("updateAccessibilities", id, {payload: payload, dateTime: mysqlTime});
    }
  };

  async function handleClose() {
    setAccessibilityOptionsVisibility(true);
    setPayload(null);
    close();
  };
  
  const Accessibility = ({ name, access_name }) => {
    return (
      <div className="flex flex-col justify-start items-start gap-1">
        <p className={`font-bold text-sm md:text-base lg:text-lg text-${selectedTheme}-800`}>{name}</p>
        <div
          className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 border-[1px] border-${selectedTheme}-800 rounded-md`}
        >
          {payload?.[access_name] &&
            Object.entries(payload[access_name]).map(([key, val], i) => (
              <div key={i} className="p-2">
                <label
                  htmlFor={key}
                  className={`flex gap-1 justify-start items-center font-semibold text-${selectedTheme}-800`}
                >
                  <input
                    type="checkbox"
                    checked={!!val}
                    onChange={() =>
                      setPayload((prev) => ({
                        ...prev,
                        [access_name]: {
                          ...prev[access_name],
                          [key]: !val,
                        },
                      }))
                    }
                    name={key}
                    className="rounded-md size-5"
                  />
                  <span>
                    {key
                      .replace('_', ' ')
                      .replace(/\b\w/g, (match) => match.toUpperCase())}
                  </span>
                </label>
              </div>
            ))}
        </div>
      </div>
    );
  };  
  
  const [selectedTheme] = useContext(colorTheme);
  return (
    <dialog ref={AOref} className='relative text-xs md:text-sm lg:text-base rounded-lg drop-shadow-lg z-52 w-[80vw] max-h-[90vh] overflow-y-auto'>
      <div className="flex flex-col text-xs md:text-sm lg:text-base p-2">
        <div className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}>
          <div className="flex items-center p-1 gap-1">
            <RiUserSettingsFill className='w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8' />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">User Account Options</strong>
          </div>
          <button onClick={() => handleClose()} className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}>
            <MdClose className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <button onClick={() => setAccessibilityOptionsVisibility(prev => !prev)} className={`m-2 font-bold rounded-md p-2 bg-${selectedTheme}-800 text-${selectedTheme}-200 hover:bg-${selectedTheme}-700 hover:text-${selectedTheme}-100 active:bg-${selectedTheme}-200 active:text-${selectedTheme}-800 active:shadow-inner`}>Edit User Accessibility</button>
            <div className={`p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ${accessibilityOptionsVisibility && 'hidden'}`}>
              <Accessibility name={"Announcements"} access_name={"access_announcements"} />
              <Accessibility name={"Appointments"} access_name={"access_appointments"} />
              <Accessibility name={"Queue"} access_name={"access_queues"}/>
              <Accessibility name={"Records"} access_name={"access_records"}/>
              <Accessibility name={"Historical Data"} access_name={"access_historical_data"}/>
              <Accessibility name={"Pharmacy"} access_name={"access_pharmacy"}/>
              <Accessibility name={"Equipments"} access_name={"access_equipments"}/>
              <Accessibility name={"Blood Units"} access_name={"access_blood"}/>
              <div className="col-span-1 md:col-span2 lg:col-span-3 self-end justify-self-end">
              <button disabled={isLoading} onClick={() => handleSubmit()} className={`font-bold rounded-md p-2 bg-${selectedTheme}-800 text-${selectedTheme}-200 hover:bg-${selectedTheme}-700 hover:text-${selectedTheme}-100 active:bg-${selectedTheme}-200 active:text-${selectedTheme}-800 active:shadow-inner`}>{isLoading ? <Spinner /> : 'Apply Options'}</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start p-2 gap-2">
          <p className={`font-bold text-base md:text-lg lg:text-xl text-${selectedTheme}-800 w-full p-2`}>User Account History/Logs</p>
            <DataTable
              data={[]}
              enAdd={false}
              isLoading={false}
              error={null}
              enOptions={false}
              enExport={false}
            />
        </div>
      </div>
    </dialog>
  );
};
 
export default AccountOptions;