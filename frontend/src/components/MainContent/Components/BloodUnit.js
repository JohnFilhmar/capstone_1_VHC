import { useLocation } from "react-router-dom";
import Header from "../Header";
import DataTable from "./Elements/DataTable";
import { BiSolidDonateBlood } from "react-icons/bi";

const BloodUnit = () => {
  const location = useLocation();
  const pathname = location.pathname.slice(1);
  const title = pathname.charAt(0).toUpperCase() + pathname.slice(1);
  const records = [];

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col p-2 mb-4 mx-2 md:mx-3 lg:mx-4 mt-4">
        <div>
          <Header title={ title } icon={ <BiSolidDonateBlood /> } />
        </div>
        <div className="min-h-[80vh] h-[80vh] overflow-y-auto scroll-smooth p-2 mt-2">
          <DataTable data={records} modalForm={pathname} enImport={false} />
        </div>
      </div>
    </div>
  );
}
 
export default BloodUnit;