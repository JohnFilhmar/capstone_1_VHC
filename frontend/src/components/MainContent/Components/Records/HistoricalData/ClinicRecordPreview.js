import React, { useContext, useEffect, useState } from "react";
import { MdClose, MdHistoryEdu, MdKeyboardArrowDown } from "react-icons/md";
import { colorTheme } from "../../../../../App";
import useQuery from "../../../../../hooks/useQuery";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

const ClinicRecordPreview = ({ toggle, recordPrevRef, record_id }) => {
  const [selectedTheme] = useContext(colorTheme);
  const { searchResults, isLoading, error, searchData } = useQuery();
  const [data, setData] = useState(null);
  const [isPatientInfoVisible, setIsPatientVisible] = useState(true);
  const [isVitalSignsVisible, setIsVitalSignsVisible] = useState(false);
  const [isPhilhealthVisible, setIsPhilhealthVisible] = useState(false);
  const [isComplaintVisible, setIsComplaintVisible] = useState(false);
  const [isMedicalHistoryVisible, setIsMedicalHistoryVisible] = useState(false);
  const [isPhysicalExaminationVisible, setIsPhysicalExaminationVisible] =
    useState(false);
  const [isMenstrualHistoryVisible, setIsMenstrualHistoryVisible] =
    useState(false);
  const [isPregnancyHistoryVisible, setIsPregnancyHistoryVisible] =
    useState(false);
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
  }

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
    setData(null);
    toggle();
  }

  const generateDocxFromTemplate = async () => {
    try {
      const response = await fetch("/report_template.docx");
      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      function formatString(string) {
        return string
          .toLowerCase()
          .replace(/\b\w/g, (match) => match.toUpperCase());
      }
      function getAge(date) {
        return new Date().getFullYear() - new Date(date).getFullYear();
      }
      const patient_info = data[0].patient_info[0];
      const vital_signs = data[0].vital_signs[0];
      const pediatric_client =
        data[0].pediatric_client.length > 0
          ? data[0].pediatric_client[0].map((prev) => ({
              ...prev,
              ped_length: prev["length"],
            }))
          : undefined;
      const skin = data[0].physical_examination.skin_examination.map((prev) => ({
        ...prev,
        normal_skin: prev.essentially_normal,
      }));
      const heent = data[0].physical_examination.heent_examination.map((prev) => ({
        ...prev,
        normal_heent: prev.essentially_normal,
      }));
      const past_medical_history = data[0].past_medical_history[0];
      const family_medical_history = data[0].family_medical_history[0];
      const physical_examination = { ...skin[0], ...heent[0] };
      const menstrual_history = data[0].menstrual_history[0];
      const pregnancy_history = data[0].pregnancy_history[0];
      function convertKey(word) {
        const data = word.split('_');
        const newKey = data.map(dat => dat.charAt(0).toUpperCase() + dat.slice(1).toLowerCase());
        return newKey.join(' ');
      };
      const diagnosis =
        (data[0].diagnosis[0]?.primary_diagnosis ||
        data[0].diagnosis[0]?.secondary_diagnosis ||
        data[0].diagnosis[0]?.cases ||
        data[0].diagnosis[0]?.symptoms ||
        data[0].diagnosis[0]?.tests_conducted ||
        data[0].diagnosis[0]?.diagnosis_details ||
        data[0].diagnosis[0]?.follow_up_recommendations)
          ? Object.entries(data[0].diagnosis[0])
              .map(([key, val]) => `${convertKey(key)}: ${val}`)
              .join(" | ")
          : "_";
      const plan =
        data[0].prescriptions.length > 0
          ? data[0].prescriptions
              .map((prescription) => Object.entries(prescription)
                .map(([key, val]) => `${convertKey(key)}: ${val}`)
                .join(" | "))
              .join(" AND ")
          : "_";
      const patientInfo = {
        fam_number: patient_info.family_number,
        last_name: formatString(patient_info.lastname),
        first_name: formatString(patient_info.firstname),
        middle_name: formatString(patient_info.middlename)
          ? formatString(patient_info.middlename)
          : "",
        barangay: formatString(patient_info.barangay),
        age: getAge(patient_info.birthdate),
        gender: patient_info.gender.toUpperCase().substring(0, 1),
        birthdate: String(patient_info.birthdate),
        civil_status: patient_info.civil_status,
        philhealth_number: patient_info?.philhealth_number || "n/a",
        philhealth_status: patient_info?.philhealth_number ? "active" : "n/a",
        philhealth_dpin: patient_info?.philhealth_dpin || "n/a",
        philhealth_category: patient_info?.philhealth_category || "n/a",
        phone_number: patient_info?.phone_number || "n/a",
      };
      const vitalSigns = {
        bp: vital_signs.blood_pressure,
        temp: vital_signs.temperature,
        hr: vital_signs.heart_rate,
        weight: vital_signs.weight,
        height: vital_signs.height,
        pr: vital_signs.pulse_rate,
        rr: vital_signs.respiratory_rate,
        bmi: vital_signs.bmi,
        ostat: vital_signs.oxygen_saturation,
      };
      const pediatricClient = {
        lngth: pediatric_client?.ped_length || "_",
        waist: pediatric_client?.waist || "_",
        head: pediatric_client?.head_circumference || "_",
        hip: pediatric_client?.hip || "_",
        limb: pediatric_client?.limb || "_",
        muac: pediatric_client?.mua_circumference || "_",
        skin: pediatric_client?.skinfold || "_",
      };
      const chiefOfComplaint = {
        chief_of_complaint: patient_info.chief_of_complaint,
        history_of_present_illness: patient_info.present_illness,
      };
      const pastMedicalHistory = {
        pm_allergy: Boolean(past_medical_history.allergy) ? "✓" : "_",
        pm_cvd: Boolean(past_medical_history.cerebrovascular_disease)
          ? "✓"
          : "_",
        pm_emphysema: Boolean(past_medical_history.emphysema) ? "✓" : "_",
        pm_hepa: Boolean(past_medical_history.hepatitis) ? "✓" : "_",
        pm_mi: Boolean(past_medical_history.mental_illness) ? "✓" : "_",
        pm_ulcer: Boolean(past_medical_history.peptic_ulcer) ? "✓" : "_",
        pm_thyd: Boolean(past_medical_history.thyroid_disease) ? "✓" : "_",
        pm_asthma: Boolean(past_medical_history.asthma) ? "✓" : "_",
        pm_cad: Boolean(past_medical_history.coronary_artery_disease)
          ? "✓"
          : "_",
        pm_epilepsy: Boolean(past_medical_history.epilepsy_seizure_disorder)
          ? "✓"
          : "_",
        pm_hyper: Boolean(past_medical_history.hyperlipidemia) ? "✓" : "_",
        pm_pneumonia: Boolean(past_medical_history.pneumonia) ? "✓" : "_",
        pm_uti: Boolean(past_medical_history.urinary_tract_infection)
          ? "✓"
          : "_",
        pm_cancer: Boolean(past_medical_history.cancer) ? "✓" : "_",
        pm_diabetes: Boolean(past_medical_history.diabetes_mellitus)
          ? "✓"
          : "_",
        pm_extube: Boolean(past_medical_history.extrapulmonary_tuberculosis)
          ? "✓"
          : "_",
        pm_pulmtube: Boolean(past_medical_history.pulmonary_tuberculosis)
          ? "✓"
          : "_",
        pm_none: Boolean(past_medical_history.none) ? "✓" : "_",
        pm_others: past_medical_history.others
          ? past_medical_history.others
          : "_",
      };
      const familyMedicalHistory = {
        fm_allergy: Boolean(family_medical_history.allergy) ? "✓" : "_",
        fm_cvd: Boolean(family_medical_history.cerebrovascular_disease)
          ? "✓"
          : "_",
        fm_emphysema: Boolean(family_medical_history.emphysema) ? "✓" : "_",
        fm_hepa: Boolean(family_medical_history.hepatitis) ? "✓" : "_",
        fm_mi: Boolean(family_medical_history.mental_illness) ? "✓" : "_",
        fm_ulcer: Boolean(family_medical_history.peptic_ulcer) ? "✓" : "_",
        fm_thyd: Boolean(family_medical_history.thyroid_disease) ? "✓" : "_",
        fm_asthma: Boolean(family_medical_history.asthma) ? "✓" : "_",
        fm_cad: Boolean(family_medical_history.coronary_artery_disease)
          ? "✓"
          : "_",
        fm_epilepsy: Boolean(family_medical_history.epilepsy_seizure_disorder)
          ? "✓"
          : "_",
        fm_hyper: Boolean(family_medical_history.hyperlipidemia) ? "✓" : "_",
        fm_pneumonia: Boolean(family_medical_history.pneumonia) ? "✓" : "_",
        fm_uti: Boolean(family_medical_history.urinary_tract_infection)
          ? "✓"
          : "_",
        fm_cancer: Boolean(family_medical_history.cancer) ? "✓" : "_",
        fm_diabetes: Boolean(family_medical_history.diabetes_mellitus)
          ? "✓"
          : "_",
        fm_extube: Boolean(family_medical_history.extrapulmonary_tuberculosis)
          ? "✓"
          : "_",
        fm_pulmtube: Boolean(family_medical_history.pulmonary_tuberculosis)
          ? "✓"
          : "_",
        fm_none: Boolean(family_medical_history.none) ? "✓" : "_",
        fm_others: family_medical_history.others
          ? family_medical_history.others
          : "_",
      };
      const socialHistory = {
        smoke_no: Boolean(patient_info.smoking_status === "no") ? "✓" : "_",
        smoke_quit: Boolean(patient_info.smoking_status === "quit") ? "✓" : "_",
        smoke_yes: Boolean(patient_info.smoking_status === "yes") ? "✓" : "_",
        drink_no: Boolean(patient_info.alcohol_status === "no") ? "✓" : "_",
        drink_quit: Boolean(patient_info.alcohol_status === "quit") ? "✓" : "_",
        drink_yes: Boolean(patient_info.alcohol_status === "yes") ? "✓" : "_",
        drug_no: Boolean(patient_info.drug_status === "no") ? "✓" : "_",
        drug_quit: Boolean(patient_info.drug_status === "quit") ? "✓" : "_",
        drug_yes: Boolean(patient_info.drug_status === "yes") ? "✓" : "_",
        sex_no: Boolean(patient_info.sexually_active === "no") ? "✓" : "_",
        sex_quit: Boolean(patient_info.sexually_active === "quit") ? "✓" : "_",
        sex_yes: Boolean(patient_info.sexually_active === "yes") ? "✓" : "_",
      };
      const physicalExamination = {
        clubbing: Boolean(physical_examination.clubbing) ? "✓" : "_",
        abpr: Boolean(physical_examination.abnormal_pupillary_reaction)
          ? "✓"
          : "_",
        decmob: Boolean(physical_examination.decreased_mobility) ? "✓" : "_",
        palen: Boolean(physical_examination.pale_nailbeds) ? "✓" : "_",
        palec: Boolean(physical_examination.pale_conjunctivae) ? "✓" : "_",
        sunkeye: Boolean(physical_examination.sunken_eyeballs) ? "✓" : "_",
        weakp: Boolean(physical_examination.weak_pulses) ? "✓" : "_",
        cerv: Boolean(physical_examination.cervical_lymphadenopathy)
          ? "✓"
          : "_",
        coldclum: Boolean(physical_examination.cold_clammy) ? "✓" : "_",
        icteric: Boolean(physical_examination.icteric_sclerae) ? "✓" : "_",
        edema: Boolean(physical_examination.edema_swelling) ? "✓" : "_",
        sunkfon: Boolean(physical_examination.sunken_fontanelle) ? "✓" : "_",
        turgor: Boolean(physical_examination.poor_skin_turgor) ? "✓" : "_",
        dry: Boolean(physical_examination.dry_mucous_membrane) ? "✓" : "_",
        cyan: Boolean(physical_examination.cyanosis_mottled_skin)
          ? "✓"
          : "_",
        rash: Boolean(physical_examination.rash_or_itching) ? "✓" : "_",
        skin_normal: Boolean(physical_examination.normal_skin) ? "✓" : "_",
        heent_normal: Boolean(physical_examination.normal_heent) ? "✓" : "_",
        skin_others: physical_examination.other_skin_description
          ? physical_examination.other_skin_description
          : "_",
        heent_others: physical_examination.other_heent_description
          ? physical_examination.other_heent_description
          : "_",
      };
      const menstrualHistory = {
        mens_no: !(menstrual_history?.menarche) ? "✓" : "_",
        mens_yes: menstrual_history?.menarche ? "✓" : "_",
        menarche: menstrual_history?.menarche ? menstrual_history.menarche : 'n/a',
        date_of_last_period: menstrual_history?.last_menstrual_date || 'n/a',
        duration: menstrual_history?.menstrual_duration || 'n/a',
        interval: menstrual_history?.menstrual_interval || '_',
        pads: menstrual_history?.pads_per_day || 'n/a',
        onset_intercourse: menstrual_history?.onset_sexual_intercourse || 'n/a',
        birth_control_method: menstrual_history?.birth_control_method || 'n/a',
        meno_no: !Boolean(menstrual_history?.is_menopause) ? "✓" : "_",
        meno_yes: Boolean(menstrual_history?.is_menopause) ? "✓" : "_",
      };
      const pregnancyHistory = {
        preg_no: !(pregnancy_history?.gravidity) ? "✓" : "_",
        preg_yes: pregnancy_history?.gravidity ? "✓" : "_",
        gravidity: pregnancy_history?.gravidity || 'n/a',
        parity: pregnancy_history?.parity || 'n/a',
        delivery: pregnancy_history?.delivery_types || 'n/a',
        num_full_term: pregnancy_history?.full_term_pregnancies || 'n/a',
        num_prema: pregnancy_history?.premature_pregnancies || 'n/a',
        num_abort: pregnancy_history?.abortions || 'n/a',
        num_living: pregnancy_history?.living_children || 'n/a',
        pre_eclampsia: pregnancy_history?.pre_eclampsia || 'n/a',
        fam_planning_no: pregnancy_history?.family_planning_access === 'no' ? "✓" : "_",
        fam_planning_yes: pregnancy_history?.family_planning_access === 'yes' ? "✓" : "_",
      };
      doc.setData({
        date: new Date(patient_info.original_datetime).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),
        time: new Date(patient_info.original_datetime).toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "numeric",
          }
        ),
        ...patientInfo,
        ...vitalSigns,
        ...pediatricClient,
        ...chiefOfComplaint,
        ...pastMedicalHistory,
        ...familyMedicalHistory,
        ...socialHistory,
        ...physicalExamination,
        ...menstrualHistory,
        ...pregnancyHistory,
        diagnosis: diagnosis,
        plan: plan,
      });
      try {
        doc.render();
        const blob = doc.getZip().generate({ type: "blob" });
        saveAs(blob, `Report.docx`);
      } catch (renderError) {
        console.error("Error rendering the docx template:", renderError);
      }
    } catch (error) {
      console.error("Error loading the template file:", error);
    }
  };

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
            {isLoading || !data ? (
              <div className="flex flex-col gap-2 w-full animate-pulse px-1">
                <div className={`self-start p-2 px-10 bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`bg-${selectedTheme}-800 w-full py-[1px]`}></div>
                <div className={`self-end p-2 px-20 bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`bg-${selectedTheme}-800 w-full py-[1px]`}></div>
                <div className={`self-end p-2 px-20 py-10 bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-2 w-full py-52 bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-4 w-full bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-4 w-full bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-4 w-full bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-4 w-full bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-4 w-full bg-${selectedTheme}-800 rounded-md`}> </div>
                <div className={`p-4 w-full bg-${selectedTheme}-800 rounded-md`}> </div>
              </div>
            ) : (
              data?.map((val, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-start items-start gap-2 w-full h-auto px-1"
                >
                  <div
                    className={`self-start justify-self-start w-full`}
                  >
                    <button
                      onClick={() => generateDocxFromTemplate()}
                      className={`bg-${selectedTheme}-800 hover:bg-${selectedTheme}-800 text-${selectedTheme}-200 hover:text-${selectedTheme}-100 transition-colors hover:border-${selectedTheme}-950 border-${selectedTheme}-50 font-semibold p-2 flex items-center justify-center rounded-md`}
                    >
                      Export
                    </button>
                  </div>
                  <div
                    className={`self-end justify-self-end pb-2 w-full`}
                  >
                    <div className={`bg-${selectedTheme}-800 w-full py-[1px] my-1`}></div>
                    <p className="text-sm md:text-base lg:text-lg text-end grow w-full font-semibold">
                      Family Number: 
                      <span
                        className={`text-sm md:text-base lg:text-lg font-bold p-1 grow w-full pb-[0.15rem]`}
                      >
                        {val.patient_info[0].family_number}
                      </span>
                    </p>
                    <div className={`bg-${selectedTheme}-800 w-full py-[1px] my-1`}></div>
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
                        className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                        className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                        className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                        className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                        className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                              const pastMedicalHistory = Object.entries(
                                val.past_medical_history[0]
                              )
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, " "));
                              return pastMedicalHistory.length > 0
                                ? pastMedicalHistory.join(", ")
                                : pastMedicalHistory;
                            })()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">
                            Family Medical History: 
                          </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {(() => {
                              const familyMedicalHistory = Object.entries(
                                val.family_medical_history[0]
                              )
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, " "));
                              return familyMedicalHistory.length > 0
                                ? familyMedicalHistory.join(", ")
                                : familyMedicalHistory;
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
                        className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                      className={
                        isPhysicalExaminationVisible ? "block" : "hidden"
                      }
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
                              const skinExamination = Object.entries(
                                val.physical_examination.skin_examination[0]
                              )
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, " "));
                              return skinExamination.length > 0
                                ? skinExamination.join(", ")
                                : skinExamination;
                            })()}
                          </span>
                        </p>
                        <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                          <p className="text-nowrap">HEENT Descriptions: </p>
                          <span
                            className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                          >
                            {(() => {
                              const heentExamination = Object.entries(
                                val.physical_examination.heent_examination[0]
                              )
                                .filter(([_, vit]) => Boolean(vit))
                                .map(([key]) => key.replace(/_/g, " "));
                              return heentExamination.length > 0
                                ? heentExamination.join(", ")
                                : heentExamination;
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
                          className={`text-lg text-${selectedTheme}-800 font-bold`}
                        >
                          Menstrual History:
                        </p>
                        <button
                          onClick={() =>
                            setIsMenstrualHistoryVisible((prev) => !prev)
                          }
                          className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                        >
                          <MdKeyboardArrowDown
                            className={`h-full w-full ${
                              isMenstrualHistoryVisible && "rotate-180"
                            }`}
                          />
                        </button>
                      </div>
                      <div
                        className={
                          isMenstrualHistoryVisible ? "block" : "hidden"
                        }
                      >
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
                                  {typeof vit === "boolean"
                                    ? String(vit)
                                    : String(vit).length > 0
                                    ? vit
                                    : "n/a"}
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
                          className={`text-lg text-${selectedTheme}-800 font-bold`}
                        >
                          Pregnancy History:
                        </p>
                        <button
                          onClick={() =>
                            setIsPregnancyHistoryVisible((prev) => !prev)
                          }
                          className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                        >
                          <MdKeyboardArrowDown
                            className={`h-full w-full ${
                              isPregnancyHistoryVisible && "rotate-180"
                            }`}
                          />
                        </button>
                      </div>
                      <div
                        className={
                          isPregnancyHistoryVisible ? "block" : "hidden"
                        }
                      >
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
                                  {typeof vit === "boolean"
                                    ? String(vit)
                                    : String(vit).length > 0
                                    ? vit
                                    : "n/a"}
                                </span>
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {val.diagnosis.length > 0 && (
                    <div
                      className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                    >
                      <div className="flex justify-between items-center p-2">
                        <p
                          className={`text-lg text-${selectedTheme}-800 font-bold`}
                        >
                          Diagnosis:
                        </p>
                        <button
                          onClick={() => setIsDiagnosisVisible((prev) => !prev)}
                          className={`size-8 flex items-center rounded-sm bg-${selectedTheme}-200 hover:bg-${selectedTheme}-300 active:bg-${selectedTheme}-100 drop-shadow-md`}
                        >
                          <MdKeyboardArrowDown
                            className={`h-full w-full ${
                              isDiagnosisVisible && "rotate-180"
                            }`}
                          />
                        </button>
                      </div>
                      <div className={isDiagnosisVisible ? "block" : "hidden"}>
                        <div
                          className={`p-2 self-start justify-self-start w-full text-${selectedTheme}-800 gap-2`}
                        >
                          <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                            <p className="text-nowrap">Primary Diagnosis: </p>
                            <span
                              className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                            >
                              {val.diagnosis[0].primary_diagnosis || "n/a"}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                            <p className="text-nowrap">Secondary Diagnosis: </p>
                            <span
                              className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                            >
                              {val.diagnosis[0].secondary_diagnosis || "n/a"}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                            <p className="text-nowrap">Cases: </p>
                            <span
                              className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                            >
                              {val.diagnosis[0].cases || "n/a"}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                            <p className="text-nowrap">Symptoms: </p>
                            <span
                              className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                            >
                              {val.diagnosis[0].symptoms || "n/a"}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                            <p className="text-nowrap">Diagnosis Details: </p>
                            <span
                              className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                            >
                              {val.diagnosis[0].symptoms || "n/a"}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm lg:text-base flex flex-col md:flex-col lg:flex-row gap-1 justify-between items-start md:items-start lg:items-center font-semibold capitalize w-full">
                            <p className="text-nowrap">
                              Follow up and Recommendations: 
                            </p>
                            <span
                              className={`text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full`}
                            >
                              {val.diagnosis[0].follow_up_recommendations ||
                                "n/a"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {val.prescriptions.length > 0 && (
                    <div
                      className={`p-2 w-full h-full bg-${selectedTheme}-200 rounded-md`}
                    >
                      <div className="flex justify-between items-center p-2">
                        <p
                          className={`text-lg text-${selectedTheme}-800 font-bold`}
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
                        className={`p-2 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 ${
                          isPrescriptionsVisible ? "block" : "hidden"
                        }`}
                      >
                        {val?.prescriptions?.length > 0 && 
                          val.prescriptions.map((prev, idx) => (
                            <div
                              key={`prescription-${idx}`} 
                              className={`text-xs md:text-sm lg:text-base text-${selectedTheme}-800 font-semibold flex flex-col gap-2 p-4 border-[1px] border-${selectedTheme}-600 rounded-md bg-${selectedTheme}-200 drop-shadow-md tracking-tight`}
                            >
                              <div className="mb-2">
                                {Object.entries(prev).map(([k, v], i) => (
                                  <React.Fragment key={`entry-${k}-${i}`}>
                                    <span className="block">
                                      {k.replace(/_/g, " ")}:{" "}
                                      <span className="text-wrap text-lg font-bold p-1 text-start pb-[0.15rem] border-b-[1px] border-gray-800 grow w-full">
                                        {v}
                                      </span>
                                    </span>
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          ))
                        }
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
