import { Spinner } from 'flowbite-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { colorTheme } from '../../../../../App';
import useQuery from '../../../../../hooks/useQuery';
import * as XLSX from 'xlsx';
import useCurrentTime from '../../../../../hooks/useCurrentTime';
import api from '../../../../../axios';
import { socket } from '../../../../../socket';

const ImportFileForm = ({ close, children, tableName }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { response, isLoading, addData, fetchData } = useQuery();
  const [data, setData] = useState(null);
  const fileRef = useRef(null);
  const { mysqlTime } = useCurrentTime();

  useEffect(() => {
    fetchData(`/describe${tableName}`);
  // eslint-disable-next-line
  }, []);

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
        setData(jsonData);
      });
    };
    file && reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        const payload = {
          data,
          dateTime: mysqlTime,
          staff_id: res.data.staff_id
        };
        addData(`/handleFileUpload${tableName}`, payload);
        setData(null);
        close();
        fileRef.current.value = "";
        const time = setTimeout(() => {
          socket.emit('updatePharmacy')
        }, 5000);
        return () => clearTimeout(time);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
    <>
    {children}
      <form className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24" onSubmit={handleSubmit}>
        <div className='text-sm md:text-base lg:text-lg'>
          <div className="mb-2 block">
            <label htmlFor="firstname" className={`text-${selectedTheme}-800 font-bold`}>Import Excel File For {tableName}:</label>
          </div>
          <div className='py-2 my-2 text-xs md:text-sm lg:text-base p-4 bg-red-100 border border-red-300 rounded-md'>
            <div className='flex items-center mb-2'>
              <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 9v2m-6 6h12l-3-3H9l-3 3z"></path>
              </svg>
              <h2 className='text-red-500 font-semibold'>Required Columns for File</h2>
            </div>
            <p>Please ensure that your file includes the following columns:</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 font-semibold'>
              {response?.data?.map((dat, i) => (
                <div key={i} className="p-2 bg-white border rounded-lg shadow-md">
                  <p className="text-gray-700">{dat.Field}</p>
                  <p className="text-gray-500">{dat.Type}</p>
                </div>
              ))}
            </div>
          </div>
          <input 
            ref={fileRef}
            type="file" 
            required 
            className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg bg-transparent border-[1px] border-${selectedTheme}-800`}
            maxLength={50} 
            id="xlsxfile" 
            name='xlsxfile'
            onChange={handleFileUpload}
          />
        </div>
        <button disabled={isLoading} type="submit" className={`font-semibold p-2 rounded-md transition-colors duration-200 ${!isLoading ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner` }`}><p className="drop-shadow-lg">{!isLoading ? 'Add New Record' : <Spinner/>}</p></button>
      </form>
    </>
  );
}

export default ImportFileForm;
