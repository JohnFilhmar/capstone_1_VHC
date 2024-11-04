import { useLocation } from "react-router-dom";
import { FaThermometer } from "react-icons/fa";
import Header from "../../Header";
import DataTable from "../Elements/DataTable";
import useSocket from "../../../../hooks/useSocket";
import useQuery from "../../../../hooks/useQuery";

const Equipments = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);

  const { error } = useQuery();

  const { data: equipments, loading } = useSocket({
    fetchUrl: "getEquipments",
    newDataSocket: "equipmentSocket",
    errorDataSocket: "equipmentSocketError"
  });

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={ title } icon={<FaThermometer />}/>
        </div>
        <div className="min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable
            data={equipments}
            modalForm={pathname}
            isLoading={loading}
            error={error}
            enImport={false}
            enExport={false}
            enOptions={false}
          />
        </div>
      </div>
    </div>
  );
}

export default Equipments;