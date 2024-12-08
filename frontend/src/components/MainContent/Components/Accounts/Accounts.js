import { useLocation } from "react-router-dom";
import Header from "../../Header";
import { FaUsers } from "react-icons/fa";
import DataTable from "../Elements/DataTable";
import useSocket from "../../../../hooks/useSocket";
import AccountOptions from "./AccountOptions";
import { useEffect, useRef, useState } from "react";
import useQuery from "../../../../hooks/useQuery";

const Accounts = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const AccountOptionRef = useRef(null);
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState(false);
  const { error, searchData, searchResults } = useQuery();
  const [payload, setPayload] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const { data: records, loading } = useSocket({
    fetchUrl: "getStaff",
    newDataSocket: "staffSocket",
    errorDataSocket: "staffSocketError",
  });

  useEffect(() => {
    if (searchResults?.status === 200 && searchResults?.accessibilities) {
      setPayload(searchResults.accessibilities);
      console.log(searchResults.accessibilities);
    }
  }, [searchResults]);

  const toggleOptions = (id) => {
    if (!isAccountOptionsOpen) {
      setSelectedStaffId(id);
      searchData("searchAccessibilities", id);
      setIsAccountOptionsOpen(true);
      AccountOptionRef.current.showModal();
    } else {
      setSelectedStaffId(null);
      setIsAccountOptionsOpen(false);
      AccountOptionRef.current.close();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<FaUsers />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <div className="flex flex-col justify-start items-center gap-3">
            <div className="flex justify-between items-center w-full text-xs md:text-sm lg:text-base"></div>

            <div className={`w-full`}>
              <DataTable
                data={records}
                modalForm={pathname}
                isLoading={loading}
                error={error}
                enImport={false}
                enExport={false}
                enOptions={true}
                toggleOption={toggleOptions}
                optionPK={records.length > 0 && Object.keys(records[0])[0]}
              />
            </div>

            <AccountOptions
              AOref={AccountOptionRef}
              close={toggleOptions}
              id={selectedStaffId}
              payload={payload}
              setPayload={setPayload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
