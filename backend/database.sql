-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 23, 2024 at 09:30 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `ccr_diagnosis`
--

CREATE TABLE `ccr_diagnosis` (
  `diagnosis_id` int NOT NULL,
  `record_id` int NOT NULL,
  `primary_diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `secondary_diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `severity` enum('mild','moderate','sever') NOT NULL DEFAULT 'moderate',
  `symptoms` text,
  `tests_conducted` text,
  `diagnosis_details` text,
  `follow_up_recommendations` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_family_medical_history`
--

CREATE TABLE `ccr_family_medical_history` (
  `family_medical_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `allergy` varchar(255) DEFAULT NULL,
  `cerebrovascular_disease` varchar(255) DEFAULT NULL,
  `emphysema` varchar(255) DEFAULT NULL,
  `hepatitis` varchar(255) DEFAULT NULL,
  `mental_illness` varchar(255) DEFAULT NULL,
  `peptic_ulcer` varchar(255) DEFAULT NULL,
  `thyroid_disease` varchar(255) DEFAULT NULL,
  `asthma` varchar(255) DEFAULT NULL,
  `coronary_artery_disease` varchar(255) DEFAULT NULL,
  `epilepsy_seizure_disorder` varchar(255) DEFAULT NULL,
  `hyperlipidemia` varchar(255) DEFAULT NULL,
  `pneumonia` varchar(255) DEFAULT NULL,
  `urinary_tract_infection` varchar(255) DEFAULT NULL,
  `cancer` varchar(255) DEFAULT NULL,
  `diabetes_mellitus` varchar(255) DEFAULT NULL,
  `extrapulmonary_tuberculosis` varchar(255) DEFAULT NULL,
  `pulmonary_tuberculosis` varchar(255) DEFAULT NULL,
  `none` tinyint(1) DEFAULT '0',
  `others` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_menstrual_history`
--

CREATE TABLE `ccr_menstrual_history` (
  `menstrual_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `menarche` varchar(255) NOT NULL,
  `last_menstrual_date` date NOT NULL,
  `menstrual_duration` int NOT NULL,
  `cycle_length` int NOT NULL,
  `pads_per_day` int NOT NULL,
  `onset_sexual_intercourse` int NOT NULL,
  `birth_control_use` tinyint(1) NOT NULL,
  `birth_control_method` varchar(100) NOT NULL,
  `is_menopause` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_past_medical_history`
--

CREATE TABLE `ccr_past_medical_history` (
  `past_medical_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `allergy` varchar(255) DEFAULT NULL,
  `cerebrovascular_disease` varchar(255) DEFAULT NULL,
  `emphysema` varchar(255) DEFAULT NULL,
  `hepatitis` varchar(255) DEFAULT NULL,
  `mental_illness` varchar(255) DEFAULT NULL,
  `peptic_ulcer` varchar(255) DEFAULT NULL,
  `thyroid_disease` varchar(255) DEFAULT NULL,
  `asthma` varchar(255) DEFAULT NULL,
  `coronary_artery_disease` varchar(255) DEFAULT NULL,
  `epilepsy_seizure_disorder` varchar(255) DEFAULT NULL,
  `hyperlipidemia` varchar(255) DEFAULT NULL,
  `pneumonia` varchar(255) DEFAULT NULL,
  `urinary_tract_infection` varchar(255) DEFAULT NULL,
  `cancer` varchar(255) DEFAULT NULL,
  `diabetes_mellitus` varchar(255) DEFAULT NULL,
  `extrapulmonary_tuberculosis` varchar(255) DEFAULT NULL,
  `pulmonary_tuberculosis` varchar(255) DEFAULT NULL,
  `none` tinyint(1) DEFAULT '0',
  `others` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_pediatric_client`
--

CREATE TABLE `ccr_pediatric_client` (
  `pediatric_client_id` int NOT NULL,
  `record_id` int NOT NULL,
  `length` int NOT NULL,
  `limb` int NOT NULL,
  `waist` int NOT NULL,
  `mua_circumference` int NOT NULL,
  `head_circumference` int NOT NULL,
  `skinfold` int NOT NULL,
  `hip` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_physical_examination`
--

CREATE TABLE `ccr_physical_examination` (
  `physical_examination_id` int NOT NULL,
  `record_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_physical_examination_heent_descriptions`
--

CREATE TABLE `ccr_physical_examination_heent_descriptions` (
  `heent_descriptions_id` int NOT NULL,
  `physical_examination_id` int NOT NULL,
  `abnormal_pupillary_reaction` tinyint(1) NOT NULL,
  `essentially_normal` tinyint(1) NOT NULL,
  `sunken_eyeballs` tinyint(1) NOT NULL,
  `cervical_lymphadenopathy` tinyint(1) NOT NULL,
  `icteric_sclerae` tinyint(1) NOT NULL,
  `sunken_fontanelle` tinyint(1) NOT NULL,
  `dry_mucous_membrane` tinyint(1) NOT NULL,
  `pale_conjunctivae` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_physical_examination_skin_descriptions`
--

CREATE TABLE `ccr_physical_examination_skin_descriptions` (
  `skin_descriptions_id` int NOT NULL,
  `physical_examination_id` int NOT NULL,
  `clubbing` tinyint(1) NOT NULL,
  `decreased_mobility` tinyint(1) NOT NULL,
  `pale_nailbeds` tinyint(1) NOT NULL,
  `weak_pulses` tinyint(1) NOT NULL,
  `cold_clammy` tinyint(1) NOT NULL,
  `edema_swelling` tinyint(1) NOT NULL,
  `poor_skin_turgor` tinyint(1) NOT NULL,
  `cyanosis_mottled_skin` tinyint(1) NOT NULL,
  `essentially_normal` tinyint(1) NOT NULL,
  `rash_or_itching` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_pregnancy_history`
--

CREATE TABLE `ccr_pregnancy_history` (
  `pregnancy_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `gravidity` int NOT NULL,
  `parity` int NOT NULL,
  `delivery_types` varchar(255) NOT NULL,
  `full_term_pregnancies` int NOT NULL,
  `premature_pregnancies` int NOT NULL,
  `abortions` int NOT NULL,
  `living_children` int NOT NULL,
  `pre_eclampsia` tinyint(1) NOT NULL,
  `family_planning_access` enum('yes','no') DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_prescriptions`
--

CREATE TABLE `ccr_prescriptions` (
  `prescription_id` int NOT NULL,
  `record_id` int NOT NULL,
  `item_id` int NOT NULL,
  `dosage` varchar(100) NOT NULL,
  `intake_method` enum('oral','injection','topical','iv') NOT NULL,
  `frequency` varchar(100) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `instructions` text NOT NULL,
  `refill_allowed` tinyint(1) NOT NULL DEFAULT '0',
  `quantity_prescribed` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_vital_signs`
--

CREATE TABLE `ccr_vital_signs` (
  `vital_signs_id` int NOT NULL,
  `record_id` int NOT NULL,
  `blood_pressure` varchar(50) NOT NULL,
  `temperature` varchar(50) NOT NULL,
  `heart_rate` varchar(50) NOT NULL,
  `weight` varchar(50) NOT NULL,
  `height` varchar(50) NOT NULL,
  `pulse_rate` varchar(50) NOT NULL,
  `respiratory_rate` varchar(50) NOT NULL,
  `bmi` varchar(50) NOT NULL,
  `oxygen_saturation` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen`
--

CREATE TABLE `citizen` (
  `citizen_family_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `citizen_firstname` varchar(255) NOT NULL,
  `citizen_middlename` varchar(255) NOT NULL,
  `citizen_lastname` varchar(255) NOT NULL,
  `citizen_gender` varchar(50) NOT NULL,
  `citizen_birthdate` date NOT NULL,
  `citizen_barangay` varchar(255) NOT NULL,
  `citizen_number` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_appointments`
--

CREATE TABLE `citizen_appointments` (
  `appointment_id` int NOT NULL,
  `citizen_family_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` text NOT NULL,
  `appointed_datetime` datetime NOT NULL,
  `status` enum('pending','scheduled','rejected','dismissed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_clinical_record`
--

CREATE TABLE `citizen_clinical_record` (
  `record_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `citizen_family_id` varchar(50) NOT NULL,
  `civil_status` varchar(50) NOT NULL,
  `philhealth_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `philhealth_dpin` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `philhealth_category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `chief_of_complaint` text NOT NULL,
  `history_of_present_illness` text NOT NULL,
  `smoking_status` enum('no','quit','yes') NOT NULL DEFAULT 'no',
  `alcohol_status` enum('no','quit','yes') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'no',
  `illicit_drug_status` enum('no','quit','yes') NOT NULL DEFAULT 'no',
  `sexually_active` enum('no','yes') NOT NULL DEFAULT 'no',
  `datetime_issued` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_history`
--

CREATE TABLE `citizen_history` (
  `history_id` int NOT NULL,
  `family_id` varchar(50) NOT NULL,
  `action` varchar(255) NOT NULL,
  `action_details` text NOT NULL,
  `staff_id` int DEFAULT NULL,
  `action_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_queue`
--

CREATE TABLE `citizen_queue` (
  `queue_number` int NOT NULL,
  `citizen_family_id` varchar(50) NOT NULL,
  `time_arrived` datetime NOT NULL,
  `current_status` enum('waiting','serving','emergency','priority','dismissed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff`
--

CREATE TABLE `medicalstaff` (
  `staff_id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `role` enum('doctor','admin','staff','developer') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'staff',
  `accessibility_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff_accessbility`
--

CREATE TABLE `medicalstaff_accessbility` (
  `staff_id` int NOT NULL,
  `general` int NOT NULL,
  `accessibility_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff_email_verification`
--

CREATE TABLE `medicalstaff_email_verification` (
  `token` varchar(255) NOT NULL,
  `staff_id` int NOT NULL,
  `expiry_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff_history`
--

CREATE TABLE `medicalstaff_history` (
  `history_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `action_details` text NOT NULL,
  `citizen_family_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `action_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messaging`
--

CREATE TABLE `messaging` (
  `message_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` varchar(255) NOT NULL,
  `datetime_sent` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL,
  `staff_id` int DEFAULT NULL,
  `message` text,
  `status` enum('unread','read','archived') DEFAULT 'unread',
  `datetime_received` datetime DEFAULT NULL,
  `datetime_seen` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_inventory`
--

CREATE TABLE `pharmacy_inventory` (
  `item_id` int NOT NULL,
  `item_name` varchar(55) NOT NULL,
  `quantity` int DEFAULT NULL,
  `container_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lot_no` varchar(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `exp_date` date DEFAULT NULL,
  `quantity_stockroom` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ccr_diagnosis`
--
ALTER TABLE `ccr_diagnosis`
  ADD PRIMARY KEY (`diagnosis_id`),
  ADD KEY `fk_diagnosis_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_family_medical_history`
--
ALTER TABLE `ccr_family_medical_history`
  ADD PRIMARY KEY (`family_medical_history_id`),
  ADD KEY `fk_family_medical_history_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_menstrual_history`
--
ALTER TABLE `ccr_menstrual_history`
  ADD PRIMARY KEY (`menstrual_history_id`),
  ADD KEY `fk_menstrual_history_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_past_medical_history`
--
ALTER TABLE `ccr_past_medical_history`
  ADD PRIMARY KEY (`past_medical_history_id`),
  ADD KEY `fk_past_medical_history_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_pediatric_client`
--
ALTER TABLE `ccr_pediatric_client`
  ADD PRIMARY KEY (`pediatric_client_id`),
  ADD KEY `fk_pediatric_client_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_physical_examination`
--
ALTER TABLE `ccr_physical_examination`
  ADD PRIMARY KEY (`physical_examination_id`),
  ADD KEY `fk_physical_examination_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_physical_examination_heent_descriptions`
--
ALTER TABLE `ccr_physical_examination_heent_descriptions`
  ADD PRIMARY KEY (`heent_descriptions_id`),
  ADD KEY `fk_pe_heent_physical_examination` (`physical_examination_id`);

--
-- Indexes for table `ccr_physical_examination_skin_descriptions`
--
ALTER TABLE `ccr_physical_examination_skin_descriptions`
  ADD PRIMARY KEY (`skin_descriptions_id`),
  ADD KEY `fk_pe_skin_physical_examination` (`physical_examination_id`);

--
-- Indexes for table `ccr_pregnancy_history`
--
ALTER TABLE `ccr_pregnancy_history`
  ADD PRIMARY KEY (`pregnancy_history_id`),
  ADD KEY `fk_pregnancy_history_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_prescriptions`
--
ALTER TABLE `ccr_prescriptions`
  ADD PRIMARY KEY (`prescription_id`),
  ADD KEY `fk_prescription_pharmacy_inventory` (`item_id`),
  ADD KEY `fk_prescriptions_citizen_clinical_record` (`record_id`);

--
-- Indexes for table `ccr_vital_signs`
--
ALTER TABLE `ccr_vital_signs`
  ADD PRIMARY KEY (`vital_signs_id`),
  ADD KEY `fk_vital_signs` (`record_id`);

--
-- Indexes for table `citizen`
--
ALTER TABLE `citizen`
  ADD PRIMARY KEY (`citizen_family_id`);

--
-- Indexes for table `citizen_appointments`
--
ALTER TABLE `citizen_appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `constraint_municipal_citizens_citizen_family_id_FK_appointmentid` (`citizen_family_id`);

--
-- Indexes for table `citizen_clinical_record`
--
ALTER TABLE `citizen_clinical_record`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `fk_clinical_record_medicalstaff` (`staff_id`),
  ADD KEY `fk_clinical_record_citizen` (`citizen_family_id`);

--
-- Indexes for table `citizen_history`
--
ALTER TABLE `citizen_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `citizen_history_medicalstaff_staff_id` (`staff_id`),
  ADD KEY `fk_citizen_history_citizen` (`family_id`);

--
-- Indexes for table `citizen_queue`
--
ALTER TABLE `citizen_queue`
  ADD PRIMARY KEY (`queue_number`),
  ADD KEY `fk_patient_queue_citizen` (`citizen_family_id`);

--
-- Indexes for table `medicalstaff`
--
ALTER TABLE `medicalstaff`
  ADD PRIMARY KEY (`staff_id`),
  ADD KEY `fk_medicalstaff_accessibility` (`accessibility_id`);

--
-- Indexes for table `medicalstaff_accessbility`
--
ALTER TABLE `medicalstaff_accessbility`
  ADD PRIMARY KEY (`accessibility_id`),
  ADD KEY `fk_accessibility_medicalstaff` (`staff_id`) USING BTREE;

--
-- Indexes for table `medicalstaff_email_verification`
--
ALTER TABLE `medicalstaff_email_verification`
  ADD PRIMARY KEY (`token`),
  ADD KEY `fk_email_verification_medicalstaff` (`staff_id`);

--
-- Indexes for table `medicalstaff_history`
--
ALTER TABLE `medicalstaff_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `medicalstaff_staff_id` (`staff_id`),
  ADD KEY `citizen_citizen_family_id` (`citizen_family_id`);

--
-- Indexes for table `messaging`
--
ALTER TABLE `messaging`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `pharmacy_inventory`
--
ALTER TABLE `pharmacy_inventory`
  ADD PRIMARY KEY (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ccr_diagnosis`
--
ALTER TABLE `ccr_diagnosis`
  MODIFY `diagnosis_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_family_medical_history`
--
ALTER TABLE `ccr_family_medical_history`
  MODIFY `family_medical_history_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_menstrual_history`
--
ALTER TABLE `ccr_menstrual_history`
  MODIFY `menstrual_history_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_past_medical_history`
--
ALTER TABLE `ccr_past_medical_history`
  MODIFY `past_medical_history_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_pediatric_client`
--
ALTER TABLE `ccr_pediatric_client`
  MODIFY `pediatric_client_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_physical_examination`
--
ALTER TABLE `ccr_physical_examination`
  MODIFY `physical_examination_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_physical_examination_heent_descriptions`
--
ALTER TABLE `ccr_physical_examination_heent_descriptions`
  MODIFY `heent_descriptions_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_physical_examination_skin_descriptions`
--
ALTER TABLE `ccr_physical_examination_skin_descriptions`
  MODIFY `skin_descriptions_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_pregnancy_history`
--
ALTER TABLE `ccr_pregnancy_history`
  MODIFY `pregnancy_history_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_prescriptions`
--
ALTER TABLE `ccr_prescriptions`
  MODIFY `prescription_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ccr_vital_signs`
--
ALTER TABLE `ccr_vital_signs`
  MODIFY `vital_signs_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `citizen_appointments`
--
ALTER TABLE `citizen_appointments`
  MODIFY `appointment_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `citizen_clinical_record`
--
ALTER TABLE `citizen_clinical_record`
  MODIFY `record_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `citizen_history`
--
ALTER TABLE `citizen_history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `citizen_queue`
--
ALTER TABLE `citizen_queue`
  MODIFY `queue_number` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalstaff`
--
ALTER TABLE `medicalstaff`
  MODIFY `staff_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalstaff_accessbility`
--
ALTER TABLE `medicalstaff_accessbility`
  MODIFY `accessibility_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalstaff_history`
--
ALTER TABLE `medicalstaff_history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messaging`
--
ALTER TABLE `messaging`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_inventory`
--
ALTER TABLE `pharmacy_inventory`
  MODIFY `item_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ccr_diagnosis`
--
ALTER TABLE `ccr_diagnosis`
  ADD CONSTRAINT `fk_diagnosis_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_family_medical_history`
--
ALTER TABLE `ccr_family_medical_history`
  ADD CONSTRAINT `fk_family_medical_history_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_menstrual_history`
--
ALTER TABLE `ccr_menstrual_history`
  ADD CONSTRAINT `fk_menstrual_history_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_past_medical_history`
--
ALTER TABLE `ccr_past_medical_history`
  ADD CONSTRAINT `fk_past_medical_history_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_pediatric_client`
--
ALTER TABLE `ccr_pediatric_client`
  ADD CONSTRAINT `fk_pediatric_client_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_physical_examination`
--
ALTER TABLE `ccr_physical_examination`
  ADD CONSTRAINT `fk_physical_examination_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_physical_examination_heent_descriptions`
--
ALTER TABLE `ccr_physical_examination_heent_descriptions`
  ADD CONSTRAINT `fk_pe_heent_physical_examination` FOREIGN KEY (`physical_examination_id`) REFERENCES `ccr_physical_examination` (`physical_examination_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_physical_examination_skin_descriptions`
--
ALTER TABLE `ccr_physical_examination_skin_descriptions`
  ADD CONSTRAINT `fk_pe_skin_physical_examination` FOREIGN KEY (`physical_examination_id`) REFERENCES `ccr_physical_examination` (`physical_examination_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_pregnancy_history`
--
ALTER TABLE `ccr_pregnancy_history`
  ADD CONSTRAINT `fk_pregnancy_history_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_prescriptions`
--
ALTER TABLE `ccr_prescriptions`
  ADD CONSTRAINT `fk_prescription_pharmacy_inventory` FOREIGN KEY (`item_id`) REFERENCES `pharmacy_inventory` (`item_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_prescriptions_citizen_clinical_record` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `ccr_vital_signs`
--
ALTER TABLE `ccr_vital_signs`
  ADD CONSTRAINT `fk_vital_signs` FOREIGN KEY (`record_id`) REFERENCES `citizen_clinical_record` (`record_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `citizen_appointments`
--
ALTER TABLE `citizen_appointments`
  ADD CONSTRAINT `constraint_municipal_citizens_citizen_family_id_FK_appointmentid` FOREIGN KEY (`citizen_family_id`) REFERENCES `citizen` (`citizen_family_id`);

--
-- Constraints for table `citizen_clinical_record`
--
ALTER TABLE `citizen_clinical_record`
  ADD CONSTRAINT `fk_clinical_record_citizen` FOREIGN KEY (`citizen_family_id`) REFERENCES `citizen` (`citizen_family_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_clinical_record_medicalstaff` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `citizen_history`
--
ALTER TABLE `citizen_history`
  ADD CONSTRAINT `fk_citizen_history_citizen` FOREIGN KEY (`family_id`) REFERENCES `citizen` (`citizen_family_id`),
  ADD CONSTRAINT `fk_citizen_history_medicalstaff` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `citizen_queue`
--
ALTER TABLE `citizen_queue`
  ADD CONSTRAINT `fk_patient_queue_citizen` FOREIGN KEY (`citizen_family_id`) REFERENCES `citizen` (`citizen_family_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `medicalstaff`
--
ALTER TABLE `medicalstaff`
  ADD CONSTRAINT `fk_medicalstaff_accessibility` FOREIGN KEY (`accessibility_id`) REFERENCES `medicalstaff_accessbility` (`accessibility_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `medicalstaff_accessbility`
--
ALTER TABLE `medicalstaff_accessbility`
  ADD CONSTRAINT `fk_accessibility_medicalstaff` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `medicalstaff_email_verification`
--
ALTER TABLE `medicalstaff_email_verification`
  ADD CONSTRAINT `fk_email_verification_medicalstaff` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `medicalstaff_history`
--
ALTER TABLE `medicalstaff_history`
  ADD CONSTRAINT `fk_history_citizen` FOREIGN KEY (`citizen_family_id`) REFERENCES `citizen` (`citizen_family_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_history_medicalstaff` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `messaging`
--
ALTER TABLE `messaging`
  ADD CONSTRAINT `messaging_ibfk_1` FOREIGN KEY (`receiver_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messaging_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
