// routes/routes.js
const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const recordController = require('../controllers/recordController');
const pharmacyController = require('../controllers/pharmacyController');
const queueController = require('../controllers/queueController');
const appointmentController = require('../controllers/appointmentController');
const clinicRecordController = require('../controllers/clinicRecordController');
const dashboardController = require('../controllers/dashboardController');
const bloodController = require('../controllers/bloodController');

// USER AUTHENTICATION/REGISTRATION
router.get('/getStaffId', staffController.getStaffId);
router.get('/getStaff', staffController.getStaff);
router.post('/addStaff', staffController.addStaff);
router.post('/logoutUser', staffController.logoutUser);
router.get('/verifyToken', staffController.verifyAccessToken);

// RECORDS
router.post('/handleFileUploadRecords', recordController.handleFileUploadRecords);
router.post('/addRecord', recordController.addRecord);
router.post('/proceedAddRecord', recordController.proceedAddRecord);
router.get('/getRecords', recordController.getRecords);
router.get('/findRecord/:id', recordController.findRecord);
router.post('/findCitizen', recordController.findCitizen);
router.post('/updateRecord', recordController.updateRecord);
router.post('/deleteRecord/:id', recordController.deleteRecord);
router.get('/describeRecords', recordController.describeRecords);

// PHARMACY
router.post('/handleFileUploadPharmacy', pharmacyController.handleFileUploadPharmacy);
router.get('/getPharmacyInventory', pharmacyController.getPharmacyInventory);
router.get('/searchPharmacyInventory/:id', pharmacyController.searchPharmacyInventory);
router.get('/describePharmacy', pharmacyController.describePharmacy);
router.post('/findMedicine', pharmacyController.findMedicine);
router.post('/addMedicine', pharmacyController.addMedicine);
router.post('/handleDeleteMedicine/:id', pharmacyController.handleDeleteMedicine);
router.post('/updateMedicine', pharmacyController.updateMedicine);
router.get('/getProductLogs/:id', pharmacyController.getProductLogs);

// QUEUE
router.post('/addToQueue', queueController.addToQueue);
router.get('/getQueue', queueController.getQueue);
router.get('/getAttended', queueController.getAttended);
router.post('/nextQueue', queueController.nextQueue);
router.post('/dismissQueue/:id', queueController.dismissQueue);

// APPOINTMENTS
router.post('/newAppointment', appointmentController.newAppointment);
router.get('/getAppointments', appointmentController.getAppointments);
router.get('/findAppointmentByNumber/:id', appointmentController.findAppointmentByNumber);
router.post('/handleCancelAppointment/:id', appointmentController.handleCancelAppointment);
router.post('/handleApproveAppointment/:id', appointmentController.handleApproveAppointment);

// BLOOD DONORS
router.get('/getBlood', bloodController.getBlood);

// CLINIC 
router.post('/addClinicRecord', clinicRecordController.addCinicRecord);

// DASHBOARD
router.get('/getDashBoardData', dashboardController.getDashboardData);

module.exports = router;