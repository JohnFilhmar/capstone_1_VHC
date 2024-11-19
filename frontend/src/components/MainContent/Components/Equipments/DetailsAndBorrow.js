import { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import useCurrentTime from "../../../../hooks/useCurrentTime";
import { colorTheme } from "../../../../App";
import useQuery from "../../../../hooks/useQuery";
import { Spinner } from "flowbite-react";

const DetailsAndBorrow = ({ selectedEquipment, equipmentId, handleClose }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { mysqlTime } = useCurrentTime();
  const { response, isLoading, error: queryError , postData } = useQuery();
  const [isDetailsShown, setIsDetailsShown] = useState(false);
  const [isBorrowFormVisible, setIsBorrowFormVisible] = useState(false);
  const [borrower, setBorrower] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [payload, setPayload] = useState(null);

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
      setIsBorrowFormVisible(false);
      setIsDetailsShown(false);
      setSuggestions([]);
      handleClose();
    }
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
        <button
          onClick={() => setIsBorrowFormVisible((prev) => !prev)}
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
      </div>
    </div>
  );
};

export default DetailsAndBorrow;
