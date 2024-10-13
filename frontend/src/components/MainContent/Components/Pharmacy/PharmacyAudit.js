import { useContext, useEffect, useState } from "react";
import { colorTheme, notificationMessage } from "../../../../App";

import { MdClose } from "react-icons/md";
import { RiMedicineBottleFill } from "react-icons/ri";
import useQuery from "../../../../hooks/useQuery";
import { Spinner } from "flowbite-react";
import DataTable from "../Elements/DataTable";
import axios from "axios";
import { BiSolidTrashAlt } from "react-icons/bi";
import api from "../../../../axios";
import useCurrentTime from "../../../../hooks/useCurrentTime";

const PharmacyAudit = ({ productRef, toggle, itemId, data }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [notifMessage] = useContext(notificationMessage);
  const { mysqlTime } = useCurrentTime();
  const { searchResults, isLoading, error, searchData, deleteData, postData } = useQuery();
  const [toEdit, setToEdit] = useState(false);
  const [productLogs, setProductLogs] = useState(null);
  const [apiResults, setApiResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [payload, setPayload] = useState({
    itemName: '',
    itemStrength: '',
    quantity: '',
    container: '',
    lotNo: '',
    expiry: '',
    stockroom: ''
  });

  async function getLogs() {
    if (itemId) {
      await searchData('getProductLogs', itemId);
    }
    const selectedProduct = data.find(prev => prev['Item Id'] === itemId);
    if (selectedProduct) {
      setPayload({
        itemName: selectedProduct['Item Name'] || '',
        itemStrength: selectedProduct['Item Strength'] || '',
        quantity: selectedProduct['Quantity'] || '',
        container: selectedProduct['Container Type'] || '',
        lotNo: selectedProduct['Lot No'] || '',
        expiry: selectedProduct['Exp Date'] || '',
        stockroom: selectedProduct['Quantity Stockroom'] || ''
      });
    }
  };
  useEffect(() => {
    getLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);
  useEffect(() => {
    setProductLogs(searchResults?.data || []);
  },[searchResults]);

  function handleChange(e) {
    const { name, value } = e.target;
    setPayload(prev => {
      if (prev[name] !== value) {
        return {
          ...prev,
          [name]: value 
        };
      }
      return prev;
    });
  }

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${query}&ef=STRENGTHS_AND_FORMS`);
      if (response?.data) {
        setApiResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching drug suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    let time;
    if ((!payload.itemStrength || strengths.length === 0) && toEdit) {
      if (payload.itemName.length > 4) {
        time = setTimeout(() => {
          fetchSuggestions(payload.itemName);
        }, 1000);
      } else {
        setSuggestions([]);
      }
      if (payload.itemName.length === 0) {
        setStrengths([]);
        setPayload(prev => ({ ...prev, itemStrength: '' }));
      }
    }
    return () => clearTimeout(time);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.itemName]);

  useEffect(() => {
    if (apiResults) {
      if (apiResults[3].length > 1) {
        const suggs = apiResults[3];
        setSuggestions(suggs);
      } else if (apiResults[3].length === 1) {
        setPayload(prev => ({ ...prev, itemName: apiResults[3][0][0] }));
        setPayload(prev => ({ ...prev, itemStrength: apiResults[2].STRENGTHS_AND_FORMS[0][0] }));
      } else {
        setSuggestions([]);
        setStrengths([]);
      }
    }
  }, [apiResults]);
  
  function handleClose() {
    toggle();
    setPayload({
      itemName: '',
      itemStrength: '',
      quantity: '',
      container: '',
      lotNo: '',
      expiry: '',
      stockroom: ''
    });
    setToEdit(false);
  };
  function handleToggleEdit(e) {
    e.preventDefault();
    setToEdit(prev => !prev);
    const selectedProduct = data.find(prev => prev['Item Id'] === itemId);
    if (selectedProduct) {
      setPayload({
        itemName: selectedProduct['Item Name'] || '',
        itemStrength: selectedProduct['Item Strength'] || '',
        quantity: selectedProduct['Quantity'] || '',
        container: selectedProduct['Container Type'] || '',
        lotNo: selectedProduct['Lot No'] || '',
        expiry: selectedProduct['Exp Date'] || '',
        stockroom: selectedProduct['Quantity Stockroom'] || ''
      });
    }
  };
  async function handelDeleteMedicine(e) {
    e.preventDefault();
    await deleteData('handleDeleteMedicine', itemId);
    handleClose();
  };
  
  function handleSelectMedicine(medicine, i) {
    setPayload(prev => ({ ...prev, itemName: medicine[0] }));
    if (apiResults[2].STRENGTHS_AND_FORMS[i].length > 1) {
      setStrengths(apiResults[2].STRENGTHS_AND_FORMS[i]);
    } else {
      setPayload(prev => ({ ...prev, itemStrength: apiResults[2].STRENGTHS_AND_FORMS[i][0] }))
    }
    setSuggestions([]);
  };

  function handleSelectStrength(strength) {
    setPayload(prev => ({ ...prev, itemStrength: strength}));
    setStrengths([]);
  }; 

  async function handleSubmit(e) {
    e.preventDefault();
    const exp = new Date(payload.expiry);
    const newExpiry = `${exp.getFullYear()}-${String(exp.getMonth() + 1).padStart('0', 2)}-${String(exp.getDate()).padStart('0', 2)}`;

    const res = await api.get('/getStaffId');
    if (res?.status === 200) {
      const newPayload ={
        ...payload,
        itemId,
        expiry: newExpiry,
        staff_id: res.data.staff_id,
        dateTime: String(mysqlTime)
      };
      await postData('updateMedicine', newPayload);
      handleClose();
    }
  };
  
  return (
    <dialog ref={productRef} className={`rounded-lg bg-${selectedTheme}-100 drop-shadow-lg w-full md:w-[80vw] lg:w-[70vw] h-[80vh] max-h-[80vh] overflow-y-auto`}>
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}>
          <div className="flex items-center p-1 gap-1">
            <RiMedicineBottleFill className='w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8' />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">Product</strong>
          </div>
          <button 
            onClick={() => handleClose()}
            className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}>
            <MdClose className='w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2 px-4 w-full">
          <div className="flex justify-between p-2 items-center">
            <p className={`font-bold text-base md:text-lg lg:text-xl text-${selectedTheme}-800`}>{toEdit ? 'Update Product' : 'Product Details'}</p>
            <div className="flex gap-2 justify-end items-center">
              <button 
                onClick={(e) => handleToggleEdit(e)}
                className={`font-semibold p-2 rounded-md transition-colors duration-200 ${!toEdit ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600` : `text-red-200 bg-red-800 shadow-inner` }`}>
                {toEdit ? 'Cancel Edit' : 'Edit Product'}
              </button>
              <button 
                onClick={(e) => handelDeleteMedicine(e)}
                className={`font-semibold p-2 rounded-md transition-colors duration-200 text-red-100 bg-red-700 hover:drop-shadow-md hover:bg-red-800 focus:bg-red-600 active:bg-red-300 active:text-red-600 active:shadow-inner active:ring-2 active:ring-red-600`}>
                <BiSolidTrashAlt className="size-4 md:size-5 lg:size-6" />
              </button>
            </div>
          </div>
          <div className='flex flex-col md:flex-row lg:flex-row justify-start items-start md:items-center lg:items-center gap-2 w-full p-2'>
            <div className="block">
              <label htmlFor="itemName" className='text-xs md:text-sm lg:text-base font-semibold text-nowrap'>Item Name:</label>
            </div>
            <div className="relative w-full basis-1/2">
              <input 
                disabled={!toEdit}
                type="text" 
                id="itemName" 
                name="itemName"
                placeholder="Enter item name. . . . ." 
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={payload.itemName}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul
                  className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                  style={{ top: '100%' }}
                >
                  {suggestions.map((suggestion, i) => (
                    <li
                      key={i}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSelectMedicine(suggestion, i)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="relative w-full basis-1/2">
              <input 
                disabled={!toEdit}
                type="text" 
                id="itemStrength" 
                name="itemStrength"
                placeholder="Select or input strength. . . . ." 
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={payload.itemStrength}
                onChange={handleChange}
                required
                autoComplete="off"
              />
              {strengths.length > 0 && (
                <ul 
                  className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                  style={{ top: '100%' }}
                >
                  {strengths.map((strength, i) => (
                    <li
                      key={i}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => handleSelectStrength(strength)}
                    >
                      {strength}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className='p-2 flex gap-1 w-full'>
            <div>
              <div className="mb-2 block">
                <label htmlFor="quantity" className='text-xs md:text-sm lg:text-base font-semibold'>Quantity:</label>
              </div>
              <input 
                disabled={!toEdit}
                type="number" 
                id="quantity" 
                name="quantity"
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={payload.quantity}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <label htmlFor="container" className='text-xs md:text-sm lg:text-base font-semibold'>Container Type:</label>
              </div>
              <input 
                disabled={!toEdit}
                type="text" 
                id="container" 
                name="container"
                placeholder="Enter container type. . . . ."
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={payload.container}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>
            <div className='grow'>
              <div className="mb-2 block">
                <label htmlFor="lotNo" className='text-xs md:text-sm lg:text-base font-semibold'>Lot. No:</label>
              </div>
              <input 
                disabled={!toEdit}
                type="text" 
                id="lotNo" 
                name="lotNo"
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={payload.lotNo}
                onChange={handleChange}
                required
                maxLength={100}
              />
            </div>
          </div>
          <div className="p-2 flex gap-1 w-full">
            <div>
              <div className="mb-2 block">
                <label htmlFor="expiry" className='text-xs md:text-sm lg:text-base font-semibold'>Expiry Date:</label>
              </div>
              <input 
                disabled={!toEdit}
                type="date"
                id="expiry" 
                name="expiry"
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={String(payload.expiry ? new Date(payload.expiry).toISOString().split('T')[0] : '')} 
                onChange={handleChange}
                required
              />
            </div>
            <div className='grow'>
              <div className="mb-2 block">
                <label htmlFor="stockroom" className='text-xs md:text-sm lg:text-base font-semibold'>Quantity Stockroom:</label>
              </div>
              <input 
                disabled={!toEdit}
                type="text" 
                id="stockroom" 
                name="stockroom"
                placeholder="Enter quantity stockroom. . . . ."
                className={`text-xs md:text-sm lg:text-base rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800 disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-800 disabled:shadow-inner transition-colors`}
                value={payload.stockroom}
                onChange={handleChange}
                maxLength={100}
              />
            </div>
          </div>
          <button disabled={!toEdit || isLoading} type="submit" className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 
            ${!isLoading || toEdit ? 
              `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600 disabled:cursor-not-allowed disabled:bg-${selectedTheme}-300 disabled:text-${selectedTheme}-700 ` : 
              `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner`}`}>
              <p className="drop-shadow-lg">
                {!isLoading ? (notifMessage ? notifMessage : 'Update Item') : <Spinner/>}
              </p>
            </button>
        </form>
        <div className="flex flex-col justify-start p-2 gap-2">
          <p className={`font-bold text-base md:text-lg lg:text-xl text-${selectedTheme}-800 w-full p-2`}>Product History</p>
            <DataTable
              data={productLogs}
              enAdd={false}
              isLoading={isLoading}
              error={error}
              enOptions={false}
              enExport={false}
            />
        </div>
      </div>
    </dialog>
  )
}
 
export default PharmacyAudit;