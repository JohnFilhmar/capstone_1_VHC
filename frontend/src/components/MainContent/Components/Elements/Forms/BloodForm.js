import { Checkbox, Label, Radio, Spinner } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { colorTheme, notificationMessage } from "../../../../../App";
import useQuery from "../../../../../hooks/useQuery";
import api from "../../../../../axios";
import useCurrentTime from "../../../../../hooks/useCurrentTime";
import { socket } from "../../../../../socket";

const BloodForm = ({ close, children }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { response, isLoading, addData, postData } = useQuery();
  const { mysqlTime } = useCurrentTime();
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const [isChecked, setIsChecked] = useState(true);
  const [payload, setPayload] = useState({
    familyId: "",
    query: "",
    gender: "male",
    birthdate: "",
    barangay: "",
    number: "",
    bloodtype: "N/A",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [changeWarning, setChangeWarning] = useState(false);
  const [BTresponse, setBTresponse] = useState('N/A');

  useEffect(() => {
    if (payload.query.length > 3 && !payload.barangay) {
      const time = setTimeout(() => {
        if (payload.query.includes("-")) {
          postData("/findCitizen", { famId: payload.query });
        } else {
          postData("/findCitizen", { name: payload.query });
        }
      }, 500);
      return () => clearTimeout(time);
    }
    if (payload.query.length <= 3) {
      setSuggestions([]);
      setBTresponse('');
      setPayload(prev => ({
        ...prev,
        familyId: "",
        gender: "male",
        birthdate: "",
        barangay: "",
        number: "",
        bloodtype: "N/A",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.query]);

  useEffect(() => {
    if (response?.status === 200) {
      if (response && response?.citizen?.length === 1) {
        const citizen = response.citizen[0];
        setPayload((prev) => ({
          ...prev,
          familyId: citizen.citizen_family_id,
          query: citizen.full_name,
          gender: citizen.citizen_gender,
          birthdate: citizen.citizen_birthdate,
          barangay: citizen.citizen_barangay,
          number: citizen.citizen_number,
          bloodtype: citizen.citizen_bloodtype,
        }));
        setBTresponse(citizen.citizen_bloodtype);
      } else if (response?.citizen?.length > 1) {
        setSuggestions(response.citizen);
      } else {
        setSuggestions([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  function handleSelectSuggestions(e, i) {
    e.preventDefault();
    if (payload.query.length > 3) {
      setPayload((prev) => ({
        ...prev,
        familyId: suggestions[i].citizen_family_id,
        query: suggestions[i].full_name,
        gender: suggestions[i].citizen_gender,
        birthdate: suggestions[i].citizen_birthdate,
        barangay: suggestions[i].citizen_barangay,
        number: suggestions[i].citizen_number,
        bloodtype: suggestions[i].citizen_bloodtype,
      }));
      setBTresponse(suggestions[i].citizen_bloodtype);
      setSuggestions([]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.get('/getStaffId');
      if (res?.status === 200) {
        const newPayload = {
          familyId: payload.familyId,
          staff_id: res.data.staff_id,
          bloodtype: payload.bloodtype,
          isBloodChanged: BTresponse !== payload.bloodtype,
          dateTime: mysqlTime,
        };
        await addData('/addDonor', newPayload);
        socket.emit('newBloodSocket', {citizen_family_id: payload.familyId});
        setBTresponse('N/A');
        setPayload({
          familyId: "",
          query: "",
          gender: "male",
          birthdate: "",
          barangay: "",
          number: "",
          bloodtype: "N/A",
        });
        setChangeWarning(false);
      }
      if (!isChecked) {
        close();
      }
    } catch (error) {
      console.log(error);
      setNotifMessage(error?.message);
      close();
    }
  }

  useEffect(() => {
    if (BTresponse !== payload.bloodtype) {
      setChangeWarning(true);
    } else {
      setChangeWarning(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.bloodtype]);
  
  return (
    <>
      {children}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-5 mt-20 md:mt-24 lg:mt-24">
        <div>
          <div className="mb-2 block">
            <label
              htmlFor="query"
              className="text-xs md:text-sm lg:text-base font-semibold"
            >
              Name or Family Number
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              required
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              maxLength={50}
              id="query"
              placeholder="Enter query or family number. . . . ."
              autoComplete="off"
              value={payload.query}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, query: e.target.value }))
              }
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
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4 justify-between items-start">
          <fieldset className="flex flex-row gap-3 p-2">
            <legend className="mr-4 text-xs md:text-sm lg:text-base">
              Choose a gender
            </legend>
            <div className="flex items-center gap-2">
              <Radio
                id="male"
                name="gender"
                value="male"
                className="text-xs md:text-sm lg:text-base"
                disabled
                checked={payload.gender === "male"}
              />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="female"
                name="gender"
                value="female"
                className="text-xs md:text-sm lg:text-base"
                disabled
                checked={payload.gender === "female"}
              />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="others"
                name="gender"
                value="others"
                className="text-xs md:text-sm lg:text-base"
                disabled
                checked={payload.gender === "others"}
              />
              <Label htmlFor="others">Others</Label>
            </div>
          </fieldset>
          <div className="grow">
            <label
              htmlFor="birthdate"
              className="text-xs md:text-sm lg:text-base font-semibold"
            >
              Birthdate:{" "}
            </label>
            <input
              type="date"
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              disabled
              required
              value={payload.birthdate}
            />
          </div>
          <div className="grow">
            <label
              htmlFor="bloodtype"
              className="text-xs md:text-sm lg:text-base font-semibold"
            >
              BloodType:{" "}
            </label>
            <select
              name="bloodtype"
              id="bloodtype"
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              required
              disabled={!payload.birthdate}
              value={payload.bloodtype}
              onChange={(e) => {
                setPayload(prev => ({ ...prev, bloodtype: e.target.value }));
              }}
            >
              <option
                value="N/A"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                N/A
              </option>
              <option
                value="O+"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                O+
              </option>
              <option
                value="O-"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                O-
              </option>
              <option
                value="A+"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                A+
              </option>
              <option
                value="A-"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                A-
              </option>
              <option
                value="B+"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                B+
              </option>
              <option
                value="B-"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                B-
              </option>
              <option
                value="AB+"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                AB+
              </option>
              <option
                value="AB-"
                className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              >
                AB-
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row gap-3">
          <div className="basis-1/2">
            <label
              htmlFor="barangay"
              className="text-xs md:text-sm lg:text-base font-semibold"
            >
              Barangay:{" "}
            </label>
            <input
              required
              disabled
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              id="barangay"
              type="text"
              value={payload.barangay}
            />
          </div>
          <div className="basis-1/2">
            <label
              htmlFor="phoneNumber"
              className="text-xs md:text-sm lg:text-base font-semibold"
            >
              Phone Number:{" "}
            </label>
            <input
              disabled
              required
              className={`text-xs md:text-sm lg:text-base shadow-md rounded-lg w-full bg-transparent border-[1px] border-${selectedTheme}-800`}
              id="phoneNumber"
              type="text"
              value={payload?.number ? payload.number : "No number available."}
            />
          </div>
        </div>
        {changeWarning && (
          <p className="text-red-800 bg-red-100 p-1 rounded-md font-thin text-xxs md:text-xs lg:text-sm">You changed the blood type value. Continuing will update the citizen's bloodtype.</p>
        )}
        <button
          // disabled={isLoading}
          type="submit"
          disabled={!payload.barangay && !payload.birthdate}
          className={`font-semibold p-2 rounded-md w-full transition-colors duration-200 ${
            !isLoading
              ? `text-${selectedTheme}-100 bg-${selectedTheme}-700 hover:drop-shadow-md hover:bg-${selectedTheme}-800 focus:bg-${selectedTheme}-600 active:bg-${selectedTheme}-300 active:text-${selectedTheme}-600 active:shadow-inner active:ring-2 active:ring-${selectedTheme}-600`
              : `text-${selectedTheme}-700 bg-${selectedTheme}-100 shadow-inner`
          }`}
        >
          <p className="drop-shadow-lg">
            {!isLoading ? (
              notifMessage ? (
                notifMessage
              ) : (
                "Add Donatee"
              )
            ) : (
              <Spinner />
            )}
          </p>
        </button>
        <div className="flex items-center justify-end gap-2">
          <Checkbox
            id="accept"
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <label
            htmlFor="accept"
            className="flex text-xs md:text-sm lg:text-base font-semibold"
          >
            Don't Close Upon Submition
          </label>
        </div>
      </form>
    </>
  );
};

export default BloodForm;
