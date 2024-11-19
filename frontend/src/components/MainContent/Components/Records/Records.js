import { useLocation } from "react-router-dom";
import Header from "../../Header";
import DataTable from "../Elements/DataTable";
import { MdFolder } from "react-icons/md";
import useQuery from "../../../../hooks/useQuery";
import { useRef, useState } from "react";
import RecordAudit from "./RecordAudit";
import useSocket from "../../../../hooks/useSocket";

const Records = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const recordAuditRef = useRef(null);
  const [isRecordAuditOpen, setIsRecordAuditOpen] = useState(false);
  const [famID, setFamID] = useState(null);

  const { error } = useQuery();

  const { data: records, loading } = useSocket({
    fetchUrl: "getRecords",
    newDataSocket: "recordSocket",
    errorDataSocket: "recordSocketError",
  });

  const toggleOptions = (familyId) => {
    setFamID(familyId);
    if (!isRecordAuditOpen) {
      setIsRecordAuditOpen(true);
      recordAuditRef.current.showModal();
    } else {
      setIsRecordAuditOpen(false);
      recordAuditRef.current.close();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={title} icon={<MdFolder />} />
        </div>
        <div className="min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh] h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable
            data={records}
            modalForm={pathname}
            isLoading={loading}
            toggleOption={toggleOptions}
            optionPK={records.length > 0 && Object.keys(records[0])[0]}
            error={error}
            enImport={true}
            importTableName={
              pathname.charAt(0).toUpperCase() + pathname.slice(1)
            }
            enExport={false}
          />
        </div>
      </div>
      <RecordAudit
        recordAudit={recordAuditRef}
        toggle={toggleOptions}
        family_id={famID}
      />
    </div>
  );
};

export default Records;
