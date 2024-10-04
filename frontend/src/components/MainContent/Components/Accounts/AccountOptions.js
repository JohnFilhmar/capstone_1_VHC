import { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { colorTheme } from "../../../../App";

const AccountOptions = ({ AOref, close }) => {
  const [payload, setPayload] = useState({
    access_appointments: {
      access: false,
      view: false,
      add_appointment: false,
      options: false,
    },
    access_queues: {
      access: false,
      add_queue: false,
      view_attended: false,
      next: false,
    },
    access_records: {
      access: false,
      import: false,
      add_record: false,
      search: false,
      options: false,
    },
    access_pharmacy: {
      access: false,
      import: false,
      add_record: false,
      search: false,
      options: false,
    },
    access_equipments: {
      access: false,
      import: false,
      add_record: false,
      search: false,
      options: false,
    },
    access_blood: {
      access: false,
      import: false,
      add_record: false,
      search: false,
      options: false,
    },
    access_accounts: {
      access: false,
      import: false,
      add_record: false,
      search: false,
      options: false,
    }
  });

  useEffect(() => {
    // set payload to initial accessibility settings from the database
  }, []);

  async function handleSubmit() {
    console.log(payload);
    handleClose();
  };

  async function handleClose() {
    setPayload({
      access_appointments: {
        access: false,
        view: false,
        add_appointment: false,
        options: false,
      },
      access_queues: {
        access: false,
        add_queue: false,
        view_attended: false,
        next: false,
      },
      access_records: {
        access: false,
        import: false,
        add_record: false,
        search: false,
        options: false,
      },
      access_pharmacy: {
        access: false,
        import: false,
        add_record: false,
        search: false,
        options: false,
      },
      access_equipments: {
        access: false,
        import: false,
        add_record: false,
        search: false,
        options: false,
      },
      access_blood: {
        access: false,
        import: false,
        add_record: false,
        search: false,
        options: false,
      },
      access_accounts: {
        access: false,
        import: false,
        add_record: false,
        search: false,
        options: false,
      }
    });
    close();
  };
  
  const Accessibility = ({ name, access_name }) => {
    return (
      <>
      <p className={`font-bold text-sm md:text-base lg:text-lg text-${selectedTheme}-800`}>{name}</p>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 border-[1px] border-${selectedTheme}-800 rounded-md`}>
        {Object.entries(payload[access_name]).map(([key, val], i) => (
          <div key={i} className={`p-2`}>
            <label htmlFor={key} className={`flex gap-1 justify-start items-center font-semibold text-${selectedTheme}-800`}>
              <input
                type="checkbox" 
                checked={val}
                onChange={() => setPayload(prev => ({ ...prev, [access_name]: { ...prev[access_name], [key]: !val } }))}
                name={key}
                className="rounded-md size-8"
              />
              <span>{key.substring(0, 1).toUpperCase() + key.substring(1)}</span>
            </label>
          </div>
        ))}
      </div>
      </>
    )
  }
  
  const [selectedTheme] = useContext(colorTheme);
  return (
    <dialog ref={AOref} className='relative text-xs md:text-sm lg:text-base rounded-lg drop-shadow-lg z-52'>
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}>
          <div className="flex items-center p-1 gap-1">
            <RiUserSettingsFill className='w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8' />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">User Account Options</strong>
          </div>
          <button onClick={() => handleClose()} className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}>
            <MdClose className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' />
          </button>
        </div>
        <div className={`p-2 flex flex-col gap-3 max-h-96 overflow-y-auto`}>
          <Accessibility name={"Appointments"} access_name={"access_appointments"} />
          <Accessibility name={"Queue"} access_name={"access_queues"}/>
          <Accessibility name={"Records"} access_name={"access_records"}/>
          <Accessibility name={"Pharmacy"} access_name={"access_pharmacy"}/>
          <Accessibility name={"Equipments"} access_name={"access_equipments"}/>
          <Accessibility name={"Blood Units"} access_name={"access_blood"}/>
          <Accessibility name={"Accounts"} access_name={"access_accounts"}/>
          <button onClick={() => handleSubmit()} className={`w-full font-bold rounded-md p-2 bg-${selectedTheme}-800 text-${selectedTheme}-200 hover:bg-${selectedTheme}-700 hover:text-${selectedTheme}-100 active:bg-${selectedTheme}-200 active:text-${selectedTheme}-800 active:shadow-inner`}>Apply Options</button>
        </div>
      </div>
    </dialog>
  );
}
 
export default AccountOptions;