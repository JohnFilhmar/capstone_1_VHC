import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { FaUsers } from "react-icons/fa";
import DataTable from "../Elements/DataTable";
import useSocket from "../../../../hooks/useSocket";
import { socket } from "../../../../socket";
import AccountOptions from "./AccountOptions";
import { useRef, useState } from "react";
import useQuery from "../../../../hooks/useQuery";

const Accounts = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const AccountOptionRef = useRef(null);
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState(false);
  const { error } = useQuery();

  const { data: records, loading } = useSocket({ SSName: "sessionStaff", fetchUrl: "getStaff", socketEmit: "updateStaff", socketUrl: "newStaff", socketError: "newStaffError" })

  const toggleOptions = () => {
    if (!isAccountOptionsOpen) {
      setIsAccountOptionsOpen(true);
      AccountOptionRef.current.showModal();
    } else {
      setIsAccountOptionsOpen(false);
      AccountOptionRef.current.close();
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div onClick={() => socket.emit("updateStaff")}>
          <Header title={ title } icon={<FaUsers />}/>
        </div>
        <div className="min-h-[80vh] h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col justify-start items-center gap-3">

            <div className="flex justify-between items-center w-full text-xs md:text-sm lg:text-base">
            
            </div>
            
            <div className={`w-full`}>
              <DataTable data={records} modalForm={pathname} isLoading={loading} error={error} enImport={false} enExport={false} toggleOption={toggleOptions} optionPK={records.length > 0 && Object.keys(records[0])[0]} />
            </div>

            <AccountOptions AOref={AccountOptionRef} close={toggleOptions} />

          </div>
        </div>
      </div>
    </div>
  );
}

export default Accounts;