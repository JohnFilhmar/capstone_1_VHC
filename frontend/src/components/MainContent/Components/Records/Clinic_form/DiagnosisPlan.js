import { useContext, useEffect, useState } from "react";
import { FaMinus, FaPlus, FaStethoscope } from "react-icons/fa";
import { formDataContext } from "../RecordAudit";

const DiagnosisPlan = ({ selectedTheme }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [cases, setCases] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { visibleForm, setVisibleForm, diagnosisPlan, setDiagnosisPlan } =
    useContext(formDataContext);

  const fetchIllnessSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${query}`
      );
      const data = await response.json();
      setSuggestions(data[3]);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  function handleAddSymptom(e) {
    if (diagnosisPlan.symptoms.length > 2) {
      e.preventDefault();
      setSymptoms((prev) => [...prev, diagnosisPlan.symptoms.trim()]);
      setDiagnosisPlan((prev) => ({
        ...prev,
        symptoms: "",
      }));
    }
  }
  const handleIllnessChange = (e) => {
    const input = e.target.value;
    setDiagnosisPlan((prev) => ({ ...prev, cases: input }));

    if (input.length > 2) {
      const time = setTimeout(() => {
        fetchIllnessSuggestions(input);
      }, 1000);
      return () => clearTimeout(time);
    } else {
      setSuggestions([]);
    }
  };
  const handleAddIllness = (e) => {
    e.preventDefault();
    if (diagnosisPlan.cases.length > 3) {
      setCases((prev) => [...prev, diagnosisPlan.cases]);
    }
  };
  const handleIllnessSelect = (cases) => {
    setCases((prev) => [...prev, cases]);
    setDiagnosisPlan((prev) => ({ ...prev, cases: "" }));
    setSuggestions([]);
  };

  const removeSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };
  const removeIllness = (index) => {
    setCases(cases.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const time = setTimeout(() => {
      const oldClinicForm = sessionStorage.getItem("clinicForm")
        ? JSON.parse(sessionStorage.getItem("clinicForm"))
        : {};
      if (
        diagnosisPlan.primary_diagnosis ||
        diagnosisPlan.secondary_diagnosis ||
        diagnosisPlan.tests_conducted ||
        diagnosisPlan.diagnosis_details ||
        diagnosisPlan.follow_up_recommendations ||
        diagnosisPlan.cases ||
        diagnosisPlan.symptoms
      ) {
        const updatedClinicForm = {
          ...oldClinicForm,
          diagnosis_plan: {
            ...diagnosisPlan,
            cases: cases.map((s) => `${s}`).join(","),
            symptoms: symptoms.map((s) => `${s}`).join(","),
          },
        };
        sessionStorage.setItem("clinicForm", JSON.stringify(updatedClinicForm));
      }
    }, 425);
    return () => clearTimeout(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosisPlan]);

  return (
    <div
      className={`flex flex-col gap-0 p-2 m-2 border-b-2 border-solid border-${selectedTheme}-500 drop-shadow-lg shadow-md rounded-lg`}
    >
      <div className={`flex gap-1 justify-between mb-2`}>
        <div className="flex gap-1">
          <FaStethoscope className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          <p className={`text-${selectedTheme}-500 font-bold`}>
            Diagnostics and Recommendations
          </p>
        </div>
        <button
          onClick={() => setVisibleForm("diagnosis_plan")}
          className={`p-1 rounded-md shadow-md border-${selectedTheme}-500 border-[1px]`}
        >
          {visibleForm === "diagnosis_plan" ? (
            <FaMinus className="size-4 md:size-5 lg:size-6" />
          ) : (
            <FaPlus className="size-4 md:size-5 lg:size-6" />
          )}
        </button>
      </div>
      <div className={visibleForm === "diagnosis_plan" ? "block" : "hidden"}>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="p-2">
            <label
              htmlFor="primary_diagnosis"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Primary Diagnosis:
            </label>
            <textarea
              name="primary_diagnosis"
              id="primary_diagnosis"
              placeholder="Enter your primary diagnosis for the patient. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              rows={2}
              value={diagnosisPlan.primary_diagnosis}
              onChange={(e) =>
                setDiagnosisPlan((prev) => ({
                  ...prev,
                  primary_diagnosis: e.target.value,
                }))
              }
            />
          </div>
          <div className="p-2">
            <label
              htmlFor="secondary_diagnosis"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Secondary Diagnosis:
            </label>
            <textarea
              name="secondary_diagnosis"
              id="secondary_diagnosis"
              placeholder="Enter your secondary diagnosis for the patient. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              rows={2}
              value={diagnosisPlan.secondary_diagnosis}
              onChange={(e) =>
                setDiagnosisPlan((prev) => ({
                  ...prev,
                  secondary_diagnosis: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="p-2 relative">
            <label
              htmlFor="cases"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Case/es:
            </label>
            <div className="flex tag-input">
              {cases.map((cases, i) => (
                <div key={i} className="tag">
                  {cases}
                  <button type="button" onClick={() => removeIllness(i)}>
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between w-full gap-2">
                <input
                  type="text"
                  id="cases-input"
                  name="cases"
                  placeholder="Type the case of the patient..."
                  value={diagnosisPlan.cases}
                  onChange={handleIllnessChange}
                  className="w-full text-xs md:text-sm lg:text-base text-gray-600 rounded-md"
                />
                <button
                  onClick={handleAddIllness}
                  className={`p-2 rounded-md bg-${selectedTheme}-600 text-${selectedTheme}-200 hover:bg-${selectedTheme}-500 hover:text-${selectedTheme}-100 active:bg-${selectedTheme}-700 active:text-${selectedTheme}-300`}
                >
                  <FaPlus className="size-3 md:size-4 lg:size-5" />
                </button>
              </div>
            </div>
            {suggestions.length > 0 && (
              <ul
                className="absolute z-10 bg-white shadow-lg border border-gray-300 max-h-40 overflow-auto rounded-md mt-1 w-full"
                style={{ top: "100%" }}
              >
                {suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleIllnessSelect(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`flex flex-col items-center justify-start gap-3`}>
            <label
              htmlFor="severity"
              className={`block text-${selectedTheme}-600 font-semibold`}
            >
              Severity of the Case/es:
            </label>
            <div className="flex items-center space-x-4">
              <label
                className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}
              >
                <input
                  type="checkbox"
                  checked={diagnosisPlan.severity === "mild"}
                  onChange={() =>
                    setDiagnosisPlan((prev) => ({ ...prev, severity: "mild" }))
                  }
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>Mild</span>
              </label>
              <label
                className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}
              >
                <input
                  type="checkbox"
                  checked={diagnosisPlan.severity === "moderate"}
                  onChange={() =>
                    setDiagnosisPlan((prev) => ({
                      ...prev,
                      severity: "moderate",
                    }))
                  }
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>Moderate</span>
              </label>
              <label
                className={`flex items-center space-x-2 bg-${selectedTheme}-200 rounded-sm p-1`}
              >
                <input
                  type="checkbox"
                  checked={diagnosisPlan.severity === "severe"}
                  onChange={() =>
                    setDiagnosisPlan((prev) => ({
                      ...prev,
                      severity: "severe",
                    }))
                  }
                  className={`form-checkbox h-5 w-5 text-${selectedTheme}-600`}
                />
                <span className={`text-${selectedTheme}-600`}>Severe</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <label
              htmlFor="symptoms"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Symptom/s:
            </label>
            <div className="flex tag-input">
              {symptoms.map((symptom, i) => (
                <div key={i} className="tag">
                  {symptom}
                  <button type="button" onClick={() => removeSymptom(i)}>
                    &times;
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between w-full gap-2">
                <input
                  type="text"
                  id="symptoms"
                  name="symptoms"
                  placeholder="Add a symptom..."
                  value={diagnosisPlan.symptoms}
                  onChange={(e) => {
                    setDiagnosisPlan((prev) => ({
                      ...prev,
                      symptoms: e.target.value,
                    }));
                  }}
                  className="w-full text-xs md:text-sm lg:text-base text-gray-600 rounded-md"
                />
                <button
                  onClick={handleAddSymptom}
                  className={`p-2 rounded-md bg-${selectedTheme}-600 text-${selectedTheme}-200 hover:bg-${selectedTheme}-500 hover:text-${selectedTheme}-100 active:bg-${selectedTheme}-700 active:text-${selectedTheme}-300`}
                >
                  <FaPlus className="size-3 md:size-4 lg:size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="p-2">
            <label
              htmlFor="tests_conducted"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Tests Conducted:
            </label>
            <textarea
              name="tests_conducted"
              id="tests_conducted"
              value={diagnosisPlan.tests_conducted}
              onChange={(e) =>
                setDiagnosisPlan((prev) => ({
                  ...prev,
                  tests_conducted: e.target.value,
                }))
              }
              placeholder="Enter the tests conducted on the patient. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              rows={1}
            />
          </div>
          <div className="p-2">
            <label
              htmlFor="diagnosis_details"
              className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
            >
              Diagnosis Details:
            </label>
            <textarea
              name="diagnosis_details"
              id="diagnosis_details"
              value={diagnosisPlan.diagnosis_details}
              onChange={(e) =>
                setDiagnosisPlan((prev) => ({
                  ...prev,
                  diagnosis_details: e.target.value,
                }))
              }
              placeholder="Enter the details of the diagnosis. . . . ."
              className="w-full rounded-lg text-xs md:text-sm lg:text-base"
              rows={1}
            />
          </div>
        </div>
        <div className="p-2">
          <label
            htmlFor="follow_up_recommendations"
            className={`block mb-2 text-${selectedTheme}-600 font-semibold`}
          >
            Follow-up Recommendations:
          </label>
          <textarea
            name="follow_up_recommendations"
            id="follow_up_recommendations"
            value={diagnosisPlan.follow_up_recommendations}
            onChange={(e) =>
              setDiagnosisPlan((prev) => ({
                ...prev,
                follow_up_recommendations: e.target.value,
              }))
            }
            placeholder="Enter the tests conducted on the patient. . . . ."
            className="w-full rounded-lg text-xs md:text-sm lg:text-base"
            rows={1}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagnosisPlan;
