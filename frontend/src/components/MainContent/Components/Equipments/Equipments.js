import { useLocation } from "react-router-dom";
import { FaThermometer } from "react-icons/fa";
import Header from "../../Header";
import DataTable from "../Elements/DataTable";
import useSocket from "../../../../hooks/useSocket";
import useQuery from "../../../../hooks/useQuery";
import { useRef, useState } from "react";
import EquipmentOptions from "./EquipmentOptions";

const Equipments = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const equipmentRef = useRef(null);
  const [isEquipmentOptionsOpen, setIsEquipmentOptionsOpen] = useState(false);
  const [equipmentId, setEquipmentId] = useState(null);

  const { error } = useQuery();

  const { data: equipments, loading } = useSocket({
    fetchUrl: "getEquipments",
    newDataSocket: "equipmentSocket",
    errorDataSocket: "equipmentSocketError"
  });

  const toggleOptions = (itemId) => {
    setEquipmentId(itemId);
    if (!isEquipmentOptionsOpen) {
      setIsEquipmentOptionsOpen(true);
      equipmentRef.current.showModal();
    } else {
      setIsEquipmentOptionsOpen(false);
      equipmentRef.current.close();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={ title } icon={<FaThermometer />}/>
        </div>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable
            data={equipments}
            modalForm={pathname}
            isLoading={loading}
            error={error}
            enImport={false}
            enExport={false}
            toggleOption={toggleOptions}
            optionPK={equipments.length > 0 && Object.keys(equipments[0])[0]}
            enOptions={true}
          />
        </div>
      </div>
      <EquipmentOptions
        toggle={toggleOptions}
        equipmentRef={equipmentRef}
        equipmentId={equipmentId}
        data={equipments}
      />
    </div>
  );
}

export default Equipments;