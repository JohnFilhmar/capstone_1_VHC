import { useContext, useEffect, useRef, useState } from "react";
import { MdSearch, MdOutlineChevronLeft, MdOutlineChevronRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight, MdArrowDropUp, MdInfo, MdKeyboardArrowUp } from "react-icons/md";
import { TbFileExport } from "react-icons/tb";
import FormModal from "./FormModal";
import { colorTheme } from "../../../../App";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DataTable = ({ data, importTableName, modalForm, enAdd = true, enImport = false, enSearch = true, enExport = true, isLoading = true, enOptions = true, toggleOption, optionPK, error, exportSheetName, exportFileName }) => {
  const [selectedTheme] = useContext(colorTheme);
  const [move, setMove] = useState(false);
  const [query, setQuery] = useState('');
  const [CurrentPage, setCurrentPage] = useState(1);
  const [Pages, setPages] = useState(0);
  const [rowCount, setRowCount] = useState(10);
  const [sortedData, setSortedData] = useState([]);
  const inputRef = useRef(null);
  const formModalRef = useRef(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState('');
  const [sortState, setSortState] = useState(
    data && data.length && Object.keys(data[0]).reduce((acc, field) => {
      acc[field] = false;
      return acc;
    }, {})
  );

  useEffect(() => {
    if (data && !isLoading) {
      setSortedData(data);
    }
  }, [data, isLoading]);

  const setSearchFocus = () => {
    if(!move){
      const onAnimEnd = setTimeout(() => {
        inputRef.current.focus();
      }, 500);
      return () => {
        clearTimeout(onAnimEnd);
      };
    }
  }
  const searchTable = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  }
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'KeyK' && event.ctrlKey) {
        event.preventDefault();
        setQuery('');
        setMove((prev) => !prev);
        setSearchFocus();
      }
    }; 
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const sortedRecord = (column, order) => {
    return data?.slice().sort((a, b) => {
      const valA = (a[column] ? a[column].toString().toLowerCase() : '');
      const valB = (b[column] ? b[column].toString().toLowerCase() : '');
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return order === 'asc' ? numA - numB : numB - numA;
      } else {
        if (order === 'asc') {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      }
    });
  };
  
  const handleSorting = (field) => {
    setSortState((prev) => {
      const newState = {};
      for (const key in prev) {
        newState[key] = false;
      }
      newState[field] = !prev[field];
      return newState;
    });
    const order = sortState[field] ? 'desc' : 'asc';
    setSortedData(sortedRecord(field, order));
  }; 

  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((col) =>
      typeof(col) === 'string' &&
      col.match(/[a-zA-Z]/) &&
      col.toString().toLowerCase().includes(query.toLowerCase()) &&
      col.toString().toLowerCase().startsWith(query.toLowerCase())
    )
  );

  useEffect(() => {
    const NumOfPages = Math.ceil(filteredData.length / rowCount);
    setPages(NumOfPages);
  }, [query, filteredData, rowCount]);

  const toggleForm = ( type ) => {
    if (!isFormOpen) {
      setFormType(type);
      formModalRef.current.showModal();
      setIsFormOpen(true);
    } else {
      formModalRef.current.close();
      setIsFormOpen(false);
    }
  }
  
  const displayedData = filteredData.slice((CurrentPage - 1) * rowCount, CurrentPage * rowCount);
  
  function handleExport() {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, exportSheetName);
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${exportFileName}.xlsx`);
  }

  const Header = ({ top }) => (
    !(data && data.length > 0) ? (
      <>
      <tr className={`flex flex-row justify-center text-center items-center bg-${selectedTheme}-300 ${top ? 'rounded-tl-lg rounded-tr-lg' : 'rounded-bl-lg rounded-br-lg'}`}></tr>
      </>
    ) : (
      <tr className={`flex flex-row justify-between items-center bg-${selectedTheme}-300 ${top ? 'rounded-tl-lg rounded-tr-lg' : 'rounded-bl-lg rounded-br-lg'}`}>
        {Object.keys(data[0]).map((field, fieldi) => (
          <th key={fieldi} className="w-full p-1 md:p-[0.35rem] lg:p-[0.45rem] text-center flex justify-center items-center">
            <button
              onClick={() => handleSorting(field)}
              className="flex flex-row justify-center items-center"
            >
              <p>{field}</p>
              {top && (
                <p>
                  <MdArrowDropUp className={`w-6 h-6 text-${selectedTheme}-600 ${sortState[field] ? 'rotate-180' : ''}`} />
                </p>
              )}
            </button>
          </th>
        ))}
        {top && enOptions && (
          <th className="w-full p-2 text-center flex justify-center items-center">{error ? error : 'Actions'}</th>
        )}
      </tr>
    )
  );
  
  if (isLoading) {
    return (
      <div className={`flex flex-col gap-3 w-full animate-pulse ease-linear drop-shadow-md`}>
        <div className="flex justify-between m-2 md:m-3 lg:m-4">
          <div className="flex justify-between items-center gap-3">
            <div className={`bg-${selectedTheme}-400 rounded-lg h-6 md:h-8 lg:h-10 w-24 md:w-26 lg:w-28`}></div>
          </div>
          <div className={`bg-${selectedTheme}-400 rounded-lg h-6 md:h-8 lg:h-10 w-24 md:w-26 lg:w-28`}></div>
        </div>
        <div className={`bg-${selectedTheme}-400 rounded-lg h-[600px]`}></div>
        <div className="flex justify-between items-center">
          <div className={`bg-${selectedTheme}-400 rounded-lg w-16 md:w-18 lg:w-20 h-6 md:h-8 lg:h-10`}></div>
          <div className={`bg-${selectedTheme}-400 rounded-lg w-26 md:w-28 lg:w-32 h-6 md:h-8 lg:h-10`}></div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <div className="flex justify-between items-center p-1 overflow-hidden text-xxs md:text-xs lg:text-sm">
          <div className="flex justify-start items-center gap-1 md:gap-2 lg:gap-3">
            {enImport && (
              <button 
                className={`whitespace-nowrap font-semibold ${!error ? `text-${selectedTheme}-50 bg-${selectedTheme}-600 drop-shadow-md` : `text-${selectedTheme}-600 bg-${selectedTheme}-200 shadow-inner`} rounded-lg p-1 md:p-1 lg:p-2`}
                onClick={() => toggleForm("import")}
                disabled={error}
              >
                <p className={`font-bold text-${selectedTheme}-100 flex items-center`}>Import <span className="hidden md:block lg:block">File</span></p>
              </button>
            )}
            {enAdd && (
              <button 
                className={`whitespace-nowrap font-semibold ${!error ? `text-${selectedTheme}-50 bg-${selectedTheme}-600 drop-shadow-md` : `text-${selectedTheme}-600 bg-${selectedTheme}-200 shadow-inner`} rounded-lg p-1 md:p-1 lg:p-2`}
                onClick={() => toggleForm(modalForm)}
                disabled={error}
              >
                <p className={`font-bold text-${selectedTheme}-100`}>Add</p>
              </button>
            )}
            <div className={`flex items-center gap-1 rounded-md bg-${selectedTheme}-200 p-1 md:p-1 lg:p-2 drop-shadow-md`}>
              <p className={`block text-${selectedTheme}-800 font-bold`}>Rows</p>
              <button disabled={data?.length === 0} onClick={() => setRowCount(prev => prev > 3 && ++prev)} className={`flex items-center rounded-sm bg-${selectedTheme}-800 text-${selectedTheme}-200 drop-shadow-md border-0 p-0 md:p-1 lg:p-1`}>
                <MdKeyboardArrowUp />
              </button>
              <p className={`text-${selectedTheme}-800 font-bold`}>{rowCount}</p>
              <button disabled={data?.length === 0} onClick={() => setRowCount(prev => prev > 3 && --prev)} className={`flex items-center rounded-sm bg-${selectedTheme}-800 text-${selectedTheme}-200 drop-shadow-md border-0 p-0 md:p-1 lg:p-1`}>
                <MdKeyboardArrowUp className="rotate-180" />
              </button>
            </div>
          </div>
          {enSearch && (
            <div className={`block`}>
              <div className="flex items-center justify-start">
                <button
                  onClick={() => {
                    setQuery(''); 
                    setSearchFocus();
                  }}
                  className={`text-${selectedTheme}-500 hover:text-${selectedTheme}-600`}
                >
                  <MdSearch className="size-6 hidden md:block lg:block" />
                </button>
                <input
                  id="tablesearch"
                  ref={inputRef}
                  type="text"
                  placeholder="Search here"
                  value={query}
                  onChange={(e) => searchTable(e)}
                  className={`w-20 md:w-28 lg:w-36 rounded-md bg-${selectedTheme}-50 text-${selectedTheme}-800 font-semibold border-2 p-1 text-xxs md:text-xs lg:text-sm`}
                />
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto drop-shadow-lg text-xxs md:text-xs lg:text-sm">
          <table 
            className="font-table table-auto w-full rounded-lg text-slate-700" 
          >
            <thead className="font-bold text-xxs md:text-xs lg:text-sm">
            {data && (
              <Header top={true} />
            )}
            </thead>
            <tbody className={`divide-y-2 divide-transparent`}>
              {data && data.length > 0 && (
                <>
                  {displayedData.map((row, rowi) => (
                    <tr
                      key={rowi}
                      className={`flex flex-row justify-between items-center bg-${selectedTheme}-200 divide-x-2 divide-transparent hover:bg-${selectedTheme}-50`}
                    >
                      {Object.values(row).map((col, coli) => (
                        <td key={coli} className={`w-full p-2 font-semibold whitespace-nowrap overflow-hidden hover:overflow-visible hover:bg-${selectedTheme}-50 hover:text-gray-900 hover:drop-shadow-md hover:rounded-md transition-colors duration-300 hover:px-2`}>
                          {col}
                        </td>
                      ))}
                      {enOptions && (
                      <td className="w-full p-2 flex items-center justify-center">
                        <button 
                          className={`font-semibold text-${selectedTheme}-500 hover:text-${selectedTheme}-600 hover:underline`}
                          onClick={() => toggleOption(row[`${optionPK}`]) }
                        >
                          Options
                        </button>
                      </td>
                      )}
                    </tr>
                  ))}
                  {Array.from({ length: Math.max(rowCount - displayedData.length, 0) }).map((_, rowIndex) => (
                    <tr
                      key={`empty-row-${rowIndex}`}
                      className={`flex flex-row justify-between items-center bg-${selectedTheme}-300 divide-x-2 divide-transparent`}
                    >
                      {Object.keys(data[0]).map((_, colIndex) => (
                        <td key={`empty-col-${colIndex}`} className="w-full p-2 text-transparent"> </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
              {data && data.length === 0 && (
               <tr>
                 <td className={`flex justify-center items-center text-center bg-${selectedTheme}-300 rounded-md h-[39rem] p-2 font-bold`}>
                   <MdInfo className="size-6 md:size-7 lg:size-8"/>
                   <p>Table is empty. Add new data.</p>
                 </td>
               </tr>
              )}
              {error && (
                <>
                  {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <tr
                      key={`empty-row-${rowIndex}`}
                      className={`flex flex-row justify-between items-center bg-${selectedTheme}-300 divide-x-2 divide-transparent`}
                    >
                      {Array.from({ length: rowCount }).map((_, colIndex) => (
                        <td key={`empty-col-${colIndex}`} className="w-full p-2 text-transparent"> </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-between items-center mt-1 text-xxs md:text-xs lg:text-sm">
          <div className="flex justify-evenly items-center">
            {enExport && (
              <button onClick={() => handleExport()} className={`flex gap-2 p-1 px-3 items-center justify-center bg-${selectedTheme}-200 text-${selectedTheme}-600 font-semibold rounded-lg hover:text-${selectedTheme}-700 hover:transition-transform ease-in-out`}>Export to file<TbFileExport className="size-3 md:size-3 lg:size-4"/></button>
            )}
          </div>
          <div className={`flex flex-row text-md font-semibold p-1 m-1 bg-${selectedTheme}-200 rounded-lg`}>
            <button disabled={CurrentPage <= 2} onClick={() => setCurrentPage((prev) => prev - 2)} className={`text-${selectedTheme}-600 hover:text-${selectedTheme}-700 hover:transition-transform ease-in-out hover:scale-150`}>
              <MdOutlineKeyboardDoubleArrowLeft />
            </button>
            <button disabled={CurrentPage <= 1} onClick={() => setCurrentPage((prev) => prev - 1)} className={`text-${selectedTheme}-600 hover:text-${selectedTheme}-700 hover:transition-transform ease-in-out hover:scale-150`}>
              <MdOutlineChevronLeft />
            </button>
            <p className="flex mx-1">
              {CurrentPage} <span className="hidden md:block lg:block"> of{Pages}</span>
            </p>
            <button disabled={CurrentPage >= Pages} onClick={() => setCurrentPage((prev) => prev + 1)} className={`text-${selectedTheme}-600 hover:text-${selectedTheme}-700 hover:transition-transform ease-in-out hover:scale-150`}>
              <MdOutlineChevronRight />
            </button>
            <button disabled={CurrentPage >= Pages - 1} onClick={() => setCurrentPage((prev) => prev + 2)} className={`text-${selectedTheme}-600 hover:text-${selectedTheme}-700 hover:transition-transform ease-in-out hover:scale-150`}>
              <MdOutlineKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
        <FormModal formRef={formModalRef} toggleForm={toggleForm} formType={formType} importTableName={importTableName} />
      </>
    );
  }
};

export default DataTable;
