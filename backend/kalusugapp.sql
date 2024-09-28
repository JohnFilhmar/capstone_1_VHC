-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 28, 2024 at 09:30 PM
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
  `primary_diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `secondary_diagnosis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `illnesses` text COLLATE utf8mb4_general_ci NOT NULL,
  `severity` enum('mild','moderate','severe') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'moderate',
  `symptoms` text COLLATE utf8mb4_general_ci,
  `tests_conducted` text COLLATE utf8mb4_general_ci,
  `diagnosis_details` text COLLATE utf8mb4_general_ci,
  `follow_up_recommendations` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_family_medical_history`
--

CREATE TABLE `ccr_family_medical_history` (
  `family_medical_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `allergy` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cerebrovascular_disease` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `emphysema` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hepatitis` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mental_illness` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `peptic_ulcer` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thyroid_disease` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `asthma` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coronary_artery_disease` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `epilepsy_seizure_disorder` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hyperlipidemia` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pneumonia` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `urinary_tract_infection` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cancer` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diabetes_mellitus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `extrapulmonary_tuberculosis` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pulmonary_tuberculosis` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `none` tinyint(1) DEFAULT '0',
  `others` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_menstrual_history`
--

CREATE TABLE `ccr_menstrual_history` (
  `menstrual_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `menarche` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `last_menstrual_date` date NOT NULL,
  `menstrual_duration` int NOT NULL,
  `cycle_length` int NOT NULL,
  `pads_per_day` int NOT NULL,
  `onset_sexual_intercourse` int NOT NULL,
  `birth_control_use` tinyint(1) NOT NULL,
  `birth_control_method` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `is_menopause` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_past_medical_history`
--

CREATE TABLE `ccr_past_medical_history` (
  `past_medical_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `allergy` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cerebrovascular_disease` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `emphysema` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hepatitis` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mental_illness` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `peptic_ulcer` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `thyroid_disease` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `asthma` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coronary_artery_disease` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `epilepsy_seizure_disorder` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hyperlipidemia` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pneumonia` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `urinary_tract_infection` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cancer` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diabetes_mellitus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `extrapulmonary_tuberculosis` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pulmonary_tuberculosis` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `none` tinyint(1) DEFAULT '0',
  `others` text COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ccr_past_medical_history`
--

INSERT INTO `ccr_past_medical_history` (`past_medical_history_id`, `record_id`, `allergy`, `cerebrovascular_disease`, `emphysema`, `hepatitis`, `mental_illness`, `peptic_ulcer`, `thyroid_disease`, `asthma`, `coronary_artery_disease`, `epilepsy_seizure_disorder`, `hyperlipidemia`, `pneumonia`, `urinary_tract_infection`, `cancer`, `diabetes_mellitus`, `extrapulmonary_tuberculosis`, `pulmonary_tuberculosis`, `none`, `others`) VALUES
(5, 5, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 1, ''),
(6, 6, '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 1, ''),
(7, 7, '0', '1', '0', '1', '1', '0', '0', '0', '1', '0', '0', '0', '1', '0', '0', '0', '0', 0, '');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_physical_examination`
--

CREATE TABLE `ccr_physical_examination` (
  `physical_examination_id` int NOT NULL,
  `record_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_pregnancy_history`
--

CREATE TABLE `ccr_pregnancy_history` (
  `pregnancy_history_id` int NOT NULL,
  `record_id` int NOT NULL,
  `gravidity` int NOT NULL,
  `parity` int NOT NULL,
  `delivery_types` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `full_term_pregnancies` int NOT NULL,
  `premature_pregnancies` int NOT NULL,
  `abortions` int NOT NULL,
  `living_children` int NOT NULL,
  `pre_eclampsia` tinyint(1) NOT NULL,
  `family_planning_access` enum('yes','no') COLLATE utf8mb4_general_ci DEFAULT 'yes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_prescriptions`
--

CREATE TABLE `ccr_prescriptions` (
  `prescription_id` int NOT NULL,
  `record_id` int NOT NULL,
  `item_id` int NOT NULL,
  `dosage` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `intake_method` enum('oral','injection','topical','iv') COLLATE utf8mb4_general_ci NOT NULL,
  `frequency` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `duration` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `instructions` text COLLATE utf8mb4_general_ci NOT NULL,
  `refill_allowed` tinyint(1) NOT NULL DEFAULT '0',
  `quantity_prescribed` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ccr_vital_signs`
--

CREATE TABLE `ccr_vital_signs` (
  `vital_signs_id` int NOT NULL,
  `record_id` int NOT NULL,
  `blood_pressure` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `temperature` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `heart_rate` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `weight` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `height` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `pulse_rate` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `respiratory_rate` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `bmi` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `oxygen_saturation` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen`
--

CREATE TABLE `citizen` (
  `citizen_family_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `citizen_firstname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `citizen_middlename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizen_lastname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `citizen_gender` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `citizen_birthdate` date DEFAULT NULL,
  `citizen_barangay` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `citizen_number` varchar(12) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_appointments`
--

CREATE TABLE `citizen_appointments` (
  `appointment_id` int NOT NULL,
  `citizen_family_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `appointed_datetime` datetime NOT NULL,
  `status` enum('pending','scheduled','rejected','dismissed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_clinical_record`
--

CREATE TABLE `citizen_clinical_record` (
  `record_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `citizen_family_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `contact_number` varchar(13) COLLATE utf8mb4_general_ci NOT NULL,
  `civil_status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `philhealth_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `philhealth_dpin` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `philhealth_category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `chief_of_complaint` text COLLATE utf8mb4_general_ci NOT NULL,
  `history_of_present_illness` text COLLATE utf8mb4_general_ci NOT NULL,
  `smoking_status` enum('no','quit','yes') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  `alcohol_status` enum('no','quit','yes') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  `illicit_drug_status` enum('no','quit','yes') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  `sexually_active` enum('no','yes') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'no',
  `datetime_issued` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_history`
--

CREATE TABLE `citizen_history` (
  `history_id` int NOT NULL,
  `family_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `action_details` text COLLATE utf8mb4_general_ci NOT NULL,
  `staff_id` int DEFAULT NULL,
  `action_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `citizen_queue`
--

CREATE TABLE `citizen_queue` (
  `queue_number` int NOT NULL,
  `citizen_family_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `time_arrived` datetime NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `current_status` enum('waiting','serving','emergency','priority','dismissed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff`
--

CREATE TABLE `medicalstaff` (
  `staff_id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `role` enum('doctor','admin','staff','developer') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'staff',
  `accessibility_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicalstaff`
--

INSERT INTO `medicalstaff` (`staff_id`, `username`, `password`, `refresh_token`, `email`, `isVerified`, `role`, `accessibility_id`) VALUES
(2, 'filhmarola', '$2a$10$FCR40jcCQ7n08q75oVZi3.JDUQ4E4LB8gOQ9/k5haqEzxKk02gTv.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpbGhtYXJvbGEiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzI3NTU4NjgxLCJleHAiOjE3MjgxNjM0ODF9.91gKI22gS5MP8FMmqBZTY1emyp_yrVk3wBEY-Ftjl-4', 'olajohnfilhmar@gmail.com', 1, 'developer', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff_accessbility`
--

CREATE TABLE `medicalstaff_accessbility` (
  `staff_id` int NOT NULL,
  `general` int NOT NULL,
  `accessibility_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff_email_verification`
--

CREATE TABLE `medicalstaff_email_verification` (
  `token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `staff_id` int NOT NULL,
  `expiry_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicalstaff_email_verification`
--

INSERT INTO `medicalstaff_email_verification` (`token`, `staff_id`, `expiry_date`) VALUES
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyNzU1ODQ4MywiZXhwIjoxNzI3NTU4NTQzfQ.VoxZK7CPEL3rUiLNRXVLluNtIBQksWMVJQq1KmJ9jSQ', 1, '2024-09-29 07:21:23'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyNzU1ODY0MiwiZXhwIjoxNzI3NTU4NzAyfQ.4D0H0G_MUPBQspOEUoxYyaq5BcvH_WD5khiWd6rK99Q', 2, '2024-09-29 07:24:02');

-- --------------------------------------------------------

--
-- Table structure for table `medicalstaff_history`
--

CREATE TABLE `medicalstaff_history` (
  `history_id` int NOT NULL,
  `staff_id` int NOT NULL,
  `action` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `action_details` text COLLATE utf8mb4_general_ci NOT NULL,
  `citizen_family_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `action_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicalstaff_history`
--

INSERT INTO `medicalstaff_history` (`history_id`, `staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES
(1, 1, 'registered', 'account created', NULL, '2024-09-29 05:21:05'),
(2, 2, 'registered', 'account created', NULL, '2024-09-29 05:23:41'),
(3, 2, 'logged in', 'logged in', NULL, '2024-09-29 05:24:13');

-- --------------------------------------------------------

--
-- Table structure for table `messaging`
--

CREATE TABLE `messaging` (
  `message_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `datetime_sent` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int NOT NULL,
  `staff_id` int DEFAULT NULL,
  `message` text COLLATE utf8mb4_general_ci,
  `status` enum('unread','read','archived') COLLATE utf8mb4_general_ci DEFAULT 'unread',
  `datetime_received` datetime DEFAULT NULL,
  `datetime_seen` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_inventory`
--

CREATE TABLE `pharmacy_inventory` (
  `item_id` int NOT NULL,
  `item_name` varchar(55) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int DEFAULT NULL,
  `container_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lot_no` varchar(55) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `exp_date` date DEFAULT NULL,
  `quantity_stockroom` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD KEY `fk_citizen_history_citizen` (`family_id`),
  ADD KEY `index_action_datetime` (`action_datetime`);

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
  MODIFY `past_medical_history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `staff_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medicalstaff_accessbility`
--
ALTER TABLE `medicalstaff_accessbility`
  MODIFY `accessibility_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medicalstaff_history`
--
ALTER TABLE `medicalstaff_history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `citizen_clinical_record`
--
ALTER TABLE `citizen_clinical_record`
  ADD CONSTRAINT `fk_clinical_record_medicalstaff` FOREIGN KEY (`staff_id`) REFERENCES `medicalstaff` (`staff_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
