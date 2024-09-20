import { Spinner } from 'flowbite-react';
import { useContext, useRef, useState } from 'react';
import { colorTheme } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import * as XLSX from 'xlsx';
import useCurrentTime from '../../../../../hooks/useCurrentTime';

const PharmacyForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { isLoading, error, addData } = useQuery();
  const [data, setData] = useState(null);
  const fileRef = useRef(null);
  const { mysqlTime } = useCurrentTime();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd'
        });
        console.log(jsonData);
        setData(jsonData);
      });
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('SUBMITTED');
    const date_added = {};
    const payloadKey = String(mysqlTime);
    date_added[payloadKey] = "Date Added";
    const payload = {
      data,
      logs : date_added
    };
    console.log('HERE ARE YOUR ROWS', payload);
    // addData('submitCSVMedicinesRecord', payload);
    setData(null);
    close();
    fileRef.current.value = "";
  }
  
  return (
    <>
    {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24 w-[50vw]" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className={`p-2`}>
            <label htmlFor="philhealthnum" className={`block mb-2 text-${selectedTheme}-600 font-semibold`}>Philhealth Number:</label>
            <input
              type="text"
              id="philhealthnum"
              name="philhealthnum"
              placeholder="Enter your philheath number. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
            />
          </div>
        </div>
      </form>
    </>
  );
}

export default PharmacyForm;
