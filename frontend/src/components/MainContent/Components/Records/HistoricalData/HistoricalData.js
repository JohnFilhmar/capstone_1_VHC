import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useQuery from "../../../../../hooks/useQuery";
import useSocket from "../../../../../hooks/useSocket";
import DataTable from "../../Elements/DataTable";
import Header from "../../../Header";
import { MdHistoryEdu } from "react-icons/md";
import ClinicRecordPreview from "./ClinicRecordPreview";

const HistoricalData = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const recordPreviewRef = useRef(null);
  const [isClinicRecordPreviewOpen, setIsClinicRecordPreviewOpen] = useState(false);
  const [recordId, setRecordId] = useState(null);

  const { error } = useQuery();

  const { data: records, loading } = useSocket({
    fetchUrl: "getHistoricalData",
    newDataSocket: "historicalDataSocket",
    errorDataSocket: "recordSocketError",
  });

  const toggleOptions = (recId) => {
    setRecordId(recId);
    if (!isClinicRecordPreviewOpen) {
      setIsClinicRecordPreviewOpen(true);
      recordPreviewRef.current.showModal();
    } else {
      setIsClinicRecordPreviewOpen(false);
      recordPreviewRef.current.close();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<MdHistoryEdu />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable
            data={records}
            enAdd={false}
            modalForm={pathname}
            isLoading={loading}
            toggleOption={toggleOptions}
            optionPK={records.length > 0 && Object.keys(records[0])[0]}
            error={error}
            importTableName={
              pathname.charAt(0).toUpperCase() + pathname.slice(1)
            }
            enExport={false}
          />
        </div>
      </div>
      <ClinicRecordPreview
        recordPrevRef={recordPreviewRef}
        toggle={toggleOptions}
        record_id={recordId}
      />
    </div>
  );
};

export default HistoricalData;
