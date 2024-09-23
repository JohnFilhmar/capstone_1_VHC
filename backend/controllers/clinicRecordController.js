const dbModel = require('../models/database_model');

class ClinicRecordController {
  
  async addCinicRecord(req, res) {
    let connection;
    try {
      connection = await dbModel.getConnection();
      const { citizen_family_id, civil_status, philhealth_number, philhealth_dpin, philhealth_category, vital_signs, isPediatric, pediatric_client, chief_of_complaint, history_of_present_illness,past_medical_history, family_medical_history, smoking_status, alcohol_status, illicit_drug_status, sexually_active, physical_examination, diagnosis_plan, prescriptions, staff_id, dateTime } = req.body;
      
      const insertClinicRecordQuery = "INSERT INTO `citizen_clinical_record`(`staff_id`, `citizen_family_id`, `civil_status`, `philhealth_number`, `philhealth_dpin`, `philhealth_category`, `chief_of_complaint`, `history_of_present_illness`, `smoking_status`, `alcohol_status`, `illicit_drug_status`, `sexually_active`, `datetime_issued`) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertCitizenRecordPayload = [staff_id, citizen_family_id, civil_status, philhealth_number, philhealth_dpin, philhealth_category, chief_of_complaint, history_of_present_illness, smoking_status, alcohol_status, illicit_drug_status, sexually_active, dateTime]
      const insertClinicRecordResponse = await dbModel.query(insertClinicRecordQuery, insertCitizenRecordPayload);

      const record_id = insertClinicRecordResponse.insertId;
      
      const { blood_pressure, temperature, heart_rate, weight, height, pulse_rate, respiratory_rate, bmi, oxygen_saturation} = vital_signs;
      const insertVitalSignsQuery = "INSERT INTO `ccr_vital_signs`(`record_id`, `blood_pressure`, `temperature`, `heart_rate`, `weight`, `height`, `pulse_rate`, `respiratory_rate`, `bmi`, `oxygen_saturation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      const insertVitalSignsPayload = [record_id, blood_pressure, temperature, heart_rate, weight, height, pulse_rate, respiratory_rate, bmi, oxygen_saturation];
      await dbModel.query(insertVitalSignsQuery, insertVitalSignsPayload);
      
      if (isPediatric) {
        const { length, waist, head, hip, limb, muac, skinfold } = pediatric_client ;
        const insertPediatricQuery = "INSERT INTO `ccr_pediatric_client` (`record_id`, `length`, `limb`, `waist`, `mua_circumference`, `head_circumference`, `skinfold`, `hip`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPediatricPayload = [record_id, length, waist, head, hip, limb, muac, skinfold];
        await dbModel.query(insertPediatricQuery, insertPediatricPayload);
      }

      if (past_medical_history) {
        const { allergy, cerebrovascular_disease, emphysema, hepatitis, mental_illness, peptic_ulcer, thyroid_disease, asthma, coronary_artery_disease, epilepsy_seizure_disorder, hyperlipidemia, pneumonia, urinary_tract_infection, cancer, diabetes_mellitus, extrapulmonary_tuberculosis, pulmonary_tuberculosis, none, others } = past_medical_history;
        const insertPastMedicalHistoryQuery = "INSERT INTO `ccr_past_medical_history` (`record_id`, `allergy`, `cerebrovascular_disease`, `emphysema`, `hepatitis`, `mental_illness`, `peptic_ulcer`, `thyroid_disease`, `asthma`, `coronary_artery_disease`, `epilepsy_seizure_disorder`, `hyperlipidemia`, `pneumonia`, `urinary_tract_infection`, `cancer`, `diabetes_mellitus`, `extrapulmonary_tuberculosis`, `pulmonary_tuberculosis`, `none`, `others`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPastMedicalHistoryPayload = [record_id, allergy, cerebrovascular_disease, emphysema, hepatitis, mental_illness, peptic_ulcer, thyroid_disease, asthma, coronary_artery_disease, epilepsy_seizure_disorder, hyperlipidemia, pneumonia, urinary_tract_infection, cancer, diabetes_mellitus, extrapulmonary_tuberculosis, pulmonary_tuberculosis, none, others];
        await dbModel.query(insertPastMedicalHistoryQuery, insertPastMedicalHistoryPayload);
      }
      
      if (family_medical_history) {
        const { allergy, cerebrovascular_disease, emphysema, hepatitis, mental_illness, peptic_ulcer, thyroid_disease, asthma, coronary_artery_disease, epilepsy_seizure_disorder, hyperlipidemia, pneumonia, urinary_tract_infection, cancer, diabetes_mellitus, extrapulmonary_tuberculosis, pulmonary_tuberculosis, none, others } = family_medical_history;
        const insertFamilyMedicalHistoryQuery = "INSERT INTO `ccr_family_medical_history` (`record_id`, `allergy`, `cerebrovascular_disease`, `emphysema`, `hepatitis`, `mental_illness`, `peptic_ulcer`, `thyroid_disease`, `asthma`, `coronary_artery_disease`, `epilepsy_seizure_disorder`, `hyperlipidemia`, `pneumonia`, `urinary_tract_infection`, `cancer`, `diabetes_mellitus`, `extrapulmonary_tuberculosis`, `pulmonary_tuberculosis`, `none`, `others`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertFamilyMedicalHistoryPayload = [record_id, allergy, cerebrovascular_disease, emphysema, hepatitis, mental_illness, peptic_ulcer, thyroid_disease, asthma, coronary_artery_disease, epilepsy_seizure_disorder, hyperlipidemia, pneumonia, urinary_tract_infection, cancer, diabetes_mellitus, extrapulmonary_tuberculosis, pulmonary_tuberculosis, none, others];
        await dbModel.query(insertFamilyMedicalHistoryQuery, insertFamilyMedicalHistoryPayload);
      }

      const insertPhysicalExaminationQuery = "INSERT INTO `ccr_physical_examination` (`record_id`) VALUES (?)";
      const insertPhysicalExaminationPayload = [record_id];
      const insertPhysicalExaminationResponse = await dbModel.query(insertPhysicalExaminationQuery, insertPhysicalExaminationPayload);

      const physical_examination_id = insertPhysicalExaminationResponse.insertId;

      const { clubbing, decreased_mobility, pale_nailbeds, weak_pulses, cold_clammy, edema_swelling, poor_skin_turgor, cyanosis_mottled_skin, essentially_normal: skin_essentially_normal, rash_or_itching } = physical_examination.skin_descriptions;
      const insertPeSkinQuery = "INSERT INTO `ccr_physical_examination_skin_descriptions`(`physical_examination_id`, `clubbing`, `decreased_mobility`, `pale_nailbeds`, `weak_pulses`, `cold_clammy`, `edema_swelling`, `poor_skin_turgor`, `cyanosis_mottled_skin`, `essentially_normal`, `rash_or_itching`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertPeSkinPayload = [physical_examination_id, clubbing, decreased_mobility, pale_nailbeds, weak_pulses, cold_clammy, edema_swelling, poor_skin_turgor, cyanosis_mottled_skin,  skin_essentially_normal, rash_or_itching];
      await dbModel.query(insertPeSkinQuery, insertPeSkinPayload);

      const { abnormal_pupillary_reaction, essentially_normal: heent_essentially_normal, sunken_eyeballs, cervical_lymphadenopathy, icteric_sclerae, sunken_fontanelle, dry_mucous_membrane, pale_conjunctivae } = physical_examination.heent_descriptions;
      const insertPeHeentQuery = "INSERT INTO `ccr_physical_examination_heent_descriptions`(`physical_examination_id`, `abnormal_pupillary_reaction`, `essentially_normal`, `sunken_eyeballs`, `cervical_lymphadenopathy`, `icteric_sclerae`, `sunken_fontanelle`, `dry_mucous_membrane`, `pale_conjunctivae`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const insertPeHeentPayload = [physical_examination_id, abnormal_pupillary_reaction, heent_essentially_normal, sunken_eyeballs, cervical_lymphadenopathy, icteric_sclerae, sunken_fontanelle, dry_mucous_membrane, pale_conjunctivae];
      await dbModel.query(insertPeHeentQuery, insertPeHeentPayload);
      
      const { primary_diagnosis, secondary_diagnosis, severity, symptoms, tests_conducted, diagnosis_details, follow_up_recommendations } = diagnosis_plan;
      const insertDiagnosisQuery = "INSERT INTO `ccr_diagnosis`(`record_id`, `primary_diagnosis`, `secondary_diagnosis`, `severity`, `symptoms`, `tests_conducted`, `diagnosis_details`, `follow_up_recommendations`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const insertDiagnosisPayload = [record_id, primary_diagnosis, secondary_diagnosis, severity, symptoms, tests_conducted, diagnosis_details, follow_up_recommendations];
      await dbModel.query(insertDiagnosisQuery, insertDiagnosisPayload);
      
      for (const medicine of prescriptions) {
        
        const { item_id, dosage, intake_method, frequency, duration, instructions, refill_allowed, quantity_prescribed } = medicine;
        const insertPrescriptionsQuery = "INSERT INTO `ccr_prescriptions` (`record_id`, `item_id`, `dosage`, `intake_method`, `frequency`, `duration`, `instructions`, `refill_allowed`, `quantity_prescribed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const insertPrescriptionsPayload = [record_id, item_id, dosage, intake_method, frequency, duration, instructions, refill_allowed, quantity_prescribed];
        await dbModel.query(insertPrescriptionsQuery, insertPrescriptionsPayload);
        
      }

      const createStaffHistoryQuery = "INSERT INTO `medicalstaff_history` (`staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES (?, ?, ?, ?, ?)";
      const staffHistoryValues = [staff_id, 'created a clinic form', 'filled up a clinic form', null, dateTime];
      await dbModel.query(createStaffHistoryQuery, staffHistoryValues);
      
      return res.status(200).json({ status: 200, message: "Successfully Created A Clinic Form!" });
            
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
        error: error
      })
    } finally {
      if (connection) {
        dbModel.releaseConnection(connection);
      }
    }
  }

}

module.exports = new ClinicRecordController();