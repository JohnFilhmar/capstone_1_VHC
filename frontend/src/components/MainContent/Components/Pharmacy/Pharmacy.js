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

  const { data: medicines, loading } = useSocket({
    fetchUrl: "getPharmacyInventory",
    newDataSocket: "pharmacySocket",
    errorDataSocket: "pharmacySocketError",
  });

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
        <div onClick={() => socket.emit("updatePharmacy")}>
          <Header title={title} icon={<MdLocalPharmacy />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable
            data={medicines}
            modalForm={pathname}
            isLoading={loading}
            toggleOption={toggleOptions}
            optionPK={medicines.length > 0 && Object.keys(medicines[0])[0]}
            error={error}
            enImport={true}
            importUrlDestination={"submitCSVMedicinesRecord"}
            importTableName={
              pathname.charAt(0).toUpperCase() + pathname.slice(1)
            }
            enExport={true}
            exportSheetName={"Pharmacy Inventory"}
            exportFileName={"Pharmacy_Inventory_Data"}
          />
        </div>
      </div>
      <PharmacyAudit
        productRef={productAuditRef}
        toggle={toggleOptions}
        itemId={itemId}
        data={medicines}
      />
    </div>
  );
};

export default Pharmacy;
