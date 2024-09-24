-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 24, 2024 at 12:41 AM
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

--
-- Dumping data for table `citizen`
--

INSERT INTO `citizen` (`citizen_family_id`, `citizen_firstname`, `citizen_middlename`, `citizen_lastname`, `citizen_gender`, `citizen_birthdate`, `citizen_barangay`, `citizen_number`) VALUES
('FAMILY_ID-RY167H7B', 'Joyce', 'Magdrigal', 'Raphael', 'female', '1997-11-05', 'Alcate', '09885846123'),
('FAMILY_ID-XGPINDTP', 'Elizabeth', 'Aquino', 'Geronaga', 'female', '2000-12-31', 'Alcate', '09668649640'),
('FAMILY_ID-YLW8PVPI', 'John Filhmar', 'De Los Reyes', 'Ola', 'male', '2001-02-21', 'Poblacion III', '0977735330');

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

--
-- Dumping data for table `citizen_appointments`
--

INSERT INTO `citizen_appointments` (`appointment_id`, `citizen_family_id`, `description`, `appointed_datetime`, `status`, `created_at`) VALUES
(1, 'FASADF32132', ' Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita dolores, explicabo perspiciatis ut nesciunt officiis doloremque, placeat corporis, deleniti alias nulla similique reiciendis saepe temporibus. Sunt quidem a saepe dolorum.', '2024-09-18 23:04:48', 'scheduled', '2024-09-16 23:04:48'),
(2, 'FASADF32132', 'asdffsd af asd fsa dfasd f', '2024-09-19 08:23:00', 'scheduled', '2024-09-17 08:22:37'),
(3, 'FASADF32132', 'asdfdsfa', '2024-09-26 08:36:00', 'rejected', '2024-09-17 08:35:50');

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

--
-- Dumping data for table `citizen_history`
--

INSERT INTO `citizen_history` (`history_id`, `family_id`, `action`, `action_details`, `staff_id`, `action_datetime`) VALUES
(1, 'FAMILY_ID-YLW8PVPI', 'record added', 'added this to records', 54, '2024-09-24 01:31:11'),
(2, 'FAMILY_ID-YLW8PVPI', 'waiting', 'added to queue as waiting', 52, '2024-09-24 02:33:44'),
(3, 'FAMILY_ID-YLW8PVPI', 'serving', 'citizen is being served', 52, '2024-09-24 02:33:44'),
(4, 'FAMILY_ID-YLW8PVPI', 'dismissed', 'dismissed from the queue', 52, '2024-09-24 02:33:44'),
(5, 'FAMILY_ID-XGPINDTP', 'record added', 'added this to records', 55, '2024-09-24 07:45:18'),
(6, 'FAMILY_ID-XGPINDTP', 'waiting', 'added to queue as emergency', 55, '2024-09-24 07:46:04'),
(7, 'FAMILY_ID-XGPINDTP', 'dismissed', 'dismissed from the queue', 55, '2024-09-24 07:46:04'),
(8, 'FAMILY_ID-XGPINDTP', 'queued for emergency', 'added to queue as emergency', 55, '2024-09-24 08:10:15'),
(9, 'FAMILY_ID-XGPINDTP', 'dismissed', 'dismissed from the queue', 55, '2024-09-24 08:09:18'),
(10, 'FAMILY_ID-RY167H7B', 'record added', 'added this to records', 55, '2024-09-24 08:39:13'),
(11, 'FAMILY_ID-RY167H7B', 'queued for emergency', 'added to queue as emergency', 55, '2024-09-24 08:40:01'),
(12, 'FAMILY_ID-RY167H7B', 'dismissed', 'dismissed from the queue', 55, '2024-09-24 08:40:01');

-- --------------------------------------------------------

--
-- Table structure for table `citizen_queue`
--

CREATE TABLE `citizen_queue` (
  `queue_number` int NOT NULL,
  `citizen_family_id` varchar(50) NOT NULL,
  `time_arrived` datetime NOT NULL,
  `reason` varchar(255) NOT NULL,
  `current_status` enum('waiting','serving','emergency','priority','dismissed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'waiting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `citizen_queue`
--

INSERT INTO `citizen_queue` (`queue_number`, `citizen_family_id`, `time_arrived`, `reason`, `current_status`) VALUES
(1, 'FAMILY_ID-YLW8PVPI', '2024-09-24 02:33:44', '', 'dismissed'),
(2, 'FAMILY_ID-XGPINDTP', '2024-09-24 07:46:04', '', 'dismissed'),
(3, 'FAMILY_ID-XGPINDTP', '2024-09-24 08:10:15', 'delivering a baby', 'dismissed'),
(4, 'FAMILY_ID-RY167H7B', '2024-09-24 08:40:01', 'delivering a baby', 'dismissed');

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

--
-- Dumping data for table `medicalstaff`
--

INSERT INTO `medicalstaff` (`staff_id`, `username`, `password`, `refresh_token`, `email`, `isVerified`, `role`, `accessibility_id`) VALUES
(52, 'filhmarola', '$2a$10$Ot26lxOmbY4J1qtfV7wMV.4ehdVWuuZnZ7H1t8aujgrX348eQ1nIa', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpbGhtYXJvbGEiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzI3MDU5OTUyLCJleHAiOjE3Mjc2NjQ3NTJ9.GepJdd_7IIVUTSx4U_EdtZ0531yL_Akf96HoXmIcM2I', 'olajohnfilhmar@gmail.com', 1, 'developer', NULL),
(54, 'adriellelalongisip', '$2a$10$ShhCnVVrHwOKm8bp5vprg.QSgMunND.NBvmdsD9EPJwFxHenmBkf.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkcmllbGxlbGFsb25naXNpcCIsInJvbGUiOiJkZXZlbG9wZXIiLCJpYXQiOjE3MjcxMTI2NjIsImV4cCI6MTcyNzcxNzQ2Mn0.RvmEBJk4-4om_OcOOQlTcNirrgRmAynxMsdfGajZXTI', 'adriellelalongisip@gmail.com', 1, 'developer', NULL),
(55, 'albeurmacapia', '$2a$10$308q.UFAhc5Y6LtISPyCT.rEX.cFo/Wyl/CoK3LtmTFZnTVk5peMW', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsYmV1cm1hY2FwaWEiLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzI3MTIwMzAyLCJleHAiOjE3Mjc3MjUxMDJ9.XqP3p2pYkz4lDNdT5WSbZuYVKWEt4YaXMm1Z6vVDuDI', 'albeurmacapia@gmail.com', 1, 'developer', NULL),
(56, 'TestingUser', '$2a$10$n3tRZ3mSi04XlCewSxy.ceJVAwFPh3XruTbFv.UsgZFbPGY.Emva.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3RhZmYiLCJpYXQiOjE3MjYwNDkzMDgsImV4cCI6MTcyNjA1NjUwOH0.SZO0GzBki3QhJExesraApWhnVW1_VjGs-HFtYYTnVuo', 'testinguser@test.testing', 0, 'staff', NULL),
(57, 'SecondTestingUser', '$2a$10$dt/Glv11SaT4hcb2d5LQaufsbFXaS.QwuHTuYVyl9sZ4KEvNYsW5O', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjYwNDk0NzQsImV4cCI6MTcyNjA1NjY3NH0.ktF9syF2XqE1uLRXpQd7w57EOwwjQkWnise_vt-NVio', 'secondtestinguser@testing.test', 0, 'admin', NULL),
(58, 'EmailVerificationTest', '$2a$10$N/TVexis4qx.G4SLE9WxzOlDXQAj8o4T3946CXNeS.Itac1M4H75i', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3RhZmYiLCJpYXQiOjE3MjYwNTExNzYsImV4cCI6MTcyNjA1ODM3Nn0.kWT6spNlGxYETeGEaO3Ay0cdlPtEniR0AS1DD-dwgNU', 'emailverificationtest@testing.test', 0, 'staff', NULL),
(59, 'EmailVerificationTest2', '$2a$10$5ADLOFvOlQuOg5PzPxY0muUowiM1Krk2dVOe9YPorMp48zthKmI8W', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3RhZmYiLCJpYXQiOjE3MjYwNTEyMzgsImV4cCI6MTcyNjA1ODQzOH0.kvSmWbIGtEvx3MzPOgCP7jC0I8Z2Nec8_D9WhNZhV4U', 'emailverificationtest2@testing.test', 0, 'staff', NULL),
(60, 'EmailVerificationTest3', '$2a$10$fGEabqElyGRhcXD6hbLci.HjDYjy3WS6IeOqlLFkEsKrE1H.KTqDK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3RhZmYiLCJpYXQiOjE3MjYwNTEzODQsImV4cCI6MTcyNjA1ODU4NH0.eRmFt1zmTgtzJADYuDEEm8epmBJhq_jksKr6Oe3SVCs', 'emailverificationtest3@testing.test', 0, 'staff', NULL);

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

--
-- Dumping data for table `medicalstaff_email_verification`
--

INSERT INTO `medicalstaff_email_verification` (`token`, `staff_id`, `expiry_date`) VALUES
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYwLCJpYXQiOjE3MjYwNTEzODR9.YQOGCOqSPqDlL2H3_iHiuIpbLolF9FJhA58qvksiDj8', 60, '2024-09-12 18:43:04');

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

--
-- Dumping data for table `medicalstaff_history`
--

INSERT INTO `medicalstaff_history` (`history_id`, `staff_id`, `action`, `action_details`, `citizen_family_id`, `action_datetime`) VALUES
(1, 54, 'logged in', 'logged in', NULL, '2024-09-24 01:30:46'),
(2, 52, 'logged out', 'logged out of account', NULL, '2024-09-24 03:37:36'),
(3, 55, 'logged in', 'logged in', NULL, '2024-09-24 03:38:06');

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
-- Dumping data for table `pharmacy_inventory`
--

INSERT INTO `pharmacy_inventory` (`item_id`, `item_name`, `quantity`, `container_type`, `lot_no`, `exp_date`, `quantity_stockroom`) VALUES
(1, 'ACETYCISTEINE 600mg/tablet 20\'s', 0, 'bxs', NULL, NULL, NULL),
(2, 'ACICLOVIR 400mg/tabet 30\'s', 4, 'bxs', '37416', '2025-07-01', NULL),
(3, 'ALLOPURINOL 100mg/tablet 100\'s', 6, 'bxs', 'u-02038', '2026-03-01', NULL),
(4, 'ALLOPURINOL 300mg/tablet 100\'s', 3, 'bxs', 'ZKN209', '2025-10-01', NULL),
(5, 'ALLUMINuM MAGESIUM Syrup', 132, 'btls', 'PCD312', '2025-07-01', NULL),
(6, 'ALLUMINUM MAGNESIUM Tablet 100\'s', 15, 'bxs', 'Z47001', '2025-10-01', NULL),
(7, 'AMLODIPINE 10mg/tablet 100\'s', 7, 'bxs', '2303066', '2025-03-01', NULL),
(8, 'AMLODIPINE 5mg/tablet 100\'s', 146, 'btls', 'GT22462', '2025-08-01', NULL),
(9, 'AMOXICILLIN 100mg/ml drops 10ml', 22, 'btls', 'ZDB102', '2026-04-01', NULL),
(10, 'AMOXICILLIN 125mg/ml drops 60ml', 0, 'btls', NULL, NULL, NULL),
(11, 'AMOXICILLIN 250/5ml syrup 60ml', 86, 'btls', 'ZBB076', '2026-02-01', NULL),
(12, 'AMOXICILLIN 500mg Capsule 100\'s', 4, 'bxs', '706230302', '2026-03-01', NULL),
(13, 'ANLODIPINE 5mg/ 30\'s', 1200, 'bxs', '2112091', NULL, NULL),
(14, 'ASCORBIC ACID  TABLET 100\'S', 0, 'bxs', NULL, NULL, NULL),
(15, 'ASCORBIC ACID drops 10ml', 24, 'btls', 'K2303', '2025-11-01', NULL),
(16, 'ASCORBIC ACID SYRUPS 60ml', 0, 'btls', NULL, NULL, NULL),
(17, 'ASPIRIN 80mg tablet 100\'s', 24, 'bxs', '3X541', '2025-10-01', NULL),
(18, 'ATORVASTATIN 10mg/tab 100\'s', 0, 'bxs', NULL, NULL, NULL),
(19, 'ATORVASTATIN 20mg/tab 100\'s', 0, 'bxs', NULL, NULL, NULL),
(20, 'ATORVASTATIN 40mg/tab 100\'s', 3, 'bxs', 'KK23313', '2026-08-01', NULL),
(21, 'ATS 1500IU ampule', 0, 'bxs', NULL, NULL, NULL),
(22, 'ATS 3000IU ampule', 0, 'bxs', NULL, NULL, NULL),
(23, 'AZITYHROMYCIN 500mg caplet 3\'s', 30, 'bxs', '230925', '2026-09-01', NULL),
(24, 'BETAHISTINE 16mg tablet 100\'s', 13, 'bxs', 'NB5-03', '2024-08-01', NULL),
(25, 'BUDESONIDE 250mcg/ml inhaler', 0, 'btls', NULL, NULL, NULL),
(26, 'BUTARAMITE 50mg/tablet 100\'s', 3, 'bxs', 'NB07', '2025-06-01', NULL),
(27, 'BUTARAMITE 7.5mg syrup 60ml', 46, 'btls', 'D02', '2025-05-01', NULL),
(28, 'CARVEDOLOL 25mg tablet 100\'s', 1, 'bxs', 'K02019', '2026-05-01', NULL),
(29, 'CARVEDOLOL 6.25mg/tablet 100\'s', 1, 'bxs', 'K21011', '2026-05-01', NULL),
(30, 'CEFALEXIN 250mg/5ml PFS 60ml', 119, 'btls', '9CB190', '2026-03-01', NULL),
(31, 'CEFALEXIN 500mg/capsule 100\'s', 0, 'bxs', NULL, NULL, NULL),
(32, 'CEFIXIME 200mg/capsule 30\'s', 9, 'bxs', 'GLT22055', '2025-08-01', NULL),
(33, 'CEFUROXIME 125mg/5ml PFS 50ml', 57, 'btls', 'I23029', '2025-09-01', NULL),
(34, 'CEFUROXIME 250mg/5ml PFS50ml', 113, 'btls', 'H23095', '2025-08-01', NULL),
(35, 'CEFUROXIME 500mg capsule 10\'s', 0, 'bxs', NULL, NULL, NULL),
(36, 'CELECOXIB 200mg capsule 10\'s', 1, 'bxs', 'c10159', '2026-08-01', NULL),
(37, 'CETERIZINE 10mg tablet 100\'s', 0, 'bxs', NULL, NULL, NULL),
(38, 'CETERIZINE 2.5mg  drops 15ml', 31, 'btls', 'mel23042', '2026-06-01', NULL),
(39, 'CETERIZINE 5mg/5ml syrup 60ml', 49, 'btls', 'MLE23030', '2026-03-01', NULL),
(40, 'CINNARIZINE 25mg tablet 100\'s', 9, 'bxs', '3J06512', '2025-11-01', NULL),
(41, 'CIPROFLOXACIN 500MG caplet 100\'s', 10, 'bxs', '233123008', '2026-02-01', NULL),
(42, 'CLARITHROMYCIN 250mg/5ml 50ml PFS', 158, 'btls', '3b239', '2026-03-01', NULL),
(43, 'CLARITHROMYCIN 500mg/tablet 30\'s', 11, 'bxs', 'CC044', '2026-02-01', NULL),
(44, 'CLINDAMYCIN 300mg capsule 100\'s', 2, 'bxs', 'ZKB118', '2026-10-01', NULL),
(45, 'CLONIDINE 75mg/tablet 100\'s', 46, 'bxs', '2J116', '2025-10-01', NULL),
(46, 'CLOPIDOGREL 75mg tablet 100\'s', 2, 'bxs', NULL, NULL, NULL),
(47, 'CLOXACILLIN 125mg/5ml PFS 60ml', 100, 'btls', '39105', '2024-08-01', NULL),
(48, 'CLOXACILLIN 250mg/5ml PFS 60ml', 108, 'btls', '165226', '2025-03-01', NULL),
(49, 'CLOXACILLIN 500mg/capsule 100\'s', 0, 'bxs', NULL, NULL, NULL),
(50, 'CO-AMOX 156', 0, 'bxs', '30292A', '2024-11-01', NULL),
(51, 'CO-AMOXICLAV  625mg/tab 14\'s', 6, 'bxs', 'T5LEN', '2025-03-01', NULL),
(52, 'CO-AMOXICLAV 125/31 25mg/5ml 60ml', 0, 'btls', '2K305A2', '2024-11-01', NULL),
(53, 'CO-AMOXICLAV 250/62 25mg/5ml 60ml', 0, 'btls', '3H114A', '2025-03-01', NULL),
(54, 'COLCHICINE 500mcg/tablet 100\'s', 4, 'bxs', 'NGT20', '2026-06-01', NULL),
(55, 'CONTRIMOXAZOLE 800mg+160mg tablet 100\'s', 10, 'bxs', 'Z-08103', '2026-02-01', NULL),
(56, 'COTRIMOXAZOLE 200 mg+40mg/5ml 70ml PFS', 44, 'btls', '2212053', '2024-12-01', NULL),
(57, 'DEPERIDONE 10mg/tablet', 8, 'bxs', 'NDD07', '2024-05-01', NULL),
(58, 'DEPERIDONE 1mg/ml syrup 60ml', 58, 'btls', '52', '2026-09-01', NULL),
(59, 'DIAZEPAM 10mg/2ml ampule', 0, 'bxs', NULL, NULL, NULL),
(60, 'DICYCLOVERINE 10mg tablet 100\'s', 15, 'bxs', '3 E203', '2026-05-01', NULL),
(61, 'DICYCLOVERINE 10mg/5ml Syrup', 96, 'btls', 'ZENI55', '2026-05-01', NULL),
(62, 'DIGOXIN 250mcg/talet 100\'s', 9, 'bxs', '0DG02', '2025-04-01', NULL),
(63, 'DIPHENHYDRAMINE 12.5mg/5ml syrup 60ml', 0, 'bxs', '2921403', '2024-11-01', NULL),
(64, 'DIPHENHYDRAMINE 50mg/capsule 100\'s', 20, 'bxs', '473200', '2025-07-01', NULL),
(65, 'DOXYCYCLINE 100mg/capsule 100\'s', 25, 'bxs', '21210', '2025-10-01', NULL),
(66, 'EPERISONE HCI 50mg/capsule 30\'s', 1, 'bxs', '113', '2026-07-01', NULL),
(67, 'ERYTHROMYCIN 200mg/5ml syrup 60ml', 14, 'btls', '2013028', '2026-09-01', NULL),
(68, 'ERYTHROMYCIN 500mg/tablet 100\'s', 4, 'bxs', '63030', '2026-09-01', NULL),
(69, 'ERYTHROMYCIN OPHTALMIC ointment .5%5g', 0, 'bxs', NULL, NULL, NULL),
(70, 'FENOFIBRATE 200mg/cap 100\'s', 20, 'bxs', '2303079', '2025-03-01', NULL),
(71, 'FEROSEMIDE 20mg/tablet 100\'s', 8, 'bxs', '2J135', '2024-10-01', NULL),
(72, 'FEROSEMIDE 40mg/tablet 100\'s', 6, 'bxs', '3C143', '2025-03-01', NULL),
(73, 'FERROUS SULFATE 500mg/capsule 100\'s', 5, 'bxs', '2308174', '2025-08-01', NULL),
(74, 'FERROUS SULFATE SYRUP', 20, 'btls', '146114', '2024-09-01', NULL),
(75, 'FERROUS SULFATE+FOLIC ACID tablet 100\'s', 16, 'bxs', '23T4174', '2025-08-01', NULL),
(76, 'GLICAZIDE 30mg/30\'s', 9, 'bxs', 'GC290', '2025-06-01', NULL),
(77, 'GLICAZIDE 80mg/tablet 100\'s', 1, 'bxs', 'CC07512', '2025-06-01', NULL),
(78, 'GLICLAZIDE 30mg/tablet 100\'s', 30, 'bxs', '2A087A', '2025-01-01', NULL),
(79, 'HYDOCHLOROTHIAZIDE 25mg/tablet 100\'s', 3, 'bxs', 'M088895', '2025-02-01', NULL),
(80, 'HYDRALAZINE Ampule', 0, 'bxs', NULL, NULL, NULL),
(81, 'HYDROCORTISONE 1%5G OINTMENT', 0, 'bxs', NULL, NULL, NULL),
(82, 'HYDROCORTISONE 250mg/ampule', 0, 'bxs', NULL, NULL, NULL),
(83, 'HYSCINE 10mg/tablet 100\'s', 4, 'bxs', 'THY121004', '2024-07-01', NULL),
(84, 'IBUPROFEN 200mg/5ml syrup', 76, 'btls', '22H010', '2024-08-01', NULL),
(85, 'IBUPROFEN 200mg/tablet 100\'s', 4, 'bxs', '35352', '2023-05-01', NULL),
(86, 'IBUPROFEN 400mg/tablet 100\'s', 2, 'bxs', 'NFH02', '2024-06-01', NULL),
(87, 'ISDN 10MG/100\'S', 7, 'bxs', 'PH143BE', '2024-05-01', NULL),
(88, 'ISONIAZID 300mg', 6, 'bxs', '2F257', '2025-08-01', NULL),
(89, 'ISOPRINOSINE syrup 60ml', 0, 'bxs', NULL, NULL, NULL),
(90, 'ISOXSUPRINE HCI 10mg/tablet 100\'s', 1, 'bxs', '2H188A', '2024-08-01', NULL),
(91, 'KETOCONAZOLE  Cream 2% 15g', 0, 'bxs', NULL, NULL, NULL),
(92, 'LAGUNDI 300mg Syrup 60ml', 46, 'btls', 'K23075', '2025-11-01', NULL),
(93, 'LAGUNDI 300mg/tablet 100\'s', 27, 'bxs', '2206009', '2025-04-01', NULL),
(94, 'LINAGLIPTIN 5mg/tablet 30\'s', 0, 'bxs', NULL, NULL, NULL),
(95, 'LOSARTAN 50mg/tablet 100\'s', 112, 'bxs', 'N9-2018', '2026-06-01', NULL),
(96, 'MEFENAMIC ACID 500mg/tablet 100\'s', 57, 'bxs', 'G0NH0061', '2025-04-01', NULL),
(97, 'MEFENAMIC ACID 50mg/5ml syrup', 63, 'btls', '2203117', '2024-03-01', NULL),
(98, 'METFORMIN 500mg/tablet 100\'s', 101, 'bxs', '98158', '2026-04-01', NULL),
(99, 'METHERGINE 0.2mg/ml ampule', 0, 'bxs', NULL, NULL, NULL),
(100, 'METHIMAZOLE  5mg/tablet 100\'s', 2, 'bxs', '301054', '2026-01-01', NULL),
(101, 'METHYLDOPA 250mg/tablet 100\'s', 6, 'bxs', '2H84A1', '2024-08-01', NULL),
(102, 'METOPROL 50mg/tab 100\'s', 20, 'bxs', '23GT132', '2026-03-01', NULL),
(103, 'METRONIDAZOLE 125mg/5ml syrup', 182, 'btls', '139226', '2024-11-01', NULL),
(104, 'MULTIVATMINS syrup', 77, 'btls', '2210044', '2024-10-01', NULL),
(105, 'MULTIVITAMINS capsule 100\'s', 17, 'bxs', '2JN318', '2025-09-01', NULL),
(106, 'MULTIVITAMINS oral drops', 14, 'btls', 'ZEN001', '2025-05-01', NULL),
(107, 'NIFEDIPINE 5mg/capsule 100\'s', 1, 'bxs', '0122 762', '2025-08-01', NULL),
(108, 'NITROFURANTOIN 100mg/100\'s', 6, 'bxs', '22862', '2026-02-01', NULL),
(109, 'NYSTAIN 100,00 units/ml 30ml', 6, 'btls', '20', '2026-05-01', NULL),
(110, 'OMEPRAZOLE 20mg/capsule 100\'s', 7, 'bxs', 'B1055', '2025-08-01', NULL),
(111, 'OMEPRAZOLE 40mg/capsule 100\'s', 5, 'bxs', 'NMR-02', '2026-03-01', NULL),
(112, 'ORS 25\'s', 45, 'btls', 'NR503', '2025-07-01', NULL),
(113, 'OXYTOCIN 10iu/ml ampule 10\'s', 0, 'btls', NULL, NULL, NULL),
(114, 'PARACETAMOL 100ml/ oral drops', 43, 'btls', '2305057', '2025-05-01', NULL),
(115, 'PARACETAMOL 125mg/5ml syrup 60ml ', 0, 'btls', NULL, NULL, NULL),
(116, 'PARACETAMOL 250mg/5l syrup 60ml', 81, 'btls', '173446', '2026-10-01', NULL),
(117, 'PARACETAMOL 500mg/tablet 100\'s', 6, 'btls', '220914', '2025-09-01', NULL),
(118, 'PATOPRAZOLE 40mg/tablet 100\'s', 2, 'btls', 'T230040', '2026-01-01', NULL),
(119, 'PREDISONE 20mg/tablet 100\'s', 3, 'bxs', '3E1538', '2025-05-01', NULL),
(120, 'PROPANOLOL 10mg/tablet 100\'s', 5, 'bxs', '0-68003', '2026-02-01', NULL),
(121, 'PURIFIED RABIES VACCINE', 0, 'bxs', NULL, NULL, NULL),
(122, 'RANITIDINE 150mg/tablet 100\'s', 5, 'bxs', 'R96001', '2026-05-01', NULL),
(123, 'RIFAMPICIN+ISONIAZID 150mg/75mg tablet', 0, 'bxs', NULL, NULL, NULL),
(124, 'RIFAMPICIN+ISONIAZID+PYRAZINAMIDE+ETHAMBUTOL tablet', 0, 'bxs', NULL, NULL, NULL),
(125, 'ROSUVASTATIN 10mg/tablet 100\'s', 1, 'bxs', '230485', '2025-09-01', NULL),
(126, 'SALBUTAMOL 2mg/5ml syrup 60ml', 12, 'btls', 'K2343', '2025-11-01', NULL),
(127, 'SALBUTAMOL 2mg/tablet 100\'s', 4, 'bxs', 'ZDN179', '2026-04-01', NULL),
(128, 'SALBUTAMOL Nebule 25\'s', 1, 'bxs', '2240034E', '2024-03-01', NULL),
(129, 'SALBUTAMOL+IPRA Nebules 30\'s', 2, 'bxs', '55S030', '2025-10-01', NULL),
(130, 'SAMBONG 500mg capsule 100\'s', 0, 'bxs', NULL, NULL, NULL),
(131, 'SILVER SUFADIAZINE 1% cream 15mg', 0, 'bxs', NULL, NULL, NULL),
(132, 'SILYMARIN200mg+Vitamin E18 IU Caosule 100\'s', 8, 'bxs', '23013', '2026-07-01', NULL),
(133, 'SIMVASTATIN 20mg/tablet 100\'s', 95, 'bxs', '220982', '2025-09-01', NULL),
(134, 'SIMVASTATIN 40mg/tablet 100\'s', 9, 'bxs', '203036', '2026-03-01', NULL),
(135, 'SIMVASTATIN 40mg/tablet 100\'s', 5, 'bxs', '144069', '2025-06-01', NULL),
(136, 'SODIUM ASCORBATE + ZINC capsule 100\'s', 0, 'bxs', NULL, NULL, NULL),
(137, 'SPIRINOLACTONE 50mg/tablet 30\'s', 1, 'bxs', 'MI1AB2201', '2024-12-01', NULL),
(138, 'TELMASARTAN 40mg 100\'s', 4, 'bxs', '23003', '2026-05-01', NULL),
(139, 'TELMISARTAN + HCTZ 40mg/12.5mg/tab 30\'s', 15, 'bxs', 'T18VD2', '2025-05-01', NULL),
(140, 'TELMISARTAN 40mg/tab 30\'s', 20, 'bxs', 'NTF06', '2026-03-01', NULL),
(141, 'TOBRAMYCIN EYE Drops Solution 0.3% 5ml', 0, 'bxs', NULL, NULL, NULL),
(142, 'TRAMADOL + PARACETAMOL 37.5mg/325mg tablet', 0, 'bxs', NULL, NULL, NULL),
(143, 'TRANEXAMIC 500mg capsule 100\'s', 3, 'bxs', 'ZHN185', '2025-08-01', NULL),
(144, 'TRIMETAZIDINE 35mg/tablet 100\'s', 19, 'bxs', 'IK530301', '2026-03-01', NULL),
(145, 'URSODEOXYCHOLIC 250mg 20\'s', 3, 'bxs', 'UL009', '2024-12-01', NULL),
(146, 'URSODEOXYCHOLIC 250mg/tablet 30\'s', 33, 'bxs', 'MHEC/170', '2026-04-01', NULL),
(147, 'VITAMIN B1 B6 B12 tablet 100\'s', 38, 'bxs', 'UT857', '2025-04-01', NULL),
(148, 'ZINC OXIDE + CALAMINE cream 20\'s', 0, 'bxs', NULL, NULL, NULL),
(149, 'ZINC syrup', 17, 'btls', '4133253', '2025-06-01', NULL),
(150, 'Testing Data 123456890', 3, 'bxs', 'I3827', '2028-10-23', 'NONE'),
(151, 'Testing Data 123456890', 3, 'bxs', 'I3827', '2028-10-23', 'NONE'),
(152, 'Testing Data 123456890', 5, 'bxs', 'I3827', '2028-11-23', 'NONE');

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
  MODIFY `appointment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `citizen_clinical_record`
--
ALTER TABLE `citizen_clinical_record`
  MODIFY `record_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `citizen_history`
--
ALTER TABLE `citizen_history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `citizen_queue`
--
ALTER TABLE `citizen_queue`
  MODIFY `queue_number` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `medicalstaff`
--
ALTER TABLE `medicalstaff`
  MODIFY `staff_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

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
  MODIFY `item_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=153;

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
