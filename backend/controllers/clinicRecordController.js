const { convertDate } = require("../globalFunctions");
const dbModel = require("../models/database_model");

class ClinicRecordController {
  async addCinicRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const {
        citizen_family_id,
        civil_status,
        philhealth_number,
        philhealth_dpin,
        philhealth_category,
        vital_signs,
        isPediatric,
        pediatric_client,
        chief_of_complaint,
        history_of_present_illness,
        past_medical_history,
        family_medical_history,
        smoking_status,
        alcohol_status,
        illicit_drug_status,
        sexually_active,
        physical_examination,
        menstrual_history,
        isMenstrual,
        pregnancy_history,
        isPregnancy,
        diagnosis_plan,
        prescriptions,
        staff_id,
        dateTime,
        contact_number,
      } = req.body;

      const insertClinicRecordQuery =
        "INSERT INTO `citizen_clinical_record`(`staff_id`, `citizen_family_id`, `civil_status`, `philhealth_number`, `philhealth_dpin`, `philhealth_category`, `chief_of_complaint`, `history_of_present_illness`, `smoking_status`, `alcohol_status`, `illicit_drug_status`, `sexually_active`, `datetime_issued`, `contact_number`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertCitizenRecordPayload = [
        staff_id,
        citizen_family_id,
        civil_status,
        philhealth_number,
        philhealth_dpin,
        philhealth_category,
        chief_of_complaint,
        history_of_present_illness,
        smoking_status,
        alcohol_status,
        illicit_drug_status,
        sexually_active,
        dateTime,
        contact_number !== null ? contact_number : "",
      ];
      const insertClinicRecordResponse = await dbModel.query(
        insertClinicRecordQuery,
        insertCitizenRecordPayload
      );

      const record_id = insertClinicRecordResponse.insertId;

      const {
        blood_pressure,
        temperature,
        heart_rate,
        weight,
        height,
        pulse_rate,
        respiratory_rate,
        bmi,
        oxygen_saturation,
      } = vital_signs;
      const insertVitalSignsQuery =
        "INSERT INTO `ccr_vital_signs`(`record_id`, `blood_pressure`, `temperature`, `heart_rate`, `weight`, `height`, `pulse_rate`, `respiratory_rate`, `bmi`, `oxygen_saturation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertVitalSignsPayload = [
        record_id,
        blood_pressure,
        temperature,
        heart_rate,
        weight,
        height,
        pulse_rate,
        respiratory_rate,
        bmi,
        oxygen_saturation,
      ];
      await dbModel.query(insertVitalSignsQuery, insertVitalSignsPayload);

      if (isPediatric) {
        const { length, waist, head, hip, limb, muac, skinfold } =
          pediatric_client;
        const insertPediatricQuery =
          "INSERT INTO `ccr_pediatric_client` (`record_id`, `length`, `limb`, `waist`, `mua_circumference`, `head_circumference`, `skinfold`, `hip`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPediatricPayload = [
          record_id,
          length,
          waist,
          head,
          hip,
          limb,
          muac,
          skinfold,
        ];
        await dbModel.query(insertPediatricQuery, insertPediatricPayload);
      }

      if (past_medical_history) {
        const {
          allergy,
          cerebrovascular_disease,
          emphysema,
          hepatitis,
          mental_illness,
          peptic_ulcer,
          thyroid_disease,
          asthma,
          coronary_artery_disease,
          epilepsy_seizure_disorder,
          hyperlipidemia,
          pneumonia,
          urinary_tract_infection,
          cancer,
          diabetes_mellitus,
          extrapulmonary_tuberculosis,
          pulmonary_tuberculosis,
          none,
          others,
        } = past_medical_history;
        const insertPastMedicalHistoryQuery =
          "INSERT INTO `ccr_past_medical_history` (`record_id`, `allergy`, `cerebrovascular_disease`, `emphysema`, `hepatitis`, `mental_illness`, `peptic_ulcer`, `thyroid_disease`, `asthma`, `coronary_artery_disease`, `epilepsy_seizure_disorder`, `hyperlipidemia`, `pneumonia`, `urinary_tract_infection`, `cancer`, `diabetes_mellitus`, `extrapulmonary_tuberculosis`, `pulmonary_tuberculosis`, `none`, `others`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPastMedicalHistoryPayload = [
          record_id,
          allergy,
          cerebrovascular_disease,
          emphysema,
          hepatitis,
          mental_illness,
          peptic_ulcer,
          thyroid_disease,
          asthma,
          coronary_artery_disease,
          epilepsy_seizure_disorder,
          hyperlipidemia,
          pneumonia,
          urinary_tract_infection,
          cancer,
          diabetes_mellitus,
          extrapulmonary_tuberculosis,
          pulmonary_tuberculosis,
          none,
          others,
        ];
        await dbModel.query(
          insertPastMedicalHistoryQuery,
          insertPastMedicalHistoryPayload
        );
      }

      if (family_medical_history) {
        const {
          allergy,
          cerebrovascular_disease,
          emphysema,
          hepatitis,
          mental_illness,
          peptic_ulcer,
          thyroid_disease,
          asthma,
          coronary_artery_disease,
          epilepsy_seizure_disorder,
          hyperlipidemia,
          pneumonia,
          urinary_tract_infection,
          cancer,
          diabetes_mellitus,
          extrapulmonary_tuberculosis,
          pulmonary_tuberculosis,
          none,
          others,
        } = family_medical_history;
        const insertFamilyMedicalHistoryQuery =
          "INSERT INTO `ccr_family_medical_history` (`record_id`, `allergy`, `cerebrovascular_disease`, `emphysema`, `hepatitis`, `mental_illness`, `peptic_ulcer`, `thyroid_disease`, `asthma`, `coronary_artery_disease`, `epilepsy_seizure_disorder`, `hyperlipidemia`, `pneumonia`, `urinary_tract_infection`, `cancer`, `diabetes_mellitus`, `extrapulmonary_tuberculosis`, `pulmonary_tuberculosis`, `none`, `others`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertFamilyMedicalHistoryPayload = [
          record_id,
          allergy,
          cerebrovascular_disease,
          emphysema,
          hepatitis,
          mental_illness,
          peptic_ulcer,
          thyroid_disease,
          asthma,
          coronary_artery_disease,
          epilepsy_seizure_disorder,
          hyperlipidemia,
          pneumonia,
          urinary_tract_infection,
          cancer,
          diabetes_mellitus,
          extrapulmonary_tuberculosis,
          pulmonary_tuberculosis,
          none,
          others,
        ];
        await dbModel.query(
          insertFamilyMedicalHistoryQuery,
          insertFamilyMedicalHistoryPayload
        );
      }

      const insertPhysicalExaminationQuery =
        "INSERT INTO `ccr_physical_examination` (`record_id`) VALUES (?)";
      const insertPhysicalExaminationPayload = [record_id];
      const insertPhysicalExaminationResponse = await dbModel.query(
        insertPhysicalExaminationQuery,
        insertPhysicalExaminationPayload
      );

      const physical_examination_id =
        insertPhysicalExaminationResponse.insertId;

      const {
        clubbing,
        decreased_mobility,
        pale_nailbeds,
        weak_pulses,
        cold_clammy,
        edema_swelling,
        poor_skin_turgor,
        cyanosis_mottled_skin,
        essentially_normal: skin_essentially_normal,
        rash_or_itching,
        other_skin_description,
      } = physical_examination.skin_descriptions;
      const insertPeSkinQuery =
        "INSERT INTO `ccr_physical_examination_skin_descriptions`(`physical_examination_id`, `clubbing`, `decreased_mobility`, `pale_nailbeds`, `weak_pulses`, `cold_clammy`, `edema_swelling`, `poor_skin_turgor`, `cyanosis_mottled_skin`, `essentially_normal`, `rash_or_itching`, `other_skin_description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertPeSkinPayload = [
        physical_examination_id,
        clubbing,
        decreased_mobility,
        pale_nailbeds,
        weak_pulses,
        cold_clammy,
        edema_swelling,
        poor_skin_turgor,
        cyanosis_mottled_skin,
        skin_essentially_normal,
        rash_or_itching,
        other_skin_description,
      ];
      await dbModel.query(insertPeSkinQuery, insertPeSkinPayload);

      const {
        abnormal_pupillary_reaction,
        essentially_normal: heent_essentially_normal,
        sunken_eyeballs,
        cervical_lymphadenopathy,
        icteric_sclerae,
        sunken_fontanelle,
        dry_mucous_membrane,
        pale_conjunctivae,
        other_heent_description,
      } = physical_examination.heent_descriptions;
      const insertPeHeentQuery =
        "INSERT INTO `ccr_physical_examination_heent_descriptions`(`physical_examination_id`, `abnormal_pupillary_reaction`, `essentially_normal`, `sunken_eyeballs`, `cervical_lymphadenopathy`, `icteric_sclerae`, `sunken_fontanelle`, `dry_mucous_membrane`, `pale_conjunctivae`, `other_heent_description`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertPeHeentPayload = [
        physical_examination_id,
        abnormal_pupillary_reaction,
        heent_essentially_normal,
        sunken_eyeballs,
        cervical_lymphadenopathy,
        icteric_sclerae,
        sunken_fontanelle,
        dry_mucous_membrane,
        pale_conjunctivae,
        other_heent_description,
      ];
      await dbModel.query(insertPeHeentQuery, insertPeHeentPayload);

      if (isMenstrual) {
        const {
          menarche,
          last_menstrual_date,
          menstrual_interval,
          menstrual_duration,
          cycle_length,
          pads_per_day,
          onset_sexual_intercourse,
          birth_control_method,
          is_menopause,
        } = menstrual_history;
        const insertMenstrualHistoryQuery =
          "INSERT INTO `ccr_menstrual_history`(`record_id`, `menarche`, `last_menstrual_date`, `menstrual_interval`, `menstrual_duration`, `cycle_length`, `pads_per_day`, `onset_sexual_intercourse`, `birth_control_use`, `birth_control_method`, `is_menopause`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertMenstrualHistoryPayload = [
          record_id,
          menarche,
          last_menstrual_date,
          menstrual_interval,
          menstrual_duration,
          cycle_length,
          pads_per_day,
          onset_sexual_intercourse,
          birth_control_method.length > 0,
          birth_control_method,
          is_menopause,
        ];
        await dbModel.query(
          insertMenstrualHistoryQuery,
          insertMenstrualHistoryPayload
        );
      }

      if (isPregnancy) {
        const {
          gravidity,
          parity,
          delivery_types,
          full_term_pregnancies,
          premature_pregnancies,
          abortions,
          living_children,
          pre_eclampsia,
          family_planning_access,
        } = pregnancy_history;
        const insertPregnancyHistoryQuery =
          "INSERT INTO `ccr_pregnancy_history`(`record_id`, `gravidity`, `parity`, `delivery_types`, `full_term_pregnancies`, `premature_pregnancies`, `abortions`, `living_children`, `pre_eclampsia`, `family_planning_access`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPregnancyHistoryPayload = [
          record_id,
          gravidity,
          parity,
          delivery_types,
          full_term_pregnancies,
          premature_pregnancies,
          abortions,
          living_children,
          pre_eclampsia,
          family_planning_access,
        ];
        await dbModel.query(
          insertPregnancyHistoryQuery,
          insertPregnancyHistoryPayload
        );
      }

      const {
        primary_diagnosis,
        secondary_diagnosis,
        cases,
        severity,
        symptoms,
        tests_conducted,
        diagnosis_details,
        follow_up_recommendations,
      } = diagnosis_plan;
      const insertDiagnosisQuery =
        "INSERT INTO `ccr_diagnosis`(`record_id`, `primary_diagnosis`, `secondary_diagnosis`, `cases`, `severity`, `symptoms`, `tests_conducted`, `diagnosis_details`, `follow_up_recommendations`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertDiagnosisPayload = [
        record_id,
        primary_diagnosis,
        secondary_diagnosis,
        cases,
        severity,
        symptoms,
        tests_conducted,
        diagnosis_details,
        follow_up_recommendations,
      ];
      await dbModel.query(insertDiagnosisQuery, insertDiagnosisPayload);

      for (const medicine of prescriptions) {
        const {
          item_id,
          item_name,
          dosage,
          intake_method,
          frequency,
          duration,
          instructions,
          refill_allowed,
          quantity_prescribed,
        } = medicine;
        const insertPrescriptionsQuery =
          "INSERT INTO `ccr_prescriptions` (`record_id`, `item_id`, `item_name`, `dosage`, `intake_method`, `frequency`, `duration`, `instructions`, `refill_allowed`, `quantity_prescribed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPrescriptionsPayload = [
          record_id,
          item_id,
          item_name,
          dosage,
          intake_method,
          frequency,
          duration,
          instructions,
          refill_allowed,
          quantity_prescribed,
        ];
        await dbModel.query(
          insertPrescriptionsQuery,
          insertPrescriptionsPayload
        );

        if (item_id) {
          const [foundItem] = await dbModel.query(
            "SELECT `quantity` FROM `pharmacy_inventory` WHERE `item_id` = ?",
            [item_id]
          );
          const newQuantity =
            parseInt(foundItem.quantity) - quantity_prescribed;
          dbModel.query(
            "UPDATE `pharmacy_inventory` SET `quantity` = ? WHERE `item_id` = ?;",
            [newQuantity, item_id]
          );
        }
      }

      const insertHistoryQuery =
        "INSERT INTO `citizen_history` (`family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const historyPayload = [
        citizen_family_id,
        "clinic form",
        `clinic form filled`,
        staff_id,
        dateTime,
      ];
      await dbModel.query(insertHistoryQuery, historyPayload);

      const createStaffHistoryQuery =
        "INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const staffHistoryValues = [
        staff_id,
        "created a clinic form",
        "filled up a clinic form",
        citizen_family_id,
        dateTime,
      ];
      await dbModel.query(createStaffHistoryQuery, staffHistoryValues);

      return res.status(200).json({
        status: 200,
        message: "Successfully Created A Clinic Form!",
        insert_id: record_id,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async getHistoricalData(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getHistoricalDataQuery = `
        SELECT
          ccr.record_id,
          meds.username,
          CONCAT(cit.citizen_firstname, ' ', cit.citizen_lastname) AS fullname,
          cit.citizen_number AS phone_number,
          ccr.chief_of_complaint,
          ccr.datetime_issued
        FROM 
          citizen_clinical_record ccr
        INNER JOIN
          medicalstaff meds
        ON
          meds.staff_id = ccr.staff_id
        INNER JOIN
          citizen cit
        ON
          cit.citizen_family_id = ccr.citizen_family_id;`;
      const getHistoricalDataResponse = await dbModel.query(
        getHistoricalDataQuery
      );
      const newResponse = getHistoricalDataResponse.map((prev) => ({
        ...prev,
        datetime_issued: convertDate(prev.datetime_issued),
      }));

      return res.status(200).json({
        status: 200,
        data: newResponse,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

  async getClinicRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();

      const getClinicRecordQuery = `
        SELECT
          ccr.record_id,
          meds.username,
          cit.citizen_family_id as family_number,
          cit.citizen_firstname AS firstname,
          cit.citizen_middlename AS middlename,
          cit.citizen_lastname AS lastname,
          cit.citizen_gender AS gender,
          cit.citizen_barangay AS barangay,
          cit.citizen_number AS phone_number,
          cit.citizen_birthdate AS birthdate,
          ccr.civil_status,
          ccr.philhealth_number,
          ccr.philhealth_dpin,
          ccr.philhealth_category,
          ccr.chief_of_complaint,
          ccr.history_of_present_illness AS present_illness,
          ccr.smoking_status,
          ccr.alcohol_status,
          ccr.illicit_drug_status AS drug_status,
          ccr.sexually_active,
          ccr.datetime_issued
        FROM 
          citizen_clinical_record ccr
        INNER JOIN
          medicalstaff meds
        ON
          meds.staff_id = ccr.staff_id
        INNER JOIN
          citizen cit
        ON
          cit.citizen_family_id = ccr.citizen_family_id
        WHERE record_id = ?`;
      const patientInfo = await dbModel.query(
        getClinicRecordQuery,
        req.params.id
      );

      const newPatientInfo = patientInfo.map((prev) => ({
        ...prev,
        philhealth_number: prev.philhealth_number
          ? prev.philhealth_number.substring(0, 2) +
            Array.from({
              length: prev.philhealth_number.substring(
                2,
                prev.philhealth_number.length - 2
              ).length,
            })
              .map(() => "*")
              .join("") +
            prev.philhealth_number.substring(prev.philhealth_number.length - 2)
          : "",
        datetime_issued: convertDate(prev.datetime_issued),
        original_datetime: prev.datetime_issued,
        birthdate: convertDate(prev.birthdate, false),
      }));

      const getVitalSignsQuery = `
        SELECT 
          vit.blood_pressure, 
          vit.temperature, 
          vit.heart_rate, 
          vit.weight, 
          vit.height, 
          vit.pulse_rate, 
          vit.respiratory_rate, 
          vit.bmi, 
          vit.oxygen_saturation
        FROM  
          ccr_vital_signs vit
        INNER JOIN
          citizen_clinical_record ccr
        ON
          ccr.record_id = vit.record_id
        WHERE
          ccr.record_id = ?;`;
      const vitalSigns = await dbModel.query(getVitalSignsQuery, req.params.id);

      const getPastMedicalHistoryQuery = `
        SELECT allergy, cerebrovascular_disease, emphysema, hepatitis, mental_illness, peptic_ulcer, thyroid_disease, asthma, coronary_artery_disease, epilepsy_seizure_disorder, hyperlipidemia, pneumonia, urinary_tract_infection, cancer, diabetes_mellitus, extrapulmonary_tuberculosis, pulmonary_tuberculosis, none, others FROM ccr_past_medical_history WHERE record_id = ?;`;
      const pastMedicalHistory = await dbModel.query(
        getPastMedicalHistoryQuery,
        req.params.id
      );

      const getFamilyMedicalHistoryQuery = `
        SELECT allergy, cerebrovascular_disease, emphysema, hepatitis, mental_illness, peptic_ulcer, thyroid_disease, asthma, coronary_artery_disease, epilepsy_seizure_disorder, hyperlipidemia, pneumonia, urinary_tract_infection, cancer, diabetes_mellitus, extrapulmonary_tuberculosis, pulmonary_tuberculosis, none, others FROM ccr_family_medical_history WHERE record_id = ?;`;
      const familyMedicalHistory = await dbModel.query(
        getFamilyMedicalHistoryQuery,
        req.params.id
      );

      const getSkinExaminationQuery = `
        SELECT
          skin.clubbing,
          skin.cold_clammy,
          skin.cyanosis_mottled_skin,
          skin.decreased_mobility,
          skin.edema_swelling,
          skin.essentially_normal,
          skin.other_skin_description,
          skin.pale_nailbeds,
          skin.poor_skin_turgor,
          skin.rash_or_itching,
          skin.weak_pulses
        FROM
          ccr_physical_examination pe
        INNER JOIN
          ccr_physical_examination_skin_descriptions skin
        ON
          pe.physical_examination_id = skin.physical_examination_id
        WHERE
          record_id = ?;`;
      const getSkinExamination = await dbModel.query(
        getSkinExaminationQuery,
        req.params.id
      );

      const getHeentExaminationQuery = `
        SELECT
          heent.abnormal_pupillary_reaction, 
          heent.essentially_normal, 
          heent.sunken_eyeballs, 
          heent.cervical_lymphadenopathy, 
          heent.icteric_sclerae, 
          heent.sunken_fontanelle, 
          heent.dry_mucous_membrane, 
          heent.pale_conjunctivae, 
          heent.other_heent_description
        FROM
          ccr_physical_examination pe
        INNER JOIN
          ccr_physical_examination_heent_descriptions heent
        ON
          pe.physical_examination_id = heent.physical_examination_id
        WHERE
          record_id = ?;`;
      const getHeentExamination = await dbModel.query(
        getHeentExaminationQuery,
        req.params.id
      );

      const birthdate = new Date(patientInfo[0].birthdate);
      const age = new Date().getFullYear() - birthdate.getFullYear();
      let pediatricClient = [];
      if (age < 2) {
        const getPediatricClientQuery = `
          SELECT
            ped.length,
            ped.limb,
            ped.waist,
            ped.mua_circumference,
            ped.head_circumference,
            ped.skinfold,
            ped.hip
          FROM
            ccr_pediatric_client ped
          INNER JOIN
            citizen_clinical_record rec
          ON
            rec.record_id = ped.record_id
          WHERE
            rec.record_id = ?;`;
        pediatricClient = await dbModel.query(
          getPediatricClientQuery,
          req.params.id
        );
      }
      let menstrualHistory = [];
      let pregnancyHistory = [];
      if (patientInfo[0].gender.toLowerCase() === "female") {
        const getMenstrualHistoryQuery = `
          SELECT
            mens.menarche, 
            mens.last_menstrual_date, 
            mens.menstrual_interval,
            mens.menstrual_duration, 
            mens.cycle_length, 
            mens.pads_per_day, 
            mens.onset_sexual_intercourse, 
            mens.birth_control_use, 
            mens.birth_control_method, 
            mens.is_menopause
          FROM
            ccr_menstrual_history mens
          INNER JOIN
            citizen_clinical_record rec
          ON
            rec.record_id = mens.record_id
          WHERE
            rec.record_id = ?;`;
        const mens = await dbModel.query(
          getMenstrualHistoryQuery,
          req.params.id
        );
        menstrualHistory = mens.map(prev => ({
          ...prev,
          last_menstrual_date: convertDate(prev.last_menstrual_date, false),
          birth_control_use: Boolean(prev.birth_control_use),
          is_menopause: Boolean(prev.is_menopause)
        }))
        const getPregnancyHistoryQuery = `
          SELECT
            preg.gravidity, 
            preg.parity, 
            preg.delivery_types, 
            preg.full_term_pregnancies, 
            preg.premature_pregnancies, 
            preg.abortions, 
            preg.living_children, 
            preg.pre_eclampsia, 
            preg.family_planning_access
          FROM
            ccr_pregnancy_history preg
          INNER JOIN
            citizen_clinical_record ccr
          ON
            ccr.record_id = preg.record_id
          WHERE 
            ccr.record_id = ?;`;
        pregnancyHistory = await dbModel.query(
          getPregnancyHistoryQuery,
          req.params.id
        );
      }

      const getDiagnosisQuery = `
        SELECT
          diagnosis.primary_diagnosis, 
          diagnosis.secondary_diagnosis, 
          diagnosis.cases, 
          diagnosis.severity, 
          diagnosis.symptoms, 
          diagnosis.tests_conducted, 
          diagnosis.diagnosis_details, 
          diagnosis.follow_up_recommendations
        FROM
          ccr_diagnosis diagnosis
        INNER JOIN
          citizen_clinical_record ccr
        ON 
          ccr.record_id = diagnosis.record_id
        WHERE
          ccr.record_id = ?;`;
      const diagnosis = await dbModel.query(getDiagnosisQuery, req.params.id);

      const getPrescriptionsQuery = `
        SELECT
          pres.item_name, 
          pres.dosage, 
          pres.intake_method, 
          pres.frequency, 
          pres.duration, 
          pres.instructions, 
          pres.refill_allowed, 
          pres.quantity_prescribed
        FROM
          ccr_prescriptions pres
        INNER JOIN
          citizen_clinical_record ccr
        ON 
          ccr.record_id = pres.record_id
        WHERE
          ccr.record_id = ?;`;
      const prescriptions = await dbModel.query(
        getPrescriptionsQuery,
        req.params.id
      );

      return res.status(200).json({
        status: 200,
        data: {
          patient_info: newPatientInfo,
          vital_signs: vitalSigns,
          pediatric_client: pediatricClient,
          past_medical_history: pastMedicalHistory,
          family_medical_history: familyMedicalHistory,
          physical_examination: {
            skin_examination: getSkinExamination,
            heent_examination: getHeentExamination,
          },
          menstrual_history: menstrualHistory,
          pregnancy_history: pregnancyHistory,
          diagnosis: diagnosis,
          prescriptions: prescriptions,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error,
      });
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }
}

module.exports = new ClinicRecordController();
