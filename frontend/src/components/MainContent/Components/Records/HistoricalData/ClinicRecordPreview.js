import React, { useContext, useEffect, useState } from "react";
import { MdClose, MdHistoryEdu, MdKeyboardArrowDown } from "react-icons/md";
import { colorTheme } from "../../../../../App";
import useQuery from "../../../../../hooks/useQuery";

const ClinicRecordPreview = ({ toggle, recordPrevRef, record_id }) => {
  const [selectedTheme] = useContext(colorTheme);
  // eslint-disable-next-line no-unused-vars
  const { searchResults, isLoading, error, searchData } = useQuery();
  const [data, setData] = useState(null);
  const [isPatientInfoVisible, setIsPatientVisible] = useState(true);
  const [isVitalSignsVisible, setIsVitalSignsVisible] = useState(false);
  const [isPhilhealthVisible, setIsPhilhealthVisible] = useState(false);
  const [isComplaintVisible, setIsComplaintVisible] = useState(false);
  const [isMedicalHistoryVisible, setIsMedicalHistoryVisible] = useState(false);
  const [isPhysicalExaminationVisible, setIsPhysicalExaminationVisible] = useState(false);
  const [isMenstrualHistoryVisible, setIsMenstrualHistoryVisible] = useState(false);
  const [isPregnancyHistoryVisible, setIsPregnancyHistoryVisible] = useState(false);
  const [isDiagnosisVisible, setIsDiagnosisVisible] = useState(false);
  const [isPrescriptionsVisible, setIsPrescriptionsVisible] = useState(false);

  useEffect(() => {
    if (record_id) {
      searchData("/getClinicRecord", record_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record_id]);

  useEffect(() => {
    if (searchResults?.data) {
      setData([
        {
          ...searchResults.data,
        },
      ]);
    }
  }, [searchResults]);

  function determineSocialHistoryStatus(status) {
    switch (status) {
      case "quit":
        return "Quitted";
      case "no":
        return "Not engaging";
      case "yes":
        return "Engaging";
      default:
        return "n/a";
    }
  };

  function handleClose() {
    setIsPatientVisible(true);
    setIsVitalSignsVisible(false);
    setIsPhilhealthVisible(false);
    setIsComplaintVisible(false);
    setIsMedicalHistoryVisible(false);
    setIsPhysicalExaminationVisible(false);
    setIsMenstrualHistoryVisible(false);
    setIsPregnancyHistoryVisible(false);
    setIsDiagnosisVisible(false);
    setIsPrescriptionsVisible(false);
    toggle();
  }

  return (
    <dialog
      ref={recordPrevRef}
      className={`rounded-lg bg-${selectedTheme}-100 drop-shadow-lg w-[90vw] h-full`}
    >
      <div className="flex flex-col text-xs md:text-sm lg:text-base">
        <div
          className={`flex justify-between items-center p-2 text-${selectedTheme}-600 border-b-[1px] border-solid border-${selectedTheme}-500 shadow-md shadow-${selectedTheme}-600 mb-2`}
        >
          <div className="flex items-center p-1 gap-1">
            <MdHistoryEdu className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            <strong className="font-semibold drop-shadow-md text-sm md:text-base lg:text-lg">
              Record Details
            </strong>
          </div>
          <button
            onClick={() => handleClose()}
            className={`transition-colors duration-200 rounded-3xl p-1 bg-${selectedTheme}-300 hover:bg-${selectedTheme}-400 active:bg-${selectedTheme}-200`}
          >
            <MdClose className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
          </button>
        </div>
        <div className="flex flex-col gap-3 h-full min-h-full overflow-y-auto">
          <div className="flex justify-between items-center p-1 md:p-2 lg:p-3">
            {!data ? (
              <></>
            ) : (
              data?.map((val, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-start items-start gap-2 w-full h-auto"
                >
                  <div
                    className={`self-end justify-self-end border-b-4 border-${selectedTheme}-800 pb-2 w-full`}
                  >
                    <p className="text-sm md:text-base lg:text-lg text-end grow w-full font-semibold">
                      Family Number: 
                      <span
                        className={`text-sm md:text-base lg:text-lg font-bold p-1 grow w-full pb-[0.15rem] border-b-[1px] border-gray-800`}
                      >
                        {val.patient_info[0].family_number}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`self-end justify-self-end flex flex-col gap-1 justify-start items-start w-44 md:w-52 lg:w-60`}
                  >
                    <p className="text-sm md:text-base lg:text-lg grow flex justify-between items-center w-full font-semibold">
                      Date: 
                      <span
                        className={`text-center text-sm md:text-base lg:text-lg font-bold p-1 grow w-full pb-[0.15rem] border-b-[1px] border-gray-800`}
                      >
                        {new Date(
                          val.patient_info[0].datetime_issued.split(" ")[0]
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="text-sm md:text-base lg:text-lg grow flex justify-between items-center w-full font-semibold">
                      Time: 
                      <span
                        className={`text-center text-sm md:text-base lg:text-lg font-bold p-1 grow w-full pb-[0.15rem] border-b-[1px] border-gray-800`}
                      >
                        {val.patient_info[0].datetime_issued.split(" ")[1]}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Patient Info:
                      </p>
                      <button
                        onClick={() => setIsPatientVisible((prev) => !prev)}
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isPatientInfoVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div className={isPatientInfoVisible ? "block" : "hidden"}>
                      <div
                        className={`p-2 self-start justify-self-start flex flex-col md:flex-col lg:flex-row gap-3 justify-between items-start md:items-start lg:items-center w-full text-${selectedTheme}-800`}
                      >
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          Firstname: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize text-nowrap`}
                          >
                            {val.patient_info[0].firstname.toLowerCase()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          Middlename: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize`}
                          >
                            {val.patient_info[0].middlename.toLowerCase()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          Lastname: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize`}
                          >
                            {val.patient_info[0].lastname.toLowerCase()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Civil Status: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize`}
                          >
                            {val.patient_info[0].civil_status}
                          </span>
                        </p>
                      </div>
                      <div
                        className={`p-2 self-start justify-self-start flex flex-col md:flex-col lg:flex-row gap-3 justify-between items-start md:items-start lg:items-center w-full text-${selectedTheme}-800`}
                      >
                        <p className="text-xs md:text-sm lg:text-base grow flex flex-col md:flex-col lg:flex-row gap-1 justify-start items-start md:items-start lg:items-center font-semibold">
                          Gender: 
                          <span
                            className={`text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize`}
                          >
                             {val.patient_info[0].gender} 
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          Address: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize`}
                          >
                            {val.patient_info[0].barangay.toLowerCase()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Phone Number: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {val.patient_info[0].phone_number || "n/a"}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Date of Birth: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {new Date(
                              val.patient_info[0].birthdate
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      </div>
                      <p
                        className={`text-lg text-${selectedTheme}-800 font-bold p-2`}
                      >
                        Social History:
                      </p>
                      <div
                        className={`p-2 self-start justify-self-start grid grid-cols-2 lg:grid-cols-2 gap-4 w-full text-${selectedTheme}-800`}
                      >
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Smoking Status: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {determineSocialHistoryStatus(
                              val.patient_info[0].smoking_status
                            )}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Alcohol Status: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {determineSocialHistoryStatus(
                              val.patient_info[0].alcohol_status
                            )}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Illicit Drug Status: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {determineSocialHistoryStatus(
                              val.patient_info[0].drug_status
                            )}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                          Sexual Activity: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {determineSocialHistoryStatus(
                              val.patient_info[0].sexually_active
                            )}
                          </span>
                        </p>
                      </div>
                      {val.pediatric_client.length > 0 && (
                        <>
                          <p
                            className={`text-lg text-${selectedTheme}-800 font-bold p-2`}
                          >
                            Pediatric Client:
                          </p>
                          <div
                            className={`p-2 self-start justify-self-start grid grid-cols-2 lg:grid-cols-2 gap-4 w-full text-${selectedTheme}-800`}
                          >
                            {Object.entries(val.pediatric_client[0]).map(
                              ([key, ped], i) => (
                                <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                                  {key.replace(/_/g, " ")}: 
                                  <span
                                    className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                                  >
                                    {ped}
                                  </span>
                                </p>
                              )
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Vital Signs:
                      </p>
                      <button
                        onClick={() => setIsVitalSignsVisible((prev) => !prev)}
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isVitalSignsVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div className={isVitalSignsVisible ? "block" : "hidden"}>
                      <div
                        className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2`}
                      >
                        {Object.entries(val.vital_signs[0]).map(
                          ([key, vit], i) => (
                            <p
                              key={i}
                              className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full"
                            >
                              <p className="basis-1/3">
                                {key.replace(/_/g, " ")}: 
                              </p>
                              <span
                                className={`text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                              >
                                {vit}
                              </span>
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md ${
                      val.patient_info[0].philhealth_number ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Philhealth Info:
                      </p>
                      <button
                        onClick={() => setIsPhilhealthVisible((prev) => !prev)}
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isPhilhealthVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div className={isPhilhealthVisible ? "block" : "hidden"}>
                      <div
                        className={`p-2 self-start justify-self-start flex flex-col md:flex-col lg:flex-row gap-3 justify-between items-start md:items-start lg:items-center w-full text-${selectedTheme}-800`}
                      >
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          Philhealth Number: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 text-nowrap`}
                          >
                            {val.patient_info[0].philhealth_number || "n/a"}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          DPIN: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800`}
                          >
                            {val.patient_info[0].philhealth_dpin || "n/a"}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold">
                          Category: 
                          <span
                            className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 capitalize`}
                          >
                            {val.patient_info[0].philhealth_category.toLowerCase() ||
                              "n/a"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Complaint and History:
                      </p>
                      <button
                        onClick={() => setIsComplaintVisible((prev) => !prev)}
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isComplaintVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div className={isComplaintVisible ? "block" : "hidden"}>
                      <p className="p-2 text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                        Chief of Complaint: 
                        <span
                          className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 text-wrap`}
                        >
                          {val.patient_info[0].chief_of_complaint || "n/a"}
                        </span>
                      </p>
                      <p className="p-2 text-xs md:text-sm lg:text-base grow w-full flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold text-nowrap">
                        History of Present Illness/es: 
                        <span
                          className={`text-lg font-bold p-1 grow w-full text-start pb-[0.15rem] border-b-[1px] border-gray-800 text-wrap`}
                        >
                          {val.patient_info[0].present_illness || "n/a"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Medical History:
                      </p>
                      <button
                        onClick={() =>
                          setIsMedicalHistoryVisible((prev) => !prev)
                        }
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isMedicalHistoryVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div
                      className={isMedicalHistoryVisible ? "block" : "hidden"}
                    >
                      <div
                        className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 gap-2`}
                      >
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Past Medical History: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {(() => {
                              const pastMedicalHistory = Object.entries(val.past_medical_history[0])
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, ' '));
                              return pastMedicalHistory.length > 0 ? pastMedicalHistory.join(', ') : pastMedicalHistory;
                            })()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Family Medical History: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {(() => {
                              const familyMedicalHistory = Object.entries(val.family_medical_history[0])
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, ' '));
                              return familyMedicalHistory.length > 0 ? familyMedicalHistory.join(', ') : familyMedicalHistory;
                            })()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Physical Examination:
                      </p>
                      <button
                        onClick={() =>
                          setIsPhysicalExaminationVisible((prev) => !prev)
                        }
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isPhysicalExaminationVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div
                      className={isPhysicalExaminationVisible ? "block" : "hidden"}
                    >
                      <div
                        className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 gap-2`}
                      >
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Skin Descriptions: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {(() => {
                              const skinExamination = Object.entries(val.physical_examination.skin_examination[0])
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, ' '));
                              return skinExamination.length > 0 ? skinExamination.join(', ') : skinExamination;
                            })()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">HEENT Descriptions: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {(() => {
                              const heentExamination = Object.entries(val.physical_examination.heent_examination[0])
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, ' '));
                              return heentExamination.length > 0 ? heentExamination.join(', ') : heentExamination;
                            })()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {val.menstrual_history.length > 0 && (
                    <div
                      className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                    >
                      <div className="flex justify-between items-center p-2">
                        <p
                          className={`text-xl text-${selectedTheme}-800 font-bold`}
                        >
                          Menstrual History:
                        </p>
                        <button
                          onClick={() => setIsMenstrualHistoryVisible((prev) => !prev)}
                          className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                        >
                          <MdKeyboardArrowDown
                            className={`h-full w-full ${
                              isMenstrualHistoryVisible && "rotate-180"
                            }`}
                          />
                        </button>
                      </div>
                      <div className={isMenstrualHistoryVisible ? "block" : "hidden"}>
                        <div
                          className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2`}
                        >
                          {Object.entries(val.menstrual_history[0]).map(
                            ([key, vit], i) => (
                              <p
                                key={i}
                                className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full"
                              >
                                <p className="basis-1/3">
                                  {key.replace(/_/g, " ")}: 
                                </p>
                                <span
                                  className={`text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                                >
                                  {typeof vit === "boolean" ? String(vit) : String(vit).length > 0 ? vit : 'n/a'}
                                </span>
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {val.pregnancy_history.length > 0 && (
                    <div
                      className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                    >
                      <div className="flex justify-between items-center p-2">
                        <p
                          className={`text-xl text-${selectedTheme}-800 font-bold`}
                        >
                          Pregnancy History:
                        </p>
                        <button
                          onClick={() => setIsPregnancyHistoryVisible((prev) => !prev)}
                          className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                        >
                          <MdKeyboardArrowDown
                            className={`h-full w-full ${
                              isPregnancyHistoryVisible && "rotate-180"
                            }`}
                          />
                        </button>
                      </div>
                      <div className={isPregnancyHistoryVisible ? "block" : "hidden"}>
                        <div
                          className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2`}
                        >
                          {Object.entries(val.pregnancy_history[0]).map(
                            ([key, vit], i) => (
                              <p
                                key={i}
                                className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full"
                              >
                                <p className="basis-1/3">
                                  {key.replace(/_/g, " ")}: 
                                </p>
                                <span
                                  className={`text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                                >
                                  {typeof vit === "boolean" ? String(vit) : String(vit).length > 0 ? vit : 'n/a'}
                                </span>
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Diagnosis:
                      </p>
                      <button
                        onClick={() =>
                          setIsDiagnosisVisible((prev) => !prev)
                        }
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isDiagnosisVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div
                      className={isDiagnosisVisible ? "block" : "hidden"}
                    >
                      <div
                        className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 gap-2`}
                      >
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Primary Diagnosis: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {val.diagnosis[0].primary_diagnosis || 'n/a'}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Secondary Diagnosis: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {val.diagnosis[0].secondary_diagnosis || 'n/a'}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Cases: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {val.diagnosis[0].cases || 'n/a'}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Symptoms: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {val.diagnosis[0].symptoms || 'n/a'}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Diagnosis Details: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {val.diagnosis[0].symptoms || 'n/a'}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">Follow up and Recommendations: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {val.diagnosis[0].follow_up_recommendations || 'n/a'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {val.prescriptions.length > 0 && (
                  <div
                    className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                  >
                    <div className="flex justify-between items-center p-2">
                      <p
                        className={`text-xl text-${selectedTheme}-800 font-bold`}
                      >
                        Prescriptions:
                      </p>
                      <button
                        onClick={() =>
                          setIsPrescriptionsVisible((prev) => !prev)
                        }
                        className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                      >
                        <MdKeyboardArrowDown
                          className={`h-full w-full ${
                            isPrescriptionsVisible && "rotate-180"
                          }`}
                        />
                      </button>
                    </div>
                    <div
                      className={`p-2 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 ${isPrescriptionsVisible ? "block" : "hidden"}`}
                    >
                        <div className={`text-xs md:text-sm lg:text-base text-${selectedTheme}-800 font-semibold flex flex-col gap-2 p-4 border-[1px] border-${selectedTheme}-600 rounded-md bg-${selectedTheme}-200 drop-shadow-md tracking-tight capitalize`}>
                          {val.prescriptions.length > 0 && Object.entries(val.prescriptions[0]).map(([k, v], index) => (
                            <React.Fragment key={index}>
                              {k.replace(/_/g, ' ')}: 
                              <span
                                className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                              >
                                {v}
                              </span>
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default ClinicRecordPreview;
