import { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import useCurrentTime from "../../../../hooks/useCurrentTime";
import { colorTheme } from "../../../../App";
import useQuery from "../../../../hooks/useQuery";
import { Spinner } from "flowbite-react";
import { socket } from "../../../../socket";

const DetailsAndBorrow = ({ selectedEquipment, equipmentId, handleClose, isBorrowFormVisible, isDetailsShown, setIsDetailsShown, setIsReturnVisible, isReturnVisible, toggleBorrowReturn, equipmentInUses }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { mysqlTime } = useCurrentTime();
  const { response, isLoading, error: queryError , postData, editData } = useQuery();
  const [borrower, setBorrower] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [payload, setPayload] = useState(null);
  const [searchReturnsQuery, setSearchReturnsQuery] = useState('');
  const [filteredEquipmentInUses, setFilteredEquipmentInUses] = useState(null);
  
  useEffect(() => {
    if (equipmentInUses) {
      setFilteredEquipmentInUses(equipmentInUses);
    }
  }, [equipmentInUses]);
  
  function handleSearch(e) {
    const userInput = e.target.value.toLowerCase();
    setSearchReturnsQuery(userInput);
    if (userInput.length > 2 && equipmentInUses) {
      setFilteredEquipmentInUses(prev => 
        prev.filter(item => 
          Object.values(item).some(value => 
            value?.toString().toLowerCase().includes(userInput)
          )
        )
      );
    } else {
      if (equipmentInUses) {
        setFilteredEquipmentInUses(equipmentInUses);
      }
    }
  };
  
  function handleBorrowerChange(e) {
    const userInput = e.target.value;
    setBorrower(userInput);
    let time;
    if (userInput.length > 2) {
      time = setTimeout(() => {
        postData("/findCitizen", { name: userInput });
      }, 455);
    } else if (userInput.length === 0) {
      setSuggestions([]);
      setPayload(prev => ({
        ...prev,
        citizenNumber: null
      }))
    }
    if (time) {
      return () => clearTimeout(time);
    }
  }
  useEffect(() => {
    if (response?.status === 200 && response?.citizen) {
      if (response && response?.citizen?.length === 1) {
        const citizen = response.citizen[0];
        setPayload((prev) => ({
          ...prev,
          citizenNumber: citizen.citizen_family_id,
        }));
      } else if (response?.citizen?.length > 1) {
        setSuggestions(response.citizen);
      } else {
        setSuggestions([]);
      }
    }
  }, [response]);
  function handleSelectSuggestions(e, i) {
    e.preventDefault();
    if (borrower.length > 3) {
      setPayload((prev) => ({
        ...prev,
        citizenNumber: suggestions[i].citizen_family_id,
      }));
      setBorrower(suggestions[i].full_name);
      setSuggestions([]);
    }
  }

  async function handleSubmit() {
    const newPayload = {
      ...payload,
      equipmentId: equipmentId,
      dateTime: mysqlTime,
    };
    if (
      newPayload.equipmentId &&
      newPayload.citizenNumber &&
      newPayload.dateTime
    ) {
      await postData("borrowEquipment", newPayload);
      setBorrower('');
      setPayload(null);
      setSuggestions([]);
      handleClose();
    }
  }

  async function handleReturn(id, borrower) {
    await editData('updateEquipmentStatus', id, {dateTime: mysqlTime, equipmentId: equipmentId, borrower: borrower });
    socket.emit('updateEquipmentHistory', id);
    if (filteredEquipmentInUses.length === 1 && isReturnVisible) setIsReturnVisible(false);
  }

  return (
    <div className="flex flex-col justify-start p-2 gap-2">
      <div className="flex flex-col gap-2">
        <div
          className={`flex flex-col gap-1 border-[1px] p-2 border-${selectedTheme}-400 rounded-md shadow-md`}
        >
          <div className={`flex justify-between items-center w-full px-2`}>
            <p
              className={`font-bold text-sm md:text-base lg:text-lg text-${selectedTheme}-800`}
            >
              Equipment Details:
            </p>
            <button
              onClick={() => setIsDetailsShown((prev) => !prev)}
              className={`justify-self-end transition-colors p-1 bg-${selectedTheme}-${
                isDetailsShown ? "200" : "800"
              } hover:bg-${selectedTheme}-${
                isDetailsShown ? "100" : "700"
              } active:bg-${selectedTheme}-${
                isDetailsShown ? "300" : "900"
              } text-${selectedTheme}-${
                isDetailsShown ? "800" : "200"
              } hover:text-${selectedTheme}-${
                isDetailsShown ? "700" : "100"
              } active:text-${selectedTheme}-${
                isDetailsShown ? "900" : "300"
              } drop-shadow-md hover:shadow-inner rounded-md font-semibold`}
            >
              <MdKeyboardArrowDown className="size-5 md:size-6 lg:size-7" />
            </button>
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-start justify-items-start w-full px-2 text-${selectedTheme}-800 font-semibold text-xs md:text-sm lg:text-base`}
          >
            {selectedEquipment &&
              isDetailsShown &&
              Object.entries(selectedEquipment).map(([key, val], i) => (
                <div
                  key={i}
                  className="flex flex-col items-start justify-start text-nowrap p-1 w-full"
                >
                  <label
                    htmlFor={key.replace(" ", "").toLowerCase()}
                    className="basis-1/3"
                  >
                    {key}:
                  </label>
                  <input
                    type="text"
                    name={key.replace(" ", "").toLowerCase()}
                    id={key.replace(" ", "").toLowerCase()}
                    disabled
                    value={val ? val : ''}
                    className={`shadow-inner rounded-lg w-full bg-${selectedTheme}-200 border-[1px] border-transparent p-1 w-full`}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="self-end flex gap-2 justify-between items-center">
          <button
            disabled={isLoading}
            onClick={() => toggleBorrowReturn(true)}
            className={`self-end transition-colors p-2 bg-${selectedTheme}-${
              isBorrowFormVisible ? "200" : "800"
            } hover:bg-${selectedTheme}-${
              isBorrowFormVisible ? "100" : "700"
            } active:bg-${selectedTheme}-${
              isBorrowFormVisible ? "300" : "900"
            } text-${selectedTheme}-${
              isBorrowFormVisible ? "800" : "200"
            } hover:text-${selectedTheme}-${
              isBorrowFormVisible ? "700" : "100"
            } active:text-${selectedTheme}-${
              isBorrowFormVisible ? "900" : "300"
            } drop-shadow-md hover:shadow-inner rounded-md font-semibold`}
          >
            Borrow Equipment
          </button>
          {equipmentInUses?.length > 0 && (
            <button
              disabled={isLoading}
              onClick={() => toggleBorrowReturn(false)}
              className={`self-end transition-colors p-2 bg-${selectedTheme}-${
                isReturnVisible ? "200" : "800"
              } hover:bg-${selectedTheme}-${
                isReturnVisible ? "100" : "700"
              } active:bg-${selectedTheme}-${
                isReturnVisible ? "300" : "900"
              } text-${selectedTheme}-${
                isReturnVisible ? "800" : "200"
              } hover:text-${selectedTheme}-${
                isReturnVisible ? "700" : "100"
              } active:text-${selectedTheme}-${
                isReturnVisible ? "900" : "300"
              } drop-shadow-md hover:shadow-inner rounded-md font-semibold`}
            >
              Return Product
            </button>
          )}
        </div>
        {isBorrowFormVisible && (
          <>
            <p
              className={`font-bold text-sm md:text-base lg:text-lg text-${selectedTheme}-800`}
            >
              Equipment Borrow Form:
            </p>
            <form
              className={`p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 items-start justify-items-start font-semibold border-${selectedTheme}-400 border-[1px] rounded-md shadow-md`}
            >
              <div className="relative px-2 w-full">
                <label htmlFor="borrower">
                  Borrower: <span className="text-red-800 font-black">*</span>
                </label>
                <input
                  type="text"
                  name="borrower"
                  id="borrower"
                  value={borrower}
                  onChange={handleBorrowerChange}
                  className={`p-1 rounded-md drop-shadow-md hover:shadow-inner active:shadow-inner w-full`}
                  placeholder="Name of borrower..."
                  autoComplete="off"
                />
                {suggestions && suggestions.length > 0 && (
                  <ul
                    className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                    style={{ top: "100%" }}
                  >
                    {suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                        onClick={(e) => handleSelectSuggestions(e, i)}
                      >
                        {suggestion.full_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative px-2 w-full">
                <label htmlFor="address">
                  Address: (Optional)
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={payload?.address || ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className={`p-1 rounded-md drop-shadow-md hover:shadow-inner active:shadow-inner w-full`}
                  placeholder="Address of borrower..."
                />
              </div>
              <div className="relative px-2 w-full">
                <label htmlFor="quantity">Quantity: (Optional)</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={payload?.quantity || ""}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  className={`p-1 rounded-md drop-shadow-md hover:shadow-inner active:shadow-inner w-full`}
                  placeholder="Number of items..."
                />
              </div>
              <div className="relative px-2 w-full md:col-span-2 lg:col-span-3">
                <label htmlFor="notes">Notes: (Optional)</label>
                <textarea
                  name="notes"
                  id="notes"
                  value={payload?.notes || ""}
                  onChange={(e) =>
                    setPayload((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className={`p-1 rounded-md drop-shadow-md hover:shadow-inner active:shadow-inner w-full`}
                  placeholder="Notes or reason if there's any..."
                  rows={2}
                />
              </div>
            </form>
            <button
              disabled={queryError && (!equipmentId || !payload?.citizenNumber)}
              onClick={() => handleSubmit()}
              className={`w-40 self-end transition-colors p-2 ${
                !equipmentId || !payload?.citizenNumber ? `bg-${selectedTheme}-200 text-${selectedTheme}-800 shadow-inner` : `bg-${selectedTheme}-800 hover:bg-${selectedTheme}-700 active:bg-900 text-${selectedTheme}-200 hover:text-${selectedTheme}-100 active:text-${selectedTheme}-300 drop-shadow-md hover:shadow-inner`
              } rounded-md font-semibold`}
            >
              {queryError ? queryError : isLoading ? <Spinner /> : 'Submit Form'}
            </button>
          </>
        )}
        {isReturnVisible && (
          <>
          <div className="justify-self-end self-end p-2 flex gap-1 items-center">
            <label htmlFor="searchReturns" className={`font-semibold text-${selectedTheme}-800`}>Search:</label>
            <input type="text" name="searchReturns" id="searchReturns" placeholder="Search..." className={`bg-${selectedTheme}-100 font-medium text-xxs md:text-xs lg:text-sm rounded-md p-1`} value={searchReturnsQuery} onChange={handleSearch}/>
          </div>
          <div className="flex flex-wrap gap-2 items-center justify-start w-full h-auto">
            {filteredEquipmentInUses?.length > 0 && filteredEquipmentInUses.map((val, i) => (
              <div key={i} className={`basis-full md:basis-52 lg:basis-80 h-full flex flex-col gap-2 p-2 shadow-md hover:shadow-inner transition-all rounded-md border-[1px] border-${selectedTheme}-600 bg-${selectedTheme}-200`}>
                <p className={`text-${selectedTheme}-800 font-semibold text-ellipsis`}>Borrower: <span className={`text-xs md:text-sm lg:text-sm`}>{val.borrower}</span></p>
                <p className={`text-${selectedTheme}-800 font-semibold text-ellipsis`}>Lender: <span className={`text-xs md:text-sm lg:text-sm`}>{val.lender}</span></p>
                <p className={`text-${selectedTheme}-800 font-semibold`}>Borrowed at: <span className={`underline text-xs md:text-sm lg:text-sm`}>{val.borrowed_at}</span></p>
                <button disabled={isLoading} onClick={() => handleReturn(val.id, val.borrower)} className={`self-end justify-self-end p-1 font-semibold text-${selectedTheme}-200 bg-${selectedTheme}-800 shadow-md hover:shadow-inner hover:bg-${selectedTheme}-700 hover:text-${selectedTheme}-100 active:text-${selectedTheme}-300 active:bg-${selectedTheme}-900 transition-colors rounded-md`}>Return Equipment</button>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsAndBorrow;
