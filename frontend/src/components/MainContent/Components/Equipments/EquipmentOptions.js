import { useContext, useEffect, useState } from "react";
import { colorTheme } from "../../../../App";

import { MdClose } from "react-icons/md";
import useQuery from "../../../../hooks/useQuery";
import DataTable from "../Elements/DataTable";
import { FaThermometer } from "react-icons/fa";
import DetailsAndBorrow from "./DetailsAndBorrow";

const EquipmentOptions = ({ equipmentRef, toggle, equipmentId, data }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { searchResults, isLoading, error, searchData } =
    useQuery();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [equipmentLogs, setEquipmentLogs] = useState([]);

  useEffect(() => {
    setSelectedEquipment(
      data.find((prev) => prev["Equipment Id"] === equipmentId)
    );
    if (equipmentId) {
      return async () => searchData("getEquipmentHistory", equipmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentId]);

  function convertKey(word) {
    const data = word.split('_');
    const newKey = data.map(dat => dat.charAt(0).toUpperCase() + dat.slice(1).toLowerCase());
    return newKey.join(' ');
  };
  function convertData(data) {
    const newData = data && data.map(obj => {
      const newObj = {};
      Object.keys(obj).forEach(key => {
        const newKey = convertKey(key);
        newObj[newKey] = obj[key];
      });
      return newObj;
    });
    return newData;
  };
  useEffect(() => {
    if (searchResults?.data) {
      setEquipmentLogs(convertData(searchResults.data));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults]);

  function handleClose() {
    setSelectedEquipment(null);
    toggle();
  }

  return (
    <dialog
      ref={equipmentRef}
      className={`rounded-lg bg-${selectedTheme}-100 drop-shadow-lg w-full md:w-[80vw] lg:w-[70vw] h-[80vh] max-h-[80vh] overflow-y-auto`}
    >
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div
          className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}
        >
          <div className="flex items-center p-1 gap-1">
            <FaThermometer className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">
              Equipments Logs and Borrow|Return
            </strong>
          </div>
          <button
            onClick={() => handleClose()}
            className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}
          >
            <MdClose className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          </button>
        </div>
        <DetailsAndBorrow selectedEquipment={selectedEquipment} equipmentId={equipmentId} handleClose={handleClose} />
        <div className="flex flex-col justify-start p-2 gap-2">
          <p
            className={`font-bold text-base md:text-lg lg:text-xl text-${selectedTheme}-800 w-full p-2`}
          >
            Equipment Logs and History
          </p>
          <DataTable
            data={equipmentLogs}
            enAdd={false}
            isLoading={isLoading}
            error={error}
            enOptions={false}
            enExport={false}
          />
        </div>
      </div>
    </dialog>
  );
};

export default EquipmentOptions;
