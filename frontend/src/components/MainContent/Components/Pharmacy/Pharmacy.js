import { useLocation } from "react-router-dom";
import Header from "../../Header";
import DataTable from "../Elements/DataTable";
import { MdLocalPharmacy } from "react-icons/md";
import useQuery from "../../../../hooks/useQuery";
import { useRef, useState } from "react";
import PharmacyAudit from "./PharmacyAudit";
import useSocket from "../../../../hooks/useSocket";
import { socket } from "../../../../socket";

const Pharmacy = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const [isProductAuditOpen, setIsProductAuditOpen] = useState(false);
  const productAuditRef = useRef(null);
  const [itemId, setItemId] = useState(null);
  const { error } = useQuery();

  const { data: medicines, loading } = useSocket({ SSName: "sessionPharmacy", fetchUrl: "getPharmacyInventory", socketEmit: "updatePharmacy", socketUrl: "newPharmacy", socketError: "newPharmacyError" })

  // useEffect(() => {
  //   console.log(medicines);
  //   console.log(`socketloading : ${loading}`)
  //   console.log(`queyloading : ${isLoading}`)
  // }, [isLoading, loading]);
  
  const toggleOptions = (itemId) => {
    setItemId(itemId);
    if (!isProductAuditOpen) {
      setIsProductAuditOpen(true);
      productAuditRef.current.showModal();
    } else {
      setIsProductAuditOpen(false);
      productAuditRef.current.close();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div onClick={() => socket.emit('updatePharmacy')}>
          <Header title={ title } icon={<MdLocalPharmacy/>}/>
        </div>
        <div className="min-h-[80vh] h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable data={medicines} modalForm={pathname} isLoading={loading} toggleOption={toggleOptions} error={error} enImport={true} importUrlDestination={"submitCSVMedicinesRecord"} importTableName={pathname.charAt(0).toUpperCase() + pathname.slice(1)} />
        </div>
      </div>
      <PharmacyAudit recordAudit={productAuditRef} toggle={toggleOptions} itemId={itemId} />
    </div>
  );
}
 
export default Pharmacy;